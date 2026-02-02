import { useEffect } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { StreamingSource } from '../types';

interface VideoPlayerProps {
  source: StreamingSource;
  title: string;
  onClose: () => void;
}

export function VideoPlayer({ source, title, onClose }: VideoPlayerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-white text-base md:text-lg font-semibold drop-shadow-lg">
            {title}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-black/50 hover:bg-white/20 text-white transition"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Player */}
      <div className="flex-1 w-full h-full flex items-center justify-center bg-black">
        {source.type === 'embed' || source.type === 'youtube' ? (
          <iframe
            src={source.url}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            referrerPolicy="origin"
          />
        ) : (
          <video
            src={source.url}
            controls
            autoPlay
            className="w-full h-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </motion.div>
  );
}
