# Tooltip Component Documentation

This document provides comprehensive information about the `Tooltip` component.

## Overview

The `Tooltip` component is a reusable UI element that displays a small informational popup when a user hovers over a designated element.  It allows for configurable positioning, delay, and content (text or HTML).  It leverages SolidJS for reactivity and efficiency.

## Code Snippet

```typescript
import {
  createComponent,
  type JSX,
  onMount,
  onCleanup,
  createSignal,
  Show,
  createEffect,
  mergeProps,
  splitProps,
} from "solid-js";

interface FileItem {
  name: string;
  type: string;
  mimeType: string;
  size: number;
  path: string;
  created: Date;
  updated: Date;
}

interface TooltipProps {
  text?: string;
  html?: JSX.Element;
  children: JSX.Element;
  delay?: number;
  position?: "top" | "bottom" | "left" | "right";
  offset?: number;
  className?: string;
}

const Tooltip = (props: TooltipProps) => {
  const [isVisible, setIsVisible] = createSignal(false);
  const [position, setPosition] = createSignal({ top: 0, left: 0 });

  const mergedProps = mergeProps({
    delay: 500,
    position: "top",
    offset: 5,
  }, props);
  
  let tooltipRef: HTMLDivElement | undefined;
  let targetRef: HTMLElement | undefined;

  const updatePosition = () => {
    if (!targetRef || !tooltipRef) return;

    const targetRect = targetRef.getBoundingClientRect();
    const tooltipRect = tooltipRef.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (mergedProps.position) {
      case "top":
        top = targetRect.top - tooltipRect.height - mergedProps.offset;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case "bottom":
        top = targetRect.bottom + mergedProps.offset;
        left = targetRect.left + (targetRect.width - tooltipRect.width) / 2;
        break;
      case "left":
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.left - tooltipRect.width - mergedProps.offset;
        break;
      case "right":
        top = targetRect.top + (targetRect.height - tooltipRect.height) / 2;
        left = targetRect.right + mergedProps.offset;
        break;
    }

    setPosition({
      top: Math.max(0,top),
      left: Math.max(0,left),
    });
  };


  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const handleMouseEnter = () => {
    timeoutId = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, mergedProps.delay);
  };

  const handleMouseLeave = () => {
    if (timeoutId) clearTimeout(timeoutId);
    setIsVisible(false);
  };

  onMount(() => {
    window.addEventListener('resize', updatePosition);
  });

  onCleanup(() => {
    if (timeoutId) clearTimeout(timeoutId);
    window.removeEventListener('resize', updatePosition);
  });

  createEffect(() => {
    if(isVisible()) {
      updatePosition();
    }
  });

  return (
    <div class="relative inline-block" ref={target => targetRef = target}>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {mergedProps.children}
      </div>

      <Show when={isVisible()}>
        <div
          ref={el => tooltipRef = el}
          class={`tooltip-wrapper absolute z-10 text-sm rounded py-2 px-3 shadow-lg min-w-70 transition-opacity duration-200 ${mergedProps.className}`}
          style={{
            top: `${position().top}px`,
            left: `${position().left}px`,
            opacity: isVisible() ? 1 : 0,
            pointerEvents: 'none',
          }}
        >
          <Show when={mergedProps.text}>{mergedProps.text}</Show>
          <Show when={mergedProps.html}>{mergedProps.html}</Show>
        </div>
      </Show>
    </div>
  );
};

export default Tooltip;

// Example Usage
/*
import Tooltip from './Tooltip';

interface Props {
    file: FileItem;
}

const FileItemComponent = (props: Props) => {
    return (
        <Tooltip
            text={props.file.name}
            position="bottom"
            offset={10}
        >
            <div>{props.file.name}</div>
        </Tooltip>
    )
}
*/
```

## Component API

### Props

| Prop        | Type               | Default Value | Description                                                                                                                                                     |
| ----------- | ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `text`      | `string`           | `undefined`   | The text content to display inside the tooltip.  If both `text` and `html` are provided, `text` is displayed.                                                 |
| `html`      | `JSX.Element`      | `undefined`   | The HTML content to display inside the tooltip.  Takes precedence if `text` is not provided.                                                              |
| `children`  | `JSX.Element`      | `required`    | The element that the tooltip is attached to.  This is the element that the user hovers over to trigger the tooltip.                                        |
| `delay`     | `number`           | `500`         | The delay (in milliseconds) before the tooltip appears after the user hovers over the element.                                                                |
| `position`  | `"top" \| "bottom" \| "left" \| "right"` | `"top"`       | The position of the tooltip relative to the element.                                                                                               |
| `offset`    | `number`           | `5`           | The offset (in pixels) between the tooltip and the element.                                                                                                   |
| `className` | `string`           | `undefined`   | An optional CSS class name to apply to the tooltip wrapper, allowing for custom styling.  This will be applied in addition to the default `tooltip-wrapper` class.|

### Internal Signals

*   `isVisible`: A signal that determines whether the tooltip is currently visible.
*   `position`: A signal that stores the top and left coordinates of the tooltip. This signal is updated by the `updatePosition` function.

### Refs

*   `tooltipRef`:  A reference to the DOM element of the tooltip itself.
*   `targetRef`: A reference to the DOM element that the tooltip is attached to (the `children` prop).

## Internal Logic

1.  **Initialization**:

    *   The component uses `createSignal` to create two reactive signals: `isVisible` (initially `false`) and `position` (initially `{ top: 0, left: 0 }`).
    *   `mergeProps` is used to merge the default prop values with the user-provided props. This ensures that default values are used if the user doesn't provide specific values for props like `delay`, `position`, and `offset`.
    *   `tooltipRef` and `targetRef` are initialized to `undefined`.  These will hold references to the DOM nodes for the tooltip and target elements, respectively.

2.  **Positioning (`updatePosition`)**:

    *   This function calculates the correct position of the tooltip based on the `position` prop, the size of the target element (the `children`), and the size of the tooltip itself.
    *   It uses `getBoundingClientRect()` to get the dimensions and position of both the target and the tooltip.
    *   A `switch` statement handles the different positioning options ("top", "bottom", "left", "right").
    *   The calculated `top` and `left` values are then used to update the `position` signal, which triggers a re-render of the tooltip with the new position.
    *   `Math.max(0, top)` and `Math.max(0, left)` are used to prevent the tooltip from rendering off-screen (specifically, from having negative coordinates).

3.  **Mouse Events (`handleMouseEnter`, `handleMouseLeave`)**:

    *   `handleMouseEnter`:  This function is called when the mouse enters the target element. It sets a `setTimeout` to delay the display of the tooltip by the specified `delay` (default 500ms).  Inside the `setTimeout` callback, `setIsVisible(true)` is called to show the tooltip, and `updatePosition()` is called to calculate and set the tooltip's position.
    *   `handleMouseLeave`: This function is called when the mouse leaves the target element. It clears the `setTimeout` (if it's still running) using `clearTimeout` to prevent the tooltip from appearing if the mouse leaves before the delay has elapsed. It then sets `setIsVisible(false)` to hide the tooltip.

4.  **Lifecycle Hooks (`onMount`, `onCleanup`)**:

    *   `onMount`: This hook is called when the component is mounted.  It adds a `resize` event listener to the `window` to ensure that the tooltip's position is updated whenever the window is resized.  This is important for responsive layouts.
    *   `onCleanup`: This hook is called when the component is unmounted.  It removes the `resize` event listener that was added in `onMount` to prevent memory leaks. It also clears any pending timeouts, preventing `setIsVisible` from being called after the component has been unmounted.

5.  **`createEffect`**:
    * This effect is triggered whenever `isVisible()` changes. When the tooltip becomes visible it calls `updatePosition` to ensure the tooltip is positioned correctly.

6.  **Rendering**:

    *   The component renders a `div` with `position: relative` that acts as the container for the target element and the tooltip.  This is important for positioning the tooltip absolutely within the container. The `targetRef` is set to this container `div`.
    *   Another `div` inside the container wraps the `children` prop and attaches the `onMouseEnter` and `onMouseLeave` event handlers.
    *   The `Show` component from SolidJS is used to conditionally render the tooltip only when `isVisible()` is `true`.
    *   The tooltip itself is a `div` with `position: absolute` and a `z-index` to ensure it appears above other elements.  It also has a CSS class `tooltip-wrapper` and can accept an additional `className` prop for custom styling. The `tooltipRef` is set to this tooltip `div`.
    *   The `style` attribute is used to set the `top`, `left`, and `opacity` based on the `position` signal and the `isVisible` signal.  `pointerEvents: 'none'` is set to prevent the tooltip from interfering with mouse events on elements underneath it.
    *   The `Show` component is used again to conditionally render either the `text` or the `html` prop, depending on which is provided.

## Example Usage

```typescript
import Tooltip from './Tooltip';

interface Props {
    file: FileItem;
}

const FileItemComponent = (props: Props) => {
    return (
        <Tooltip
            text={props.file.name}
            position="bottom"
            offset={10}
        >
            <div>{props.file.name}</div>
        </Tooltip>
    )
}
```

In this example:

*   The `Tooltip` component is imported.
*   A functional component `FileItemComponent` is defined, which accepts a `file` prop of type `FileItem`.
*   Inside `FileItemComponent`, the `Tooltip` component is used.
*   The `text` prop is set to `props.file.name`, which will display the file name inside the tooltip.
*   The `position` prop is set to `"bottom"`, which will position the tooltip below the file name.
*   The `offset` prop is set to `10`, which will create a 10-pixel gap between the file name and the tooltip.
*   The `children` prop is set to `<div>{props.file.name}</div>`, which is the file name that the user will hover over to trigger the tooltip.

## Styling

The component includes the CSS class `tooltip-wrapper` for basic styling. You can override this class or add additional styles using the `className` prop. The default styling provides a rounded appearance, a shadow, and a white background.  It also sets `min-width: 70px` to ensure the tooltip doesn't collapse if the content is too short. The opacity transition provides a smooth fade-in/fade-out effect.
```css
.tooltip-wrapper {
  /* Existing Styles */
}
```

## Considerations

*   **Accessibility**:  Consider adding ARIA attributes to improve accessibility for users who rely on screen readers.
*   **Performance**: For very complex tooltips or a large number of tooltips on a page, consider optimizing the `updatePosition` function to avoid unnecessary calculations.  Debouncing the `updatePosition` function could also be beneficial.
*   **Responsiveness**:  The component includes a `resize` event listener to handle window resizing. Ensure that your CSS styles are also responsive to different screen sizes.

## Dependencies

*   SolidJS


