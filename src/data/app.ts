import { type FeatureCardProps } from '../types/types';
export const features: FeatureCardProps[] = [
  {
    id: '7d2f7e98-983c-4d6a-896a-43bb8a5d85c5',
    title: 'Integrated Code Editor',
    icon: 'mdi:file-code-outline',
    description: 'Edit your files with a fast, Monaco-based editor tailored for developers.',
    page: 'fa6bc7dc-23ad-4174-84c4-bdb65de0c230',
  },
  {
    id: '5971b870-98f4-4a7e-b9e2-e8d7de7d1fa4',
    title: 'Terminal Access',
    icon: 'mdi:console',
    description: 'Execute commands directly from a built-in terminal interface with real-time output.',
    page: '3e8b3138-3f64-4a37-bd88-72c3fefb7d5c',
  },
  {
    id: '0f194ee1-f318-4a9f-8f10-bf26e23fcd57',
    title: 'Version Control',
    icon: 'mdi:source-branch',
    description: 'Seamlessly track changes and manage your codebase using Git integration.',
    page: '7a0f74b1-94d8-4ad0-9c4d-1b6599a6d4f3',
  },
  {
    id: 'e9786a13-3a3d-46a0-9b0f-b7f82dd13e42',
    title: 'Environment Configuration',
    icon: 'mdi:cog-outline',
    description:
      'Configure environment variables through a user-friendly setup form and automatic .env file generation.',
    page: '10495a57-c50b-40b3-8dbe-d0879ee589c3',
  },
  {
    id: 'c5775401-3be2-42d5-95ee-dc818c6e89ef',
    title: 'Project Explorer',
    icon: 'mdi:folder-outline',
    description: 'Navigate, organize, and manage your project files with a structured tree view.',
    page: 'c17beae3-9ef1-4bcb-9947-7f66d1a897b5',
  },
  {
    id: 'fc2f7a5c-d6f4-4b6f-b7f1-7a4043c0b0e2',
    title: 'Live Preview',
    icon: 'mdi:eye-outline',
    description: 'View changes in real time with an embedded browser preview of your web application.',
    page: '9495a528-65b5-4f6d-a43d-65c9cd6a215e',
  },
  {
    id: '0e149f6e-caa7-4a88-94c3-214dfc1f94e4',
    title: 'Authentication & Role Management',
    icon: 'mdi:shield-account-outline',
    description: 'Secure your workspace with JWT-based authentication and customizable role-based access control.',
    page: 'f1b13e8b-41cf-4d02-9d90-918b94ea88e7',
  },
  {
    id: '1e6fbbd3-d437-41fa-a96c-bf6f510bf4c1',
    title: 'Screen Recording',
    icon: 'mdi:record-rec',
    description: 'Record your screen directly from the browser to create tutorials or share your workflow.',
    page: 'page-id-screen-recording',
  },
  {
    id: '3a0e2dc6-1ea3-45e4-a429-66c4a5e7a2c8',
    title: 'Screen Capture',
    icon: 'mdi:camera-outline',
    description: 'Take instant screenshots of your code editor or project workspace.',
    page: 'page-id-screen-capture',
  },
  {
    id: 'd3be56c7-4047-4f57-bff3-48c05cb7f30e',
    title: 'Code Documentation Generator',
    icon: 'mdi:file-document-edit-outline',
    description: 'Automatically extract and generate markdown documentation from your source code.',
    page: 'page-id-doc-generator',
  },
  {
    id: '9b4d9db2-fb8d-471e-bb48-c0074d6826e0',
    title: 'AI Code Generator',
    icon: 'mdi:robot-outline',
    description: 'Leverage AI to generate, refactor, or explain code directly within the editor.',
    page: 'page-id-ai-code-generator',
  },
];
export const company = {
  name: 'Project Board',
  logo: '/logo.svg', // You can change this path to your actual logo
};
export const editor = {
  title: 'Welcome to the Editor',
  description: 'Explore the features that will enhance your development workflow',
  features: features,
};
