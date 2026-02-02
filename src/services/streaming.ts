import { StreamingSource, MediaType } from '../types';
import { VIDSRC_BASE_URL } from './api';

export const streamingService = {
  getStreamUrl: async (
    id: number,
    mediaType: MediaType = 'movie',
    season?: number,
    episode?: number
  ): Promise<StreamingSource | null> => {
    try {
      let embedUrl: string;
      if (mediaType === 'tv') {
        const s = season || 1;
        const e = episode || 1;
        embedUrl = `${VIDSRC_BASE_URL}/tv?tmdb=${id}&season=${s}&episode=${e}`;
      } else {
        embedUrl = `${VIDSRC_BASE_URL}/movie?tmdb=${id}`;
      }

      return {
        url: embedUrl,
        type: 'embed'
      };
    } catch (error) {
      console.error('Error generating stream URL:', error);
      return null;
    }
  },

  getTrailerSource: (trailerUrl: string): StreamingSource => {
    return {
      url: trailerUrl,
      type: 'youtube'
    };
  }
};
