import api from './api';
import { useEditorFile } from '../hooks/useEditorFile';

const { createFile } = useEditorFile();
export async function generateGeminiText(prompt, systemInstruction, conversationId) {
  try {
    const payload = { prompt };
    if (systemInstruction !== undefined) {
      payload.systemInstruction = systemInstruction;
    }
    if (conversationId !== undefined) {
      payload.conversationId = conversationId;
    }

    const response = await api.post('/gemini/file/generate-text', payload);
    if (!response.data) {
      throw new Error('Failed to Generate content');
    }
    return response.data;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

export async function generateGeminiFile(prompt, fileData, systemInstruction, conversationId) {
  try {
    const formData = new FormData();
    formData.append('prompt', prompt);
    console.log(prompt, 'prompt');

    const byteCharacters = atob(fileData.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: fileData.type });

    formData.append('file', blob, fileData.name);

    if (systemInstruction !== undefined) {
      formData.append('systemInstruction', systemInstruction);
    }
    if (conversationId !== undefined) {
      formData.append('conversationId', conversationId);
    }

    const response = await api.post('/gemini/file/generate-file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (!response.data) {
      throw new Error('Failed to Generate content');
    }
    const stripCode = response.data;
    const createResponse = await createFile('./docs/gemini/', fileData.name, stripCode.content);

    return createResponse.filePath;
  } catch (error) {
    console.error('Error calling Gemini File API:', error);
    throw error;
  }
}

export async function convertMarkdowToHtml(markdown) {
  try {
    const response = await api.post('/utils/to-html', { markdown: markdown });
    if (!response.data) {
      throw new Error('Failed to Generate content');
    }
    return response.data;
  } catch (error) {
    console.error('Error calling Utils API:', error);
    throw error;
  }
}
