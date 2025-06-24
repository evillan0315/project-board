# DropdownMenu Component Documentation

This document provides detailed information about the `DropdownMenu` component, including its purpose, properties, and usage.

## Overview

The `DropdownMenu` component is a reusable UI element that renders a dropdown menu triggered by a button.  It utilizes the SolidJS framework and `@iconify-icon/solid` for icons. It provides a customizable dropdown with a list of selectable items, each associated with an action. The dropdown closes when an item is selected or when the user clicks outside the dropdown area.

## Import

```typescript
import DropdownMenu from './DropdownMenu'; // Adjust the path as necessary
```

## Component Props (`DropdownMenuProps`)

The `DropdownMenu` component accepts the following props:

| Prop Name    | Type                               | Description                                                              | Default Value | Required |
| ------------ | ---------------------------------- | ------------------------------------------------------------------------ | ------------- | -------- |
| `items`      | `DropdownItem[]`                   | An array of `DropdownItem` objects representing the menu options.           |               | Yes      |
| `label`      | `string`                           | The text displayed on the button that triggers the dropdown.               |               | No       |
| `icon`       | `string | IconifyIcon`              | The icon displayed on the button. Can be a string (icon name) or `IconifyIcon` object. |               | Yes      |
| `iconSize`   | `string | number`                   | The size of the icons within the button and dropdown items.               | `'1.4em'`     | No       |
| `variant`    | `'primary' | 'secondary' | 'outline'` | The visual style of the button (inherits from the `Button` component). |               | No       |
| `size`       | `'sm' | 'md' | 'lg' | 'xl'`        | The size of the button and the dropdown list items.                     |               | No       |

### `DropdownItem` Interface

Each item in the `items` array conforms to the following interface:

| Property  | Type         | Description                                                      | Required |
| --------- | ------------ | ---------------------------------------------------------------- | -------- |
| `label`   | `string`     | The text displayed for the dropdown item.                        | No       |
| `icon`    | `string | IconifyIcon` | The icon displayed for the dropdown item. Can be a string (icon name) or `IconifyIcon` object.      | Yes       |
| `onClick` | `() => void` | A function that is executed when the dropdown item is clicked. | Yes       |

## Usage Example

```typescript jsx
import { createSignal } from 'solid-js';
import DropdownMenu from './DropdownMenu'; // Adjust the path as necessary
import { Icon } from '@iconify-icon/solid';

const MyComponent = () => {
  const [count, setCount] = createSignal(0);

  const dropdownItems = [
    {
      label: 'Increment',
      icon: 'mdi:plus',
      onClick: () => setCount(count() + 1),
    },
    {
      label: 'Decrement',
      icon: 'mdi:minus',
      onClick: () => setCount(count() - 1),
    },
    {
      label: 'Reset',
      icon: 'mdi:refresh',
      onClick: () => setCount(0),
    },
  ];

  return (
    <div>
      <p>Count: {count()}</p>
      <DropdownMenu
        items={dropdownItems}
        label="Actions"
        icon="mdi:menu-down"
        variant="primary"
        size="md"
      />
    </div>
  );
};

export default MyComponent;
```

## Internal State

*   **`isOpen`**: A signal that controls whether the dropdown menu is visible. Initialized to `false`.
*   **`containerRef`**:  A reference to the root `div` element of the component. Used to detect clicks outside the dropdown.

## Internal Functions

*   **`toggleDropdown`**: Toggles the `isOpen` signal, showing or hiding the dropdown.
*   **`handleClickOutside`**: An event handler that closes the dropdown when a click occurs outside the component's container.
*   **`resolveTextSizeClass`**:  A function that maps the `size` prop to a Tailwind CSS class for controlling the text size and width of the dropdown.

## Lifecycle Hooks

*   **`onMount`**:  Attaches a `click` event listener to the document to detect clicks outside the dropdown when the component mounts.
*   **`onCleanup`**: Removes the `click` event listener when the component unmounts to prevent memory leaks.

## CSS Classes

The component uses Tailwind CSS classes for styling:

*   `relative inline-block text-left`: Styles the container `div` for positioning and text alignment.
*   `dropdown-menu absolute top-full mb-6 right-0 border shadow-md rounded z-50`: Styles the dropdown menu container for positioning, appearance, and stacking order.
*   `flex items-center justify-start gap-2 px-4 py-2 hover:bg-gray-500/10 cursor-pointer`: Styles each dropdown item for layout, spacing, appearance, and interactivity.
*   `text-sm w-48`, `text-base w-58`, `text-lg w-75`, `text-xl w-100`: Styles for varying the size of text and width of dropdown.

## Dependencies

*   **SolidJS:** A JavaScript framework for building user interfaces.
*   **`@iconify-icon/solid`:** A library for using Iconify icons in SolidJS applications.
*   **`Button` Component:**  A custom button component (assumed to be in the same directory).  It should accept `variant` and `size` props.

## Notes

*   The `Button` component used within `DropdownMenu` is assumed to be defined elsewhere (e.g., `./Button.tsx`).  Ensure it's available and properly implemented.
*   The component relies on Tailwind CSS for styling. Make sure Tailwind CSS is configured in your project.
*   The icon names used should correspond to available icons in the `@iconify-icon/solid` library.
*   Consider adding accessibility features (e.g., ARIA attributes) to improve the usability of the dropdown menu for users with disabilities.

