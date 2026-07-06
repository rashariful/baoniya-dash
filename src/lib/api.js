// src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api"; // আপনার backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API Response handler
const handleResponse = (response) => {
  if (response.data.success) {
    return response.data;
  }
  throw new Error(response.data.message || "Something went wrong");
};

// Lesson API
export const lessonAPI = {
  // Get all lessons
  getAll: () => api.get("/lesson").then(handleResponse),

  // Get lessons by module
  getByModule: (moduleId) =>
    api.get(`/lesson/module/${moduleId}`).then(handleResponse),

  // Get single lesson
  getById: (id) => api.get(`/lesson/${id}`).then(handleResponse),

  // Create lesson
  create: (data) => api.post("/lesson", data).then(handleResponse),

  // Update lesson
  update: (id, data) => api.patch(`/lesson/${id}`, data).then(handleResponse),

  // Delete lesson
  delete: (id) => api.delete(`/lesson/${id}`).then(handleResponse),
};

// Module API
export const moduleAPI = {
  // Get all modules
  getAll: () => api.get("/module").then(handleResponse),

  // Get single module
  getById: (id) => api.get(`/module/${id}`).then(handleResponse),

  // Create module
  create: (data) => api.post("/module", data).then(handleResponse),

  // Update module
  update: (id, data) => api.patch(`/module/${id}`, data).then(handleResponse),

  // Delete module
  delete: (id) => api.delete(`/module/${id}`).then(handleResponse),
};

// VdoCipher Video API
export const videoAPI = {
  // Get video status (YOUR MAIN ENDPOINT)
  getStatus: (videoId) =>
    api.get(`/lesson/video/${videoId}/status`).then(handleResponse),

  // Get video OTP for player
  getOTP: (videoId, watermark = "") =>
    api
      .get(`/lesson/video/${videoId}/otp`, {
        params: watermark ? { watermark } : {},
      })
      .then(handleResponse),

  // Get video info
  getInfo: (videoId) =>
    api.get(`/lesson/video/${videoId}/info`).then(handleResponse),

  // Get upload credentials
  getUploadCredentials: (title) =>
    api.post("/lesson/upload/credentials", { title }).then(handleResponse),
};

export default api;
