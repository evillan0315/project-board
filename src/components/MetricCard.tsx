import type { JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

type MetricCardProps = {
  icon: any; // You can refine this type based on your icon system
  label: string;
  value: string | number;
};

const MetricCard = (props: MetricCardProps): JSX.Element => {
  return (
    <div class="border bg-gray-800/10 border-gray-500/30 rounded-2xl px-4 py-8 shadow-md flex items-center space-x-4 border">
      <Icon icon={props.icon} width="50" height="50" class="text-sky-500 shrink-0" />
      <div class="flex flex-col">
        <span class="text-lg">{props.label}</span>
        <span class="text-4xl font-semibold">{props.value}</span>
      </div>
    </div>
  );
};

export default MetricCard;
