import { createSelector } from '@reduxjs/toolkit';
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

export const selectTracks = (state: AppState) => state.library.tracks;
export const selectArtists = (state: AppState) => state.library.artists;
export const selectAlbums = (state: AppState) => state.library.albums;
export const selectPlaylists = (state: AppState) => state.library.playlists;

export const selectTrackInfo = createSelector(
  selectTracks,
  (tracks) => (trackId: number) => tracks.find((t) => t.id === trackId)
);

export const selectArtistInfo = createSelector(
  selectArtists,
  (artists) => (artistId: number) => artists.get(artistId)
);

export const selectAlbumInfo = createSelector(
  selectAlbums,
  (albums) => (albumId: number) => albums.get(albumId)
);

export const selectPlaylistInfo = createSelector(
  selectPlaylists,
  (playlists) => (playlistId: number) => playlists.get(playlistId)
);

export const selectCurrentTrackInfo = createSelector(
  selectCurrentTrack,
  selectTrackInfo,
  selectAlbumInfo,
  selectArtistInfo,
  (id, getTrackInfo, getAlbumInfo, getArtistInfo) => {
    if (id) {
      const trackInfo = getTrackInfo(id);
      const albumName = getAlbumInfo(trackInfo!.album)?.name;
      const artistName = getArtistInfo(trackInfo!.artist)?.name;
      return {
        ...trackInfo,
        album: albumName,
        artist: artistName,
      };
    }
    return null;
  }
);
