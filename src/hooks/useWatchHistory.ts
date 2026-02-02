import { useState, useEffect, useCallback } from 'react';
import { Movie, WatchHistoryItem } from '../types';

const STORAGE_KEY = 'swabflix_watch_history';
const MAX_HISTORY = 30;

export const useWatchHistory = () => {
  const [history, setHistory] = useState<WatchHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      // Storage full or unavailable
    }
  }, [history]);

  const addToHistory = useCallback((item: Movie) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => !(h.item.id === item.id && h.item.mediaType === item.mediaType));
      const newEntry: WatchHistoryItem = {
        item,
        watchedAt: Date.now(),
        progress: 0
      };
      return [newEntry, ...filtered].slice(0, MAX_HISTORY);
    });
  }, []);

  const removeFromHistory = useCallback((id: number) => {
    setHistory((prev) => prev.filter((h) => h.item.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const continueWatching = history.filter((h) => h.progress < 90).slice(0, 10);
  const recentlyWatched = history.map((h) => h.item).slice(0, 20);

  return {
    history,
    continueWatching,
    recentlyWatched,
    addToHistory,
    removeFromHistory,
    clearHistory
  };
};
