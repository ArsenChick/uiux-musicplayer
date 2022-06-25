import { createSlice } from '@reduxjs/toolkit';

export interface PlayerState {
  currentPlaylist: { id: string; trackIds: Array<number> };
  currentTrackId: null | number;
  volume: number;
  timePosInSeconds: number;
  durationInSeconds: number;
  isPlaying: boolean;
}

const initialState: PlayerState = {
  currentPlaylist: { id: 'none', trackIds: [] },
  currentTrackId: null,
  volume: 0.5,
  timePosInSeconds: 0,
  durationInSeconds: 0,
  isPlaying: false,
};

const getNewTrack = (
  { currentPlaylist, currentTrackId }: PlayerState,
  isNext = true
) => {
  const currentPlaylistPos = currentPlaylist.trackIds.findIndex(
    (trackId) => trackId === currentTrackId
  );
  const prevIndex =
    currentPlaylistPos === 0
      ? 0
      : currentPlaylist.trackIds[currentPlaylistPos - 1];
  const nextIndex =
    currentPlaylistPos === currentPlaylist.trackIds.length
      ? currentPlaylist.trackIds[currentPlaylistPos]
      : currentPlaylist.trackIds[currentPlaylistPos + 1];
  return isNext ? nextIndex : prevIndex;
};

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    selectPlaylist: (state, action) => {
      state.currentPlaylist = action.payload;
    },
    selectTrack: (state, action) => {
      state.currentTrackId = action.payload;
      state.timePosInSeconds = 0;
      state.isPlaying = true;
    },
    setDuration: (state, action) => {
      state.durationInSeconds = action.payload;
    },
    togglePlayPause: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    playNextTrack: (state) => {
      state.currentTrackId = getNewTrack(state, true);
      state.timePosInSeconds = 0;
      state.isPlaying = true;
    },
    playPrevTrack: (state) => {
      state.currentTrackId = getNewTrack(state, false);
      state.timePosInSeconds = 0;
      state.isPlaying = true;
    },
    changeTimePosition: (state, action) => {
      state.timePosInSeconds = action.payload;
    },
    changeVolume: (state, action) => {
      state.volume = action.payload;
    },
    stopPlaying: (state) => {
      state.currentPlaylist = { id: 'none', trackIds: [] };
      state.currentTrackId = null;
      state.isPlaying = false;
    },
  },
});

export const {
  selectPlaylist,
  selectTrack,
  setDuration,
  togglePlayPause,
  playNextTrack,
  playPrevTrack,
  changeTimePosition,
  changeVolume,
  stopPlaying,
} = playerSlice.actions;
export default playerSlice.reducer;
