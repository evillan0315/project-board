import { type Method } from 'axios';
import { type Socket } from 'socket.io-client';

export interface APIProps {
  endpoint: string;
  method: Method;
  event: 'readFile' | 'listFiles' | 'createFile' | 'deleteFile' | 'saveFile' | 'writeContent' | string;
  headers?: object;
  body?: object;
  params?: object;
  responseType?: string;
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

export interface UserConfiguration {
  server: {
    host: string;
    port: number;
    enableSSL?: boolean;
  };
  database: {
    type: 'postgresql' | 'mysql' | 'sqlite' | 'mongodb';
    host: string;
    port: number;
    username: string;
    password?: string;
    databaseName: string;
  };
  apiKeys?: {
    [serviceName: string]: string;
  };
}
