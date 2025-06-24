import { createSignal, Show, type JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { Button } from './Button';
import { FormInput } from './FormControl';

type ModalType = 'confirm' | 'prompt' | 'alert';

export function createModalService() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [type, setType] = createSignal<ModalType>('confirm');
  const [message, setMessage] = createSignal('');
  const [inputValue, setInputValue] = createSignal('');

  // More precise type for resolver
  let resolveFn: ((value: any) => void) | null = null;

  const open = (modalType: ModalType, msg: string, defaultValue?: string) => {
    setType(modalType);
    setMessage(msg);
    setInputValue(defaultValue || '');
    setIsOpen(true);

    return new Promise<any>((resolve) => {
      resolveFn = resolve;
    });
  };

  const confirm = (msg: string): Promise<boolean> => open('confirm', msg);
  const prompt = (msg: string, defaultValue = ''): Promise<string | null> => open('prompt', msg, defaultValue);
  const alert = (msg: string): Promise<void> => open('alert', msg);

  const handleOk = () => {
    setIsOpen(false);
    if (!resolveFn) return;

    switch (type()) {
      case 'confirm':
        resolveFn(true);
        break;
      case 'prompt':
        resolveFn(inputValue());
        break;
      case 'alert':
        resolveFn();
        break;
    }

    resolveFn = null; // clear resolver
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (!resolveFn) return;

    if (type() === 'confirm') {
      resolveFn(false);
    } else if (type() === 'prompt') {
      resolveFn(null);
    }

    resolveFn = null;
  };

  const resolveOkVariant = (): 'error' | 'info' | 'warning' | 'primary' => {
    switch (type()) {
      case 'confirm':
        return 'error';
      case 'prompt':
        return 'info';
      case 'alert':
        return 'warning';
      default:
        return 'primary';
    }
  };

  const Modal = (): JSX.Element => (
    <Show when={isOpen()}>
      <div class={`${type()}-dialog-modal dialog-modal fixed inset-0 flex items-center justify-center z-100`}>
        <div class={`${type()}-dialog-modal-body dialog-modal-body rounded-lg shadow-lg p-6 max-w-sm w-full space-y-4`}>
          <p class="text-sm">{message()}</p>

          <Show when={type() === 'prompt'}>
            <FormInput
              type="text"
              value={inputValue()}
              onInput={(e) => setInputValue(e.currentTarget.value)}
              placeholder="Enter value"
              class="w-full"
            />
          </Show>

          <div class="flex justify-end gap-2">
            <Show when={type() !== 'alert'}>
              <Button
                variant="secondary"
                icon="mdi:close"
                size="sm"
                onClick={handleCancel}
                class={`btn-${type()}-cancel `}
              >
                Cancel
              </Button>
            </Show>
            <Button
              variant={resolveOkVariant()}
              size="sm"
              icon="mdi:check"
              class={`btn-${type()}-ok`}
              onClick={handleOk}
            >
              OK
            </Button>
          </div>
        </div>
      </div>
    </Show>
  );

  return { Modal, confirm, prompt, alert };
}
