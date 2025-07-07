export const TOOLS: string[] = [
  'React',
  'SolidJS',
  'Vue',
  'Angular',
  'Svelte',
  'NestJS',
  'Express',
  'Next.js',
  'Nuxt.js',
  'Other',
];

export const FILE_MANAGE = [
  { type: 'divider' },
  { label: 'Manage Folder', type: 'header', icon: 'mdi:file-code-outline' },
  { type: 'divider' },
  { label: 'Create Folder', icon: 'mdi:format-align-right', onClick: () => handleCreate('folder') },
  { label: 'Delete Folder', icon: 'mdi:file-plus', onClick: () => handleDelete('folder') },
  { type: 'divider' },
  { label: 'Manage File', type: 'header', icon: 'mdi:file-code-outline' },
  { type: 'divider' },
  { label: 'Create File', icon: 'mdi:file-plus', onClick: () => handleCreate('file') },
  { label: 'Delete File', icon: 'mdi:file-plus', onClick: () => handleDelete('file') },
];

export const EDITOR_ACTIONS = [
  { type: 'divider' },
  { label: 'Code Tools', type: 'header', icon: 'mdi:file-code-outline' },
  { type: 'divider' },
  { label: 'Remove Comments', icon: 'mdi:comment-remove', onClick: handleRemoveComments },
  { label: 'Format Code', icon: 'mdi:format-align-right', onClick: formatCode },
  { label: 'Optimize Code', icon: 'mdi:code-block-braces', onClick: optimize },
  { label: 'Analyze Code', icon: 'mdi:code-block-parentheses', onClick: analyze },
  { label: 'Repair Code', icon: 'mdi:code-tags-check', onClick: repair },
  { type: 'divider' },
  { label: 'Generate Docs', type: 'header', icon: 'mdi:book-open' },
  { type: 'divider' },

  { label: 'Inline Documentation', icon: 'mdi:book-open-page-variant', onClick: handleGenerateDocumentation },
  {
    label: 'Generate Documentation',
    icon: 'mdi:book-open-variant',
    onClick: () => props.setDocDrawerOpen(true),
  },
];
