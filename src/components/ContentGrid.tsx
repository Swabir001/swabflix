import { Movie } from '../types';
import { Play, Plus, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMyList } from '../hooks/useMyList';

interface ContentGridProps {
  items: Movie[];
  onPlay: (movie: Movie) => void;
  onMoreInfo: (movie: Movie) => void;
}

export function ContentGrid({ items, onPlay, onMoreInfo }: ContentGridProps) {
  const { isInList, toggleMyList } = useMyList();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-24 sm:py-32 text-gray-400"
      >
        <p className="text-lg sm:text-xl font-semibold mb-2">Your list is empty</p>
        <p className="text-xs sm:text-sm">Add movies and TV shows to your list to see them here</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
      {items.map((item, idx) => {
        const inList = isInList(item.id);
        return (
          <motion.div
            key={`${item.mediaType}-${item.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            whileHover={{ scale: 1.05 }}
            className="group cursor-pointer"
            onClick={() => onMoreInfo(item)}
          >
            <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-gray-800">
              <img
                src={item.posterUrl}
                alt={item.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Hover overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onPlay(item);
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition"
                  >
                    <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black fill-black" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMyList(item);
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-gray-400 flex items-center justify-center hover:border-white text-gray-300 hover:text-white transition"
                  >
                    {inList ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                </div>
                <p className="text-white text-[10px] sm:text-xs font-semibold truncate">{item.title}</p>
                <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-gray-400 mt-0.5 sm:mt-1">
                  <span className="text-[#46d369]">{item.match}%</span>
                  <span>{item.year}</span>
                  {item.mediaType === 'tv' && (
                    <span className="bg-gray-700 px-1.5 py-0.5 rounded text-[8px] sm:text-[9px]">TV</span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
