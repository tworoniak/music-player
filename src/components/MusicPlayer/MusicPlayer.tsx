import { useState, useRef, useEffect } from "react";
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
} from "lucide-react";

import ProgressBar from "../ProgressBar/ProgressBar";
import VolumeControl from "../VolumeControl/VolumeControl";
import PlayList from "../PlayList/PlayList";
import BarVisualizer from "../BarVisualizer/BarVisualizer";
import tracksData from "../../types/tracks";
import type { Track } from "../../types/tracks";

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("none");
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // AudioContext & visualizer
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);

  const currentTrack = tracksData[currentTrackIndex];

  // -------------------- Audio Events --------------------
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [currentTrackIndex]);

  // -------------------- Play / Pause --------------------

  const handlePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audioContextRef.current) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;

      if (!AudioContextClass) {
        console.error("Web Audio API not supported");
        return;
      }

      const audioContext = new AudioContextClass();
      const source = audioContext.createMediaElementSource(audio);
      const analyserNode = audioContext.createAnalyser();

      source.connect(analyserNode);
      analyserNode.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyserNode;
      setAnalyser(analyserNode); // Add this line
    } else if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }

    try {
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      console.log("Playback blocked:", err);
    }
  };

  const handlePause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    setIsPlaying(false);
  };

  // -------------------- Track Navigation --------------------
  const handlePrevious = () =>
    setCurrentTrackIndex(
      currentTrackIndex > 0 ? currentTrackIndex - 1 : tracksData.length - 1,
    );

  const handleNext = () =>
    setCurrentTrackIndex(
      currentTrackIndex < tracksData.length - 1 ? currentTrackIndex + 1 : 0,
    );

  // -------------------- Repeat --------------------
  const toggleRepeat = () => {
    const modes: ("none" | "one" | "all")[] = ["none", "one", "all"];
    setRepeatMode(modes[(modes.indexOf(repeatMode) + 1) % modes.length]);
  };

  // -------------------- Seek --------------------
  const handleSeek = (time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  // -------------------- Volume --------------------
  const handleVolumeChange = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = value;
    setVolume(value);
    if (value > 0 && isMuted) setIsMuted(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // -------------------- Shuffle --------------------

  const displayedTracks: Track[] = isShuffled
    ? shuffledOrder.map((i) => tracksData[i])
    : tracksData;

  const toggleShuffle = () => {
    if (!isShuffled) {
      // Turning shuffle ON - create shuffled order
      const indices = tracksData.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }
      setShuffledOrder(indices);
    }
    setIsShuffled(!isShuffled);
  };

  // -------------------- Render --------------------
  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-100'>
      <audio ref={audioRef} src={currentTrack.audioUrl} preload='metadata' />

      <div className='w-[1280px] p-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Music Player */}
          <div className='lg:col-span-2 bg-white backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl'>
            {/* Album + Info */}
            <div className='flex flex-col md:flex-row gap-8'>
              <div className='flex-shrink-0'>
                <div className='w-64 h-64 mx-auto md:mx-0 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-105'>
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.album}
                    className='w-full h-full object-cover'
                  />
                </div>
              </div>

              <div className='flex-1 flex flex-col justify-between'>
                <div className='text-center md:text-left'>
                  <h2 className='text-3xl font-bold text-violet-600 mb-2'>
                    {currentTrack.title}
                  </h2>
                  <p className='text-gray-400'>{currentTrack.artist}</p>

                  {/* Like Button */}
                  <div className='flex items-center justify-center md:justify-start gap-4 mt-6'>
                    <button
                      className={`p-3 rounded-full transition-all duration-300 cursor-pointer ${
                        isLiked
                          ? "bg-pink-500 shadow-lg text-white"
                          : "bg-white/10 text-gray-400 hover:text-pink-400"
                      }`}
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart size={20} fill={isLiked ? "currentColor" : ""} />
                    </button>
                  </div>
                </div>

                {/* Progress + Controls */}
                <div className='mt-8'>
                  <ProgressBar
                    currentTime={currentTime}
                    duration={duration || currentTrack.duration}
                    onSeek={handleSeek}
                  />

                  <div className='flex justify-between text-sm text-gray-400 mt-2'>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>

                  {/* Visualizer */}
                  <div className='mt-4 mb-6'>
                    {analyser && (
                      <BarVisualizer
                        analyser={analyser}
                        isPlaying={isPlaying}
                        height={80}
                        barCount={64}
                      />
                    )}
                  </div>

                  {/* Control Buttons */}
                  <div className='flex items-center justify-center gap-4 mt-6'>
                    <button
                      className={`p-3 rounded-full transition-all duration-300 cursor-pointer ${
                        isShuffled ? "bg-gray-300" : ""
                      }`}
                      onClick={toggleShuffle} // Changed from setIsShuffled
                    >
                      <Shuffle size={18} />
                    </button>

                    <button
                      className='p-3 rounded-full transition-all duration-300 cursor-pointer'
                      onClick={handlePrevious}
                    >
                      <SkipBack size={20} />
                    </button>

                    <button
                      className='p-3 rounded-full bg-purple-500 text-white transition-all duration-300 cursor-pointer'
                      onClick={isPlaying ? handlePause : handlePlayPause}
                    >
                      {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                    </button>

                    <button
                      className='p-3 rounded-full transition-all duration-300 cursor-pointer'
                      onClick={handleNext}
                    >
                      <SkipForward size={20} />
                    </button>

                    <button
                      className='relative p-3 rounded-full transition-all duration-300 cursor-pointer'
                      onClick={toggleRepeat}
                    >
                      <Repeat size={18} />
                      {repeatMode === "one" && (
                        <span className='absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center font-bold text-xs text-white'>
                          1
                        </span>
                      )}
                    </button>

                    {/* Volume */}
                    <div className='flex items-center justify-center gap-2'>
                      <button
                        className='transition-all duration-300 cursor-pointer'
                        onClick={toggleMute}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX size={20} />
                        ) : (
                          <Volume2 size={20} />
                        )}
                      </button>
                      <VolumeControl
                        volume={volume}
                        onVolumeChange={handleVolumeChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Playlist */}
          <div className='backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl bg-white'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-bold text-gray-800'>Up Next</h3>
            </div>
            <div className='space-y-3 h-96 overflow-y-auto overflow-x-hidden'>
              <PlayList
                tracks={displayedTracks}
                currentTrackIndex={currentTrackIndex}
                onSelectTrack={(index) => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
