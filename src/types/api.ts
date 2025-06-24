import { type Method } from 'axios';
import { type Socket } from 'socket.io-client';

export interface APIProps {
  endpoint: string;
  method: 'POST' | 'GET' | 'DELETE' | 'UPDATE' | 'PATCH' | string;
  event: 'readFile' | 'listFiles' | 'createFile' | 'deleteFile' | 'saveFile' | 'writeContent' | string;
  headers?: object;
  body?: object;
  updateStore?: boolean;
}

export interface ApiDataProps {
  client: Socket;
  endpoint: string;
  method: Method;
  body?: any;
  eventBase: string;
  responseType?: string;
}
