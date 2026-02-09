import { useMemo } from 'react';
import { usePlayer } from '../context/PlayerContext';

export default function Liked() {
  const { tracks, likedIds, selectTrackByIndex } = usePlayer();

  const likedTracks = useMemo(() => {
    return tracks.filter((t) => likedIds.has(t.id));
  }, [tracks, likedIds]);

  if (likedTracks.length === 0) {
    return (
      <div className='mx-auto max-w-4xl p-6 text-white'>
        <h1 className='text-2xl font-bold mb-2'>Liked Songs</h1>
        <p className='text-white/70'>You haven’t liked any songs yet.</p>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-4xl p-6 text-white'>
      <h1 className='text-2xl font-bold mb-4'>Liked Songs</h1>

      <ul className='space-y-3'>
        {likedTracks.map((t) => (
          <li
            key={t.id}
            className='flex items-center gap-3 rounded-xl bg-white/10 p-3 hover:bg-white/15 cursor-pointer'
            onClick={() => {
              const realIndex = tracks.findIndex((x) => x.id === t.id);
              if (realIndex >= 0) selectTrackByIndex(realIndex);
            }}
          >
            <img
              src={t.coverUrl}
              alt=''
              className='h-12 w-12 rounded-lg object-cover'
              draggable={false}
            />
            <div className='min-w-0'>
              <div className='truncate font-semibold'>{t.title}</div>
              <div className='truncate text-sm text-white/70'>{t.artist}</div>
            </div>
            <div className='ml-auto text-sm text-white/70'>{t.album}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
