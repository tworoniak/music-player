import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import tracksData from '../types/tracks';
import type { Track } from '../types/tracks';
import { useMediaSession } from '../hooks/useMediaSession';
import { PlayerContext } from './PlayerContext';
import type { RepeatMode, PlayerContextValue } from './PlayerContext';

// -------------------- Storage Helpers --------------------
const STORAGE_KEY = 'music-player:v1';

type PersistedPlayerState = {
  currentTrackIndex: number;
  repeatMode: 'none' | 'one' | 'all';
  volume: number;
  isMuted: boolean;
  isShuffled: boolean;
  shuffledOrder: number[];
  likedIds?: number[];
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function safeParse(json: string): unknown | null {
  try {
    return JSON.parse(json) as unknown;
  } catch {
    return null;
  }
}

function isPersistedState(x: unknown): x is PersistedPlayerState {
  if (!x || typeof x !== 'object') return false;
  const o = x as Record<string, unknown>;

  const repeatModeOk =
    o.repeatMode === 'none' || o.repeatMode === 'one' || o.repeatMode === 'all';

  const likedOk =
    o.likedIds === undefined ||
    (Array.isArray(o.likedIds) &&
      o.likedIds.every((n) => typeof n === 'number'));

  return (
    typeof o.currentTrackIndex === 'number' &&
    repeatModeOk &&
    typeof o.volume === 'number' &&
    typeof o.isMuted === 'boolean' &&
    typeof o.isShuffled === 'boolean' &&
    Array.isArray(o.shuffledOrder) &&
    o.shuffledOrder.every((n) => typeof n === 'number') &&
    likedOk
  );
}

function loadPersistedState(trackCount: number): PersistedPlayerState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  const parsed = safeParse(raw);
  if (!isPersistedState(parsed)) return null;

  return {
    currentTrackIndex: clamp(
      parsed.currentTrackIndex,
      0,
      Math.max(0, trackCount - 1),
    ),
    repeatMode: parsed.repeatMode,
    volume: clamp(parsed.volume, 0, 1),
    isMuted: parsed.isMuted,
    isShuffled: parsed.isShuffled,
    shuffledOrder: parsed.shuffledOrder,
    likedIds: Array.isArray(parsed.likedIds) ? parsed.likedIds : [],
  };
}

function savePersistedState(state: PersistedPlayerState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function makeShuffledOrder(length: number) {
  const indices = Array.from({ length }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

// -------------------- Provider --------------------
export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ✅ define tracks first (so we can use tracks.length safely)
  const tracks: Track[] = tracksData;

  // ✅ read persisted state (safe: only depends on tracks.length)
  const persisted = useMemo(
    () => loadPersistedState(tracks.length),
    [tracks.length],
  );

  // --- Likes ---
  const [likedIds, setLikedIds] = useState<Set<number>>(
    () => new Set(persisted?.likedIds ?? []),
  );

  const isLiked = useCallback(
    (trackId: number) => likedIds.has(trackId),
    [likedIds],
  );

  const toggleLike = useCallback((trackId: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) next.delete(trackId);
      else next.add(trackId);
      return next;
    });
  }, []);

  // --- Shuffle init ---
  const initialShuffledOrder = persisted?.isShuffled
    ? persisted.shuffledOrder.length === tracks.length
      ? persisted.shuffledOrder
      : makeShuffledOrder(tracks.length)
    : [];

  // persisted-backed state
  const [currentTrackIndex, setCurrentTrackIndex] = useState(
    persisted?.currentTrackIndex ?? 0,
  );

  const [repeatMode, setRepeatMode] = useState<RepeatMode>(
    persisted?.repeatMode ?? 'none',
  );

  const [volume, setVolumeState] = useState(persisted?.volume ?? 1);
  const [isMuted, setIsMuted] = useState(persisted?.isMuted ?? false);

  const [isShuffled, setIsShuffled] = useState(persisted?.isShuffled ?? false);
  const [shuffledOrder, setShuffledOrder] =
    useState<number[]>(initialShuffledOrder);

  // non-persisted state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // AudioContext & visualizer
  const audioContextRef = useRef<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const currentTrack = tracks[currentTrackIndex];

  const displayedTracks: Track[] = useMemo(() => {
    return isShuffled ? shuffledOrder.map((i) => tracks[i]) : tracks;
  }, [isShuffled, shuffledOrder, tracks]);

  // ✅ direct selection by real index (needed for Liked page)
  const selectTrackByIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= tracks.length) return;
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    },
    [tracks.length],
  );

  // -------------------- ensureAudioGraph --------------------
  const ensureAudioGraph = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextClass) return false;

      const audioContext = new AudioContextClass();
      const source = audioContext.createMediaElementSource(audio);
      const analyserNode = audioContext.createAnalyser();

      source.connect(analyserNode);
      analyserNode.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      setAnalyser(analyserNode);
    } else if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }

    return true;
  }, []);

  // ✅ Track change only (src/load)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.audioUrl;
    audio.load();
  }, [currentTrack.audioUrl]);

  // ✅ Volume/mute only (no reload)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // time + metadata listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);

    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
    };
  }, []);

  // Single source of truth: play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    let cancelled = false;

    const run = async () => {
      if (isPlaying) {
        const ok = await ensureAudioGraph();
        if (!ok || cancelled) return;

        try {
          await audio.play();
        } catch {
          setIsPlaying(false);
        }
      } else {
        audio.pause();
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [isPlaying, currentTrackIndex, ensureAudioGraph]);

  // Persist changes (debounced)
  useEffect(() => {
    const t = window.setTimeout(() => {
      savePersistedState({
        currentTrackIndex,
        repeatMode,
        volume,
        isMuted,
        isShuffled,
        shuffledOrder,
        likedIds: Array.from(likedIds),
      });
    }, 250);

    return () => window.clearTimeout(t);
  }, [
    currentTrackIndex,
    repeatMode,
    volume,
    isMuted,
    isShuffled,
    shuffledOrder,
    likedIds,
  ]);

  // -------------------- Fix Repeat Reliability --------------------
  // Use refs so the 'ended' event always sees the latest state (avoids stale closures)
  const repeatModeRef = useRef(repeatMode);
  const isShuffledRef = useRef(isShuffled);
  const shuffledOrderRef = useRef(shuffledOrder);
  const currentTrackIndexRef = useRef(currentTrackIndex);

  useEffect(() => {
    repeatModeRef.current = repeatMode;
  }, [repeatMode]);

  useEffect(() => {
    isShuffledRef.current = isShuffled;
  }, [isShuffled]);

  useEffect(() => {
    shuffledOrderRef.current = shuffledOrder;
  }, [shuffledOrder]);

  useEffect(() => {
    currentTrackIndexRef.current = currentTrackIndex;
  }, [currentTrackIndex]);

  // ended behavior (stable listener)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onEnded = () => {
      const mode = repeatModeRef.current;
      const shuffled = isShuffledRef.current;
      const order = shuffledOrderRef.current;
      const idx = currentTrackIndexRef.current;

      // Repeat ONE: restart same track immediately
      if (mode === 'one') {
        audio.currentTime = 0;
        setIsPlaying(true);
        void audio.play().catch(() => {});
        return;
      }

      let nextIndex = idx;

      if (shuffled && order.length) {
        const pos = order.indexOf(idx);
        const isLast = pos >= order.length - 1;

        if (!isLast) nextIndex = order[pos + 1];
        else nextIndex = mode === 'all' ? order[0] : idx;
      } else {
        const isLast = idx >= tracks.length - 1;
        if (!isLast) nextIndex = idx + 1;
        else nextIndex = mode === 'all' ? 0 : idx;
      }

      if (nextIndex !== idx) {
        setCurrentTrackIndex(nextIndex);
        setIsPlaying(true);
      } else {
        // mode === 'none' on last track
        setIsPlaying(false);
      }
    };

    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [tracks.length]);

  // -------------------- actions --------------------
  const play = useCallback(() => {
    void ensureAudioGraph().then((ok) => {
      if (ok) setIsPlaying(true);
    });
  }, [ensureAudioGraph]);

  const pause = useCallback(() => setIsPlaying(false), []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((p) => !p);
  }, []);

  const next = useCallback(() => {
    setCurrentTrackIndex((i) => (i < tracks.length - 1 ? i + 1 : 0));
    setIsPlaying(true);
  }, [tracks.length]);

  const previous = useCallback(() => {
    setCurrentTrackIndex((i) => (i > 0 ? i - 1 : tracks.length - 1));
    setIsPlaying(true);
  }, [tracks.length]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback(
    (value: number) => {
      setVolumeState(value);
      if (value > 0 && isMuted) setIsMuted(false);
    },
    [isMuted],
  );

  const toggleMute = useCallback(() => {
    setIsMuted((m) => !m);
  }, []);

  const toggleRepeat = useCallback(() => {
    const modes: RepeatMode[] = ['none', 'one', 'all'];
    setRepeatMode((m) => modes[(modes.indexOf(m) + 1) % modes.length]);
  }, []);

  const toggleShuffle = useCallback(() => {
    setIsShuffled((prev) => {
      const nextVal = !prev;

      if (nextVal) {
        setShuffledOrder(makeShuffledOrder(tracks.length));
      }

      return nextVal;
    });
  }, [tracks.length]);

  const selectDisplayedTrack = useCallback(
    (displayIndex: number) => {
      const realIndex = isShuffled ? shuffledOrder[displayIndex] : displayIndex;
      if (typeof realIndex !== 'number') return;
      setCurrentTrackIndex(realIndex);
      setIsPlaying(true);
    },
    [isShuffled, shuffledOrder],
  );

  // -------------------- keyboard shortcuts --------------------
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTyping =
        tag === 'input' ||
        tag === 'textarea' ||
        target?.isContentEditable === true;

      if (isTyping) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
        return;
      }

      if (e.key.toLowerCase() === 'm') {
        toggleMute();
        return;
      }

      if (e.key.toLowerCase() === 'n') {
        next();
        return;
      }

      if (e.key.toLowerCase() === 'p') {
        previous();
        return;
      }

      if (e.key === 'ArrowRight') {
        const newTime = Math.min(
          (audioRef.current?.currentTime ?? currentTime) + 5,
          (audioRef.current?.duration ?? duration) || Infinity,
        );
        seek(newTime);
        return;
      }

      if (e.key === 'ArrowLeft') {
        const newTime = Math.max(
          (audioRef.current?.currentTime ?? currentTime) - 5,
          0,
        );
        seek(newTime);
        return;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    togglePlayPause,
    toggleMute,
    next,
    previous,
    seek,
    currentTime,
    duration,
  ]);

  // -------------------- Media Session --------------------
  useMediaSession({
    title: currentTrack.title,
    artist: currentTrack.artist,
    album: currentTrack.album,
    artworkUrl: currentTrack.coverUrl,
    isPlaying,
    onPlay: play,
    onPause: pause,
    onNext: next,
    onPrev: previous,
    onSeek: seek,
    currentTime,
    duration: duration || currentTrack.duration,
  });

  const value: PlayerContextValue = useMemo(
    () => ({
      tracks,
      currentTrack,
      currentTrackIndex,
      displayedTracks,
      isShuffled,
      shuffledOrder,
      repeatMode,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      analyser,

      // ✅ favorites
      likedIds,
      isLiked,
      toggleLike,

      // ✅ direct selection
      selectTrackByIndex,

      play,
      pause,
      togglePlayPause,
      next,
      previous,
      seek,
      setVolume,
      toggleMute,
      toggleRepeat,
      toggleShuffle,
      selectDisplayedTrack,
    }),
    [
      tracks,
      currentTrack,
      currentTrackIndex,
      displayedTracks,
      isShuffled,
      shuffledOrder,
      repeatMode,
      isPlaying,
      currentTime,
      duration,
      volume,
      isMuted,
      analyser,
      likedIds,
      isLiked,
      toggleLike,
      selectTrackByIndex,
      play,
      pause,
      togglePlayPause,
      next,
      previous,
      seek,
      setVolume,
      toggleMute,
      toggleRepeat,
      toggleShuffle,
      selectDisplayedTrack,
    ],
  );

  return (
    <PlayerContext.Provider value={value}>
      <audio ref={audioRef} preload='metadata' />
      {children}
    </PlayerContext.Provider>
  );
}
