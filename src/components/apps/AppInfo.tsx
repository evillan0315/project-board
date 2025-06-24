import { createSignal, For, Show } from 'solid-js';
import { APP_NAME } from '../../constants/app';

export default function AppInfo() {
  return (
    <div class="flex items-center gap-2">
      <p>{APP_NAME}</p>
    </div>
  );
}
