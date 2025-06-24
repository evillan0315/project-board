import { type Component } from 'solid-js';
import Editor from './Editor';

type Props = {
  code: () => string;
  setCode: (code: string) => void;
  onAction: () => void;
  actionIcon: string;
  actionLabel: string;
  readOnly?: boolean;
  filePath?: () => string;
};

const EditorWithToolbar: Component<Props> = (props) => {
  return (
    <div class="relative h-full border rounded shadow">
      <div class="absolute top-2 right-2 z-10">
        <button
          class="p-1 bg-gray-700 text-white rounded hover:bg-gray-600"
          onClick={props.onAction}
          title={props.actionLabel}
          aria-label={props.actionLabel}
        >
          {props.actionIcon}
        </button>
      </div>
      <Editor
        content={props.code}
        filePath={props.filePath ?? (() => '')}
        onChange={props.setCode}
        readOnly={props.readOnly}
      />
    </div>
  );
};

export default EditorWithToolbar;
