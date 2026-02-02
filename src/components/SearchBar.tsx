import { useEffect, useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '../hooks/useSearch';
import { Movie } from '../types';

interface SearchBarProps {
  onMovieSelect: (movie: Movie) => void;
}

export function SearchBar({ onMovieSelect }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { query, setQuery, results, isSearching, clearSearch } = useSearch();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!query) setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [query]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      clearSearch();
    }
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      <motion.div
        initial={false}
        animate={{ width: isOpen ? 280 : 32 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`flex items-center overflow-hidden h-9 rounded ${
          isOpen ? 'bg-black/80 border border-white/80' : 'bg-transparent border border-transparent'
        }`}
      >
        <Search
          onClick={handleToggle}
          className="w-5 h-5 text-white cursor-pointer min-w-[20px] ml-2"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Titles, people, genres"
          className={`bg-transparent text-white text-sm outline-none px-3 w-full ${!isOpen && 'hidden'}`}
        />
        {query && (
          <X
            onClick={clearSearch}
            className="w-4 h-4 text-gray-400 cursor-pointer mr-2 hover:text-white"
          />
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && query.length > 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-12 right-0 w-80 bg-[#141414] border border-gray-700 shadow-2xl max-h-[420px] overflow-y-auto z-50 rounded-lg"
          >
            {isSearching ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#e50914] mx-auto" />
              </div>
            ) : results.length > 0 ? (
              <div className="py-1">
                {results.slice(0, 12).map((item) => (
                  <button
                    key={`${item.mediaType}-${item.id}`}
                    onClick={() => {
                      onMovieSelect(item);
                      setIsOpen(false);
                      clearSearch();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer transition text-left"
                  >
                    <img
                      src={item.posterUrl}
                      alt={item.title}
                      className="w-10 h-14 object-cover rounded flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-white text-sm font-medium truncate">{item.title}</h4>
                        {item.mediaType === 'tv' && (
                          <span className="bg-blue-600/30 text-blue-400 text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0">
                            TV
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span>{item.year}</span>
                        <span className="text-[#46d369]">{item.match}%</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm">
                No results found for "{query}"
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
