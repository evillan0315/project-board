/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: [
    //'src/components',
    'src/pages',
    'src/contexts',
    'src/utils',
  ],
  entryPointStrategy: 'expand',
  out: 'docs',
  theme: 'markdown',
  plugin: ['typedoc-plugin-markdown'],

  // Filtering options
  excludePrivate: true,
  excludeProtected: true,
  excludeInternal: true,
  excludeExternals: true,

  exclude: [
    '**/*.test.ts',
    '**/*.test.tsx',
    '**/*.stories.tsx',
    '**/__mocks__/**',
    '**/node_modules/**',
    '**/dist/**',
  ],

  includeVersion: true,
  readme: 'none',
};

