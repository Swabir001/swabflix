export type MediaType = 'movie' | 'tv';

export interface Movie {
  id: number;
  title: string;
  description: string;
  backdropUrl: string;
  posterUrl: string;
  match: number;
  rating: string;
  duration: string;
  genres: string[];
  year: number;
  cast?: CastMember[];
  trailerUrl?: string;
  mediaType: MediaType;
  seasonCount?: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profileUrl: string | null;
}

export interface Category {
  id: string;
  title: string;
  movies: Movie[];
}

export type PageType = 'home' | 'tvshows' | 'movies' | 'new' | 'mylist';

export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  adult: boolean;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  first_air_date: string;
  genre_ids: number[];
  origin_country: string[];
  number_of_seasons?: number;
}

export interface TMDBResponse {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
}

export interface Video {
  id: string;
  key: string;
  site: string;
  type: string;
  official: boolean;
}

export interface StreamingSource {
  url: string;
  type: 'youtube' | 'mp4' | 'hls' | 'embed';
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  episodeNumber: number;
  seasonNumber: number;
  stillUrl: string | null;
  airDate: string;
  runtime: number | null;
}

export interface SeasonDetail {
  seasonNumber: number;
  name: string;
  episodes: Episode[];
}

export interface WatchHistoryItem {
  item: Movie;
  watchedAt: number;
  progress: number;
}
