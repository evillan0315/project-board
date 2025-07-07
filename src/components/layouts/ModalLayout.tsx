import { createSignal, onMount } from 'solid-js';
import type { JSX } from 'solid-js';
import { Button } from '../ui/Button';
interface ModalLayoutProps {
  title: string;
  onClose: () => void;
  children: JSX.Element;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  slideFrom?: 'left' | 'right' | 'top' | 'bottom';
}

export default function ModalLayout(props: ModalLayoutProps): JSX.Element {
  const [show, setShow] = createSignal(false);

  onMount(() => {
    setShow(true);
  });

  const sizeClass = () => {
    switch (props.size) {
      case 'sm':
        return 'w-64';
      case 'md':
        return 'w-96';
      case 'lg':
        return 'w-[32rem]';
      case 'xl':
        return 'w-[48rem]';
      case 'full':
        return 'w-full h-full';
      default:
        return 'w-96';
    }
  };

  const slideClass = () => {
    switch (props.slideFrom) {
      case 'left':
        return show() ? 'translate-x-0' : '-translate-x-full';
      case 'right':
        return show() ? 'translate-x-0' : 'translate-x-full';
      case 'top':
        return show() ? 'translate-y-0' : '-translate-y-full';
      case 'bottom':
        return show() ? 'translate-y-0' : 'translate-y-full';
      default:
        return show() ? 'opacity-100' : 'opacity-0';
    }
  };

  return (
    <div class="modal-wrapper fixed inset-0 flex items-center justify-center z-30 transition-opacity duration-300">
      <div
        class={`modal-body border h-auto rounded-lg shadow-lg max-w-full p-4 transform transition duration-300 ease-in-out ${sizeClass()} ${slideClass()}`}
      >
        <div class="flex justify-between items-center pb-2 mb-2 border-b ">
          <h2 class="text-sky-500 font-bold">{props.title}</h2>
          <Button
            class="btn-icon hover:text-red-400"
            onClick={() => {
              setShow(false);
              setTimeout(() => props.onClose(), 300); // allow transition to finish
            }}
          >
            &times;
          </Button>
        </div>
        <div class="space-y-3 text-sm overflow-auto max-h-[80vh]">{props.children}</div>
      </div>
    </div>
  );
}
