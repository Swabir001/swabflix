import { createContext, useContext, useState, useRef, useCallback, ReactNode } from 'react';
import { Movie } from '../types';

interface ActiveMovieContextType {
  activeMovie: Movie | null;
  activeTrailerUrl: string | null;
  isHeroPlaying: boolean;
  setActiveMovie: (movie: Movie | null, trailerUrl: string | null) => void;
  setIsHeroPlaying: (playing: boolean) => void;
  scheduleActiveMovie: (movie: Movie, fetchTrailer: () => Promise<string | null>) => void;
  clearScheduledMovie: () => void;
  clearActiveMovie: () => void;
}

const ActiveMovieContext = createContext<ActiveMovieContextType | null>(null);

const HOVER_DELAY_MS = 250;

export function ActiveMovieProvider({ children }: { children: ReactNode }) {
  const [activeMovie, setActiveMovieState] = useState<Movie | null>(null);
  const [activeTrailerUrl, setActiveTrailerUrl] = useState<string | null>(null);
  const [isHeroPlaying, setIsHeroPlaying] = useState(false);
  const scheduledTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setActiveMovie = useCallback((movie: Movie | null, trailerUrl: string | null) => {
    setActiveMovieState(movie);
    setActiveTrailerUrl(trailerUrl);
    setIsHeroPlaying(!!trailerUrl);
  }, []);

  const scheduleActiveMovie = useCallback((movie: Movie, fetchTrailer: () => Promise<string | null>) => {
    // Clear any existing scheduled change
    if (scheduledTimeout.current) {
      clearTimeout(scheduledTimeout.current);
    }

    // Schedule the active movie change with delay
    scheduledTimeout.current = setTimeout(async () => {
      const trailerUrl = await fetchTrailer();
      setActiveMovieState(movie);
      setActiveTrailerUrl(trailerUrl);
      setIsHeroPlaying(!!trailerUrl);
    }, HOVER_DELAY_MS);
  }, []);

  const clearScheduledMovie = useCallback(() => {
    if (scheduledTimeout.current) {
      clearTimeout(scheduledTimeout.current);
      scheduledTimeout.current = null;
    }
  }, []);

  const clearActiveMovie = useCallback(() => {
    if (scheduledTimeout.current) {
      clearTimeout(scheduledTimeout.current);
      scheduledTimeout.current = null;
    }
    setActiveMovieState(null);
    setActiveTrailerUrl(null);
    setIsHeroPlaying(false);
  }, []);

  return (
    <ActiveMovieContext.Provider
      value={{
        activeMovie,
        activeTrailerUrl,
        isHeroPlaying,
        setActiveMovie,
        setIsHeroPlaying,
        scheduleActiveMovie,
        clearScheduledMovie,
        clearActiveMovie,
      }}
    >
      {children}
    </ActiveMovieContext.Provider>
  );
}

export function useActiveMovie() {
  const context = useContext(ActiveMovieContext);
  if (!context) {
    throw new Error('useActiveMovie must be used within ActiveMovieProvider');
  }
  return context;
}
