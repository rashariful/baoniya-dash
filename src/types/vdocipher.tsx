// src/types/vdocipher.d.ts
declare global {
  interface Window {
    VdoPlayer: any;
  }
}

export interface ClientPayload {
  policy: string;
  key: string;
  'x-amz-signature': string;
  'x-amz-algorithm': string;
  'x-amz-date': string;
  'x-amz-credential': string;
  uploadLink: string;
}

export interface UploadCredentials {
  clientPayload: ClientPayload;
  videoId: string;
}

export interface Lesson {
  _id: string;
  moduleId: string;
  title: string;
  videoId: string;
  order: number;
  duration: number;
  isPreview: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
}