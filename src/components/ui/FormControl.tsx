import { splitProps, Show, For, type JSX } from 'solid-js';
import { Icon } from '@iconify-icon/solid';

type Variant = 'default' | 'error' | 'warning' | 'success' | 'info' | 'primary';
type Size = 'sm' | 'md' | 'lg';

type CommonProps = {
  label?: string;
  helperText?: string;
  errorText?: string;
  variant?: Variant;
  size?: Size;
  prefix?: JSX.Element;
  suffix?: JSX.Element;
  icon?: string; // iconify icon name (optional)
};

type InputProps = JSX.InputHTMLAttributes<HTMLInputElement> &
  CommonProps & {
    type?: 'text' | 'radio' | 'range';
    options?: { label: string; value: string }[]; // for radio
  };

type TextareaProps = JSX.TextareaHTMLAttributes<HTMLTextAreaElement> & CommonProps;

type SelectProps = JSX.SelectHTMLAttributes<HTMLSelectElement> &
  CommonProps & {
    options: { label: string; value: string }[];
  };

const sizeClasses = {
  sm: 'text-sm p-1',
  md: 'text-base p-2',
  lg: 'text-lg p-3',
};

const variantClasses = {
  default: 'border-gray-300 focus:border-sky-500',
  error: 'border-red-500 focus:border-red-600',
  warning: 'border-yellow-500 focus:border-yellow-600',
  success: 'border-green-500 focus:border-green-600',
  info: 'border-blue-500 focus:border-blue-600',
  primary: 'border-sky-600 focus:border-blue-700',
};

function containerClass(size: Size, variant: Variant, disabled: boolean | undefined, readOnly: boolean | undefined) {
  let base = `border rounded w-full flex items-center gap-1 ${sizeClasses[size]} ${variantClasses[variant]} transition`;
  if (disabled) base += ' opacity-50 cursor-not-allowed';
  if (readOnly) base += ' bg-gray-100';
  return base;
}

export function FormInput(props: InputProps) {
  const [local, others] = splitProps(props, [
    'label',
    'helperText',
    'errorText',
    'variant',
    'size',
    'class',
    'type',
    'options',
    'prefix',
    'suffix',
    'icon',
    'disabled',
    'readOnly',
  ]);
  const variant = () => local.variant || 'default';
  const size = () => local.size || 'md';

  return (
    <div class={`space-y-1 ${local.class || ''}`}>
      <Show when={local.label}>
        <label class="block font-medium">{local.label}</label>
      </Show>

      <Show
        when={local.type === 'radio' && local.options}
        fallback={
          <div class={containerClass(size(), variant(), local.disabled, local.readOnly)}>
            <Show when={local.prefix}>
              <div class="shrink-0">{local.prefix}</div>
            </Show>
            <Show when={local.icon}>
              <Icon icon={local.icon!} class="text-gray-400" />
            </Show>
            <input
              type={local.type || 'text'}
              class="bg-transparent border-0 outline-none w-full"
              disabled={local.disabled}
              readOnly={local.readOnly}
              {...others}
            />
            <Show when={local.suffix}>
              <div class="shrink-0">{local.suffix}</div>
            </Show>
          </div>
        }
      >
        <div class="flex gap-2 flex-wrap">
          <For each={local.options}>
            {(opt) => (
              <label class="inline-flex items-center gap-1">
                <input type="radio" value={opt.value} name={others.name} disabled={local.disabled} {...others} />
                {opt.label}
              </label>
            )}
          </For>
        </div>
      </Show>

      <Show when={local.helperText}>
        <p class="text-xs text-gray-500">{local.helperText}</p>
      </Show>
      <Show when={local.errorText}>
        <p class="text-xs text-red-500">{local.errorText}</p>
      </Show>
    </div>
  );
}

export function FormTextarea(props: TextareaProps) {
  const [local, others] = splitProps(props, [
    'label',
    'helperText',
    'errorText',
    'variant',
    'size',
    'class',
    'prefix',
    'suffix',
    'icon',
    'disabled',
    'readOnly',
  ]);
  const variant = () => local.variant || 'default';
  const size = () => local.size || 'md';

  return (
    <div class={`space-y-1 ${local.class || ''}`}>
      <Show when={local.label}>
        <label class="block font-medium">{local.label}</label>
      </Show>

      <div class={containerClass(size(), variant(), local.disabled, local.readOnly)}>
        <Show when={local.prefix}>
          <div class="shrink-0">{local.prefix}</div>
        </Show>
        <Show when={local.icon}>
          <Icon icon={local.icon!} class="text-gray-400" />
        </Show>
        <textarea
          class="bg-transparent border-0 outline-none w-full resize-none"
          disabled={local.disabled}
          readOnly={local.readOnly}
          {...others}
        />
        <Show when={local.suffix}>
          <div class="shrink-0">{local.suffix}</div>
        </Show>
      </div>

      <Show when={local.helperText}>
        <p class="text-xs text-gray-500">{local.helperText}</p>
      </Show>
      <Show when={local.errorText}>
        <p class="text-xs text-red-500">{local.errorText}</p>
      </Show>
    </div>
  );
}

export function FormSelect(props: SelectProps) {
  const [local, others] = splitProps(props, [
    'label',
    'helperText',
    'errorText',
    'variant',
    'size',
    'class',
    'prefix',
    'suffix',
    'icon',
    'disabled',
  ]);
  const variant = () => local.variant || 'default';
  const size = () => local.size || 'md';

  return (
    <div class={`space-y-1 ${local.class || ''}`}>
      <Show when={local.label}>
        <label class="block font-medium">{local.label}</label>
      </Show>

      <div class={containerClass(size(), variant(), local.disabled, false)}>
        <Show when={local.prefix}>
          <div class="shrink-0">{local.prefix}</div>
        </Show>
        <Show when={local.icon}>
          <Icon icon={local.icon!} class="text-gray-400" />
        </Show>
        <select class="bg-transparent border-0 outline-none w-full" disabled={local.disabled} {...others}>
          <For each={local.options}>{(opt) => <option value={opt.value}>{opt.label}</option>}</For>
        </select>
        <Show when={local.suffix}>
          <div class="shrink-0">{local.suffix}</div>
        </Show>
      </div>

      <Show when={local.helperText}>
        <p class="text-xs text-gray-500">{local.helperText}</p>
      </Show>
      <Show when={local.errorText}>
        <p class="text-xs text-red-500">{local.errorText}</p>
      </Show>
    </div>
  );
}
