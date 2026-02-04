import { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveMovie } from '../contexts/ActiveMovieContext';
import { Movie } from '../types';

interface FloatingTrailerPlayerProps {
  onMoreInfo?: (movie: Movie) => void;
}

export function FloatingTrailerPlayer({ onMoreInfo }: FloatingTrailerPlayerProps) {
  const { activeMovie, activeTrailerUrl, isHeroPlaying, setActiveMovie } = useActiveMovie();
  const [isMuted, setIsMuted] = useState(true);
  const [trailerLoaded, setTrailerLoaded] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);

  // Check if hero section is visible
  useEffect(() => {
    const checkHeroVisibility = () => {
      const heroElement = document.querySelector('[data-hero-section]');
      if (heroElement) {
        const rect = heroElement.getBoundingClientRect();
        // Hero is visible if at least 30% is in viewport
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const isVisible = visibleHeight > rect.height * 0.3;
        setIsHeroVisible(isVisible);
      }
    };

    checkHeroVisibility();
    window.addEventListener('scroll', checkHeroVisibility, { passive: true });
    window.addEventListener('resize', checkHeroVisibility, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkHeroVisibility);
      window.removeEventListener('resize', checkHeroVisibility);
    };
  }, []);

  // Reset loaded state when trailer changes
  useEffect(() => {
    setTrailerLoaded(false);
  }, [activeTrailerUrl]);

  // Only show floating player when:
  // - There's an active movie with trailer
  // - Hero is NOT visible (scrolled down)
  const shouldShow = activeMovie && activeTrailerUrl && isHeroPlaying && !isHeroVisible;

  const handleClose = () => {
    setActiveMovie(null, null);
  };

  // Build YouTube URL with HD quality
  const getTrailerUrl = () => {
    if (!activeTrailerUrl) return '';
    return `${activeTrailerUrl}&autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&loop=1&modestbranding=1&vq=hd1080&hd=1`;
  };

  return (
    <AnimatePresence>
      {shouldShow && activeMovie && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-4 right-4 z-[100] w-[320px] sm:w-[400px] bg-[#181818] rounded-lg shadow-2xl overflow-hidden border border-gray-700"
        >
          {/* Video area */}
          <div className="relative aspect-video bg-black">
            {/* Backdrop while loading */}
            <img
              src={activeMovie.backdropUrl}
              alt={activeMovie.title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${trailerLoaded ? 'opacity-0' : 'opacity-100'}`}
            />

            {/* Trailer iframe */}
            <iframe
              src={getTrailerUrl()}
              title={activeMovie.title}
              className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${trailerLoaded ? 'opacity-100' : 'opacity-0'}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
              style={{ border: 'none' }}
              onLoad={() => setTrailerLoaded(true)}
            />

            {/* Controls overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

            {/* Top controls */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Info area */}
          <div className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm font-semibold truncate">{activeMovie.title}</h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                  <span className="text-[#46d369] font-semibold">{activeMovie.match}% Match</span>
                  <span>{activeMovie.year}</span>
                  <span className="border border-gray-600 px-1 text-[10px]">{activeMovie.rating}</span>
                </div>
              </div>
              {onMoreInfo && (
                <button
                  onClick={() => onMoreInfo(activeMovie)}
                  className="p-2 rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-white transition"
                  title="More Info"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
