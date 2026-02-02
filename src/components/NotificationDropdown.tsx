import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '../types';
import { tmdbService } from '../services/tmdb';

interface NotificationDropdownProps {
  onMovieSelect: (movie: Movie) => void;
}

export function NotificationDropdown({ onMovieSelect }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [upcoming, setUpcoming] = useState<Movie[]>([]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const genres = await tmdbService.getGenres();
        const results = await tmdbService.getUpcoming();
        setUpcoming(
          results.slice(0, 5).map((m) => tmdbService.mapMovies(m, genres))
        );
      } catch {
        // Silently fail
      }
    };
    fetchUpcoming();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-1 hover:text-gray-300 transition"
      >
        <Bell className="w-5 h-5" />
        {upcoming.length > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e50914] rounded-full text-[10px] font-bold flex items-center justify-center">
            {upcoming.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-10 w-80 bg-[#141414] border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-white font-semibold text-sm">New Arrivals</h3>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {upcoming.map((movie) => (
                <button
                  key={movie.id}
                  onClick={() => {
                    onMovieSelect(movie);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 hover:bg-white/5 transition text-left"
                >
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-12 h-16 object-cover rounded flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {movie.title}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      Coming {movie.year}
                    </p>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                      {movie.description}
                    </p>
                  </div>
                </button>
              ))}
              {upcoming.length === 0 && (
                <p className="text-gray-500 text-sm p-4 text-center">
                  No new notifications
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
