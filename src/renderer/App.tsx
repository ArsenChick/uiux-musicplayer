import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Player } from './components/Player/Player';
import { Sidebar } from './components/Sidebar/Sidebar';
import { MusicLibrary } from './components/MusicLibrary/MusicLibrary';
import { CustomPlaylist } from './components/Playlist/wrappers/CustomPlaylist';
import './App.scss';
import { fromFileToBlobSrc, isAudioType } from './utils';
import {
  addTrackToLibrary,
  createTrack,
} from './features/library/librarySlice';
import { AlbumArtistPlaylist } from './components/Playlist/wrappers/AlbumArtistPlaylist';
import { MediaGrid } from './components/MediaGrid/MediaGrid';
import { useAppSelector } from './hooks/app';

const Hello = ({ name }: any) => {
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
};

export default function App() {
  const dispatch = useDispatch();
  const [dragFile, setDragFile] = useState(false);
  const navigate = useNavigate();

  const albums = useAppSelector((state) => state.library.albums);
  const artists = useAppSelector((state) => state.library.artists);

  const dragStartHandler = (e: React.DragEvent) => {
    e.preventDefault();
    setDragFile(true);
  };

  const dragLeaveHandler = (e: React.DragEvent) => {
    e.preventDefault();
    setDragFile(false);
  };

  const dropHandler = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragFile(false);
    const trackFiles = e.dataTransfer.files;

    Array.from(trackFiles).forEach(async (track) => {
      if (isAudioType(track)) {
        const trackSrc = await fromFileToBlobSrc(track);
        if (typeof trackSrc === 'string') {
          const trackItem = createTrack(trackSrc, track.name);
          dispatch(addTrackToLibrary(trackItem));
        }
      }
    });

    navigate('/');
  };

  return (
    <>
      <Sidebar />
      {dragFile ? (
        <div
          className="dragTrackWindow"
          onDragStart={(e) => dragStartHandler(e)}
          onDragOver={(e) => dragStartHandler(e)}
          onDragLeave={(e) => dragLeaveHandler(e)}
          onDrop={(e) => dropHandler(e)}
        >
          Drag file here to add to track
        </div>
      ) : (
        <div
          className="mainViewContainer"
          onDragStart={(e) => dragStartHandler(e)}
          onDragOver={(e) => dragStartHandler(e)}
          onDragLeave={(e) => dragLeaveHandler(e)}
        >
          <Routes>
            <Route path="/" element={<MusicLibrary />} />
            <Route path="albums">
              <Route
                index
                element={<MediaGrid header="Albums" items={albums} />}
              />
              <Route path=":albumId" element={<AlbumArtistPlaylist />} />
            </Route>
            <Route path="artists">
              <Route
                index
                element={<MediaGrid header="Artists" items={artists} />}
              />
              <Route path=":artistId" element={<AlbumArtistPlaylist />} />
            </Route>
            <Route path="playlists">
              <Route path=":playlistId" element={<CustomPlaylist />} />
            </Route>
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
        </div>
      )}

      <Player />
    </>
  );
}
