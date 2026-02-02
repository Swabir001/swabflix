// ============================================
// API CONFIGURATION
// ============================================

// TMDB API - Get your free key at https://www.themoviedb.org/settings/api
export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '';
export const TMDB_API_KEY_V3 = import.meta.env.VITE_TMDB_API_KEY_V3 || '';
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
export const TMDB_IMAGE_SMALL = 'https://image.tmdb.org/t/p/w500';

// ============================================
// VIDSRC STREAMING API
// ============================================
export const VIDSRC_BASE_URL = 'https://vidsrc.xyz/embed';

export async function fetchFromTMDB(
  endpoint: string,
  params: Record<string, string> = {}
) {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY_V3,
    language: 'en-US',
    ...params
  });

  const url = `${TMDB_BASE_URL}${endpoint}?${queryParams}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`TMDB API Error: ${response.status} for ${endpoint}`);
      throw new Error(`TMDB API Error: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}
