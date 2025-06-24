// src/components/layouts/Header.tsx

export default function CommandPalette() {
  return (
    <div id="commandPalette" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4">
      <div class="bg-gray-800 w-full max-w-md rounded shadow-lg">
        <input
          type="text"
          class="w-full bg-gray-900 text-white p-2 rounded-t outline-none"
          placeholder="Type a command..."
        />
        <div class="p-2 text-sm">
          <div class="hover:bg-gray-700 p-1 rounded cursor-pointer"> Open File</div>
          <div class="hover:bg-gray-700 p-1 rounded cursor-pointer"> Go to Symbol</div>
          <div class="hover:bg-gray-700 p-1 rounded cursor-pointer"> Run Build Task</div>
        </div>
      </div>
    </div>
  );
}
