const ProgressBar = () => {
  return (
    <div className='relative bg-gray-300 rounded-full'>
      <div className='relative h-3 bg-white/10 rounded-full cursor-pointer group overflow-hidden'>
        {/* Progress Fill */}
        <div className='absolute left-0 top-0 h-full bg-gray-600 rounded-full transition-all duration-150 shadow-lg shadow-pink-500/50'>
          {/* Hover Preview */}
          <div className='absolute top-0 w-0.5 h-full bg-white/60 transition-all duration-150'>
            {/* Progress Thumb */}
            <div className='absolute top-1/2 w-5 h-5 bg-white rounded-full shadow-lg transform -translate-y-1/2 transition-all duration-150 border-2 border-pink-500'>
              {/* Hover Tooltip */}
              <div className='absolute -top-10 transform -translate-x-1/2 bg-black-80 text-white text-xsl px-2 py-1 rounded-lg backdrop-blur-sm'>
                Hover Time
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
