import { fetchFromTMDB, TMDB_IMAGE_BASE, TMDB_IMAGE_SMALL } from './api';
import { Movie, TMDBMovie, TMDBTVShow, Video, CastMember, SeasonDetail, Episode } from '../types';

const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1920&q=80';
const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=500&q=80';

// Map TMDB movie to internal Movie type
const mapTMDBMovie = (
  tmdbMovie: TMDBMovie,
  genresMap: Record<number, string> = {}
): Movie => {
  const year = tmdbMovie.release_date
    ? new Date(tmdbMovie.release_date).getFullYear()
    : new Date().getFullYear();
  const genres = tmdbMovie.genre_ids
    .map((id) => genresMap[id] || 'Unknown')
    .filter((g) => g !== 'Unknown')
    .slice(0, 3);

  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title,
    description: tmdbMovie.overview,
    backdropUrl: tmdbMovie.backdrop_path
      ? `${TMDB_IMAGE_BASE}${tmdbMovie.backdrop_path}`
      : FALLBACK_BACKDROP,
    posterUrl: tmdbMovie.poster_path
      ? `${TMDB_IMAGE_SMALL}${tmdbMovie.poster_path}`
      : FALLBACK_POSTER,
    match: Math.round(tmdbMovie.vote_average * 10),
    rating: tmdbMovie.adult ? 'R' : 'PG-13',
    duration: '1h 45m',
    genres,
    year,
    mediaType: 'movie'
  };
};

// Map TMDB TV show to internal Movie type
const mapTMDBTVShow = (
  show: TMDBTVShow,
  genresMap: Record<number, string> = {}
): Movie => {
  const year = show.first_air_date
    ? new Date(show.first_air_date).getFullYear()
    : new Date().getFullYear();
  const genres = show.genre_ids
    .map((id) => genresMap[id] || 'Unknown')
    .filter((g) => g !== 'Unknown')
    .slice(0, 3);

  return {
    id: show.id,
    title: show.name,
    description: show.overview,
    backdropUrl: show.backdrop_path
      ? `${TMDB_IMAGE_BASE}${show.backdrop_path}`
      : FALLBACK_BACKDROP,
    posterUrl: show.poster_path
      ? `${TMDB_IMAGE_SMALL}${show.poster_path}`
      : FALLBACK_POSTER,
    match: Math.round(show.vote_average * 10),
    rating: 'TV-MA',
    duration: show.number_of_seasons
      ? `${show.number_of_seasons} Season${show.number_of_seasons > 1 ? 's' : ''}`
      : 'Series',
    genres,
    year,
    mediaType: 'tv',
    seasonCount: show.number_of_seasons
  };
};

export const tmdbService = {
  // ========== GENRES ==========
  getGenres: async (): Promise<Record<number, string>> => {
    const data = await fetchFromTMDB('/genre/movie/list');
    return data.genres.reduce(
      (acc: Record<number, string>, genre: { id: number; name: string }) => {
        acc[genre.id] = genre.name;
        return acc;
      },
      {}
    );
  },

  getTVGenres: async (): Promise<Record<number, string>> => {
    const data = await fetchFromTMDB('/genre/tv/list');
    return data.genres.reduce(
      (acc: Record<number, string>, genre: { id: number; name: string }) => {
        acc[genre.id] = genre.name;
        return acc;
      },
      {}
    );
  },

  // ========== MOVIES ==========
  getTrending: async (): Promise<TMDBMovie[]> => {
    const data = await fetchFromTMDB('/trending/movie/week');
    return data.results;
  },

  getPopular: async (): Promise<TMDBMovie[]> => {
    const data = await fetchFromTMDB('/movie/popular');
    return data.results;
  },

  getTopRated: async (): Promise<TMDBMovie[]> => {
    const data = await fetchFromTMDB('/movie/top_rated');
    return data.results;
  },

  getNowPlaying: async (): Promise<TMDBMovie[]> => {
    const data = await fetchFromTMDB('/movie/now_playing');
    return data.results;
  },

  getUpcoming: async (): Promise<TMDBMovie[]> => {
    const data = await fetchFromTMDB('/movie/upcoming');
    return data.results;
  },

  getByGenre: async (genreId: number): Promise<TMDBMovie[]> => {
    const data = await fetchFromTMDB('/discover/movie', {
      with_genres: genreId.toString(),
      sort_by: 'popularity.desc'
    });
    return data.results;
  },

  searchMovies: async (query: string): Promise<TMDBMovie[]> => {
    if (!query) return [];
    const data = await fetchFromTMDB('/search/movie', { query });
    return data.results;
  },

  getMovieDetails: async (
    id: number
  ): Promise<Movie & { cast: CastMember[]; trailerUrl?: string }> => {
    const [details, credits, videos] = await Promise.all([
      fetchFromTMDB(`/movie/${id}`),
      fetchFromTMDB(`/movie/${id}/credits`),
      fetchFromTMDB(`/movie/${id}/videos`)
    ]);

    const trailer =
      videos.results.find(
        (v: Video) => v.type === 'Trailer' && v.site === 'YouTube'
      ) || videos.results.find((v: Video) => v.site === 'YouTube');

    const cast = credits.cast.slice(0, 10).map((actor: any) => ({
      id: actor.id,
      name: actor.name,
      character: actor.character,
      profileUrl: actor.profile_path
        ? `${TMDB_IMAGE_SMALL}${actor.profile_path}`
        : null
    }));

    return {
      id: details.id,
      title: details.title,
      description: details.overview,
      backdropUrl: details.backdrop_path
        ? `${TMDB_IMAGE_BASE}${details.backdrop_path}`
        : '',
      posterUrl: details.poster_path
        ? `${TMDB_IMAGE_SMALL}${details.poster_path}`
        : '',
      match: Math.round(details.vote_average * 10),
      rating: details.adult ? 'R' : 'PG-13',
      duration: details.runtime
        ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m`
        : '1h 45m',
      genres: details.genres.map((g: any) => g.name),
      year: details.release_date
        ? new Date(details.release_date).getFullYear()
        : new Date().getFullYear(),
      cast,
      trailerUrl: trailer
        ? `https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`
        : undefined,
      mediaType: 'movie'
    };
  },

  getSimilarMovies: async (id: number): Promise<TMDBMovie[]> => {
    const data = await fetchFromTMDB(`/movie/${id}/similar`);
    return data.results;
  },

  // ========== TV SHOWS ==========
  getTrendingTV: async (): Promise<TMDBTVShow[]> => {
    const data = await fetchFromTMDB('/trending/tv/week');
    return data.results;
  },

  getPopularTV: async (): Promise<TMDBTVShow[]> => {
    const data = await fetchFromTMDB('/tv/popular');
    return data.results;
  },

  getTopRatedTV: async (): Promise<TMDBTVShow[]> => {
    const data = await fetchFromTMDB('/tv/top_rated');
    return data.results;
  },

  getAiringTodayTV: async (): Promise<TMDBTVShow[]> => {
    const data = await fetchFromTMDB('/tv/airing_today');
    return data.results;
  },

  getTVByGenre: async (genreId: number): Promise<TMDBTVShow[]> => {
    const data = await fetchFromTMDB('/discover/tv', {
      with_genres: genreId.toString(),
      sort_by: 'popularity.desc'
    });
    return data.results;
  },

  searchTV: async (query: string): Promise<TMDBTVShow[]> => {
    if (!query) return [];
    const data = await fetchFromTMDB('/search/tv', { query });
    return data.results;
  },

  getTVDetails: async (
    id: number
  ): Promise<Movie & { cast: CastMember[]; trailerUrl?: string }> => {
    const [details, credits, videos] = await Promise.all([
      fetchFromTMDB(`/tv/${id}`),
      fetchFromTMDB(`/tv/${id}/credits`),
      fetchFromTMDB(`/tv/${id}/videos`)
    ]);

    const trailer =
      videos.results.find(
        (v: Video) => v.type === 'Trailer' && v.site === 'YouTube'
      ) || videos.results.find((v: Video) => v.site === 'YouTube');

    const cast = (credits.cast || []).slice(0, 10).map((actor: any) => ({
      id: actor.id,
      name: actor.name,
      character: actor.character,
      profileUrl: actor.profile_path
        ? `${TMDB_IMAGE_SMALL}${actor.profile_path}`
        : null
    }));

    const seasons = details.number_of_seasons || 1;

    return {
      id: details.id,
      title: details.name,
      description: details.overview,
      backdropUrl: details.backdrop_path
        ? `${TMDB_IMAGE_BASE}${details.backdrop_path}`
        : '',
      posterUrl: details.poster_path
        ? `${TMDB_IMAGE_SMALL}${details.poster_path}`
        : '',
      match: Math.round(details.vote_average * 10),
      rating: 'TV-MA',
      duration: `${seasons} Season${seasons > 1 ? 's' : ''}`,
      genres: details.genres.map((g: any) => g.name),
      year: details.first_air_date
        ? new Date(details.first_air_date).getFullYear()
        : new Date().getFullYear(),
      cast,
      trailerUrl: trailer
        ? `https://www.youtube.com/embed/${trailer.key}?rel=0&modestbranding=1`
        : undefined,
      mediaType: 'tv',
      seasonCount: seasons
    };
  },

  getSimilarTV: async (id: number): Promise<TMDBTVShow[]> => {
    const data = await fetchFromTMDB(`/tv/${id}/similar`);
    return data.results;
  },

  // ========== SEASONS & EPISODES ==========
  getSeasonDetails: async (tvId: number, seasonNumber: number): Promise<SeasonDetail> => {
    const data = await fetchFromTMDB(`/tv/${tvId}/season/${seasonNumber}`);
    const episodes: Episode[] = (data.episodes || []).map((ep: any) => ({
      id: ep.id,
      name: ep.name,
      overview: ep.overview || '',
      episodeNumber: ep.episode_number,
      seasonNumber: ep.season_number,
      stillUrl: ep.still_path ? `${TMDB_IMAGE_SMALL}${ep.still_path}` : null,
      airDate: ep.air_date || '',
      runtime: ep.runtime || null
    }));

    return {
      seasonNumber: data.season_number,
      name: data.name,
      episodes
    };
  },

  // ========== MAPPERS ==========
  mapMovies: mapTMDBMovie,
  mapTVShows: mapTMDBTVShow
};
