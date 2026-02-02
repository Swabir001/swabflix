import { useEffect, useState } from 'react';
import { X, Play, Plus, Check, ThumbsUp, Tv, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Movie, SeasonDetail } from '../types';
import { tmdbService } from '../services/tmdb';
import { useMyList } from '../hooks/useMyList';

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
  onPlay: () => void;
  onPlayEpisode?: (movie: Movie, season: number, episode: number) => void;
}

export function MovieModal({ movie, onClose, onPlay, onPlayEpisode }: MovieModalProps) {
  const [details, setDetails] = useState<Movie | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [showTrailer, setShowTrailer] = useState(false);
  const { isInList, toggleMyList } = useMyList();
  const inList = isInList(movie.id);

  // TV episode state
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonData, setSeasonData] = useState<SeasonDetail | null>(null);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);

  const isTV = movie.mediaType === 'tv';
  const seasonCount = details?.seasonCount || movie.seasonCount || 1;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const fullDetails = isTV
          ? await tmdbService.getTVDetails(movie.id)
          : await tmdbService.getMovieDetails(movie.id);
        setDetails(fullDetails);

        const similar = isTV
          ? await tmdbService.getSimilarTV(movie.id)
          : await tmdbService.getSimilarMovies(movie.id);
        const genresMap = isTV
          ? await tmdbService.getTVGenres()
          : await tmdbService.getGenres();
        const mapper = isTV ? tmdbService.mapTVShows : tmdbService.mapMovies;
        setSimilarMovies(
          similar.slice(0, 9).map((m: any) => mapper(m, genresMap))
        );
      } catch (e) {
        console.error('Error fetching modal details:', e);
        setDetails(movie);
      }
    };
    fetchDetails();
  }, [movie.id, movie.mediaType, isTV]);

  // Fetch episodes when season changes (TV only)
  useEffect(() => {
    if (!isTV) return;
    const fetchSeason = async () => {
      setLoadingEpisodes(true);
      try {
        const data = await tmdbService.getSeasonDetails(movie.id, selectedSeason);
        setSeasonData(data);
      } catch (e) {
        console.error('Error fetching season:', e);
        setSeasonData(null);
      } finally {
        setLoadingEpisodes(false);
      }
    };
    fetchSeason();
  }, [movie.id, selectedSeason, isTV]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const displayMovie = details || movie;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-8 md:pt-12 px-4 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-4xl bg-[#181818] rounded-xl shadow-2xl overflow-hidden mb-12"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#181818]/80 text-white hover:bg-white/20 transition"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Hero Image / Trailer */}
        <div className="relative w-full aspect-video">
          {showTrailer && displayMovie.trailerUrl ? (
            <iframe
              src={`${displayMovie.trailerUrl}&autoplay=1&mute=0&controls=1&showinfo=0`}
              title={displayMovie.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ border: 'none' }}
            />
          ) : (
            <img
              src={displayMovie.backdropUrl}
              alt={displayMovie.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent pointer-events-none" />

          {/* Title & Controls overlay */}
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              {displayMovie.title}
            </h2>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={onPlay}
                className="flex items-center gap-2 bg-white text-black px-5 py-2 md:px-7 md:py-2.5 rounded font-bold hover:bg-white/90 transition text-sm"
              >
                <Play className="w-4 h-4 fill-black" />
                {isTV ? 'Play S1:E1' : 'Play'}
              </button>

              {displayMovie.trailerUrl && (
                <button
                  onClick={() => setShowTrailer(!showTrailer)}
                  className="flex items-center gap-2 bg-gray-600/50 text-white px-4 py-2 md:px-6 md:py-2.5 rounded font-semibold hover:bg-gray-600/70 transition backdrop-blur-sm text-sm"
                >
                  <Tv className="w-4 h-4" />
                  {showTrailer ? 'Hide Trailer' : 'Watch Trailer'}
                </button>
              )}

              <button
                onClick={() => toggleMyList(displayMovie)}
                className="p-2.5 rounded-full border-2 border-gray-500 text-gray-300 hover:border-white hover:text-white transition bg-black/30 backdrop-blur-sm"
              >
                {inList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              </button>

              <button className="p-2.5 rounded-full border-2 border-gray-500 text-gray-300 hover:border-white hover:text-white transition bg-black/30 backdrop-blur-sm">
                <ThumbsUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6 p-6 md:p-10 pt-2">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm flex-wrap">
              <span className="text-[#46d369] font-bold">{displayMovie.match}% Match</span>
              <span className="text-gray-400">{displayMovie.year}</span>
              <span className="border border-gray-500 px-2 py-0.5 text-xs text-gray-300 rounded-sm">
                {displayMovie.rating}
              </span>
              <span className="text-gray-400">{displayMovie.duration}</span>
              {isTV && (
                <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 text-xs font-semibold rounded">
                  TV Series
                </span>
              )}
            </div>
            <p className="text-white/90 text-sm md:text-base leading-relaxed">
              {displayMovie.description}
            </p>
          </div>

          <div className="space-y-4 text-sm">
            {displayMovie.cast && displayMovie.cast.length > 0 && (
              <div>
                <span className="text-gray-500">Cast: </span>
                <span className="text-gray-300">
                  {displayMovie.cast.map((c) => c.name).join(', ')}
                </span>
              </div>
            )}
            <div>
              <span className="text-gray-500">Genres: </span>
              <span className="text-gray-300">{displayMovie.genres.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Episodes Section (TV only) */}
        {isTV && (
          <div className="p-6 md:p-10 pt-0 border-t border-gray-800 mt-2">
            <div className="flex items-center justify-between mt-6 mb-5">
              <h3 className="text-lg font-bold text-white">Episodes</h3>

              {/* Season selector */}
              {seasonCount > 1 && (
                <div className="relative">
                  <button
                    onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                    className="flex items-center gap-2 bg-[#242424] border border-gray-600 text-white px-4 py-2 rounded text-sm font-medium hover:border-gray-400 transition"
                  >
                    Season {selectedSeason}
                    <ChevronDown className={`w-4 h-4 transition ${seasonDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {seasonDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setSeasonDropdownOpen(false)}
                      />
                      <div className="absolute right-0 top-11 bg-[#242424] border border-gray-600 rounded shadow-xl z-20 max-h-60 overflow-y-auto min-w-[140px]">
                        {Array.from({ length: seasonCount }, (_, i) => i + 1).map((num) => (
                          <button
                            key={num}
                            onClick={() => {
                              setSelectedSeason(num);
                              setSeasonDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition ${
                              selectedSeason === num
                                ? 'text-white bg-white/5 font-semibold'
                                : 'text-gray-400'
                            }`}
                          >
                            Season {num}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Episode list */}
            {loadingEpisodes ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex gap-4 p-3 bg-[#242424] rounded-lg">
                    <div className="w-32 h-20 bg-gray-700 rounded flex-shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-700 rounded w-1/3" />
                      <div className="h-3 bg-gray-700 rounded w-2/3" />
                      <div className="h-3 bg-gray-700 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : seasonData && seasonData.episodes.length > 0 ? (
              <div className="space-y-2">
                {seasonData.episodes.map((ep) => (
                  <button
                    key={ep.id}
                    onClick={() => onPlayEpisode?.(displayMovie, ep.seasonNumber, ep.episodeNumber)}
                    className="w-full flex items-start gap-4 p-3 md:p-4 rounded-lg hover:bg-[#2a2a2a] transition group text-left"
                  >
                    {/* Episode number */}
                    <div className="flex-shrink-0 w-8 text-center">
                      <span className="text-gray-500 text-lg font-medium">{ep.episodeNumber}</span>
                    </div>

                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0 w-28 md:w-36 aspect-video rounded overflow-hidden bg-gray-800">
                      {ep.stillUrl ? (
                        <img
                          src={ep.stillUrl}
                          alt={ep.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <Play className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40">
                        <div className="bg-white/90 rounded-full p-1.5">
                          <Play className="w-5 h-5 fill-black text-black" />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 py-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-white text-sm font-medium truncate">
                          {ep.name}
                        </h4>
                        {ep.runtime && (
                          <span className="text-gray-500 text-xs flex-shrink-0">
                            {ep.runtime}m
                          </span>
                        )}
                      </div>
                      <p className="text-gray-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                        {ep.overview || 'No description available.'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm py-4">No episodes available for this season.</p>
            )}
          </div>
        )}

        {/* Similar content */}
        {similarMovies.length > 0 && (
          <div className="p-6 md:p-10 pt-0 border-t border-gray-800 mt-2">
            <h3 className="text-lg font-bold text-white mb-5 mt-6">More Like This</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {similarMovies.map((m) => (
                <div
                  key={`${m.mediaType}-${m.id}`}
                  className="bg-[#2a2a2a] rounded-md overflow-hidden cursor-pointer hover:bg-[#333] transition group"
                >
                  <div className="relative aspect-video">
                    <img
                      src={m.backdropUrl}
                      alt={m.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40">
                      <div className="bg-white/90 rounded-full p-2">
                        <Play className="w-6 h-6 fill-black text-black" />
                      </div>
                    </div>
                    {m.mediaType === 'tv' && (
                      <span className="absolute top-2 right-2 bg-blue-600/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        TV
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h4 className="text-gray-300 font-semibold text-sm mb-1.5 line-clamp-1">
                      {m.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="text-[#46d369]">{m.match}%</span>
                      <span>{m.year}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
