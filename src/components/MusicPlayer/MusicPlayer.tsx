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
import tracks from "../../tracks";

type RepeatMode = "none" | "one" | "all";

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Track / playback states
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Volume / mute
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Controls
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  const currentTrack = tracks[currentTrackIndex];

  // Sync audio volume and mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Update time / duration
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

  // Play / Pause
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) audio.pause();
    else audio.play();

    setIsPlaying(!isPlaying);
  };

  // Previous / Next track
  const handlePrevious = () => {
    const newIndex =
      currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(false);
  };

  const handleNext = () => {
    const newIndex =
      currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0;
    setCurrentTrackIndex(newIndex);
    setIsPlaying(false);
  };

  // Seek
  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Repeat toggle
  const toggleRepeat = () => {
    const modes: RepeatMode[] = ["none", "one", "all"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setRepeatMode(modes[nextIndex]);
  };

  // Mute toggle
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  // Time formatter
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Keyboard accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    switch (e.key) {
      case " ":
      case "Spacebar":
        e.preventDefault();
        handlePlayPause();
        break;
      case "ArrowRight":
        handleSeek(Math.min(currentTime + 5, duration));
        break;
      case "ArrowLeft":
        handleSeek(Math.max(currentTime - 5, 0));
        break;
      case "ArrowUp":
        setVolume(Math.min(volume + 0.05, 1));
        if (isMuted) setIsMuted(false);
        break;
      case "ArrowDown":
        setVolume(Math.max(volume - 0.05, 0));
        if (volume - 0.05 <= 0) setIsMuted(true);
        break;
      case "m":
      case "M":
        toggleMute();
        break;
      default:
        break;
    }
  };

  return (
    <div
      className='min-h-screen flex justify-center items-center'
      tabIndex={0} // make div focusable for keyboard
      onKeyDown={handleKeyDown}
    >
      <audio ref={audioRef} src={currentTrack.audioUrl} preload='metadata' />
      <div className='w-[1280px] p-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Music Player */}
          <div className='lg:col-span-2 bg-white backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl'>
            <div className='flex flex-col md:flex-row gap-8'>
              <div className='flex-shrink-0'>
                <div className='w-64 h-64 mx-auto md:mx-0 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-105'>
                  <img
                    src={currentTrack.coverUrl}
                    className='w-full h-full object-cover'
                    alt={currentTrack.album}
                  />
                </div>
              </div>

              {/* Track Info & Controls */}
              <div className='flex-1 flex flex-col justify-between'>
                <div className='text-center md:text-left'>
                  <h2 className='text-3xl font-bold text-violet-600 mb-2'>
                    {currentTrack.title}
                  </h2>
                  <p className='text-gray-400'>{currentTrack.artist}</p>

                  <div className='flex items-center justify-center md:justify-start gap-4 mt-6'>
                    <button
                      aria-label={isLiked ? "Unlike Track" : "Like Track"}
                      className={`p-3 rounded-full transition-all duration-300 border cursor-pointer ${
                        isLiked
                          ? "bg-pink-500 shadow-lg text-white"
                          : "bg-white/10 text-gray-400 hover:text-pink-400"
                      }`}
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart size={20} fill={isLiked ? "currentColor" : ""} />
                    </button>
                    <button
                      className='px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-violet-500/50 transition-all duration-300 cursor-pointer'
                      aria-label='Add to Playlist'
                    >
                      Add to Playlist
                    </button>
                  </div>
                </div>

                {/* Progress Section */}
                <div className='mt-8'>
                  <ProgressBar
                    currentTime={currentTime}
                    duration={duration || currentTrack.duration}
                    onSeek={handleSeek}
                  />
                  <div className='flex justify-between text-sm text-gray-400 mt-2'>
                    <span>{formatTime(currentTime)}</span>
                    <span>
                      {formatTime(
                        duration - currentTime || currentTrack.duration,
                      )}
                    </span>
                  </div>

                  {/* Control Buttons */}
                  <div className='flex items-center justify-center gap-4 mt-6'>
                    <button
                      className={`p-3 rounded-full transition-all duration-300 text-dark hover:bg-gray-300 hover:scale-110 cursor-pointer ${
                        isShuffled ? "bg-gray-300" : ""
                      }`}
                      aria-label='Shuffle'
                      onClick={() => setIsShuffled(!isShuffled)}
                    >
                      <Shuffle size={18} />
                    </button>

                    <button
                      className='p-3 rounded-full transition-all duration-300 text-dark hover:bg-gray-300 hover:scale-110 cursor-pointer'
                      aria-label='Previous Track'
                      onClick={handlePrevious}
                    >
                      <SkipBack size={20} />
                    </button>

                    <button
                      className='p-3 rounded-full transition-all duration-300 text-dark bg-purple-500 text-white hover:bg-purple-600 hover:scale-110 cursor-pointer'
                      aria-label={isPlaying ? "Pause" : "Play"}
                      onClick={handlePlayPause}
                    >
                      {isPlaying ? <Pause size={28} /> : <Play size={28} />}
                    </button>

                    <button
                      className='p-3 rounded-full transition-all duration-300 text-dark hover:bg-gray-300 hover:scale-110 cursor-pointer'
                      aria-label='Next Track'
                      onClick={handleNext}
                    >
                      <SkipForward size={20} />
                    </button>

                    <button
                      className='relative p-3 rounded-full transition-all duration-300 text-dark hover:bg-gray-300 hover:scale-110 cursor-pointer'
                      aria-label='Repeat'
                      onClick={toggleRepeat}
                    >
                      <Repeat size={18} />
                      {repeatMode === "one" && (
                        <span className='absolute -top-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center font-bold text-xs text-white'>
                          1
                        </span>
                      )}
                    </button>

                    {/* Volume Control */}
                    <div className='flex items-center justify-center gap-2'>
                      <button
                        className='text-dark hover:scale-110 transition-all duration-300 cursor-pointer'
                        onClick={toggleMute}
                        aria-label={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX size={20} />
                        ) : (
                          <Volume2 size={20} />
                        )}
                      </button>
                      <VolumeControl
                        volume={isMuted ? 0 : volume}
                        onVolumeChange={(v) => {
                          setVolume(v);
                          if (v > 0 && isMuted) setIsMuted(false);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Playlist Sidebar */}
          <div className='backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl bg-white'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-xl font-bold text-gray-800'>Up Next</h3>
              <p className='w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-gray-100 text-sm font-bold'>
                Track Length
              </p>
            </div>
            <div className='space-7-3 h-96 overflow-y-auto overflow-x-hidden'>
              <PlayList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
