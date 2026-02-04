import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';
import { TopTenCard } from './TopTenCard';

interface MovieCarouselProps {
  title: string;
  movies: Movie[];
  onPlay?: (movie: Movie) => void;
  onMoreInfo?: (movie: Movie) => void;
  onRemove?: (movie: Movie) => void;
  showRemove?: boolean;
  isTopTen?: boolean;
}

export function MovieCarousel({
  title,
  movies,
  onPlay,
  onMoreInfo,
  onRemove,
  showRemove = false,
  isTopTen = false
}: MovieCarouselProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth * 0.75
          : scrollLeft + clientWidth * 0.75;
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (movies.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-1 md:space-y-2 mb-2 group/carousel relative z-10"
    >
      <h2 className="cursor-pointer text-sm font-semibold text-[#e5e5e5] transition duration-200 hover:text-white md:text-xl px-4 md:px-12">
        {title}
      </h2>

      <div className="relative group/row md:-ml-2">
        <button
          className={`absolute top-0 bottom-0 left-0 z-40 w-10 md:w-14 flex items-center justify-center bg-black/30 hover:bg-black/60 opacity-0 group-hover/row:opacity-100 transition ${!isMoved && 'hidden'}`}
          onClick={() => handleClick('left')}
        >
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>

        <div
          ref={rowRef}
          className="flex items-center gap-1.5 sm:gap-2 md:gap-3 overflow-x-scroll overflow-y-visible scrollbar-hide px-4 md:px-12 py-8 md:py-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {isTopTen
            ? movies.slice(0, 10).map((movie, idx) => (
                <TopTenCard
                  key={movie.id}
                  movie={movie}
                  rank={idx + 1}
                  onPlay={onPlay}
                  onMoreInfo={onMoreInfo}
                />
              ))
            : movies.map((movie) => (
                <MovieCard
                  key={`${movie.mediaType}-${movie.id}`}
                  movie={movie}
                  onPlay={onPlay}
                  onMoreInfo={onMoreInfo}
                  onRemove={onRemove}
                  showRemove={showRemove}
                />
              ))}
        </div>

        <button
          className="absolute top-0 bottom-0 right-0 z-40 w-10 md:w-14 flex items-center justify-center bg-black/30 hover:bg-black/60 opacity-0 group-hover/row:opacity-100 transition"
          onClick={() => handleClick('right')}
        >
          <ChevronRight className="w-8 h-8 text-white" />
        </button>
      </div>
    </motion.div>
  );
}
