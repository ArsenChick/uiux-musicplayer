/* eslint-disable global-require */
import { createSlice } from '@reduxjs/toolkit';
import cover1 from '../../../../assets/covers/cover1.jpg';
import cover2 from '../../../../assets/covers/cover2.jpg';
import coverUnknown from '../../../../assets/covers/unknown.png';

export interface Album {
  name: string;
  cover: string;
  trackIds: Array<number>;
}

export interface Playlist {
  name: string;
  trackIds: Array<number>;
}

export interface Artist {
  name: string;
  trackIds: Array<number>;
}

export interface Track {
  id: number;
  src: string;
  title: string;
  cover: string;
  album: number;
  artist: number;
}

export interface LibraryState {
  tracks: Array<Track>;
  mainPlaylist: Array<number>;
  artists: Map<number, Artist>;
  albums: Map<number, Album>;
  playlists: Map<number, Playlist>;
}

const initialState: LibraryState = {
  tracks: [
    {
      id: 0,
      src: require('../../../../assets/audio/The Light.mp3'),
      title: 'The Light',
      cover: cover1,
      artist: 1,
      album: 1,
    },
    {
      id: 1,
      src: require('../../../../assets/audio/The Vengeful One.mp3'),
      title: 'The Vengeful One',
      cover: cover1,
      artist: 1,
      album: 1,
    },
    {
      id: 2,
      src: require('../../../../assets/audio/Torikoriko PLEASE.mp3'),
      title: 'Torikoriko PLEASE',
      cover: cover2,
      artist: 2,
      album: 2,
    },
  ],
  mainPlaylist: [0, 1, 2],
  artists: new Map([
    [0, { name: 'Unknown Artist', trackIds: [] }],
    [1, { name: 'Disturbed', trackIds: [0, 1] }],
    [2, { name: 'AZALEA', trackIds: [2] }],
  ]),
  albums: new Map([
    [0, { name: 'Unknown Album', cover: coverUnknown, trackIds: [] }],
    [1, { name: 'Immortalized', cover: cover1, trackIds: [0, 1] }],
    [2, { name: 'Torikoriko PLEASE', cover: cover2, trackIds: [2] }],
  ]),
  playlists: new Map(),
};

const deleteSongFromCollections = (
  playlist: Playlist | Album | Artist,
  id: number,
  container: Map<number, Playlist | Album | Artist>,
  idToDelete: number,
  deleteCollection = false
) => {
  const newPlaylist = playlist.trackIds.filter(
    (trackId) => trackId !== idToDelete
  );
  if (newPlaylist.length === 0 && deleteCollection && id !== 0)
    container.delete(id);
  else container.set(id, { ...playlist, trackIds: newPlaylist });
};

export const createTrack = (
  src: string,
  cover = coverUnknown,
  title = 'No Title',
  artist = 0,
  album = 0
) => ({
  src,
  cover,
  title,
  artist,
  album,
});

export const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    addTrackToLibrary: (state, action) => {
      const newId = state.tracks[state.tracks.length - 1].id + 1;
      state.tracks.push({ ...action.payload, id: newId });
      state.mainPlaylist.push(newId);
      state.artists.get(0)?.trackIds.push(newId);
    },
    deleteTrackFromLibrary: (state, action) => {
      state.tracks = state.tracks.filter(
        (track) => track.id !== action.payload
      );

      state.mainPlaylist.filter((trackId) => trackId !== action.payload);

      state.playlists.forEach((playlist, id, container) => {
        deleteSongFromCollections(playlist, id, container, action.payload);
      });

      state.albums.forEach((playlist, id, container) => {
        deleteSongFromCollections(
          playlist,
          id,
          container,
          action.payload,
          true
        );
      });

      state.artists.forEach((playlist, id, container) => {
        deleteSongFromCollections(
          playlist,
          id,
          container,
          action.payload,
          true
        );
      });
    },
    addTrackToPlaylist: (state, action) => {
      const playlist = state.playlists.get(action.payload.playlistId);
      playlist?.trackIds.push(action.payload.trackId);
    },
    deleteTrackFromPlaylist: (state, action) => {
      const playlist = state.playlists.get(action.payload.playlistId);
      playlist?.trackIds.filter((id) => id !== action.payload.trackId);
    },
    createPlaylist: (state, action) => {
      state.playlists.set(state.playlists.size, {
        name: action.payload,
        trackIds: [],
      });
    },
    deletePlaylist: (state, action) => {
      state.playlists.delete(action.payload);
    },
    changeTrackPosition: (state, action) => {
      const { trackId, newIndex } = action.payload;
      if (action.payload.isMainPlaylist) {
        const trackIndex = state.mainPlaylist.findIndex((t) => t === trackId);
        state.mainPlaylist.splice(trackIndex, 1);
        state.mainPlaylist.splice(newIndex, 0, trackId);
      } else {
        const playlist = state.playlists.get(
          action.payload.playlistId
        )?.trackIds;
        const trackIndex = playlist?.findIndex((t) => t === trackId);
        playlist?.splice(trackIndex!, 1);
        state.mainPlaylist.splice(newIndex, 0, trackId);
      }
    },
  },
});

export const {
  addTrackToLibrary,
  deleteTrackFromLibrary,
  addTrackToPlaylist,
  deleteTrackFromPlaylist,
  createPlaylist,
  deletePlaylist,
  changeTrackPosition,
} = librarySlice.actions;
export default librarySlice.reducer;
