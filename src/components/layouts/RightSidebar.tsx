import { createSignal } from 'solid-js';

const RightSidebar = () => {
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <div id="rightSidebar" class="w-100 min-w-60 max-w-196 overflow-auto transition-all duration-200">
      <div class="flex justify-between items-center p-1 bg-gray-900/70 border-b border-gray-800 shadow-lg">
        <span>Preview</span>
        <button id="toggleRight" class="text-xs bg-gray-700 px-1 rounded">
          ⨯
        </button>
      </div>
      <div id="previewContent" class="p-2 text-gray-300 text-sm font-mono">
        <p class="text-gray-500 italic">Nothing to preview...</p>
      </div>
    </div>
  );
};

export default RightSidebar;
