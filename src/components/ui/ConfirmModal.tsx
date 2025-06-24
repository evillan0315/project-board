import { createSignal, Show, type JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';
import { Button } from './Button';
type ModalType = 'confirm' | 'prompt' | 'alert';

export function createConfirmModal() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [message, setMessage] = createSignal('');
  let resolveFn: (result: boolean) => void;

  const confirm = (msg: string): Promise<boolean> => {
    setMessage(msg);
    setIsOpen(true);
    return new Promise((resolve) => {
      resolveFn = resolve;
    });
  };

  const handleConfirm = () => {
    setIsOpen(false);
    resolveFn(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolveFn(false);
  };

  const Modal = (): JSX.Element => (
    <Show when={isOpen()}>
      <div class="confirm-dialog-modal fixed inset-0 flex items-center justify-center z-50">
        <div class="rounded-lg shadow-lg p-6 max-w-sm w-full confirm-dialog-modal-body">
          <p class="text-sm mb-4">{message()}</p>
          <div class="flex justify-end gap-2">
            <button class="px-3 py-1 text-sm rounded" onClick={handleCancel}>
              Cancel
            </button>
            <button class="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700" onClick={handleConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </Show>
  );

  return { Modal, confirm };
}

export function createModalService() {
  const [isOpen, setIsOpen] = createSignal(false);
  const [type, setType] = createSignal<ModalType>('confirm');
  const [message, setMessage] = createSignal('');
  const [inputValue, setInputValue] = createSignal('');
  let resolveFn: (value: any) => void;

  const open = (modalType: ModalType, msg: string, defaultValue?: string) => {
    setType(modalType);
    setMessage(msg);
    setInputValue(defaultValue || '');
    setIsOpen(true);
    return new Promise((resolve) => {
      resolveFn = resolve;
    });
  };

  const confirm = (msg: string) => open('confirm', msg);
  const prompt = (msg: string, defaultValue = '') => open('prompt', msg, defaultValue);
  const alert = (msg: string) => open('alert', msg);

  const handleOk = () => {
    setIsOpen(false);
    if (type() === 'confirm') resolveFn(true);
    else if (type() === 'prompt') resolveFn(inputValue());
    else resolveFn();
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (type() === 'confirm') resolveFn(false);
    else if (type() === 'prompt') resolveFn(null);
  };

  const resolveOkVariant = (): ButtonProps['variant'] => {
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
      <div class="confirm-dialog-modal fixed inset-0 flex items-center justify-center z-50">
        <div class="rounded-lg shadow-lg p-6 max-w-sm w-full space-y-4 confirm-dialog-modal-body">
          <p class="text-sm">{message()}</p>

          <Show when={type() === 'prompt'}>
            <input
              type="text"
              value={inputValue()}
              onInput={(e) => setInputValue(e.currentTarget.value)}
              class="rounded w-full p-2 text-sm border"
              placeholder="Enter value"
            />
          </Show>

          <div class="flex justify-end gap-2">
            <Show when={type() !== 'alert'}>
              <Button variant="secondary" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            </Show>
            <Button variant={resolveOkVariant()} size="sm" onClick={handleOk}>
              OK
            </Button>
          </div>
        </div>
      </div>
    </Show>
  );

  return { Modal, confirm, prompt, alert };
}
