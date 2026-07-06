export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  totalLessons: number;
  instructor: string;
  price: number;
}

export interface Module {
  _id: string;
  title: string;
  courseId: string;
  order: number;
}

export interface Lesson {
  _id: string;
  title: string;
  moduleId: string;
  videoUrl?: string;
  duration: number;
  order: number;
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correct: number;
}

export interface Quiz {
  moduleId: string;
  title: string;
  questions: QuizQuestion[];
}

export interface CourseProgress {
  completedLessons: Record<string, boolean>;
  unlockedLessons: Record<string, Record<string, boolean>>;
}
export interface Enrollment {
  studentId: string;
  courseId: string;
  batchId: string;
  orderId?: string;
  progress?: number;
  status?: "active" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoadingState {
  courses: boolean;
  modules: boolean;
  lessons: boolean;
  entollment: boolean;
}


// src/types/index.ts

export interface Module {
  _id: string;
  title: string;
  order: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Video {
  videoId: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  duration: number;
  poster?: string | null;
  processedAt?: string;
}

export interface Lesson {
  _id: string;
  title: string;
  moduleId: string;
  order: number;
  video?: Video;
  isPreview: boolean;
  attachments?: Array<{ title: string; fileUrl: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface UploadCredentials {
  clientPayload: {
    key: string;
    policy: string;
    'x-amz-algorithm': string;
    'x-amz-credential': string;
    'x-amz-date': string;
    'x-amz-signature': string;
    success_action_status: string;
    uploadLink: string;
  };
  videoId: string;
}

export interface VideoOTP {
  otp: string;
  playbackInfo: string;
}

export interface VideoStatus {
  videoId: string;
  status: 'pending' | 'processing' | 'ready' | 'error';
  isReady: boolean;
  duration: number;
  poster: string | null;
  vdocipherStatus: string;
  transcodingProgress: number;
  lessonTitle: string | null;
  moduleId: string | null;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
}