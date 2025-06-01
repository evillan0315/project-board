import { createSignal } from 'solid-js';

const RightSidebar = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <aside
      class={`transition-all duration-300 ${
        isOpen() ? 'w-52' : 'w-0'
      } flex-shrink-0 bg-gray-100 dark:bg-gray-900 text-white dark:text-gray-100 py-4 flex flex-col justify-between items-center`}
    >
      <button class="text-lg font-medium mx-4 hover:text-gray-400" onClick={() => setIsOpen(!isOpen())}>
        {/*isOpen() ? '>' : '<' */}
      </button>
    </aside>
  );
};

export default RightSidebar;
