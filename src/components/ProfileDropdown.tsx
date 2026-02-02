import { useState, useRef, useEffect } from 'react';
import { ChevronDown, User, Settings, HelpCircle, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded bg-gradient-to-br from-[#e50914] to-[#b20710] overflow-hidden flex items-center justify-center">
          <User className="w-5 h-5 text-white" />
        </div>
        <ChevronDown
          className={`w-4 h-4 text-white transition duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-12 w-56 bg-[#141414] border border-gray-700 rounded-lg shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded bg-gradient-to-br from-[#e50914] to-[#b20710] flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Viewer</p>
                <p className="text-gray-500 text-xs">Switch Profiles</p>
              </div>
            </div>

            <div className="py-2">
              {[
                { icon: Settings, label: 'Account' },
                { icon: HelpCircle, label: 'Help Center' },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition text-sm"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-800 py-2">
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition text-sm">
                <LogOut className="w-4 h-4" />
                Sign out of Swabflix
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
