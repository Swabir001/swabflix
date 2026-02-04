import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Movie } from '../types';

interface MyListContextType {
  myList: Movie[];
  addToList: (movie: Movie) => void;
  removeFromList: (movieId: number) => void;
  isInList: (movieId: number) => boolean;
  toggleMyList: (movie: Movie) => void;
}

const MyListContext = createContext<MyListContextType | null>(null);

const STORAGE_KEY = 'swabflix_mylist';

export function MyListProvider({ children }: { children: ReactNode }) {
  const [myList, setMyList] = useState<Movie[]>(() => {
    // Initialize from localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever list changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(myList));
    } catch (e) {
      console.error('Error saving my list:', e);
    }
  }, [myList]);

  const isInList = useCallback((movieId: number) => {
    return myList.some((m) => m.id === movieId);
  }, [myList]);

  const addToList = useCallback((movie: Movie) => {
    setMyList((prev) => {
      if (prev.some((m) => m.id === movie.id)) {
        return prev; // Already in list
      }
      return [movie, ...prev];
    });
  }, []);

  const removeFromList = useCallback((movieId: number) => {
    setMyList((prev) => prev.filter((m) => m.id !== movieId));
  }, []);

  const toggleMyList = useCallback((movie: Movie) => {
    setMyList((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      if (exists) {
        return prev.filter((m) => m.id !== movie.id);
      }
      return [movie, ...prev];
    });
  }, []);

  return (
    <MyListContext.Provider
      value={{
        myList,
        addToList,
        removeFromList,
        isInList,
        toggleMyList,
      }}
    >
      {children}
    </MyListContext.Provider>
  );
}

export function useMyList() {
  const context = useContext(MyListContext);
  if (!context) {
    throw new Error('useMyList must be used within MyListProvider');
  }
  return context;
}
