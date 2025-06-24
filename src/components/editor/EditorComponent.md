# EditorComponent Documentation

This document provides comprehensive details about the `EditorComponent` code snippet.  It outlines the component's purpose, functionality, properties, and implementation details.
## Overview
The `EditorComponent` is a React component built with Solid.js that provides a code editor interface. It leverages the CodeMirror editor library for syntax highlighting, theming, and other advanced editor features. It dynamically updates based on changes to the file path and theme, providing a responsive and customizable code editing experience. The component integrates with nanostores for state management.
## Core Functionality

*   **Code Editing:**  Provides a functional code editor using CodeMirror.
*   **Syntax Highlighting:** Dynamically updates syntax highlighting based on the file extension.
*   **Theming:**  Dynamically applies themes to the editor.
*   **State Management:** Utilizes `nanostores` for managing the editor's content, file path, and theme.
*   **Dynamic Updates:** Reacts to changes in the file path, theme, and editor content, updating the editor accordingly.
*   **Keyboard Shortcuts:** Implements keyboard shortcuts for saving, undo, and redo functionalities.
*   **Lifecycle Management:**  Properly initializes and cleans up the editor instance.
*   **Content Synchronization**: keeps the code editor's content synchronized with a state variable, enabling external modifications.

## Imports

The component imports necessary modules from various libraries:

*   **`solid-js`:**  Provides the core Solid.js functionalities like `createEffect`, `onMount`, `onCleanup`, `JSX`, and `Show`.
*   **`@codemirror/state`:** Provides `EditorState` and `Compartment` for managing the editor's state and extensions.
*   **`codemirror`:** Provides `EditorView` and `basicSetup` for creating and configuring the editor.
*   **`@nanostores/solid`:** Provides `useStore` hook for accessing and subscribing to nanostores.
*   **`../../stores/theme`:** Imports the `theme` store.
*   **`../../utils/editorLanguage`:** Imports the `detectLanguage` function for language detection.
*   **`../../utils/editorTheme`:** Imports the `getThemeExtension` function for applying themes.
*   **`../../utils/editorUndoRedo`:** Imports `undoEdit` and `redoEdit` functionalities.
*   **`../../stores/editorContent`:** Imports the `editorContent` and `editorFilePath` stores.

## Props

The `EditorComponent` accepts the following props:

*   `onSave?: () => void`: An optional callback function that is triggered when the user attempts to save (e.g., via Ctrl/Cmd + S).
*   `onChange?: (content: string) => void`: An optional callback function that is triggered when the editor content changes. The function receives the new content as a string argument.

## State Variables

*   `editorContainer: HTMLDivElement | undefined`: A reference to the HTML div element that will contain the CodeMirror editor. Initialized to `undefined`.
*   `editorView: EditorView | null`: A reference to the CodeMirror `EditorView` instance. Initialized to `null`.

## Stores

The component uses the following nanostores:

*   `theme`: Stores the current theme of the editor. Accessed using `$theme = useStore(theme)`.
*   `editorContent`: Stores the current content of the editor. Accessed using `$content = useStore(editorContent)`.
*   `editorFilePath`: Stores the file path of the currently opened file. Accessed using `$filePath = useStore(editorFilePath)`.

## Compartments

The component uses CodeMirror Compartments to dynamically reconfigure the editor's language and theme:

*   `themeCompartment`:  Used to update the editor's theme dynamically.
*   `langCompartment`: Used to update the editor's language dynamically based on the file extension.

## `createEffect` Hooks

The component utilizes several `createEffect` hooks for managing the editor's lifecycle and dynamic updates:

1.  **Initialize editor:**
    *   Runs when the `editorContainer` is available and `editorView` is null (editor hasn't been initialized).
    *   Creates a new `EditorView` instance.
    *   Configures the editor with `basicSetup`, `langCompartment`, `themeCompartment`, line wrapping, and an update listener.
    *   The update listener triggers when the document changes, updating the `editorContent` store and calling the `onChange` prop if provided.

2.  **Update content dynamically:**
    *   Runs when the `editorContent` store changes.
    *   Compares the current editor content with the value in the `editorContent` store.
    *   If they are different, dispatches a transaction to update the editor's content to match the store.

3.  **Clear content when no file is open:**
    *   Runs when the `editorFilePath` store becomes empty (no file is open).
    *   Dispatches a transaction to clear the editor's content.

4.  **Update language dynamically:**
    *   Runs when the `editorFilePath` store changes.
    *   Dispatches a transaction to reconfigure the `langCompartment` with the new language based on the file extension.

5.  **Update theme dynamically:**
    *   Runs when the `theme` store changes.
    *   Dispatches a transaction to reconfigure the `themeCompartment` with the new theme.

## Event Handling

*   **`handleKeyDown`**: Handles keyboard shortcuts for saving (Ctrl/Cmd + S), undo (Ctrl/Cmd + Z), and redo (Ctrl/Cmd + Y or Ctrl/Cmd + Shift + Z).

## Lifecycle Hooks

*   **`onMount`**:
    *   Attaches the `handleKeyDown` function to the window's `keydown` event to listen for keyboard shortcuts.
*   **`onCleanup`**:
    *   Destroys the `editorView` instance to prevent memory leaks.
    *   Sets `editorView` to null.
    *   Removes the `handleKeyDown` event listener from the window.

## JSX Structure

The component's JSX structure consists of:

*   A `div` element with `h-screen`, `flex`, `flex-col`, `overflow-auto`, and `relative` classes, serving as the main container.
*   A nested `div` element with `h-full` and `w-full` classes, and a `ref` attribute that assigns the element to the `editorContainer` variable. This div will be the parent element for the CodeMirror editor.

## Usage

```jsx
import EditorComponent from './EditorComponent'; // Replace with the actual path

function MyComponent() {
  const handleSave = () => {
    // Save logic here
    console.log('Save triggered');
  };

  const handleChange = (content) => {
    // Handle content changes here
    console.log('Content changed:', content);
  };

  return (
     <EditorComponent onSave={handleSave} onChange={handleChange} />
  );
}

export default MyComponent;
```

## Dependencies

*   solid-js
*   @codemirror/state
*   codemirror
*   @nanostores/solid

## Notes

*   Ensure that the `theme`, `editorContent`, and `editorFilePath` stores are properly initialized and updated elsewhere in your application.
*   The `detectLanguage` and `getThemeExtension` functions should be implemented according to your specific language detection and theming requirements.
*   Consider adding error handling and more robust state management for a production environment.
*   This component is highly dependent on the styling defined by the `basicSetup` extension of CodeMirror. Further styling might be required to achieve the desired look and feel.
*   The component assumes that the parent component or a global state manages the `editorContent` state. The `onChange` prop is used to propagate changes to the content, but the component doesn't directly mutate a state owned by the parent.

