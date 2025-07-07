import type { JSX } from 'solid-js';
import { Icon } from './ui/Icon';
import type { FeatureCardProps } from '../types/types';

/**
 * A card component to display a feature with an icon, title, and description.
 *  It utilizes `@iconify-icon/solid` for rendering icons.  Styling is applied using Tailwind CSS.
 *
 * @param {FeatureCardProps} props - The props for the FeatureCard component.
 * @returns {JSX.Element} A JSX element representing the FeatureCard.
 *
 * @example
 * ```typescript
 * <FeatureCard
 *   icon="mdi:rocket"
 *   title="Blazing Fast Performance"
 *   description="Experience unparalleled speed and responsiveness with our optimized algorithms."
 * />
 * ```
 *
 * **Component Features:**
 *  - Displays an icon using `@iconify-icon/solid`.
 *  - Shows a title for the feature.
 *  - Provides a description of the feature.
 *  - Uses Tailwind CSS classes for styling, including:
 *     - `p-6`: Padding of 6 units.
 *     - `border`: Adds a border.
 *     - `rounded-lg`: Rounds the corners.
 *     - `bg-gray-800/10`: A semi-transparent gray background.
 *     - `border-gray-500/30`: A semi-transparent gray border.
 *     - `hover:shadow-lg`: Adds a shadow on hover.
 *     - `transition`: Enables smooth transitions for hover effects.
 *     - `cursor-default`: Sets the cursor to the default pointer.
 *     - `text-sky-500`: Sets the icon color to sky-500.
 *     - `shrink-0`: Prevents the icon from shrinking.
 *     - `text-xl`: Sets the title text size to extra large.
 *     - `font-semibold`: Makes the title font semi-bold.
 *     - `mb-2`: Adds a margin-bottom to the title.
 */
const FeatureCard = (props: FeatureCardProps): JSX.Element => {
  return (
    <div class="p-6 border rounded-lg bg-gray-800/10 border-gray-500/30 hover:shadow-lg transition cursor-default ">
      <Icon icon={props.icon} width="50px" height="50px" class="text-sky-500 shrink-0" />
      <h3 class="text-xl font-semibold mb-2 mt-2">{props.title}</h3>
      <p class="">{props.description}</p>
    </div>
  );
};

export default FeatureCard;
