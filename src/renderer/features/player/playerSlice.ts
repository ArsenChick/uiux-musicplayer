import { createSlice } from '@reduxjs/toolkit';

export interface PlayerState {
  currentPlaylist: Array<number>;
  currentTrackId: null | number;
  volume: number;
  timePosInSeconds: number;
  durationInSeconds: number;
  isPlaying: boolean;
}

const initialState: PlayerState = {
  currentPlaylist: [2, 0, 1],
  currentTrackId: 2,
  volume: 0.5,
  timePosInSeconds: 0,
  durationInSeconds: 0,
  isPlaying: false,
};

const getNewTrack = (state: PlayerState, isNext = true) => {
  const currentPlaylistPos = state.currentPlaylist.findIndex(
    (trackId) => trackId === state.currentTrackId
  );
  const prevIndex =
    currentPlaylistPos === 0
      ? 0
      : state.currentPlaylist[currentPlaylistPos - 1];
  const nextIndex =
    currentPlaylistPos === state.currentPlaylist?.length
      ? state.currentPlaylist[currentPlaylistPos]
      : state.currentPlaylist[currentPlaylistPos + 1];
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
      state.currentPlaylist = [];
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
