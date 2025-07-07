import { Show, type JSX } from 'solid-js';

import AppInfo from '../../../components/apps/AppInfo';

interface LeftFooterProps {
  show?: boolean;
}
export const LeftFooter = (props: LeftFooterProps): JSX.Element => {
  return (
    <Show when={props.show}>
      <AppInfo />
    </Show>
  );
};
