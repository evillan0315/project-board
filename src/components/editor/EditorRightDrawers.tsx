import RightDrawer from '../ui/RightDrawer';
import GenerateCode from '../GenerateCode';
import GenerateDocumentation from '../GenerateDocumentation';
import ChatGenerateCode from '../ChatGenerate';
import { sharedDrawerProps } from './editorActions';
import { editorFilePath, editorContent } from '../../stores/editorContent';
interface Props {
  drawerOpen: () => boolean;
  setDrawerOpen: (open: boolean) => void;
  chatDrawerOpen: () => boolean;
  setChatDrawerOpen: (open: boolean) => void;
  docDrawerOpen: () => boolean;
  setDocDrawerOpen: (open: boolean) => void;
  drawerTitle?: string;
  markdownDrawerOpen: () => boolean;
  setMarkdownDrawerOpen: (open: boolean) => void;
}

export default function EditorRightDrawers(props: Props) {
  return (
    <>
      <RightDrawer isOpen={props.drawerOpen()} onClose={() => props.setDrawerOpen(false)} title="Generate Code">
        <GenerateCode {...sharedDrawerProps} />
      </RightDrawer>

      <RightDrawer
        isOpen={props.docDrawerOpen()}
        onClose={() => props.setDocDrawerOpen(false)}
        title="Generate Documentation"
      >
        <GenerateDocumentation {...sharedDrawerProps} />
      </RightDrawer>

      <RightDrawer
        isOpen={props.chatDrawerOpen()}
        onClose={() => props.setChatDrawerOpen(false)}
        title="Generate chat Code"
      >
        <ChatGenerateCode {...sharedDrawerProps} />
      </RightDrawer>

      <RightDrawer
        isOpen={props.markdownDrawerOpen()}
        onClose={() => props.setMarkdownDrawerOpen(false)}
        title="View Markdown"
      >
        <MarkdownViewer content={editorContent.get()} />
      </RightDrawer>
    </>
  );
}
