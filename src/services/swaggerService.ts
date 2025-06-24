import type { SwaggerSpec } from '../types/swagger';
import api from '../services/api';

export async function loadSwaggerSpec(): Promise<SwaggerSpec> {
  const response = await api.post('/file/read', { filePath: './swagger.json' });

  if (!response.data) {
    throw new Error('Failed to load swagger.json');
  }
  return await JSON.parse(response.data.content);
}
