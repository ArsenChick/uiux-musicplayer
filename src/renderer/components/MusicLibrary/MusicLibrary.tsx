import { useRef } from 'react';
import { useBoolean } from '@fluentui/react-hooks';
import { DefaultButton } from '@fluentui/react';
import { fromFileToBlobSrc, isAudioType } from 'renderer/utils';
import {
  addTrackToLibrary,
  deleteTrackFromLibrary,
  addTrackToPlaylist,
  createTrack,
  IPlaylist,
} from 'renderer/features/library/librarySlice';
import { Playlist } from '../Playlist/Playlist';
import { useAppDispatch, useAppSelector } from '../../hooks/app';
import './MusicLibrary.scss';

export const MusicLibrary = ({ className }: any) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [errorMsg, { setTrue: showErrorMsg, setFalse: hideErrorMsg }] =
    useBoolean(false);
  const trackIds = useAppSelector((state) => state.library.mainPlaylist);
  const dispatch = useAppDispatch();

  const addTrackHandler = () => {
    const files = fileInput.current?.files;
    Array.from(files!).forEach(async (track) => {
      if (isAudioType(track)) {
        const trackSrc = await fromFileToBlobSrc(track);
        if (typeof trackSrc === 'string') {
          const trackItem = createTrack(trackSrc, track.name);
          dispatch(addTrackToLibrary(trackItem));
        } else showErrorMsg();
      } else showErrorMsg();
    });
  };

  const fakePlaylistInfo: IPlaylist = {
    id: 'main',
    name: '',
    trackIds,
    cover: '',
  };

  return (
    <div className={`${className || ''} libraryWrapper`}>
      <div className="mainPlaylistHeader">
        <h2>Music Library</h2>
        <DefaultButton
          text="Add tracks"
          iconProps={{ iconName: 'Add' }}
          onClick={() => {
            fileInput.current?.click();
          }}
        />
        <input
          type="file"
          ref={fileInput}
          multiple
          accept=".mp3"
          onChange={addTrackHandler}
        />
      </div>
      <Playlist
        playlistInfo={fakePlaylistInfo}
        isMainPlaylist
        allowReordering
        showCard={false}
      />
    </div>
  );
};

export default MusicLibrary;
