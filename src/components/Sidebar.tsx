import React from "react";
import { BookOpen, Minus, Plus, Play, Lock, CheckCircle } from "lucide-react";
import { formatDuration } from "../utils/helpers";
import { Course, Module, Lesson } from "../types";

interface SidebarProps {
  selectedCourse: Course | null;
  modules: Module[];
  lessons: Lesson[];
  selectedModule: Module | null;
  selectedLesson: Lesson | null;
  loading: { courses: boolean; modules: boolean; lessons: boolean };
  expandedModules: Record<string, boolean>;
  completedLessons: Record<string, boolean>;
  unlockedLessons: Record<string, Record<string, boolean>>;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  onModuleClick: (module: Module) => void;
  onLessonClick: (lesson: Lesson) => void;
  calculateProgress: () => number;
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedCourse,
  modules,
  lessons,
  selectedLesson,
  loading,
  expandedModules,
  completedLessons,
  unlockedLessons,
  sidebarOpen,
  mobileMenuOpen,
  onModuleClick,
  onLessonClick,
  calculateProgress,
}) => {
  // 🔓 Check lesson unlocked
  const isLessonUnlocked = (lessonId: string) => {
    if (!selectedCourse) return false;

    const courseId = String(selectedCourse._id);
    const id = String(lessonId);

    const courseUnlocks = unlockedLessons?.[courseId];

    return Boolean(courseUnlocks?.[id]);
  };

  // 📦 handle moduleId populate / string

  const getLessonModuleId = (lesson: Lesson) => {
    console.log("Modules:", modules);
    console.log("Lessons:", lessons);
    if (!lesson.moduleId) return null;

    if (typeof lesson?.moduleId === "string") return lesson.moduleId;

    return lesson?.moduleId._id;
  };

  return (
    <div
      className={`
    fixed lg:relative h-full bg-white shadow-2xl z-20 transition-all duration-300 overflow-hidden flex flex-col
    ${sidebarOpen ? "w-[350px]" : "w-0 lg:w-16"}
    ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
  `}
    >
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200 px-3 py-4">
        {/* Course Header with Gradient - Light Version */}
        {sidebarOpen ? (
          <div className="bg-gradient-to-r from-[#ff4d4d] to-[#ff8c42] rounded-2xl p-5 mb-6 shadow-sm">
            <h2 className="font-bold text-lg text-white truncate">
              {selectedCourse?.title}
            </h2>

            <p className="text-sm text-white/90 mt-1">
              {selectedCourse?.instructor}
            </p>

            <div className="mt-5">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-white/80">Course Progress</span>
                <span className="text-white font-semibold">
                  {Math.round(calculateProgress())}%
                </span>
              </div>

              <div className="w-full bg-white/30 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-300"
                  style={{ width: `${calculateProgress()}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-[#ff4d4d] to-[#ff8c42] rounded-2xl p-3.5 shadow-sm">
              <BookOpen size={22} className="text-white" />
            </div>
          </div>
        )}

        {/* Search Input - Light Version */}
        {sidebarOpen && (
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search lessons..."
                className="w-full bg-gray-100 rounded-2xl py-3 pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-500 border border-[#ff4d4d] focus:outline-[#ff4d4d] focus:border-[#ff4d4d] focus:ring-1 focus:ring-[#ff4d4d]/30 transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ff4d4d]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        )}

        {!sidebarOpen && (
          <div className="flex justify-center mb-6">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        )}

        {/* Modules */}
        <div className="flex flex-col gap-3">
          {modules
            .sort((a, b) => a.order - b.order)
            .map((module, idx) => {
              const moduleLessons = lessons
                .filter(
                  (lesson) =>
                    String(getLessonModuleId(lesson)) === String(module._id),
                )
                .sort((a, b) => a.order - b.order);

              const completedCount = moduleLessons.filter(
                (l) => completedLessons[String(l._id)],
              ).length;

              const progress =
                moduleLessons.length > 0
                  ? (completedCount / moduleLessons.length) * 100
                  : 0;

              return (
                <div
                  key={module._id}
                  className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow"
                >
                  {/* Module Header */}
                  <button
                    onClick={() => onModuleClick(module)}
                    className="w-full p-4 flex items-center gap-3 hover:bg-orange-50 transition-all group"
                  >
                    {/* Module Number Badge */}
                    {/* <div
                  className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold ${
                    progress === 100
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-gradient-to-r from-[#ff4d4d]/10 to-[#ff8c42]/10 text-gray-700"
                  }`}
                >
                  {progress === 100 ? (
                    <CheckCircle size={18} className="text-emerald-600" />
                  ) : (
                    idx + 1
                  )}
                </div> */}

                    {sidebarOpen ? (
                      <>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-bold text-gray-900">
                            {module.title}
                          </p>

                          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                            <span>
                              {completedCount}/{moduleLessons.length} lessons
                            </span>
                            {progress > 0 && progress < 100 && (
                              <>
                                <span>•</span>
                                <span>{Math.round(progress)}%</span>
                              </>
                            )}
                          </div>

                          {/* Progress Bar */}
                          {progress > 0 && progress < 100 && (
                            <div className="mt-2.5 w-full bg-gray-100 rounded-full h-1">
                              <div
                                className="bg-gradient-to-r from-[#ff4d4d] to-[#ff8c42] h-full rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="flex-shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors">
                          {expandedModules[module._id] ? (
                            <Minus size={18} />
                          ) : (
                            <Plus size={18} />
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="flex-shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors ml-auto">
                        {expandedModules[module._id] ? (
                          <Minus size={16} />
                        ) : (
                          <Plus size={16} />
                        )}
                      </div>
                    )}
                  </button>

                  {/* Lessons List */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      expandedModules[module._id]
                        ? "max-h-[1000px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="border-t border-gray-100 bg-gray-50/50">
                      {moduleLessons.map((lesson) => {
                        const lessonId = String(lesson._id);
                        const unlocked = isLessonUnlocked(lessonId);
                        const completed = completedLessons[lessonId];
                        const isActive = selectedLesson?._id === lessonId;

                        return (
                          <button
                            key={lessonId}
                            onClick={() => unlocked && onLessonClick(lesson)}
                            disabled={!unlocked}
                            className={`
                          w-full flex items-center gap-3 px-5 py-3.5 pl-14 text-left transition-all relative
                          hover:bg-white
                          ${isActive ? "bg-orange-50" : ""}
                          ${!unlocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                        `}
                          >
                            {/* Active Indicator */}
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-gradient-to-b from-[#ff4d4d] to-[#ff8c42]" />
                            )}

                            
                            {/* Icon */}
                            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full">
                              {completed ? (
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-emerald-100">
                                  <CheckCircle
                                    size={14}
                                    className="text-emerald-600"
                                  />
                                </div>
                              ) : unlocked ? (
                                <div className="w-6 h-6 text-green-600 flex items-center justify-center rounded-full bg-green-500">
                                  <Play
                                    size={12}
                                    className="text-green-50 ml-[1px]"
                                  />
                                </div>
                              ) : (
                                <div className="w-6 h-6 flex items-center justify-center rounded-full bg-rose-500">
                                  <Lock size={12} className="text-red-50" />
                                </div>
                              )}
                            </div>

                            {/* Lesson Info */}
                            <div className="flex-1 min-w-0">
                              <p
                                className={`text-sm truncate ${
                                  completed
                                    ? "text-gray-400 line-through"
                                    : isActive
                                      ? "text-[#ff8c42] font-medium"
                                      : "text-gray-700"
                                }`}
                              >
                                {lesson.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {formatDuration(lesson.duration)}
                              </p>
                            </div>
                          </button>
                        );
                      })}

                      {moduleLessons.length === 0 &&
                        !loading.lessons &&
                        sidebarOpen && (
                          <div className="pl-14 py-4 text-sm text-gray-500">
                            No lessons in this module
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
