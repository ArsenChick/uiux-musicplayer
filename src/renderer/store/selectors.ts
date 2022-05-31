import { createSelector } from '@reduxjs/toolkit';
import { IPlaylist, ITrack } from 'renderer/features/library/librarySlice';
import { AppState } from '.';

const selectCurrentPlaylist = (state: AppState) => state.player.currentPlaylist;
const selectCurrentTrack = (state: AppState) => state.player.currentTrackId;

const selectCurrentTrackIndex = createSelector(
  selectCurrentPlaylist,
  selectCurrentTrack,
  (list, track) => {
    return list.findIndex((t) => t === track);
  }
);

export const canPlayPrevTrackSelector = createSelector(
  selectCurrentTrackIndex,
  (i) => i > 0
);

export const canPlayNextTrackSelector = createSelector(
  selectCurrentTrackIndex,
  selectCurrentPlaylist,
  (i, list) => i < list.length - 1
);

const selectTracks = (state: AppState) => state.library.tracks;
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
    artists.find((playlist) => playlist.id === artistId)
);

export const selectAlbumInfo = createSelector(
  selectAlbums,
  (albums) => (albumId: number) =>
    albums.find((playlist) => playlist.id === albumId)
);

export const selectPlaylistInfo = createSelector(
  selectPlaylists,
  (playlists) => (playlistId: number) =>
    playlists.find((playlist) => playlist.id === playlistId)
);

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

export const selectCurrentTrackInfo = createSelector(
  selectCurrentTrack,
  selectTrackInfo,
  selectAlbumInfo,
  selectArtistInfo,
  (id, getTrackInfo, getAlbumInfo, getArtistInfo) => {
    if (id !== null)
      return getTrackVerboseInfo(id, getTrackInfo, getAlbumInfo, getArtistInfo);
    return null;
  }
);

export const selectMultipleTracksInfo = createSelector(
  selectTrackInfo,
  selectAlbumInfo,
  selectArtistInfo,
  (getTrackInfo, getAlbumInfo, getArtistInfo) => (tracks: Array<number>) => {
    return tracks.map((id) =>
      getTrackVerboseInfo(id, getTrackInfo, getAlbumInfo, getArtistInfo)
    );
  }
);
