import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='min-h-screen bg-photo-gradient text-white p-8'>
      <div className='mx-auto max-w-4xl'>
        <h1 className='text-3xl font-bold'>Music Player</h1>
        <p className='mt-2 text-white/70'>
          A React + TypeScript music player with Media Session + Mini-player.
        </p>

        <div className='mt-6 flex gap-3'>
          <Link
            to='/now-playing'
            className='rounded-xl bg-white/10 px-4 py-2 hover:bg-white/20'
          >
            Open Now Playing
          </Link>
        </div>
      </div>
    </div>
  );
}
