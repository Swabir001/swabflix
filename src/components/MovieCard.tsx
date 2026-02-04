import { useState, useRef, useEffect } from 'react';
import { Play, Plus, ThumbsUp, ChevronDown, Check, X, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Movie } from '../types';
import { useMyList } from '../contexts/MyListContext';
import { useActiveMovie } from '../contexts/ActiveMovieContext';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const trailerTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isInList, toggleMyList } = useMyList();
  const { isHeroPlaying, scheduleActiveMovie, clearScheduledMovie } = useActiveMovie();
  const inList = isInList(movie.id);

  const fetchTrailer = async (): Promise<string | null> => {
    try {
      const details = movie.mediaType === 'tv'
        ? await tmdbService.getTVDetails(movie.id)
        : await tmdbService.getMovieDetails(movie.id);
      return details.trailerUrl || null;
    } catch {
      return null;
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);

    // Schedule this movie to become the active hero movie
    scheduleActiveMovie(movie, fetchTrailer);

    // Fetch trailer for card preview
    trailerTimeout.current = setTimeout(async () => {
      const url = await fetchTrailer();
      if (url) {
        setTrailerUrl(url);
      }
    }, 600);
  };

  const handleMouseLeave = () => {
    if (trailerTimeout.current) clearTimeout(trailerTimeout.current);
    clearScheduledMovie();
    setIsHovered(false);
    setTrailerLoaded(false);
    setMenuOpen(false);
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    return () => {
      if (trailerTimeout.current) clearTimeout(trailerTimeout.current);
    };
  }, []);

  // Don't show card trailer if hero is playing
  const shouldShowCardTrailer = trailerUrl && isHovered && !isHeroPlaying;

  // Build YouTube URL with maximum quality
  const getTrailerUrl = () => {
    if (!trailerUrl) return '';
    return `${trailerUrl}&autoplay=1&mute=1&controls=0&showinfo=0&loop=1&modestbranding=1&vq=hd1080&hd=1&highres=1`;
  };

  return (
    <div
      ref={cardRef}
      className="relative w-[160px] sm:w-[200px] md:w-[240px] flex-shrink-0 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ zIndex: isHovered ? 50 : 1 }}
    >
      {/* Card that scales up on hover */}
      <motion.div
        animate={{
          scale: isHovered ? 1.4 : 1,
        }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative"
        style={{ transformOrigin: 'center center' }}
      >
        {/* Card Content */}
        <div className={`w-full rounded-md overflow-hidden bg-[#181818] ${isHovered ? 'shadow-2xl' : ''}`}>
          {/* Image / Trailer */}
          <div className="relative w-full aspect-video">
            {/* Always show backdrop as base */}
            <img
              src={movie.backdropUrl}
              alt={movie.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                shouldShowCardTrailer && trailerLoaded ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
            />

            {/* Trailer overlay */}
            {shouldShowCardTrailer && (
              <iframe
                src={getTrailerUrl()}
                title={movie.title}
                className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
                  trailerLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                style={{ border: 'none' }}
                onLoad={() => setTrailerLoaded(true)}
              />
            )}

            {/* TV Badge */}
            {movie.mediaType === 'tv' && (
              <span className="absolute top-2 left-2 bg-blue-600/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded z-10">
                TV
              </span>
            )}

            {/* 3-dots menu button */}
            <div
              ref={menuRef}
              className={`absolute top-1.5 right-1.5 z-30 transition-opacity duration-150 ${
                isHovered || menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1.5 rounded-full bg-black/80 text-white hover:bg-black transition"
                title="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Dropdown menu */}
              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-9 right-0 w-52 bg-[#141414] border border-gray-700 rounded-md shadow-xl overflow-hidden z-[60]"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMyList(movie);
                        setMenuOpen(false);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#2a2a2a] flex items-center gap-3 transition"
                    >
                      {inList ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          Remove from My List
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add to My List
                        </>
                      )}
                    </button>
                    {showRemove && onRemove && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(movie);
                          setMenuOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-[#2a2a2a] flex items-center gap-3 transition"
                      >
                        <X className="w-4 h-4 text-red-500" />
                        Remove from Continue Watching
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Info section - only shows when hovered */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden sm:block"
              >
                <div className="p-3 flex flex-col gap-2">
                  {/* Action buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); onPlay?.(movie); }}
                        className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition"
                        title="Play"
                      >
                        <Play className="w-4 h-4 text-black fill-black" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleMyList(movie); }}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition ${
                          inList
                            ? 'border-green-500 text-green-500 hover:border-green-400'
                            : 'border-gray-500 text-gray-300 hover:border-white hover:text-white'
                        }`}
                        title={inList ? 'Remove from My List' : 'Add to My List'}
                      >
                        {inList ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        className="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-white text-gray-300 hover:text-white transition"
                        title="Like"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onMoreInfo?.(movie); }}
                      className="w-8 h-8 rounded-full border-2 border-gray-500 flex items-center justify-center hover:border-white text-gray-300 hover:text-white transition"
                      title="More Info"
                    >
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-400">
                    <span className="text-[#46d369]">{movie.match}% Match</span>
                    <span className="border border-gray-500 px-1 text-[9px] text-white">
                      {movie.rating}
                    </span>
                    <span>{movie.duration}</span>
                  </div>

                  {/* Genres */}
                  <div className="flex flex-wrap gap-x-1.5 text-[10px] text-white">
                    {movie.genres.slice(0, 3).map((genre, idx) => (
                      <span key={idx} className="flex items-center">
                        {idx > 0 && <span className="w-1 h-1 bg-gray-500 rounded-full mr-1 inline-block" />}
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mobile: show title below card */}
      <p className="sm:hidden text-[11px] text-gray-400 mt-1 truncate px-0.5">{movie.title}</p>
    </div>
  );
}
