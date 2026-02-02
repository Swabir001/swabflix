import { useState, useEffect } from 'react';
import { Movie, Category, PageType } from '../types';
import { tmdbService } from '../services/tmdb';

const FALLBACK_MOVIES: Movie[] = [
  {
    id: 550, title: 'Fight Club',
    description: 'A ticking time bomb of a movie that explodes with unexpected twists.',
    backdropUrl: 'https://image.tmdb.org/t/p/original/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    match: 84, rating: 'R', duration: '2h 19m', genres: ['Drama', 'Thriller'], year: 1999, mediaType: 'movie'
  },
  {
    id: 680, title: 'Pulp Fiction',
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
    backdropUrl: 'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    match: 87, rating: 'R', duration: '2h 34m', genres: ['Thriller', 'Crime'], year: 1994, mediaType: 'movie'
  },
  {
    id: 238, title: 'The Godfather',
    description: 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.',
    backdropUrl: 'https://image.tmdb.org/t/p/original/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    match: 87, rating: 'R', duration: '2h 55m', genres: ['Drama', 'Crime'], year: 1972, mediaType: 'movie'
  },
  {
    id: 155, title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest tests.',
    backdropUrl: 'https://image.tmdb.org/t/p/original/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    match: 85, rating: 'PG-13', duration: '2h 32m', genres: ['Action', 'Crime', 'Drama'], year: 2008, mediaType: 'movie'
  },
  {
    id: 27205, title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea.',
    backdropUrl: 'https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    match: 84, rating: 'PG-13', duration: '2h 28m', genres: ['Action', 'Sci-Fi', 'Adventure'], year: 2010, mediaType: 'movie'
  },
  {
    id: 278, title: 'The Shawshank Redemption',
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    backdropUrl: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
    posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    match: 87, rating: 'R', duration: '2h 22m', genres: ['Drama', 'Crime'], year: 1994, mediaType: 'movie'
  }
];

const createFallbackCategories = (): Category[] => [
  { id: 'trending', title: 'Trending Now', movies: FALLBACK_MOVIES.slice(0, 6) },
  { id: 'popular', title: 'Popular on Swabflix', movies: [...FALLBACK_MOVIES].reverse().slice(0, 6) },
  { id: 'top_rated', title: 'Critically Acclaimed', movies: FALLBACK_MOVIES.slice(2, 6) }
];

export const useMovies = (page: PageType = 'home') => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHome = async () => {
      const genresMap = await tmdbService.getGenres();
      const [trending, popular, topRated, action, comedy, horror, scifi, romance] =
        await Promise.all([
          tmdbService.getTrending(),
          tmdbService.getPopular(),
          tmdbService.getTopRated(),
          tmdbService.getByGenre(28),
          tmdbService.getByGenre(35),
          tmdbService.getByGenre(27),
          tmdbService.getByGenre(878),
          tmdbService.getByGenre(10749)
        ]);

      const map = (results: any[]) => results.map((m) => tmdbService.mapMovies(m, genresMap));

      const cats: Category[] = [
        { id: 'trending', title: 'Trending Now', movies: map(trending) },
        { id: 'popular', title: 'Popular on Swabflix', movies: map(popular) },
        { id: 'top_rated', title: 'Top Rated', movies: map(topRated) },
        { id: 'action', title: 'Action Thrillers', movies: map(action) },
        { id: 'comedy', title: 'Comedies', movies: map(comedy) },
        { id: 'horror', title: 'Horror Movies', movies: map(horror) },
        { id: 'scifi', title: 'Sci-Fi & Fantasy', movies: map(scifi) },
        { id: 'romance', title: 'Romance', movies: map(romance) }
      ];

      setCategories(cats);

      if (trending.length > 0) {
        const pick = trending[Math.floor(Math.random() * Math.min(5, trending.length))];
        const detailed = await tmdbService.getMovieDetails(pick.id);
        setFeaturedMovie(detailed);
      }
    };

    const fetchTVShows = async () => {
      const genresMap = await tmdbService.getTVGenres();
      const [trending, popular, topRated, drama, crime, scifi, comedy, reality] =
        await Promise.all([
          tmdbService.getTrendingTV(),
          tmdbService.getPopularTV(),
          tmdbService.getTopRatedTV(),
          tmdbService.getTVByGenre(18),
          tmdbService.getTVByGenre(80),
          tmdbService.getTVByGenre(10765),
          tmdbService.getTVByGenre(35),
          tmdbService.getTVByGenre(10764)
        ]);

      const map = (results: any[]) => results.map((m) => tmdbService.mapTVShows(m, genresMap));

      const cats: Category[] = [
        { id: 'tv_trending', title: 'Trending TV Shows', movies: map(trending) },
        { id: 'tv_popular', title: 'Popular TV Shows', movies: map(popular) },
        { id: 'tv_top', title: 'Top Rated Shows', movies: map(topRated) },
        { id: 'tv_drama', title: 'Drama Series', movies: map(drama) },
        { id: 'tv_crime', title: 'Crime & Mystery', movies: map(crime) },
        { id: 'tv_scifi', title: 'Sci-Fi & Fantasy', movies: map(scifi) },
        { id: 'tv_comedy', title: 'Comedy Shows', movies: map(comedy) },
        { id: 'tv_reality', title: 'Reality TV', movies: map(reality) }
      ];

      setCategories(cats);

      if (trending.length > 0) {
        const pick = trending[Math.floor(Math.random() * Math.min(5, trending.length))];
        const detailed = await tmdbService.getTVDetails(pick.id);
        setFeaturedMovie(detailed);
      }
    };

    const fetchMoviesPage = async () => {
      const genresMap = await tmdbService.getGenres();
      const [popular, topRated, action, thriller, scifi, romance, animation, documentary, adventure, mystery] =
        await Promise.all([
          tmdbService.getPopular(),
          tmdbService.getTopRated(),
          tmdbService.getByGenre(28),
          tmdbService.getByGenre(53),
          tmdbService.getByGenre(878),
          tmdbService.getByGenre(10749),
          tmdbService.getByGenre(16),
          tmdbService.getByGenre(99),
          tmdbService.getByGenre(12),
          tmdbService.getByGenre(9648)
        ]);

      const map = (results: any[]) => results.map((m) => tmdbService.mapMovies(m, genresMap));

      const cats: Category[] = [
        { id: 'mov_popular', title: 'Popular Movies', movies: map(popular) },
        { id: 'mov_top', title: 'Critically Acclaimed', movies: map(topRated) },
        { id: 'mov_action', title: 'Action & Adventure', movies: map(action) },
        { id: 'mov_thriller', title: 'Thrillers', movies: map(thriller) },
        { id: 'mov_scifi', title: 'Sci-Fi', movies: map(scifi) },
        { id: 'mov_romance', title: 'Romance', movies: map(romance) },
        { id: 'mov_animation', title: 'Animation', movies: map(animation) },
        { id: 'mov_documentary', title: 'Documentaries', movies: map(documentary) },
        { id: 'mov_adventure', title: 'Adventure', movies: map(adventure) },
        { id: 'mov_mystery', title: 'Mystery', movies: map(mystery) }
      ];

      setCategories(cats);

      if (popular.length > 0) {
        const pick = popular[Math.floor(Math.random() * Math.min(5, popular.length))];
        const detailed = await tmdbService.getMovieDetails(pick.id);
        setFeaturedMovie(detailed);
      }
    };

    const fetchNewAndPopular = async () => {
      const genresMap = await tmdbService.getGenres();
      const tvGenresMap = await tmdbService.getTVGenres();
      const [nowPlaying, upcoming, trendingMovies, trendingTV, topRated, airingToday] =
        await Promise.all([
          tmdbService.getNowPlaying(),
          tmdbService.getUpcoming(),
          tmdbService.getTrending(),
          tmdbService.getTrendingTV(),
          tmdbService.getTopRated(),
          tmdbService.getAiringTodayTV()
        ]);

      const mapM = (results: any[]) => results.map((m) => tmdbService.mapMovies(m, genresMap));
      const mapT = (results: any[]) => results.map((m) => tmdbService.mapTVShows(m, tvGenresMap));

      const cats: Category[] = [
        { id: 'now_playing', title: 'Now Playing in Theaters', movies: mapM(nowPlaying) },
        { id: 'upcoming', title: 'Coming Soon', movies: mapM(upcoming) },
        { id: 'trending_movies', title: 'Trending Movies', movies: mapM(trendingMovies) },
        { id: 'trending_tv', title: 'Trending TV Shows', movies: mapT(trendingTV) },
        { id: 'top_movies', title: 'Top Rated Movies', movies: mapM(topRated) },
        { id: 'airing_today', title: 'Airing Today', movies: mapT(airingToday) }
      ];

      setCategories(cats);

      if (nowPlaying.length > 0) {
        const pick = nowPlaying[Math.floor(Math.random() * Math.min(5, nowPlaying.length))];
        const detailed = await tmdbService.getMovieDetails(pick.id);
        setFeaturedMovie(detailed);
      }
    };

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (page === 'mylist') {
          setCategories([]);
          setFeaturedMovie(null);
          setLoading(false);
          return;
        }

        switch (page) {
          case 'home':
            await fetchHome();
            break;
          case 'tvshows':
            await fetchTVShows();
            break;
          case 'movies':
            await fetchMoviesPage();
            break;
          case 'new':
            await fetchNewAndPopular();
            break;
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        setCategories(createFallbackCategories());
        setFeaturedMovie(FALLBACK_MOVIES[0]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  return { categories, featuredMovie, loading, error };
};
