// src/hooks/useVideoStatus.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { videoAPI } from '@/services/api';

interface VideoStatusData {
  status: 'pending' | 'processing' | 'ready' | 'error' | 'failed';
  isReady: boolean;
  duration: number;
  transcodingProgress?: number;
  [key: string]: any;
}

interface UseVideoStatusReturn {
  status: string | null;
  isReady: boolean;
  duration: number;
  progress: number;
  loading: boolean;
  error: string | null;
  videoData: any | null;
}

/**
 * প্রোডাকশন গ্রেড ভিডিও স্ট্যাটাস হুক
 * ভিডিও 'ready' বা 'error' হলে অটোমেটিক পোলিং বন্ধ করে দেয়।
 */
export const useVideoStatus = (
  videoId: string | null,
  onReady?: (videoId: string, duration: number) => void
): UseVideoStatusReturn => {
  const [status, setStatus] = useState<string | null>(null);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<any | null>(null);

  // useRef ব্যবহার করা হয়েছে যাতে onReady কলব্যাক চেঞ্জ হলেও পোলিং রিসেট না হয়
  const onReadyRef = useRef(onReady);
  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);

  const checkStatus = useCallback(async () => {
    if (!videoId) return false; // পোলিং চালু রাখার জন্য false রিটার্ন করবে

    try {
      const response = await videoAPI.getStatus(videoId);

      if (response.success && response.data) {
        const data = response.data as VideoStatusData;
        
        setStatus(data.status);
        setIsReady(data.isReady);
        setDuration(data.duration);
        setProgress(data.transcodingProgress || 0);
        setVideoData(data);

        // যদি ভিডিও রেডি হয়, তবে true রিটার্ন করো যাতে পোলিং বন্ধ হয়
        if (data.isReady || data.status === 'ready') {
          console.log(`✅ Video ${videoId} is ready!`);
          onReadyRef.current?.(videoId, data.duration);
          return true; 
        }

        // যদি কোনো এরর থাকে তবেও পোলিং বন্ধ করো
        if (data.status === 'error' || data.status === 'failed') {
          setError('Video processing failed');
          return true;
        }
      }
      return false; // এখনো রেডি হয়নি, পোলিং চলবে
    } catch (err) {
      console.error('Failed to fetch video status:', err);
      // নেটওয়ার্ক এরর হলে পোলিং বন্ধ না করে চলতে দেওয়া ভালো (retry mechanism)
      return false; 
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    if (!videoId) return;

    let isStopped = false;
    let timerId: NodeJS.Timeout;

    const poll = async () => {
      if (isStopped) return;
      
      const shouldStop = await checkStatus();
      
      if (!shouldStop && !isStopped) {
        timerId = setTimeout(poll, 3000); // ৩ সেকেন্ড পর আবার চেক
      }
    };

    poll();

    return () => {
      isStopped = true;
      clearTimeout(timerId);
    };
  }, [videoId, checkStatus]);

  return { status, isReady, duration, progress, loading, error, videoData };
};