import { onCleanup, onMount } from 'solid-js';
import { io, Socket } from 'socket.io-client';
import {
  uploadProgress,
  transcodeProgress,
  connectionStatus,
  logsOutput,
  downloadProgress,
} from '../stores/socketStore';

export function useSocket(namespace: string, autoConnect = true) {
  let socket: Socket | undefined;
  const base = import.meta.env.BASE_URL_API?.replace(/\/$/, '');

  function connect() {
    if (socket) return; // Prevent multiple connections

    const token = localStorage.getItem('token');
    socket = io(`${base}${namespace}`, {
      auth: { token: `Bearer ${token}` },
    });

    socket.on('connect', () => {
      console.log(`[✔] ${namespace} connected`);
      connectionStatus.set('connected');
    });

    socket.on('disconnect', () => {
      console.log(`${namespace} disconnected`);
      connectionStatus.set('disconnected');
    });

    socket.on('connect_error', (err) => {
      console.error(`Connection error on ${namespace}:`, err.message);
      connectionStatus.set('error');
    });

    bindNamespaceHandlers(namespace);
  }

  function bindNamespaceHandlers(ns: string) {
    switch (ns) {
      case '/files':
      case '/gemini':
        // No specific handlers (yet)
        break;

      case '/terminal':
      case '/logs':
        socket?.on('log_entry', (data) => {
          logsOutput.update((prev) => [...prev, data.entry]);
        });
        break;

      case '/download':
        socket?.on('download_progress', (data) => {
          downloadProgress.set(Number(data.percent));
        });
        socket?.on('download_complete', () => {
          downloadProgress.set(100);
        });
        break;

      case '/upload':
        socket?.on('upload_progress', (data) => {
          uploadProgress.set(Number(data.percent));
        });
        socket?.on('upload_complete', () => {
          uploadProgress.set(100);
        });
        break;

      case '/transcode':
        socket?.on('transcode_progress', (data) => {
          transcodeProgress.set(Number(data.percent));
        });
        socket?.on('transcode_complete', () => {
          transcodeProgress.set(100);
        });
        break;

      case '/recording':
        socket?.on('recording:start:response', (res) => {
          res.success
            ? console.log(`Recording started:`, res)
            : console.error(`Failed to start recording: ${res.error}`);
        });
        socket?.on('recording:stop:response', (res) => {
          res.success
            ? console.log(`Recording stopped:`, res)
            : console.error(`Failed to stop recording: ${res.error}`);
        });
        socket?.on('recordings:list:response', (res) => {
          if (Array.isArray(res)) {
            console.log('Recordings:', res);
          } else if (res.success === false) {
            console.error(`Failed to list recordings: ${res.error}`);
          }
        });
        socket?.on('recordings:cleanup:response', (res) => {
          res.success
            ? console.log(`Deleted files:`, res.deleted)
            : console.error(`Failed to cleanup recordings: ${res.error}`);
        });
        socket?.on('recording:status:update', (status) => {
          console.log('Recording status update:', status);
        });
        break;

      default:
        console.warn(`No handler defined for namespace: ${ns}`);
    }
  }

  function disconnect() {
    if (socket) {
      socket.disconnect();
      console.log(`Disconnected from namespace: ${namespace}`);
      socket = undefined;
    }
  }

  onMount(() => {
    if (autoConnect) {
      connect();
    }
  });

  onCleanup(() => {
    disconnect();
  });

  return {
    connect,
    disconnect,
    emit: (event: string, data?: any) => {
      socket?.emit(event, data);
    },
    socket: () => socket,
  };
}
