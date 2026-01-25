import type { Track } from "../../types/tracks";
import { Play } from "lucide-react";

interface PlayListProps {
  tracks: Track[];
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
}

const PlayList = ({
  tracks,
  currentTrackIndex,
  onSelectTrack,
}: PlayListProps) => {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className='flex flex-col gap-2'>
      {tracks.map((track, index) => {
        const isActive = index === currentTrackIndex;
        return (
          <div
            key={track.id}
            onClick={() => onSelectTrack(index)}
            className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
              isActive ? "bg-purple-100" : "hover:bg-gray-100"
            }`}
          >
            {/* Track number or play icon */}
            <div className='w-6 flex-shrink-0 flex items-center justify-center'>
              {isActive ? <Play size={16} /> : index + 1}
            </div>

            {/* Track info */}
            <div className='flex-1 min-w-0'>
              <h4
                className={`text-sm font-semibold truncate ${isActive ? "text-purple-600" : ""}`}
              >
                {track.title}
              </h4>
              <p className='text-xs text-gray-500 truncate'>{track.artist}</p>
            </div>

            {/* Track duration */}
            <div className='flex-shrink-0 text-xs text-gray-400'>
              {formatTime(track.duration)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlayList;
