import { Maximize2, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import { useCallback } from 'react';

type MiniPlayerProps = {
  title: string;
  artist: string;
  coverUrl?: string;

  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;

  currentTime: number;
  duration: number;

  // NEW
  onSeek?: (time: number) => void;
  onExpand?: () => void;
};

function clamp01(n: number) {
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (n >= 1) return 1;
  return n;
}

export default function MiniPlayer({
  title,
  artist,
  coverUrl,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
  currentTime,
  duration,
  onSeek,
  onExpand,
}: MiniPlayerProps) {
  const progress = duration > 0 ? clamp01(currentTime / duration) : 0;

  const handleSeekClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!onSeek || !Number.isFinite(duration) || duration <= 0) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const ratio = clamp01(x / rect.width);
      onSeek(ratio * duration);
    },
    [onSeek, duration],
  );

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-playerBackground/80 backdrop-blur'>
      {/* Click-to-seek progress */}
      <button
        type='button'
        className='group relative h-2 w-full bg-white/10'
        onClick={handleSeekClick}
        aria-label='Seek'
        title={onSeek ? 'Seek' : undefined}
      >
        <div
          className='h-full bg-accent2 transition-[height] group-hover:h-2'
          style={{ width: `${progress * 100}%` }}
        />
      </button>

      <div className='mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3'>
        {/* Track info (click to expand) */}
        <button
          type='button'
          onClick={onExpand}
          className='flex min-w-0 items-center gap-3 text-left'
          aria-label='Open now playing'
        >
          <div className='h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-white/10'>
            {coverUrl ? (
              <img
                src={coverUrl}
                alt=''
                className='h-full w-full object-cover'
                draggable={false}
              />
            ) : null}
          </div>

          <div className='min-w-0'>
            <p className='truncate text-sm font-semibold text-white'>{title}</p>
            <p className='truncate text-xs text-gray-400'>{artist}</p>
          </div>
        </button>

        {/* Controls */}
        <div className='flex items-center gap-2'>
          <button
            onClick={onPrev}
            className='rounded-full p-2 text-white hover:bg-white/10'
            aria-label='Previous'
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={onPlayPause}
            className='rounded-full bg-white p-2 text-gray-900 hover:opacity-90'
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button
            onClick={onNext}
            className='rounded-full p-2 text-white hover:bg-white/10'
            aria-label='Next'
          >
            <SkipForward size={18} />
          </button>

          <button
            onClick={onExpand}
            className='rounded-full p-2 text-white hover:bg-white/10'
            aria-label='Expand'
            title='Now Playing'
          >
            <Maximize2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
