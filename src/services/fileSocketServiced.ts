import { io, Socket } from 'socket.io-client';
import { fileSocketConnectionStatus, currentDirectory, fileList } from '../stores/fileSocketStore';
import {
  editorContent,
  editorFilePath,
  editorLanguage,
  editorOriginalContent,
  editorHistory,
  editorFuture,
  editorOpenTabs,
  editorUnsaved,
  editorCurrentDirectory,
  editorFilesDirectories,
} from '../stores/editorContent';
import api from './api'; // Import your REST API service

class FileSocketService {
  private socket?: Socket;
  private readonly namespace = '/files';
  //private readonly editorCurrentDirectory;
  private readonly base = import.meta.env.BASE_URL_API?.replace(/\/$/, '');

  connect(): Socket {
    if (this.socket) return this.socket;

    const token = localStorage.getItem('token');

    this.socket = io(`${this.base}${this.namespace}`, {
      auth: { token: `Bearer ${token}` },
    });

    this.socket.on('connect', () => {
      console.log(`[✔] FileSocket connected: ${this.socket?.id}`);
      fileSocketConnectionStatus.set('connected');
      // Optionally trigger initial listFiles
      //editorCurrentDirectory.set('./');
    });

    this.socket.on('disconnect', () => {
      console.log(`FileSocket disconnected: ${this.socket?.id}`);
      fileSocketConnectionStatus.set('disconnected');
    });

    this.socket.on('connect_error', (err) => {
      console.error(`FileSocket connection error: ${err.message}`);
      fileSocketConnectionStatus.set('error');
    });

    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = undefined;
    fileSocketConnectionStatus.set('disconnected');
  }

  listFiles(data: { directory: string; recursive?: boolean }): Promise<any[]> {
    const dir = encodeURIComponent(data.directory || '/');
    const recursive = data.recursive ?? true; // Default to true
    return this.emitRequest('listFiles', data, 'listFilesResponse', 'listFilesError');
  }

  readFile(data: { buffer: any; filePath: string; generateBlob: boolean }): Promise<string> {
    return this.emitRequest('readFile', data, 'readFileResponse', 'readFileError');
  }

  createFile(data: { directory: string; name: string }): Promise<any> {
    return this.emitRequest('createFile', data, 'createFileResponse', 'createFileError');
  }

  createFolder(data: { directory: string; name: string }): Promise<any> {
    return this.emitRequest('createFolder', data, 'createFolderResponse', 'createFolderError');
  }

  deleteFile(data: { filePath: string }): Promise<any> {
    return this.emitRequest('deleteFile', data, 'deleteFileResponse', 'deleteFileError');
  }

  renameFile(data: { oldPath: string; newPath: string }): Promise<any> {
    return this.emitRequest('renameFile', data, 'renameFileResponse', 'renameFileError');
  }

  searchFiles(data: { directory: string; searchTerm: string }): Promise<any[]> {
    return this.emitRequest('searchFiles', data, 'searchFilesResponse', 'searchFilesError');
  }

  private emitRequest(event: string, data: any, successEvent: string, errorEvent: string): Promise<any> {
    if (!this.socket) this.connect();
    console.log();
    return new Promise((resolve, reject) => {
      this.socket?.emit(event, data);
      this.socket?.once(successEvent, (res) => resolve(res));
      this.socket?.once(errorEvent, (err) => reject(new Error(err?.message || 'Unknown error')));
    });
  }
}

export const fileSocketService = new FileSocketService();
