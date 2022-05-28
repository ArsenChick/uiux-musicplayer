import { fromFileToBlobSrc, isAudioType } from 'renderer/utils';
import {
  addTrackToLibrary,
  deleteTrackFromLibrary,
  addTrackToPlaylist,
  deleteTrackFromPlaylist,
} from 'renderer/features/library/librarySlice';
import { useAppDispatch, useAppSelector } from '../../hooks/app';

// export const MusicLibrary =
