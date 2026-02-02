import { useState } from 'react';
import { Menu } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { SearchBar } from './SearchBar';
import { NotificationDropdown } from './NotificationDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { MobileMenu } from './MobileMenu';
import { Movie, PageType } from '../types';

interface NavbarProps {
  onMovieSelect?: (movie: Movie) => void;
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

export function Navbar({ onMovieSelect = () => {}, currentPage, onNavigate }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <>
      <motion.nav
        className={`fixed top-0 w-full z-50 transition-colors duration-300 ${
          isScrolled ? 'bg-[#0a0a0a]/95 backdrop-blur-sm' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-4 md:px-12 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-white p-1"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <button
              onClick={() => onNavigate('home')}
              className="text-[#e50914] text-2xl md:text-3xl font-bold tracking-tighter uppercase"
            >
              SWABFLIX
            </button>

            {/* Desktop Links */}
            <ul className="hidden md:flex items-center gap-5 text-[13px] text-gray-300">
              {NAV_ITEMS.map((item) => (
                <li key={item.page}>
                  <button
                    onClick={() => onNavigate(item.page)}
                    className={`transition hover:text-white ${
                      currentPage === item.page
                        ? 'text-white font-semibold'
                        : ''
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4 md:gap-5 text-white">
            <div className="hidden md:block">
              <SearchBar onMovieSelect={onMovieSelect} />
            </div>
            <div className="hidden md:block">
              <NotificationDropdown onMovieSelect={onMovieSelect} />
            </div>
            <ProfileDropdown />
          </div>
        </div>
      </motion.nav>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentPage={currentPage}
        onNavigate={onNavigate}
      />
    </>
  );
}
