import { useState } from 'react';
import { Play, Plus, ThumbsUp, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '../types';
import { useMyList } from '../hooks/useMyList';

interface MovieCardProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
  onMoreInfo?: (movie: Movie) => void;
}

export function MovieCard({ movie, onPlay, onMoreInfo }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInList, toggleMyList } = useMyList();
  const inList = isInList(movie.id);

  return (
    <div
      className="relative w-[200px] md:w-[240px] h-[120px] md:h-[140px] flex-shrink-0 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Base Image */}
      <div className="w-full h-full rounded-md overflow-hidden bg-gray-800">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {movie.mediaType === 'tv' && (
          <span className="absolute top-2 right-2 bg-blue-600/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
            TV
          </span>
        )}
      </div>

      {/* Hover Expansion */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0, scale: 1, transition: { duration: 0.2 } }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="absolute top-0 left-0 w-full bg-[#181818] rounded-md shadow-xl z-50 overflow-hidden"
            style={{
              top: '-20%',
              height: 'auto',
              minHeight: '140%',
              width: '100%',
              transformOrigin: 'center center'
            }}
          >
            <div
              className="relative h-28 w-full"
              onClick={() => onMoreInfo?.(movie)}
            >
              <img
                src={movie.backdropUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              {movie.mediaType === 'tv' && (
                <span className="absolute top-2 right-2 bg-blue-600/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  TV
                </span>
              )}
            </div>

            <div className="p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-0.5">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => { e.stopPropagation(); onPlay?.(movie); }}
                    className="w-7 h-7 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition"
                  >
                    <Play className="w-3.5 h-3.5 text-black fill-black" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleMyList(movie); }}
                    className="w-7 h-7 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-white text-gray-300 hover:text-white transition"
                  >
                    {inList ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </button>
                  <button className="w-7 h-7 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-white text-gray-300 hover:text-white transition">
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onMoreInfo?.(movie); }}
                  className="w-7 h-7 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-white text-gray-300 hover:text-white transition"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400">
                <span className="text-[#46d369]">{movie.match}% Match</span>
                <span className="border border-gray-500 px-1 text-[10px] text-white">
                  {movie.rating}
                </span>
                <span>{movie.duration}</span>
              </div>

              <div className="flex flex-wrap gap-x-2 text-[10px] text-white">
                {movie.genres.map((genre, idx) => (
                  <span key={idx} className="flex items-center">
                    {idx > 0 && <span className="w-1 h-1 bg-gray-500 rounded-full mr-1.5 inline-block" />}
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
