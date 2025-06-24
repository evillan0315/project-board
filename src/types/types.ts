export interface FeatureCardProps {
  id?: string;

  icon: string;

  title: string;

  description: string;
  page?: string;
}
export interface Feature {
  id: string;
  title: string;
  icon: string;
  description: string;
  page: string;
}
export interface FileItem {
  name: string;
  path: string;
  isDirectory: boolean;
  mimeType?: string;
  lang?: string;
  type: 'file' | 'folder';
  children?: FileItem[];
  size?: number;
  url?: string;
}
export interface ReadFileResponseDto {
  filePath?: string | null;

  filename: string;

  mimeType: string;

  language?: string | null;

  content: string;

  blob?: string | null;
}

export interface GenerateCodeDto {
  prompt: string;
  topic?: string;
  language?: string;
  output?: 'markdown' | 'json' | 'html' | 'text';
}
