import { Outlet, useNavigate } from 'react-router-dom';
import MiniPlayer from '../components/player/MiniPlayer';
import { usePlayer } from '../context/PlayerContext';

export default function AppLayout() {
  const navigate = useNavigate();
  const p = usePlayer();

  return (
    <div className='min-h-screen pb-24'>
      <Outlet />

      <MiniPlayer
        title={p.currentTrack.title}
        artist={p.currentTrack.artist}
        coverUrl={p.currentTrack.coverUrl}
        isPlaying={p.isPlaying}
        onPlayPause={p.togglePlayPause}
        onNext={p.next}
        onPrev={p.previous}
        currentTime={p.currentTime}
        duration={p.duration || p.currentTrack.duration}
        onSeek={p.seek}
        onExpand={() => navigate('/now-playing')}
      />
    </div>
  );
}
