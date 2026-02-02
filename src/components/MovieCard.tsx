import { useState, useRef, useEffect } from 'react';
import { Play, Plus, ThumbsUp, ChevronDown, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '../types';
import { useMyList } from '../hooks/useMyList';
import { tmdbService } from '../services/tmdb';

interface MovieCardProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
  onMoreInfo?: (movie: Movie) => void;
  onRemove?: (movie: Movie) => void;
  showRemove?: boolean;
}

export function MovieCard({ movie, onPlay, onMoreInfo, onRemove, showRemove }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState<string | null>(null);
  const [trailerLoaded, setTrailerLoaded] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const trailerTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { isInList, toggleMyList } = useMyList();
  const inList = isInList(movie.id);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => setIsHovered(true), 200);
    // Start fetching trailer after a delay
    trailerTimeout.current = setTimeout(async () => {
      try {
        const details = movie.mediaType === 'tv'
          ? await tmdbService.getTVDetails(movie.id)
          : await tmdbService.getMovieDetails(movie.id);
        if (details.trailerUrl) {
          setTrailerUrl(details.trailerUrl);
        }
      } catch {
        // Silently fail
      }
    }, 600);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    if (trailerTimeout.current) clearTimeout(trailerTimeout.current);
    setIsHovered(false);
    setTrailerLoaded(false);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
      if (trailerTimeout.current) clearTimeout(trailerTimeout.current);
    };
  }, []);

  return (
    <div
      className="relative w-[160px] sm:w-[200px] md:w-[240px] flex-shrink-0 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Base Image */}
      <div className="w-full aspect-video rounded-md overflow-hidden bg-gray-800 relative">
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

        {/* Remove button for Continue Watching */}
        {showRemove && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove?.(movie); }}
            className="absolute top-1.5 right-1.5 z-20 p-1 rounded-full bg-black/70 text-white hover:bg-red-600 transition opacity-0 group-hover:opacity-100"
            style={{ opacity: isHovered ? 1 : undefined }}
            title="Remove from Continue Watching"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Mobile: show title below card */}
      <p className="sm:hidden text-[11px] text-gray-400 mt-1 truncate px-0.5">{movie.title}</p>

      {/* Hover Expansion (desktop only) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="hidden sm:block absolute top-[-15%] left-[-10%] w-[120%] bg-[#181818] rounded-lg shadow-2xl z-50 overflow-hidden"
          >
            {/* Image / Trailer */}
            <div
              className="relative w-full aspect-video"
              onClick={() => onMoreInfo?.(movie)}
            >
              {trailerUrl && isHovered ? (
                <>
                  <iframe
                    src={`${trailerUrl}&autoplay=1&mute=1&controls=0&showinfo=0&loop=1&modestbranding=1`}
                    title={movie.title}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${trailerLoaded ? 'opacity-100' : 'opacity-0'}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                    style={{ border: 'none' }}
                    onLoad={() => setTrailerLoaded(true)}
                  />
                  <img
                    src={movie.backdropUrl}
                    alt={movie.title}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${trailerLoaded ? 'opacity-0' : 'opacity-100'}`}
                  />
                </>
              ) : (
                <img
                  src={movie.backdropUrl}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              )}
              {movie.mediaType === 'tv' && (
                <span className="absolute top-2 right-2 bg-blue-600/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  TV
                </span>
              )}
            </div>

            <div className="p-3 flex flex-col gap-2">
              {/* Title */}
              <p className="text-white text-xs font-semibold truncate">{movie.title}</p>

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
                  {showRemove && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onRemove?.(movie); }}
                      className="w-7 h-7 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-red-500 text-gray-300 hover:text-red-500 transition"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
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
