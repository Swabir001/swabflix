import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MovieCarousel } from './components/MovieCarousel';
import { MovieModal } from './components/MovieModal';
import { VideoPlayer } from './components/VideoPlayer';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ContentGrid } from './components/ContentGrid';
import { useMovies } from './hooks/useMovies';
import { useMyList } from './hooks/useMyList';
import { useWatchHistory } from './hooks/useWatchHistory';
import { Movie, StreamingSource, PageType } from './types';
import { streamingService } from './services/streaming';

export function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const { categories, featuredMovie, loading } = useMovies(currentPage);
  const { myList } = useMyList();
  const { continueWatching, addToHistory } = useWatchHistory();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingVideo, setPlayingVideo] = useState<{
    source: StreamingSource;
    title: string;
  } | null>(null);

  const handlePlay = async (movie: Movie) => {
    setSelectedMovie(null);
    addToHistory(movie);
    const source = await streamingService.getStreamUrl(movie.id, movie.mediaType);
    if (source) {
      setPlayingVideo({ source, title: movie.title });
    } else {
      alert('No video source available for this title yet.');
    }
  };

  const handlePlayEpisode = async (movie: Movie, season: number, episode: number) => {
    setSelectedMovie(null);
    addToHistory(movie);
    const source = await streamingService.getStreamUrl(movie.id, 'tv', season, episode);
    if (source) {
      setPlayingVideo({ source, title: `${movie.title} - S${season}:E${episode}` });
    } else {
      alert('No video source available for this episode yet.');
    }
  };

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <>
        <Navbar
          onMovieSelect={setSelectedMovie}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
        <SkeletonLoader />
      </>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] overflow-x-hidden">
      <Navbar
        onMovieSelect={setSelectedMovie}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative pb-20"
        >
          {/* My List page */}
          {currentPage === 'mylist' ? (
            <div className="pt-24 md:pt-28 px-4 md:px-12">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-8">My List</h1>
              <ContentGrid
                items={myList}
                onPlay={handlePlay}
                onMoreInfo={setSelectedMovie}
              />
            </div>
          ) : (
            <>
              {/* Hero */}
              {featuredMovie && (
                <HeroSection
                  movie={featuredMovie}
                  onPlay={handlePlay}
                  onMoreInfo={setSelectedMovie}
                />
              )}

              {/* Content rows */}
              <div className="relative z-10 -mt-16 md:-mt-32 space-y-4 md:space-y-8 pb-10">
                {/* Continue Watching */}
                {continueWatching.length > 0 && (
                  <MovieCarousel
                    title="Continue Watching"
                    movies={continueWatching.map((h) => h.item)}
                    onPlay={handlePlay}
                    onMoreInfo={setSelectedMovie}
                  />
                )}

                {/* My List row (only on home) */}
                {currentPage === 'home' && myList.length > 0 && (
                  <MovieCarousel
                    title="My List"
                    movies={myList}
                    onPlay={handlePlay}
                    onMoreInfo={setSelectedMovie}
                  />
                )}

                {/* Top 10 (first category as Top 10) */}
                {categories.length > 0 && (
                  <MovieCarousel
                    title={`Top 10 ${currentPage === 'tvshows' ? 'TV Shows' : 'Movies'} Today`}
                    movies={categories[0].movies}
                    onPlay={handlePlay}
                    onMoreInfo={setSelectedMovie}
                    isTopTen
                  />
                )}

                {/* Category rows */}
                {categories.map((category) => (
                  <MovieCarousel
                    key={category.id}
                    title={category.title}
                    movies={category.movies}
                    onPlay={handlePlay}
                    onMoreInfo={setSelectedMovie}
                  />
                ))}
              </div>
            </>
          )}
        </motion.main>
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full bg-[#0a0a0a] border-t border-gray-800/50 py-12 px-4 md:px-12 text-gray-500 text-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <span className="text-[#e50914] text-xl font-bold tracking-tighter uppercase">SWABFLIX</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="space-y-3">
              <p className="hover:underline cursor-pointer hover:text-gray-300 transition">Audio Description</p>
              <p className="hover:underline cursor-pointer hover:text-gray-300 transition">Investor Relations</p>
              <p className="hover:underline cursor-pointer hover:text-gray-300 transition">Legal Notices</p>
            </div>
            <div className="space-y-3">
              <p className="hover:underline cursor-pointer hover:text-gray-300 transition">Help Center</p>
              <p className="hover:underline cursor-pointer hover:text-gray-300 transition">Jobs</p>
              <p className="hover:underline cursor-pointer hover:text-gray-300 transition">Cookie Preferences</p>
            </div>
            <div className="space-y-3">
              <p className="hover:underline cursor-pointer hover:text-gray-300 transition">Gift Cards</p>
              <p className="hover:underline cursor-pointer hover:text-gray-300 transition">Terms of Use</p>
              <p className="hover:underline cursor-pointer hover:text-gray-300 transition">Corporate Information</p>
            </div>
            <div className="space-y-3">
              <p className="hover:underline cursor-pointer hover:text-gray-300 transition">Media Center</p>
              <p className="hover:underline cursor-pointer hover:text-gray-300 transition">Privacy</p>
              <p className="hover:underline cursor-pointer hover:text-gray-300 transition">Contact Us</p>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-gray-800/50 pt-6">
            <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} Swabflix, Inc.</p>
            <button className="border border-gray-600 px-3 py-1 text-xs hover:text-white hover:border-gray-400 transition rounded">
              Service Code
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      <AnimatePresence>
        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
            onPlay={() => handlePlay(selectedMovie)}
            onPlayEpisode={handlePlayEpisode}
          />
        )}
        {playingVideo && (
          <VideoPlayer
            source={playingVideo.source}
            title={playingVideo.title}
            onClose={() => setPlayingVideo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
