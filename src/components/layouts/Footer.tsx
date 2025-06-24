import { For, Show, type JSX } from 'solid-js';

import { LeftFooter } from './footer/LeftFooter';
import { MiddleFooter } from './footer/MiddleFooter';
import { RightFooter } from './footer/RightFooter';

import { EditorStatusBar } from '../../components/editor/EditorStatusBar';
import MiniVideoPlayer from '../media/MiniVideoPlayer';
interface FooterProps {
  left: boolean;
  right?: boolean;
  middle?: boolean;
}

export const Footer = (props: FooterProps): JSX.Element => {
  return (
    <>
      <footer class="footer-wrapper flex flex-col sticky bottom-0 h-10 border-t px-2 text-sm">
        <div class="flex items-center justify-between gap-x-4">
          <div class="flex items-center justify-start gap-x-4">
            <LeftFooter show={props.left} />
            <MiddleFooter show={props.middle} />
          </div>
          <RightFooter show={props.right} children={EditorStatusBar} />
        </div>
      </footer>
    </>
  );
};
