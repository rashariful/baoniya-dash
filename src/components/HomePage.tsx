// src/pages/HomePage.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Layers, Loader2, PlusCircle, RefreshCw, X } from 'lucide-react';
import LessonModal from '../components/LessonModal';
import LessonsTable from '../components/LessonsTable';
import { lessonAPI, moduleAPI } from '@/services/api';
import type { Lesson, Module } from '@/types';

const POLL_INTERVAL_MS: number = 5000;

const HomePage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [moduleFormOpen, setModuleFormOpen] = useState<boolean>(false);
  const [moduleName, setModuleName] = useState<string>('');
  const [moduleOrder, setModuleOrder] = useState<number>(1);
  const [moduleSubmitting, setModuleSubmitting] = useState<boolean>(false);

  const hasNonReadyVideos = (list: Lesson[]): boolean =>
    list.some((l) => l.video?.videoId && l.video?.status !== 'ready' && l.video?.status !== 'error');

  const fetchLessons = useCallback(async (silent: boolean = false): Promise<Lesson[]> => {
    if (!silent) setLoading(true);
    try {
      const res = await lessonAPI.getAll();
      if (res.success && res.data) {
        setLessons(res.data);
        return res.data;
      }
      return [];
    } catch (err) {
      console.error('Failed to fetch lessons:', err);
      return [];
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const fetchModules = useCallback(async (): Promise<void> => {
    try {
      const res = await moduleAPI.getAll();
      if (res.success && res.data) {
        setModules(res.data);
        setModuleOrder((res.data.length ?? 0) + 1);
      }
    } catch (err) {
      console.error('Failed to fetch modules:', err);
    }
  }, []);

  const fetchAll = useCallback(async (silent: boolean = false): Promise<void> => {
    await Promise.all([fetchLessons(silent), fetchModules()]);
  }, [fetchLessons, fetchModules]);

  // Smart polling for video processing
  useEffect(() => {
    let pollTimer: ReturnType<typeof setTimeout> | null = null;
    
    const schedulePoll = (): void => {
      if (pollTimer) clearTimeout(pollTimer);
      
      if (hasNonReadyVideos(lessons)) {
        pollTimer = setTimeout(async () => {
          await fetchLessons(true);
          schedulePoll();
        }, POLL_INTERVAL_MS);
      }
    };
    
    schedulePoll();
    return () => {
      if (pollTimer) clearTimeout(pollTimer);
    };
  }, [lessons, fetchLessons]);

  // Initial load
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleCreateModule = async (): Promise<void> => {
    if (!moduleName.trim()) return;
    setModuleSubmitting(true);
    try {
      const res = await moduleAPI.create({ title: moduleName.trim(), order: moduleOrder });
      if (res.success && res.data) {
        setModules((prev) => [...prev, res.data!].sort((a, b) => a.order - b.order));
        setModuleName('');
        setModuleOrder((prev) => prev + 1);
        setModuleFormOpen(false);
      }
    } catch (err) {
      console.error('Failed to create module:', err);
    } finally {
      setModuleSubmitting(false);
    }
  };

  const handleLessonSuccess = (lesson: Lesson): void => {
    setLessons((prev) => {
      const idx = prev.findIndex((l) => l._id === lesson._id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = lesson;
        return next;
      }
      return [...prev, lesson];
    });
  };

  const handleDeleteLesson = async (lessonId: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await lessonAPI.delete(lessonId);
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
    } catch (err) {
      console.error('Failed to delete lesson:', err);
    }
  };

  const handleOpenCreateModal = (): void => {
    setEditLesson(null);
    setModalOpen(true);
  };

  const handleOpenEditModal = (lesson: Lesson): void => {
    setEditLesson(lesson);
    setModalOpen(true);
  };

  const processingCount: number = lessons.filter(
    (l) => l.video?.videoId && l.video?.status !== 'ready' && l.video?.status !== 'error'
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="block w-1 h-7 bg-primary rounded-full" aria-hidden="true" />
            <h1 className="text-lg font-semibold text-gray-900">Lesson Management</h1>
            {!loading && (
              <span className="text-xs text-gray-400 font-medium">
                {lessons.length} lesson{lessons.length !== 1 ? 's' : ''}
              </span>
            )}
            {processingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                <Loader2 className="w-3 h-3 animate-spin" />
                {processingCount} video{processingCount > 1 ? 's' : ''} processing
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAll()}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-primary hover:bg-primary-light rounded-md transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button onClick={() => setModuleFormOpen((o) => !o)} className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 inline-flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Modules</span>
            </button>

            <button onClick={handleOpenCreateModal} className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary-dark inline-flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Create Lesson</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Module Form */}
        {moduleFormOpen && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Course Modules
              </h2>
              <button onClick={() => setModuleFormOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {modules.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {modules.map((m) => (
                  <span key={m._id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-light text-primary text-xs font-medium rounded-full">
                    <span className="opacity-60">{m.order}.</span> {m.title}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <input
                type="text"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateModule()}
                placeholder="Module name (e.g. Introduction)"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="number"
                value={moduleOrder}
                onChange={(e) => setModuleOrder(Number(e.target.value))}
                min={1}
                placeholder="Order"
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleCreateModule}
                disabled={moduleSubmitting || !moduleName.trim()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
              >
                {moduleSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add'}
              </button>
            </div>
          </div>
        )}

        {/* Lessons Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-800 text-sm">All Lessons</h2>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : (
            <LessonsTable
              lessons={lessons}
              modules={modules}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteLesson}
            />
          )}
        </div>
      </main>

      <LessonModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditLesson(null);
        }}
        onSuccess={handleLessonSuccess}
        modules={modules}
        editLesson={editLesson}
      />
    </div>
  );
};

export default HomePage;