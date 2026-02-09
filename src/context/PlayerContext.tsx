import { createContext, useContext } from 'react';
import type { Track } from '../types/tracks';

export type RepeatMode = 'none' | 'one' | 'all';

export type PlayerContextValue = {
  tracks: Track[];
  currentTrack: Track;
  currentTrackIndex: number;

  displayedTracks: Track[];
  isShuffled: boolean;
  shuffledOrder: number[];
  repeatMode: RepeatMode;

  isPlaying: boolean;
  currentTime: number;
  duration: number;

  volume: number;
  isMuted: boolean;

  analyser: AnalyserNode | null;

  play: () => void;
  pause: () => void;
  togglePlayPause: () => void;

  next: () => void;
  previous: () => void;

  seek: (time: number) => void;

  setVolume: (value: number) => void;
  toggleMute: () => void;

  toggleRepeat: () => void;
  toggleShuffle: () => void;

  selectDisplayedTrack: (displayIndex: number) => void;
};

export const PlayerContext = createContext<PlayerContextValue | null>(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within <PlayerProvider />');
  return ctx;
}
