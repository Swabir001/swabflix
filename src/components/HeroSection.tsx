import { useState } from 'react';
import { Info, Play, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie } from '../types';

interface HeroSectionProps {
  movie: Movie;
  onPlay?: (movie: Movie) => void;
  onMoreInfo?: (movie: Movie) => void;
}

export function HeroSection({ movie, onPlay, onMoreInfo }: HeroSectionProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [showTrailer, setShowTrailer] = useState(true);

  const trailerUrl = movie.trailerUrl;

  return (
    <div className="relative h-[70vw] sm:h-[56.25vw] min-h-[400px] sm:min-h-[500px] max-h-[85vh] w-full flex flex-col justify-end">
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
        {trailerUrl && showTrailer ? (
          <iframe
            src={`${trailerUrl}&autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&showinfo=0&loop=1`}
            title={movie.title}
            className="w-full h-full scale-[1.2] pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            style={{ border: 'none' }}
          />
        ) : (
          <img
            src={movie.backdropUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        )}

        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/90 via-[#0a0a0a]/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative px-4 md:px-12 w-full max-w-3xl space-y-3 sm:space-y-4 md:space-y-6 pb-[20%] sm:pb-[15%] md:pb-[10%]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold text-white drop-shadow-lg"
        >
          {movie.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap"
        >
          <span className="text-[#46d369] font-bold text-xs sm:text-sm md:text-base">{movie.match}% Match</span>
          <span className="text-gray-300 text-xs sm:text-sm">{movie.year}</span>
          <span className="border border-gray-500 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs text-gray-300 rounded-sm">
            {movie.rating}
          </span>
          <span className="text-gray-300 text-xs sm:text-sm">{movie.duration}</span>
          {movie.mediaType === 'tv' && (
            <span className="bg-[#e50914]/20 text-[#e50914] px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded">
              TV Series
            </span>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg drop-shadow-md max-w-xl line-clamp-2 sm:line-clamp-3"
        >
          {movie.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex items-center gap-2 sm:gap-3 pt-1 sm:pt-2"
        >
          <button
            onClick={() => onPlay?.(movie)}
            className="flex items-center gap-1.5 sm:gap-2 bg-white text-black px-4 py-1.5 sm:px-5 sm:py-2 md:px-8 md:py-3 rounded font-bold hover:bg-white/80 transition duration-200 text-xs sm:text-sm md:text-base"
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
            Play
          </button>
          <button
            onClick={() => onMoreInfo?.(movie)}
            className="flex items-center gap-1.5 sm:gap-2 bg-gray-500/50 text-white px-4 py-1.5 sm:px-5 sm:py-2 md:px-8 md:py-3 rounded font-bold hover:bg-gray-500/40 transition duration-200 backdrop-blur-sm text-xs sm:text-sm md:text-base"
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
            More Info
          </button>

          {/* Mute / Image toggle */}
          {trailerUrl && (
            <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 sm:p-2 rounded-full border border-gray-500 text-white hover:bg-white/10 transition"
              >
                {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button
                onClick={() => setShowTrailer(!showTrailer)}
                className="hidden sm:block px-3 py-1.5 rounded border border-gray-500 text-gray-300 text-xs hover:bg-white/10 transition"
              >
                {showTrailer ? 'Show Image' : 'Play Trailer'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
