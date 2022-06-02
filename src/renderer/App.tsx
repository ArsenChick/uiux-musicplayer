import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Player } from './components/Player/Player';
import { Playlist } from './components/Playlist/Playlist';
import { Sidebar } from './components/Sidebar/Sidebar';
import { MusicLibrary } from './components/MusicLibrary/MusicLibrary';
import './App.scss';
import { useAppSelector } from './hooks/app';
import {
  selectAlbumInfo,
  selectArtistInfo,
  selectPlaylistInfo,
} from './store/selectors';
import { IPlaylist } from './features/library/librarySlice';

const Hello = ({ name }: any) => {
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
};

const PlaylistWrapper = () => {
  const location = useLocation();
  const [type, id] = location.pathname.slice(1).split('/', 2);

  const getArtistInfo = useAppSelector(selectArtistInfo);
  const getAlbumInfo = useAppSelector(selectAlbumInfo);
  const getPlaylistInfo = useAppSelector(selectPlaylistInfo);

  let playlistInfo: IPlaylist | undefined;
  let allowReordering: boolean;
  switch (type) {
    case 'artists': {
      playlistInfo = getArtistInfo(Number(id));
      allowReordering = false;
      break;
    }
    case 'albums': {
      playlistInfo = getAlbumInfo(Number(id));
      allowReordering = false;
      break;
    }
    case 'playlists': {
      playlistInfo = getPlaylistInfo(Number(id));
      allowReordering = true;
      break;
    }
    default: {
      return <Navigate to="/" replace />;
    }
  }

  return (
    <Playlist
      playlistInfo={playlistInfo!}
      allowReordering={allowReordering}
      showCard
    />
  );
};

export default function App() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<MusicLibrary />} />
        <Route path="albums" element={<Hello name="Albums" />} />
        <Route path="artists" element={<Hello name="Artists" />} />
        <Route path="playlists">
          <Route path=":playlistId" element={<PlaylistWrapper />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Player />
    </>
  );
}
