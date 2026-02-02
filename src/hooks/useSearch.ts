import { useState, useEffect, useCallback } from 'react';
import { tmdbService } from '../services/tmdb';
import { Movie } from '../types';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [genres, setGenres] = useState<Record<number, string>>({});
  const [tvGenres, setTVGenres] = useState<Record<number, string>>({});

  useEffect(() => {
    Promise.all([tmdbService.getGenres(), tmdbService.getTVGenres()]).then(
      ([movieGenres, tvGenresMap]) => {
        setGenres(movieGenres);
        setTVGenres(tvGenresMap);
      }
    );
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsSearching(true);
        try {
          const [movieResults, tvResults] = await Promise.all([
            tmdbService.searchMovies(query),
            tmdbService.searchTV(query)
          ]);

          const mappedMovies = movieResults
            .filter((m) => m.backdrop_path || m.poster_path)
            .map((m) => tmdbService.mapMovies(m, genres));

          const mappedTV = tvResults
            .filter((m) => m.backdrop_path || m.poster_path)
            .map((m) => tmdbService.mapTVShows(m, tvGenres));

          // Interleave results, prioritizing by popularity (vote_average proxy via match)
          const combined = [...mappedMovies, ...mappedTV].sort(
            (a, b) => b.match - a.match
          );

          setResults(combined);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, genres, tvGenres]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch
  };
}
