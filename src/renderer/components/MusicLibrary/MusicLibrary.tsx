import { useEffect, useRef } from 'react';
import { useBoolean } from '@fluentui/react-hooks';
import {
  ActionButton,
  CommandButton,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  DirectionalHint,
  IContextualMenuItem,
  PrimaryButton,
} from '@fluentui/react';
import { fromFileToBlobSrc, isAudioType } from 'renderer/utils';
import {
  canPlayNextTrackSelector,
  selectGenericPlaylistInfo,
} from 'renderer/store/selectors';
import {
  addTrackToLibrary,
  deleteTrackFromLibrary,
  addTrackToPlaylist,
  createTrack,
} from 'renderer/features/library/librarySlice';
import {
  playNextTrack,
  selectPlaylist,
  stopPlaying,
} from 'renderer/features/player/playerSlice';
import { fakeMainPlaylistInfo } from 'renderer/constants';
import { Playlist } from '../Playlist/Playlist';
import { useAppDispatch, useAppSelector } from '../../hooks/app';
import './MusicLibrary.scss';

const ControlElement = ({ trackId }: any) => {
  const dispatch = useAppDispatch();
  const canPlayNext = useAppSelector(canPlayNextTrackSelector);
  const { currentTrackId } = useAppSelector((state) => state.player);
  const playlists = useAppSelector((state) => state.library.playlists);
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);

  const playlistMenuItems = playlists.reduce((menuItems, playlist) => {
    if (!playlist.trackIds.includes(trackId)) {
      menuItems.push({
        key: playlist.id,
        text: playlist.name,
      });
    }
    return menuItems;
  }, new Array<IContextualMenuItem>());

  const onDeleteConfirmClick = () => {
    const shouldCorrectPlayer = trackId === currentTrackId;
    if (shouldCorrectPlayer) {
      if (canPlayNext) dispatch(playNextTrack());
      else dispatch(stopPlaying());
    }
    dispatch(deleteTrackFromLibrary(trackId));
    toggleHideDialog();
  };

  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Delete song from library?',
    subText:
      'You cannot revert this action. Are you sure you want to delete the song forever?',
  };

  const onAddToPlaylistCilck = (
    ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
    item?: IContextualMenuItem
  ) => {
    dispatch(
      addTrackToPlaylist({
        playlistId: item?.key,
        trackId,
      })
    );
  };

  return (
    <div className="songToolbar">
      <CommandButton
        disabled={playlistMenuItems.length === 0}
        iconProps={{ iconName: 'Add' }}
        menuProps={{
          items: playlistMenuItems,
          onDismiss: (ev) => ev?.stopPropagation(),
          onItemClick: onAddToPlaylistCilck,
          directionalHint: DirectionalHint.leftTopEdge,
          isBeakVisible: false,
          gapSpace: 4,
        }}
        onRenderMenuIcon={() => <div />}
        onMenuClick={(ev) => ev?.stopPropagation()}
      />
      <ActionButton
        iconProps={{ iconName: 'Delete' }}
        onClick={(ev) => {
          ev.stopPropagation();
          toggleHideDialog();
        }}
      />
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={onDeleteConfirmClick} text="OK" />
          <DefaultButton onClick={toggleHideDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export const MusicLibrary = ({ className }: any) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [errorMsg, { setTrue: showErrorMsg, setFalse: hideErrorMsg }] =
    useBoolean(false);
  const trackIds = useAppSelector((state) => state.library.mainPlaylist);
  const { currentPlaylist } = useAppSelector((state) => state.player);
  const getGenericPlaylistInfo = useAppSelector(selectGenericPlaylistInfo);
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

  useEffect(() => {
    dispatch(
      selectPlaylist({
        id: currentPlaylist.id,
        trackIds: getGenericPlaylistInfo(currentPlaylist.id)!.trackIds,
      })
    );
  }, [trackIds, dispatch, currentPlaylist.id, getGenericPlaylistInfo]);

  return (
    <div className={`${className || ''} libraryWrapper`}>
      <div className="mainPlaylistHeader">
        <h2>My Music</h2>
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
      {trackIds.length === 0 ? (
        <div className="noContent">
          <h3>You&#39;ve got no songs!</h3>
          <p>Add some music by clickng the button above</p>
        </div>
      ) : (
        <Playlist
          playlistInfo={{ ...fakeMainPlaylistInfo, trackIds }}
          isMainPlaylist
          allowReordering
          ActionElement={ControlElement}
        />
      )}
    </div>
  );
};

export default MusicLibrary;
