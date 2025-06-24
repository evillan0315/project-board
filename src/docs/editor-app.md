# 📄 `src/pages/editor.tsx` – **Editor Page**

The `Editor` page is the primary interface for file editing and terminal interaction in the application. It combines a file manager, code editor, and embedded terminal in a responsive, resizable layout.

---

## 🔧 **Components & Dependencies**

* **SolidJS**: Reactive UI framework used for state management and component lifecycles.
* **xterm**: Terminal emulation library.
* **Tailwind CSS**: Utility-first CSS framework.
* **Custom Components**:

  * `EditorComponent`: The main code editor (likely Monaco-based).
  * `FileManager`: Sidebar file tree and file selector.
  * `GridResizer`: UI component for resizing panels.
  * `XTerminal`: Terminal interface (replaced with `TerminalDrawer` in use).
  * `Drawer`: Generic drawer container.
  * `TerminalDrawer`: Configurable terminal drawer.
  * `BottomDrawer`: Example/alternative terminal drawer demo.

---

## 🧩 **Signals (Reactive State)**

### Editor

* `filePath`, `fileContent`: Track selected file and its content.
* `isLoading`: Controls loading indicator state.
* `fileManagerWidth`, `containerWidth`: Track dimensions for layout adjustment.
* `left`: Tracks horizontal split ratio between the FileManager and Editor.
* `isTerminalOpen`: Controls the visibility of the terminal drawer (toggle pending).

### TerminalDrawer (`BottomDrawer` Example)

* `term`: Active terminal instance.
* `isDrawerOpen`: Controls drawer visibility.
* `position`, `size`: Drawer configuration.
* `cmd`, `cmdBuffer`: Stores current user input and history.

---

## 📁 **File Loading**

```ts
const loadFile = async (path: string) => { ... }
```

* Posts a form to `/file/read` using `api`.
* Sets `filePath` and updates `fileContent`.
* Handles errors with try/catch and `showToast()` feedback.
* Called on mount and when selecting a file from `FileManager`.

---

## 🎛️ **Layout & Responsiveness**

* FileManager and Editor are laid out using `flex`.
* `GridResizer` allows dynamic resizing by dragging.
* `left()` determines the flex ratio (default `32.5%`).
* Responsive to changes in layout dimensions.

---

## 🖥️ **Terminal Drawer**

* Configured using the `<TerminalDrawer />` component.
* Currently always rendered with fixed props:

  ```tsx
  <TerminalDrawer position="bottom" size="200px" fontSize="12" resizable={true} draggable={false} />
  ```
* Comments provide roadmap for enhancements (e.g., transitions, configurable styles, color schemes, and command interaction logic).

---

## 🚀 **Future Enhancements (TODOs)**

* 🔘 Terminal toggle button.
* 📐 Dynamic position, size, and font configuration for terminal.
* 💄 Smooth open/close animations.
* 🎨 Custom themes (background, text, input, error coloring).
* 📦 Shell execution integration.
* 🛠️ Drag/resizing improvements.
* 💡 Overall user experience refinement for a full IDE-like interface.

---

## 🧪 **BottomDrawer Component**

A development/demo drawer component showing how to:

* Toggle drawer visibility.
* Hook into `xterm` terminal input.
* Manage input and command buffer.
* Render interactive shell output.

Though unused in the main `Editor` return tree, it provides a reference for interactive terminal UX patterns.

---

## 🧼 **Cleanup & Observers**

* `onMount` initializes file loading and widths.
* Resize event listener and `ResizeObserver` (commented out) are meant to auto-update layout metrics.
* `onCleanup` ensures event listeners are removed.

---

## 📌 **Key UX Notes**

* The interface aims to replicate the experience of Visual Studio Code:

  * Sidebar (FileManager).
  * Central Editor.
  * Bottom Drawer (Terminal).
* Terminal is not open by default to avoid clutter.
* Flex layout enables adaptable screen usage for large or small devices.

---

## 📚 **Exports**

* `BottomDrawer`: Exported but unused in main render.
* `Editor`: Default export representing the page itself.



