import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageType } from '../types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const NAV_ITEMS: { label: string; page: PageType }[] = [
  { label: 'Home', page: 'home' },
  { label: 'TV Shows', page: 'tvshows' },
  { label: 'Movies', page: 'movies' },
  { label: 'New & Popular', page: 'new' },
  { label: 'My List', page: 'mylist' }
];

export function MobileMenu({ isOpen, onClose, currentPage, onNavigate }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-[70] md:hidden"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 left-0 bottom-0 w-72 bg-[#141414] z-[80] md:hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <span className="text-[#e50914] text-2xl font-bold tracking-tighter uppercase">
                SWABFLIX
              </span>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <nav className="p-6 space-y-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    onClose();
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-base transition ${
                    currentPage === item.page
                      ? 'text-white bg-white/10 font-semibold'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
