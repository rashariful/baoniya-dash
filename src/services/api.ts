// src/services/api.ts - Alternative version with full response
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import type { 
  ApiResponse, 
  Lesson, 
  Module, 
  UploadCredentials, 
  VideoOTP, 
  VideoStatus 
} from '../types';

const API_BASE_URL: string = import.meta.env.VITE_REACT_APP_ROOT;

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lesson API with full response
export const lessonAPI = {
  getAll: async (): Promise<ApiResponse<Lesson[]>> => {
    const response = await api.get<ApiResponse<Lesson[]>>('/lesson');
    return response.data;
  },
  
  getByModule: async (moduleId: string): Promise<ApiResponse<Lesson[]>> => {
    const response = await api.get<ApiResponse<Lesson[]>>(`/lesson/module/${moduleId}`);
    return response.data;
  },
  
  getById: async (id: string): Promise<ApiResponse<Lesson>> => {
    const response = await api.get<ApiResponse<Lesson>>(`/lesson/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Lesson>): Promise<ApiResponse<Lesson>> => {
    const response = await api.post<ApiResponse<Lesson>>('/lesson', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Lesson>): Promise<ApiResponse<Lesson>> => {
    const response = await api.patch<ApiResponse<Lesson>>(`/lesson/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/lesson/${id}`);
    return response.data;
  },
};

// Module API with full response
export const moduleAPI = {
  getAll: async (): Promise<ApiResponse<Module[]>> => {
    const response = await api.get<ApiResponse<Module[]>>('/modules');
    return response.data;
  },
  
  getById: async (id: string): Promise<ApiResponse<Module>> => {
    const response = await api.get<ApiResponse<Module>>(`/modules/${id}`);
    return response.data;
  },
  
  create: async (data: { title: string; order: number; description?: string }): Promise<ApiResponse<Module>> => {
    const response = await api.post<ApiResponse<Module>>('/modules', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Module>): Promise<ApiResponse<Module>> => {
    const response = await api.patch<ApiResponse<Module>>(`/modules/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<ApiResponse<void>> => {
    const response = await api.delete<ApiResponse<void>>(`/modules/${id}`);
    return response.data;
  },
};

// Video API with full response
export const videoAPI = {
  getStatus: async (videoId: string): Promise<ApiResponse<VideoStatus>> => {
    const response = await api.get<ApiResponse<VideoStatus>>(`/lesson/video/${videoId}/status`);
    return response.data;
  },
  
  getOTP: async (videoId: string, watermark?: string): Promise<ApiResponse<VideoOTP>> => {
    const response = await api.post<ApiResponse<VideoOTP>>(`/lesson/video/get-otp/${videoId}`, {
      params: watermark ? { watermark } : {}
    });
    return response.data;
  },
  
  getInfo: async (videoId: string): Promise<ApiResponse<any>> => {
    const response = await api.get<ApiResponse<any>>(`/lesson/video/${videoId}/info`);
    return response.data;
  },
  
  getUploadCredentials: async (title: string): Promise<ApiResponse<UploadCredentials>> => {
    const response = await api.post<ApiResponse<UploadCredentials>>('/lesson/upload/credentials', { title });
    return response.data;
  },
};

export default api;