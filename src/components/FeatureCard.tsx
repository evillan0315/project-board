import type { JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

type FeatureCardProps = {
  icon: any; // You can refine this type based on your icon system
  title: string;
  description: string;
};

const FeatureCard = (props: FeatureCardProps): JSX.Element => {
  return (
    <div class="p-6 border rounded-lg hover:shadow-lg transition cursor-default ">
      <Icon icon={props.icon} width="50" height="50" class="text-sky-500 shrink-0" />
      <h3 class="text-xl font-semibold mb-2">{props.title}</h3>
      <p class="">{props.description}</p>
    </div>
  );
};

export default FeatureCard;
