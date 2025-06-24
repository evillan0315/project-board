import { Show, type JSX } from 'solid-js';

import { company } from '../../../data/app';

interface LeftFooterProps {
  show?: boolean;
}
export const LeftFooter = (props: LeftFooterProps): JSX.Element => {
  return (
    <Show when={props.show}>
      <p>© 2025 {company.name}.</p>
    </Show>
  );
};
