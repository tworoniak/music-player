import { useState, useRef, useEffect } from "react";

type ProgressBarProps = {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
};

const ProgressBar = ({ currentTime, duration, onSeek }: ProgressBarProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [tooltipLeft, setTooltipLeft] = useState<number | null>(null); // position in px
  const progressRef = useRef<HTMLDivElement | null>(null);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const calculateTimeAndPosition = (clientX: number) => {
    const slider = progressRef.current;
    if (!slider) return { time: 0, left: 0 };

    const rect = slider.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const time = pct * duration;
    const left = pct * rect.width;
    return { time, left };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const { time, left } = calculateTimeAndPosition(e.clientX);
    onSeek(time);
    setHoverTime(time);
    setTooltipLeft(left);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { time, left } = calculateTimeAndPosition(e.clientX);
    setHoverTime(time);
    setTooltipLeft(left);

    if (isDragging) {
      onSeek(time);
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoverTime(null);
    setTooltipLeft(null);
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div
      ref={progressRef}
      className='relative w-full h-3 rounded-full bg-gray-300 cursor-pointer'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Filled progress */}
      <div
        className='absolute left-0 top-0 h-full bg-gray-600 rounded-full transition-all duration-150'
        style={{ width: `${progressPercent}%` }}
      />

      {/* Thumb */}
      <div
        className={`absolute top-1/2 w-5 h-5 bg-white border-2 border-pink-500 rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-150 ${
          isDragging ? "scale-125 shadow-pink-500/50" : "scale-100"
        }`}
        style={{ left: `calc(${progressPercent}% - 10px)` }}
      />

      {/* Tooltip */}
      {hoverTime !== null && tooltipLeft !== null && (
        <div
          className='absolute -top-10 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm pointer-events-none transition-all duration-100'
          style={{ left: tooltipLeft }}
        >
          {formatTime(hoverTime)}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
