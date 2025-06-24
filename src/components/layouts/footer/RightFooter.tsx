import { Show, type JSX } from 'solid-js';

interface RightFooterProps {
  show?: boolean;
  children?: JSX.Element;
}

export const RightFooter = (props: RightFooterProps): JSX.Element => {
  return <Show when={props.show}>{props.children}</Show>;
};
