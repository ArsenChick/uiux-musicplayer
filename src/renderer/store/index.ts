import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
} from '@reduxjs/toolkit';
import playerReducer, { PlayerState } from '../features/player/playerSlice';
import playlistsReducer, {
  LibraryState,
} from '../features/library/librarySlice';

export interface AppState {
  player: PlayerState;
  library: LibraryState;
}

export const store = configureStore({
  reducer: combineReducers({
    player: playerReducer,
    library: playlistsReducer,
  }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
