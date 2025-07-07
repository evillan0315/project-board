import { createMemo, type JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { useStore } from '@nanostores/solid';
import { editorUnsaved } from '../../stores/editorContent';
import { fileService } from '../../services/fileService';

interface EditorFileTabItemProps {
  path: string;
  active?: boolean;
  onClick?: (path: string) => void;
  onClose?: (path: string) => void;
}

export default function EditorFileTabItem(props: EditorFileTabItemProps): JSX.Element {
  const $unsaved = useStore(editorUnsaved);
  const fileName = createMemo(() => props.path.split('/').pop() || '');
  const hasUnsaved = createMemo(() => !!$unsaved()[props.path]);

  const handleClick = () => {
    props.onClick?.(props.path) ??
      fileService.emitDynamicFileEvent({
        endpoint: '/file/open',
        method: 'GET',
        body: { filePath: props.path },
        event: 'openFile',
      });
  };

  const handleClose = (e: MouseEvent) => {
    e.stopPropagation();
    props.onClose?.(props.path) ??
      fileService.emitDynamicFileEvent({
        endpoint: '/file/close',
        method: 'POST',
        body: { filePath: props.path },
        event: 'closeFile',
      });
  };

  return (
    <div
      class={`file-tab-item cursor-pointer flex-shrink-0 flex items-center gap-0 text-sm font-light pl-4 py-0
        ${props.active ? 'text-sky-600 hover:bg-gray-900/40 font-semibold border-b-2 border-sky-600' : 'hover:text-sky-500'}
      `}
    >
      <div class="pr-1 py-2 flex items-center gap-1 min-w-0 max-w-[150px]" onClick={handleClick}>
        <span class="truncate overflow-hidden whitespace-nowrap flex-grow min-w-0" title={props.path}>
          {fileName()}
        </span>
        {hasUnsaved() && <span class="ml-1 text-info-600 flex-shrink-0">*</span>}
      </div>
      <Icon
        title={`Close ${fileName()}`}
        icon="mdi:close"
        class="text-red-600 hover:text-red-500 mr-2 flex-shrink-0"
        onClick={handleClose}
      />
    </div>
  );
}
