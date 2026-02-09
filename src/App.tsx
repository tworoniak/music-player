import { Navigate, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NowPlaying from './pages/NowPlaying';
import Liked from './pages/Liked';
import AppLayout from './layouts/AppLayout';
import { PlayerProvider } from './context/PlayerProvider';

export default function App() {
  return (
    <PlayerProvider>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/now-playing' element={<NowPlaying />} />
          <Route path='/liked' element={<Liked />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Route>
      </Routes>
    </PlayerProvider>
  );
}
