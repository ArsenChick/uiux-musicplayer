import {
  ActionButton,
  CompoundButton,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
} from '@fluentui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBoolean } from '@fluentui/react-hooks';
import { useAppDispatch, useAppSelector } from 'renderer/hooks/app';
import {
  deletePlaylist,
  deleteTrackFromPlaylist,
} from 'renderer/features/library/librarySlice';
import {
  playNextTrack,
  stopPlaying,
} from 'renderer/features/player/playerSlice';
import {
  canPlayNextTrackSelector,
  selectPlaylistInfo,
} from 'renderer/store/selectors';
import UI from 'renderer/ui';
import { Playlist } from '../Playlist';
import './PlaylistWrapper.scss';

const DeleteButton = ({ playlistId, trackId }: any) => {
  const dispatch = useAppDispatch();
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const canPlayNext = useAppSelector(canPlayNextTrackSelector);
  const { currentTrackId, currentPlaylist } = useAppSelector(
    (state) => state.player
  );

  const onDeleteConfirmClick = () => {
    if (playlistId === currentPlaylist.id && trackId === currentTrackId)
      if (canPlayNext) dispatch(playNextTrack());
      else dispatch(stopPlaying());
    dispatch(deleteTrackFromPlaylist({ playlistId, trackId }));
    toggleHideDialog();
  };

  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Remove song from playlist?',
    subText: 'Are you sure you want to remove this song from the playlist?',
  };

  return (
    <div className="songToolbar">
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
      <ActionButton
        iconProps={{ iconName: 'Cancel' }}
        onClick={(ev) => {
          ev.stopPropagation();
          toggleHideDialog();
        }}
      />
    </div>
  );
};

export const CustomPlaylist = () => {
  const playlistId = useLocation().pathname.slice(1);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const getPlaylistInfo = useAppSelector(selectPlaylistInfo);
  const { currentPlaylist } = useAppSelector((state) => state.player);
  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);

  const numericalId = playlistId.split('/', 2)[1];
  const playlistInfo = getPlaylistInfo(Number(numericalId))!;

  const onGoToLibraryClick = () => {
    navigate('/');
  };

  const onDeletePlaylist = () => {
    if (currentPlaylist.id === playlistId) dispatch(stopPlaying());
    dispatch(deletePlaylist(playlistId));
    toggleHideDialog();
    navigate('/');
  };

  const dialogContentProps = {
    type: DialogType.normal,
    title: 'Delete?',
    subText:
      'You cannot revert this action. Are you sure you want to delete the playlist?',
  };

  return (
    <div className="playlistViewWrapper">
      <UI.PlaylistHeader
        cover={playlistInfo.cover}
        name={playlistInfo.name}
        DeleteElement={
          <ActionButton
            text="Delete playlist"
            iconProps={{ iconName: 'Delete' }}
            onClick={toggleHideDialog}
          />
        }
      />
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
      >
        <DialogFooter>
          <PrimaryButton onClick={onDeletePlaylist} text="OK" />
          <DefaultButton onClick={toggleHideDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
      {playlistInfo.trackIds.length !== 0 ? (
        <Playlist
          playlistInfo={playlistInfo!}
          allowReordering
          ActionElement={DeleteButton}
        />
      ) : (
        <div className="noContent">
          <p>What is a playlist without music?</p>
          <CompoundButton
            text="Pick and add some"
            secondaryText="Go to My Music"
            iconProps={{ iconName: 'MultiSelect' }}
            onClick={onGoToLibraryClick}
          />
        </div>
      )}
    </div>
  );
};

export default { CustomPlaylist };
