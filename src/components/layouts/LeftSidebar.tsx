import { createSignal } from 'solid-js';




const LeftSidebar = () => {
  const [isOpen, setIsOpen] = createSignal(true);

  return (
    <aside
      class={`transition-all duration-300 ${
        isOpen()? 'w-80' : 'w-0'
      } flex-shrink-0 bg-gray-900 text-white py-4 flex flex-col justify-between items-center border-r dark:border-gray-700`}
    >
      <button
        class="mx-4 hover:text-gray-400"
        onClick={() => setIsOpen(!isOpen())}
      >
        {/*isOpen() ? '>' : '<' */}
      </button>
    </aside>
  );
};

export default LeftSidebar;
