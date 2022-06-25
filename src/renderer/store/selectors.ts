import { createSelector } from '@reduxjs/toolkit';
import { fakeMainPlaylistInfo, nullPlaylistInfo } from 'renderer/constants';
import { IPlaylist, ITrack } from 'renderer/features/library/librarySlice';
import { AppState } from '.';

const selectCurrentPlaylist = (state: AppState) => state.player.currentPlaylist;
const selectCurrentTrack = (state: AppState) => state.player.currentTrackId;

const selectCurrentTrackIndex = createSelector(
  selectCurrentPlaylist,
  selectCurrentTrack,
  (list, track) => {
    return list.trackIds.findIndex((t) => t === track);
  }
);

export const canPlayPrevTrackSelector = createSelector(
  selectCurrentTrackIndex,
  (i) => i > 0
);

export const canPlayNextTrackSelector = createSelector(
  selectCurrentTrackIndex,
  selectCurrentPlaylist,
  (i, list) => i < list.trackIds.length - 1
);

const selectTracks = (state: AppState) => state.library.tracks;
const selectMainPlaylist = (state: AppState) => state.library.mainPlaylist;
const selectArtists = (state: AppState) => state.library.artists;
const selectAlbums = (state: AppState) => state.library.albums;
const selectPlaylists = (state: AppState) => state.library.playlists;

export const selectTrackInfo = createSelector(
  selectTracks,
  (tracks) => (trackId: number) => tracks.find((t) => t.id === trackId)
);

export const selectArtistInfo = createSelector(
  selectArtists,
  (artists) => (artistId: number) =>
    artists.find((playlist) => playlist.id === `artists/${artistId}`)
);

export const selectAlbumInfo = createSelector(
  selectAlbums,
  (albums) => (albumId: number) =>
    albums.find((playlist) => playlist.id === `albums/${albumId}`)
);

export const selectPlaylistInfo = createSelector(
  selectPlaylists,
  (playlists) => (playlistId: number) =>
    playlists.find((playlist) => playlist.id === `playlists/${playlistId}`)
);

export const selectGenericPlaylistInfo = createSelector(
  selectMainPlaylist,
  selectAlbumInfo,
  selectArtistInfo,
  selectPlaylistInfo,
  (mainPlylistTrackIds, getAlbumInfo, getArtistInfo, getPlaylistInfo) =>
    (playlistId: string) => {
      const [type, numericalId] = playlistId.split('/', 2);
      switch (type) {
        case 'main':
          return { ...fakeMainPlaylistInfo, trackIds: mainPlylistTrackIds };
        case 'albums':
          return getAlbumInfo(Number(numericalId));
        case 'artists':
          return getArtistInfo(Number(numericalId));
        case 'playlists':
          return getPlaylistInfo(Number(numericalId));
        default:
          return nullPlaylistInfo;
      }
    }
);

export interface ITrackVerboseInfo {
  album: string | undefined;
  artist: string | undefined;
  id: number;
  src: string;
  title: string;
  cover: string;
}

const getTrackVerboseInfo = (
  id: number,
  getTrackInfo: (trackId: number) => ITrack | undefined,
  getAlbumInfo: (albumId: number) => IPlaylist | undefined,
  getArtistInfo: (artistId: number) => IPlaylist | undefined
) => {
  const trackInfo = getTrackInfo(id)!;
  const albumName = getAlbumInfo(trackInfo.album)?.name;
  const artistName = getArtistInfo(trackInfo.artist)?.name;
  return {
    ...trackInfo,
    album: albumName,
    artist: artistName,
  };
};

export const selectTrackVerboseInfo = createSelector(
  selectTrackInfo,
  selectAlbumInfo,
  selectArtistInfo,
  (getTrackInfo, getAlbumInfo, getArtistInfo) =>
    (id: number): ITrackVerboseInfo => {
      return getTrackVerboseInfo(id, getTrackInfo, getAlbumInfo, getArtistInfo);
    }
);

export const selectCurrentTrackVerboseInfo = createSelector(
  selectCurrentTrack,
  selectTrackVerboseInfo,
  (id, getTrackInfo): ITrackVerboseInfo => {
    if (id !== null) return getTrackInfo(id);
    return {
      id: -1,
      title: 'null',
      src: 'null',
      cover: 'null',
      album: undefined,
      artist: undefined,
    };
  }
);

// export const selectPlaylistsWithoutTrack = createSelector(
//   selectPlaylists,
//   (playlists) => (trackId: number) => {
//     return playlists.filter((playlist) => !playlist.trackIds.includes(trackId));
//   }
// );
