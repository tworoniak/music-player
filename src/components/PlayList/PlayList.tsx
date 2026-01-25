import { useEffect, useRef } from "react";
import { Play } from "lucide-react";
import tracks from "../../tracks";

type PlayListProps = {
  currentTrackIndex: number;
  onSelectTrack: (index: number) => void;
  isShuffled?: boolean; // Optional shuffle flag
};

const PlayList = ({
  currentTrackIndex,
  onSelectTrack,
  isShuffled = false,
}: PlayListProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll current track into view
  useEffect(() => {
    const currentTrackEl = trackRefs.current[currentTrackIndex];
    if (currentTrackEl && containerRef.current) {
      const containerTop = containerRef.current.scrollTop;
      const containerHeight = containerRef.current.clientHeight;
      const elementTop = currentTrackEl.offsetTop;
      const elementHeight = currentTrackEl.clientHeight;

      if (
        elementTop < containerTop ||
        elementTop + elementHeight > containerTop + containerHeight
      ) {
        containerRef.current.scrollTo({
          top: elementTop - containerHeight / 2 + elementHeight / 2,
          behavior: "smooth",
        });
      }
    }
  }, [currentTrackIndex]);

  // Generate the track list (shuffled if needed)
  const trackList = isShuffled
    ? [...tracks].sort(() => Math.random() - 0.5)
    : tracks;

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div ref={containerRef} className='space-y-3 h-96 overflow-y-auto'>
      {trackList.map((track, index) => {
        const isActive = track.id === tracks[currentTrackIndex].id; // Highlight actual current track

        return (
          <div
            key={track.id}
            ref={(el) => (trackRefs.current[index] = el)}
            className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${
              isActive
                ? "bg-purple-500 text-white shadow-lg"
                : "hover:scale-[1.02] hover:bg-gray-100"
            }`}
            onClick={() =>
              onSelectTrack(tracks.findIndex((t) => t.id === track.id))
            }
          >
            {/* Thumbnail + Play Icon */}
            <div className='relative flex-shrink-0'>
              <div className='w-12 h-12 rounded-full overflow-hidden bg-gray-200'>
                <img
                  src={track.coverUrl}
                  alt={track.album}
                  className='w-full h-full object-cover'
                />
              </div>
              <div className='absolute inset-0 rounded-xl flex items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-100'>
                <Play size={16} />
              </div>
            </div>

            {/* Track Info */}
            <div
              className={`flex-1 min-w-0
                ${
                  isActive
                    ? "bg-purple-500 text-white "
                    : "hover:scale-[1.02] hover:bg-gray-100"
                }
                `}
            >
              <h4 className='font-semibold truncate'>{track.title}</h4>
              <p className='text-sm truncate'>{track.artist}</p>
            </div>

            {/* Track Duration */}
            <div
              className={`flex items-center gap-3
                ${
                  isActive
                    ? "bg-purple-500 text-white "
                    : "hover:scale-[1.02] hover:bg-gray-100"
                }
                `}
            >
              <div className='text-sm'>{formatTime(track.duration)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlayList;
