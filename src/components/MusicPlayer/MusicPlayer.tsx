import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
  Heart,
} from 'lucide-react';

import ProgressBar from '../ProgressBar/ProgressBar';
import VolumeControl from '../VolumeControl/VolumeControl';
import PlayList from '../PlayList/PlayList';
import BarVisualizer from '../BarVisualizer/BarVisualizer';
import { usePlayer } from '../../context/PlayerContext';

const MusicPlayer = () => {
  const p = usePlayer();

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const safeDuration = p.duration || p.currentTrack.duration || 0;
  const liked = p.isLiked(p.currentTrack.id);

  return (
    <div className='min-h-screen flex justify-center items-center bg-photo-gradient'>
      <div className='w-7xl p-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Music Player */}
          <div className='lg:col-span-2 bg-surface/50 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl'>
            {/* Album + Info */}
            <div className='flex flex-col md:flex-row gap-8'>
              <div className='shrink-0'>
                <div className='w-64 h-64 mx-auto md:mx-0 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-105'>
                  <img
                    src={p.currentTrack.coverUrl}
                    alt={p.currentTrack.album}
                    className='w-full h-full object-cover'
                  />
                </div>
              </div>

              <div className='flex-1 flex flex-col justify-between'>
                <div className='text-center md:text-left'>
                  <h2 className='text-3xl font-bold text-text mb-2'>
                    {p.currentTrack.title}
                  </h2>
                  <p className='text-muted'>{p.currentTrack.artist}</p>

                  {/* Like Button */}
                  <div className='flex items-center justify-center md:justify-start gap-4 mt-6'>
                    <button
                      className={`p-3 rounded-full transition-all duration-300 cursor-pointer ${
                        liked
                          ? 'bg-pink-500 shadow-lg text-white'
                          : 'bg-white/10 text-gray-400 hover:text-pink-400'
                      }`}
                      onClick={() => p.toggleLike(p.currentTrack.id)}
                      aria-label={liked ? 'Unlike' : 'Like'}
                    >
                      <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                {/* Progress + Controls */}
                <div className='mt-8'>
                  <ProgressBar
                    currentTime={p.currentTime}
                    duration={safeDuration}
                    onSeek={p.seek}
                  />

                  <div className='flex justify-between text-sm text-muted mt-2'>
                    <span>{formatTime(p.currentTime)}</span>
                    <span>
                      {formatTime(Math.max(0, safeDuration - p.currentTime))}
                    </span>
                  </div>

                  {/* Visualizer */}
                  <div className='mt-4 mb-6'>
                    {p.analyser && (
                      <BarVisualizer
                        analyser={p.analyser}
                        isPlaying={p.isPlaying}
                        height={80}
                        barCount={64}
                      />
                    )}
                  </div>

                  {/* Control Buttons */}
                  <div className='flex flex-col items-center justify-center gap-4 mt-6'>
                    <div className='flex items-center justify-center gap-4 mt-6'>
                      <button
                        className={`p-3 rounded-full transition-all duration-300 cursor-pointer  border border-accent hover:border-accent2 ${
                          p.isShuffled ? 'bg-surface' : ''
                        }`}
                        onClick={p.toggleShuffle}
                        aria-label='Shuffle'
                      >
                        <Shuffle size={18} />
                      </button>

                      <button
                        className='p-3 rounded-full transition-all duration-300 cursor-pointer border border-accent hover:border-accent2'
                        onClick={p.previous}
                        aria-label='Previous'
                      >
                        <SkipBack size={20} />
                      </button>

                      <button
                        className='p-3 rounded-full bg-surface text-white transition-all duration-300 cursor-pointer'
                        onClick={p.togglePlayPause}
                        aria-label={p.isPlaying ? 'Pause' : 'Play'}
                      >
                        {p.isPlaying ? <Pause size={28} /> : <Play size={28} />}
                      </button>

                      <button
                        className='p-3 rounded-full transition-all duration-300 cursor-pointer border border-accent hover:border-accent2'
                        onClick={p.next}
                        aria-label='Next'
                      >
                        <SkipForward size={20} />
                      </button>

                      <button
                        className='relative p-3 rounded-full transition-all duration-300 cursor-pointer border border-accent hover:border-accent2'
                        onClick={p.toggleRepeat}
                        aria-label='Repeat'
                      >
                        <Repeat size={18} />
                        {p.repeatMode === 'one' && (
                          <span className='absolute -top-1 -right-1 w-4 h-4 bg-surface rounded-full flex items-center justify-center font-bold text-xs text-white'>
                            1
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Volume */}
                    <div className='flex items-center justify-center gap-2 mt-6 w-full'>
                      <button
                        className='transition-all duration-300 cursor-pointer'
                        onClick={p.toggleMute}
                        aria-label={p.isMuted ? 'Unmute' : 'Mute'}
                      >
                        {p.isMuted || p.volume === 0 ? (
                          <VolumeX size={20} />
                        ) : (
                          <Volume2 size={20} />
                        )}
                      </button>

                      <VolumeControl
                        volume={p.volume}
                        onVolumeChange={p.setVolume}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Playlist */}
          <div className='backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl bg-surface/50'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-bold text-text'>Up Next</h3>
            </div>

            <div className='space-y-3 h-96 overflow-y-auto overflow-x-hidden'>
              <PlayList
                tracks={p.displayedTracks}
                currentTrackIndex={p.currentTrackIndex}
                onSelectTrack={(index) => p.selectDisplayedTrack(index)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
