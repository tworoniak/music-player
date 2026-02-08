import { useEffect } from 'react';

type SeekToDetails = {
  seekTime?: number;
  fastSeek?: boolean;
};

type UseMediaSessionArgs = {
  title: string;
  artist: string;
  album?: string;
  artworkUrl?: string;

  isPlaying: boolean;

  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;

  // NEW: allow OS scrubber to seek
  onSeek?: (time: number) => void;

  // Optional but nice (shows scrubber position in some UIs)
  currentTime?: number;
  duration?: number;

  // Optional: if you ever support variable playback speed
  playbackRate?: number;
};

export function useMediaSession({
  title,
  artist,
  album,
  artworkUrl,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onSeek,
  currentTime,
  duration,
  playbackRate = 1,
}: UseMediaSessionArgs) {
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album: album ?? '',
      artwork: artworkUrl
        ? [
            { src: artworkUrl, sizes: '96x96', type: 'image/png' },
            { src: artworkUrl, sizes: '128x128', type: 'image/png' },
            { src: artworkUrl, sizes: '192x192', type: 'image/png' },
            { src: artworkUrl, sizes: '256x256', type: 'image/png' },
            { src: artworkUrl, sizes: '384x384', type: 'image/png' },
            { src: artworkUrl, sizes: '512x512', type: 'image/png' },
          ]
        : [],
    });

    // OS controls → your handlers
    navigator.mediaSession.setActionHandler('play', onPlay);
    navigator.mediaSession.setActionHandler('pause', onPause);
    navigator.mediaSession.setActionHandler('nexttrack', onNext);
    navigator.mediaSession.setActionHandler('previoustrack', onPrev);

    // Seek support (Android + some desktop UIs)
    navigator.mediaSession.setActionHandler(
      'seekto',
      onSeek
        ? (details: SeekToDetails) => {
            const t = details?.seekTime;
            if (typeof t !== 'number' || !Number.isFinite(t)) return;
            onSeek(t);
          }
        : null,
    );

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('seekto', null);
    };
  }, [
    title,
    artist,
    album,
    artworkUrl,
    onPlay,
    onPause,
    onNext,
    onPrev,
    onSeek,
  ]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    if (
      typeof currentTime !== 'number' ||
      typeof duration !== 'number' ||
      !Number.isFinite(currentTime) ||
      !Number.isFinite(duration) ||
      duration <= 0
    )
      return;

    const session = navigator.mediaSession as unknown as {
      setPositionState?: (state: {
        duration: number;
        playbackRate: number;
        position: number;
      }) => void;
    };

    session.setPositionState?.({
      duration,
      playbackRate,
      position: currentTime,
    });
  }, [currentTime, duration, playbackRate]);
}
