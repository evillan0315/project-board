import { io, Socket } from 'socket.io-client';
import { currentDirectory, setDirectoryChildren, addRecentDirectory } from '../stores/fileStore';
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
    this.socket.on('fileUploadProgress', (progress) => {
      console.log(`Upload: ${progress.percent}%`);
    });

    this.socket.on('fileDownloadProgress', (progress) => {
      console.log(`Download: ${progress.percent}%`);
    });

    this.socket.on('fileUploadResponse', (data) => {
      console.log('Upload complete:', data);
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

  private handleStoreUpdate(data: { endpoint: string; method: string; body?: any; event: string }, res: any) {
    /*if (data.event === 'listFiles' && typeof data.endpoint === 'string') {
      // Extract directory from query param
      const url = new URL(`${this.base}${data.endpoint}`, window.location.origin);
      const dir = url.searchParams.get('directory') || './';
      setDirectoryChildren(dir, res);
      addRecentDirectory(dir);
      currentDirectory.set(dir);
    }*/
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
