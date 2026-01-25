import { useState, useRef, useEffect } from "react";

type VolumeControlProps = {
  volume: number;
  onVolumeChange: (volume: number) => void;
};

const VolumeControl = ({ volume, onVolumeChange }: VolumeControlProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverVolume, setHoverVolume] = useState<number | null>(null); // store tooltip value directly
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const calculateVolume = (clientX: number) => {
    const slider = sliderRef.current;
    if (!slider) return 0;
    const rect = slider.getBoundingClientRect();
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const vol = calculateVolume(e.clientX);
    onVolumeChange(vol);
    setHoverVolume(vol);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const vol = calculateVolume(e.clientX);
    setHoverVolume(vol);

    if (isDragging) {
      onVolumeChange(vol);
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoverVolume(null);
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, [isDragging]);

  return (
    <div
      ref={sliderRef}
      className='relative w-28 h-3 bg-gray-300 rounded-full cursor-pointer'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {/* Filled bar */}
      <div
        className='absolute left-0 top-0 h-full bg-gray-600 rounded-full transition-all duration-150'
        style={{ width: `${volume * 100}%` }}
      />

      {/* Thumb */}
      <div
        className={`absolute top-1/2 w-5 h-5 bg-white border-2 border-pink-500 rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-150 ${
          isDragging ? "scale-125 shadow-pink-500/50" : "scale-100"
        }`}
        style={{ left: `calc(${volume * 100}% - 10px)` }}
      />

      {/* Tooltip */}
      {hoverVolume !== null && (
        <div
          className='absolute -top-10 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm pointer-events-none transition-all duration-100'
          style={{ left: `${hoverVolume * 100}%` }}
        >
          {Math.round(hoverVolume * 100)}%
        </div>
      )}
    </div>
  );
};

export default VolumeControl;
