// Global reusable options for Generating content
// src/constants/generateCodeOptiosn
export const topicOptions: string[] = [
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

export const languageOptions: { code: string; label: string }[] = [
  { code: 'ts', label: 'TypeScript' },
  { code: 'js', label: 'JavaScript' },
  { code: 'py', label: 'Python' },
  { code: 'java', label: 'Java' },
  { code: 'go', label: 'Go' },
  { code: 'rb', label: 'Ruby' },
  { code: 'php', label: 'PHP' },
  { code: 'cpp', label: 'C++' },
  { code: 'csharp', label: 'C#' },
  { code: 'swift', label: 'Swift' },
  { code: 'other', label: 'Other' },
];

export const outputFormats: string[] = ['markdown', 'html', 'json', 'text'];
