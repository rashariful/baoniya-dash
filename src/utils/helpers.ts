import { Module, Quiz } from "@/types";

export const formatDuration = (seconds?: number): string => {
  if (!seconds) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const isYouTubeUrl = (url?: string): boolean => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

export const getYouTubeEmbedUrl = (url: string): string => {
  if (url.includes('youtube.com/watch?v=')) {
    return url.replace('watch?v=', 'embed/');
  }
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

export const generateSampleQuiz = (module: Module): Quiz => ({
  moduleId: module._id,
  title: `${module.title} - Knowledge Check`,
  questions: [
    {
      id: 1,
      text: "What is the main topic covered in this module?",
      options: [
        "Introduction to basics",
        "Advanced concepts",
        "Practical applications",
        "Theory and fundamentals"
      ],
      correct: 0
    },
    {
      id: 2,
      text: "Which of the following is correct about the module content?",
      options: [
        "It covers only theory",
        "It includes practical examples",
        "It has no exercises",
        "It's only for beginners"
      ],
      correct: 1
    },
    {
      id: 3,
      text: "What skill will you gain after completing this module?",
      options: [
        "Basic understanding",
        "Expert-level knowledge",
        "Practical implementation skills",
        "Theoretical knowledge only"
      ],
      correct: 2
    }
  ]
});