/* eslint-disable global-require */
import { createSlice } from '@reduxjs/toolkit';
import cover1 from '../../../../assets/covers/cover1.jpg';
import cover2 from '../../../../assets/covers/cover2.jpg';
import coverUnknown from '../../../../assets/covers/unknown.png';

export interface IPlaylist {
  id: string;
  name: string;
  cover: string;
  trackIds: Array<number>;
}

export interface ITrack {
  id: number;
  src: string;
  title: string;
  cover: string;
  album: number;
  artist: number;
}

export interface LibraryState {
  tracks: Array<ITrack>;
  mainPlaylist: Array<number>;
  artists: Array<IPlaylist>;
  albums: Array<IPlaylist>;
  playlists: Array<IPlaylist>;
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
  artists: [
    {
      id: 'artists/0',
      name: 'Unknown Artist',
      cover: coverUnknown,
      trackIds: [],
    },
    { id: 'artists/1', name: 'Disturbed', cover: cover1, trackIds: [0, 1] },
    { id: 'artists/2', name: 'AZALEA', cover: cover2, trackIds: [2] },
  ],
  albums: [
    {
      id: 'albums/0',
      name: 'Unknown Album',
      cover: coverUnknown,
      trackIds: [],
    },
    { id: 'albums/1', name: 'Immortalized', cover: cover1, trackIds: [0, 1] },
    {
      id: 'albums/2',
      name: 'Torikoriko PLEASE',
      cover: cover2,
      trackIds: [2],
    },
  ],
  playlists: [
    {
      id: 'playlists/0',
      name: 'Test Playlist',
      cover: coverUnknown,
      trackIds: [0, 2, 1],
    },
  ],
};

const deleteSongFromCollections = (
  result: Array<IPlaylist>,
  playlist: IPlaylist,
  id: number,
  idToDelete: number,
  deleteCollection = false
) => {
  const newPlaylist = playlist.trackIds.filter(
    (trackId) => trackId !== idToDelete
  );
  if (id === 0 || newPlaylist.length !== 0 || !deleteCollection)
    result.push({ ...playlist, trackIds: newPlaylist });
  return result;
};

export const createTrack = (
  src: string,
  title = 'No Title',
  cover = coverUnknown,
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
      state.artists[0].trackIds.push(newId);
      state.albums[0].trackIds.push(newId);
    },
    deleteTrackFromLibrary: (state, action) => {
      state.tracks = state.tracks.filter(
        (track) => track.id !== action.payload
      );

      state.mainPlaylist = state.mainPlaylist.filter(
        (trackId) => trackId !== action.payload
      );

      state.playlists = state.playlists.reduce(
        (array, playlist, id) =>
          deleteSongFromCollections(array, playlist, id, action.payload),
        new Array<IPlaylist>()
      );

      state.albums = state.albums.reduce(
        (array, playlist, id) =>
          deleteSongFromCollections(array, playlist, id, action.payload, true),
        new Array<IPlaylist>()
      );

      state.artists = state.artists.reduce(
        (array, playlist, id) =>
          deleteSongFromCollections(array, playlist, id, action.payload, true),
        new Array<IPlaylist>()
      );
    },
    addTrackToPlaylist: (state, action) => {
      const playlistToAddTo = state.playlists.find(
        (playlist) => playlist.id === action.payload.playlistId
      )!;
      playlistToAddTo.trackIds.push(action.payload.trackId);
    },
    deleteTrackFromPlaylist: (state, action) => {
      const playlistToDeleteFrom = state.playlists.find(
        (playlist) => playlist.id === action.payload.playlistId
      )!;
      playlistToDeleteFrom.trackIds = playlistToDeleteFrom.trackIds.filter(
        (id) => id !== action.payload.trackId
      );
    },
    createPlaylist: (state, action) => {
      const { length } = state.playlists;
      const newId =
        length === 0
          ? 0
          : Number(state.playlists[length - 1].id.split('/', 2)[1]) + 1;
      state.playlists.push({
        id: `playlists/${newId}`,
        name: action.payload,
        cover: coverUnknown,
        trackIds: [],
      });
    },
    deletePlaylist: (state, action) => {
      state.playlists = state.playlists.filter(
        (track) => track.id !== action.payload
      );
    },
    changeTrackPositionInPlaylist: (state, action) => {
      const { prevIndex, newIndex } = action.payload;
      if (action.payload.isMainPlaylist) {
        const trackId = state.mainPlaylist.splice(prevIndex, 1)[0];
        state.mainPlaylist.splice(newIndex, 0, trackId);
      } else {
        const playlistToEdit = state.playlists.find(
          (playlist) => playlist.id === action.payload.playlistId
        )?.trackIds;
        const trackId = playlistToEdit?.splice(prevIndex, 1)[0];
        playlistToEdit?.splice(newIndex, 0, trackId!);
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
  changeTrackPositionInPlaylist,
} = librarySlice.actions;
export default librarySlice.reducer;
