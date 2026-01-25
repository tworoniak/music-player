import { Play } from "lucide-react";

const PlayList = () => {
  return (
    <div
      className={`group flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className='relative flex-shrink-0'>
        <div className='w-12 h-12 rounded-full overflow-hidden'>
          <h2>Image</h2>
        </div>
        {/* Play Pause Overlay  */}
        <div
          className={`absolute inset-0 rounded-xl flex items-center justify-center transition-all duration-300`}
        >
          <Play size={16} />
        </div>
      </div>
      <div className='flex-1 min-w-o'>
        <h4>Track Title</h4>
        <p>Track Artist</p>
      </div>
      {/* Time Duration */}
      <div className='flex items-center gap-3'>
        <div>Track Duration</div>
      </div>
    </div>
  );
};

export default PlayList;
