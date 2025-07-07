import { io, Socket } from 'socket.io-client';
import { currentDirectory, setDirectoryChildren, addRecentDirectory } from '../stores/fileStore';
import {
  editorActiveFilePath,
  editorActiveContent,
  editorOpenTabs,
  editorUnsaved,
  editorLanguage,
} from '../stores/editorContent';
import { type APIProps } from '../types/api';

export class FileService {
  private socket?: Socket;
  private readonly namespace = '/files';
  private readonly base = import.meta.env.BASE_URL_API?.replace(/\/$/, '');

  connect(): Socket {
    if (this.socket) return this.socket;

    const token = localStorage.getItem('token');
    this.socket = io(`${this.base}${this.namespace}`, {
      auth: { token: `Bearer ${token}` },
    });

    this.socket.on('connect', () => {
      console.log(`[✔] FileService connected: ${this.socket?.id}`);
    });
    this.socket.on('openFileResponse', (data) => {
      this.handleOpenFile(data);
    });

    this.socket.on('closeFileResponse', (data) => {
      this.handleCloseFile(data);
    });
    this.socket.on('fileUploadProgress', (progress) => {
      console.log(`Upload: ${progress.percent}%`);
    });

    this.socket.on('fileDownloadProgress', (progress) => {
      console.log(`Download: ${progress.percent}%`);
    });

    this.socket.on('fileUploadResponse', (data) => {
      console.log('Upload complete:', data);
    });
    this.socket.on('listFilesResponse', (data) => {
      console.log('listFilesResponse', data);
    });
    this.socket.on('readFileProgress', (data) => {
      console.log('readFileProgress', data);
    });
    this.socket.on('readFileResponse', (data) => {
      //console.log('readFileResponse', data);
      this.editorTools(data);
    });
    this.socket.on('formatCodeProgress', (data) => {
      console.log('formatCodeProgress', data);
      //this.handleReadFile(data);
    });
    this.socket.on('formatCodeResponse', (data) => {
      console.log('formatCodeResponse', data);
      this.editorTools(data);
    });
    this.socket.on('optimizeCodeProgress', (data) => {
      console.log('optimizeCodeProgress', data);
    });
    this.socket.on('optimizeCodeResponse', (data) => {
      this.editorTools(data);
    });
    this.socket.on('disconnect', () => {
      console.log(`FileService disconnected: ${this.socket?.id}`);
    });

    this.socket.on('connect_error', (err) => {
      console.error(`FileService connection error: ${err.message}`);
    });

    return this.socket;
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = undefined;
  }

  emitDynamicFileEvent(data: APIProps): Promise<any> {
    if (!this.socket) this.connect();

    return new Promise((resolve, reject) => {
      this.socket?.emit('dynamicFileEvent', data);

      this.socket?.once(`${data.event}Response`, (res) => {
        if (data.updateStore) {
          this.handleStoreUpdate(data, res);
        }
        resolve(res);
      });

      this.socket?.once(`${data.event}Error`, (err) => {
        reject(new Error(err?.message || 'Unknown error'));
      });
    });
  }
  private editorTools(data: { path: string; language: string; content: string }) {
    editorActiveFilePath.set(data.path || editorActiveFilePath.get());
    editorActiveContent.set(data.content);
    editorLanguage.set(data.language || editorLanguage.get());
  }
  private handleOpenFile(data: { path: string; content: string }) {
    //console.log(`Opened file: ${data.path}`);
    editorActiveFilePath.set(data.path);
    editorActiveContent.set(data.content);
    editorOpenTabs.set((tabs) => (tabs.includes(data.path) ? tabs : [...tabs, data.path]));
    editorUnsaved.set((unsaved) => {
      unsaved[data.path] = false;
      return unsaved;
    });
  }

  private handleCloseFile(data: { path: string }) {
    console.log(`Closed file: ${data.path}`);
    editorOpenTabs.set((tabs) => tabs.filter((p) => p !== data.path));
    if (editorActiveFilePath.get() === data.path) {
      const remaining = editorOpenTabs.get();
      editorActiveFilePath.set(remaining[0] || '');
      editorActiveContent.set(remaining[0] ? editorActiveContent.get() : '');
    }
    editorUnsaved.set((unsaved) => {
      delete unsaved[data.path];
      return unsaved;
    });
  }
  private handleStoreUpdate(data: { endpoint: string; method: string; body?: any; event: string }, res: any) {
    if (data.event === 'readFile') {
      console.log(data, data.event);
    }
    if (data.event === 'createFile' || data.event === 'createFolder') {
      // Optionally refresh directoryChildren externally if needed
      const dir = data.body?.directory || currentDirectory.get();
      if (Array.isArray(res)) {
        setDirectoryChildren(dir, res);
      }
    }
    if (data.event === 'updateFile') {
      // Could emit event for external refresh,
    }
    if (data.event === 'renameFile') {
      // Could emit event for external refresh, or you may choose to update directoryChildren here
      // (left to consumer to trigger refresh via fetchDirectory)
    }
  }
}

export const fileService = new FileService();
