import { atom } from 'nanostores';

export const logsOutput = atom<string[]>([]);
export const uploadProgress = atom<number>(0);
export const transcodeProgress = atom<number>(0);
export const connectionStatus = atom<'disconnected' | 'connected'>('disconnected');

export const downloadProgress = atom<number>(0);
