import { useState, useCallback } from "react";
import { Course, Module, Lesson, Enrollment } from "../types";

const API = import.meta.env.VITE_REACT_APP_ROOT;

interface LoadingState {
  courses: boolean;
  modules: boolean;
  lessons: boolean;
  enrollment: boolean;
}

interface UseCourseDataReturn {
  courses: Course[];
  modules: Module[];
  lessons: Lesson[];
  enrollment: Enrollment[];
  loading: LoadingState;
  fetchCourses: () => Promise<Course[]>;
  fetchModules: (courseId: string) => Promise<Module[]>;
  fetchLessons: (moduleId: string) => Promise<Lesson[]>;
  fetchEnrollment: (moduleId: string) => Promise<Enrollment[]>;
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
  setEnrollment: React.Dispatch<React.SetStateAction<Enrollment[]>>;
}

export const useCourseData = (): UseCourseDataReturn => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState<LoadingState>({ 
    courses: false, 
    modules: false, 
    enrollment: false, 
    lessons: false       
  });

  const fetchCourses = useCallback(async (): Promise<Course[]> => {
    setLoading(prev => ({ ...prev, courses: true }));
    try {
      const res = await fetch(`${API}/course`);
      const data = await res.json();
      setCourses(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  }, []);

  const fetchModules = useCallback(async (courseId: string): Promise<Module[]> => {
    setLoading(prev => ({ ...prev, modules: true }));
    try {
      const res = await fetch(`${API}/modules?courseId=${courseId}`);
      const data = await res.json();
      setModules(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching modules:", error);
      return [];
    } finally {
      setLoading(prev => ({ ...prev, modules: false }));
    }
  }, []);

  const fetchLessons = useCallback(async (moduleId: string): Promise<Lesson[]> => {
    setLoading(prev => ({ ...prev, lessons: true }));
    try {
      const res = await fetch(`${API}/lesson?moduleId=${moduleId}`);
      const data = await res.json();
      setLessons(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching lessons:", error);
      return [];
    } finally {
      setLoading(prev => ({ ...prev, lessons: false }));
    }
  }, []);

  const fetchEnrollment = useCallback(async (moduleId: string): Promise<Enrollment[]> => {
    setLoading(prev => ({ ...prev, enrollment: true }));
    try {
      const res = await fetch(`${API}/enrollment`);
      const data = await res.json();
      setEnrollment(data.data);
      return data.data;
    } catch (error) {
      console.error("Error fetching enrollment:", error);
      return [];
    } finally {
      setLoading(prev => ({ ...prev, enrollment: false }));
    }
  }, []);

  return {
    courses,
    modules,
    lessons,
    enrollment,
    loading,
    fetchCourses,
    fetchModules,
    fetchLessons,
    fetchEnrollment,
    setCourses,
    setModules,
    setLessons,
    setEnrollment
  };
};