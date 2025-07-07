// src/services/icon.ts
import api from './api';
import qs from 'qs';
export async function listIcons(params: {
  prefix?: string;
  sort?: 'prefix' | 'name';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}) {
  const { data } = await api.get('/icon/list', { params });
  return data;
}
export async function getIconNameSvg(icon: string): Promise<string> {
  const [prefix, name] = icon.split(':');

  try {
    // Attempt to fetch the SVG directly
    const { data } = await api.get(`/icon/${prefix}/${name}`, {
      headers: { Accept: 'image/svg+xml' },
      responseType: 'text',
    });
    return data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      try {
        // Attempt to download the missing icon
        await downloadIcons([`${prefix}:${name}`]);

        // Retry fetching the SVG
        const { data: svg } = await api.get(`/icon/${prefix}/${name}`, {
          headers: { Accept: 'image/svg+xml' },
          responseType: 'text',
        });

        return svg;
      } catch (downloadError) {
        throw new Error(`Failed to download and retrieve icon "${icon}"`);
      }
    }

    throw error; // rethrow other errors
  }
}
export async function getIconSvg(prefix: string, name: string): Promise<string> {
  const { data } = await api.get(`/icon/${prefix}/${name}`, {
    headers: { Accept: 'image/svg+xml' },
    responseType: 'text',
  });
  return data;
}
export async function downloadIcons(names: string[]) {
  const { data } = await api.get('/icon/download', {
    params: { name: names },
    paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
  });
  return data;
}
