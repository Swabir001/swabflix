import { Movie } from '../types';

interface TopTenCardProps {
  movie: Movie;
  rank: number;
  onPlay?: (movie: Movie) => void;
  onMoreInfo?: (movie: Movie) => void;
}

export function TopTenCard({ movie, rank, onMoreInfo }: TopTenCardProps) {
  return (
    <div
      className="relative flex-shrink-0 w-[200px] md:w-[260px] h-[150px] md:h-[180px] cursor-pointer group"
      onClick={() => onMoreInfo?.(movie)}
    >
      {/* Rank number */}
      <div className="absolute -left-2 bottom-0 z-10">
        <span
          className="text-[100px] md:text-[140px] font-black leading-none select-none"
          style={{
            WebkitTextStroke: '3px #e5e5e5',
            color: 'transparent',
            textShadow: '4px 4px 0 rgba(0,0,0,0.8)'
          }}
        >
          {rank}
        </span>
      </div>

      {/* Poster */}
      <div className="absolute right-0 top-0 w-[60%] h-full rounded-md overflow-hidden">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
    </div>
  );
}
