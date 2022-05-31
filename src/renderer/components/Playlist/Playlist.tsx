import {
  DragDropContext,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';

import {
  changeTrackPositionInPlaylist,
  IPlaylist,
} from 'renderer/features/library/librarySlice';
import { useAppDispatch, useAppSelector } from 'renderer/hooks/app';
import { selectMultipleTracksInfo } from 'renderer/store/selectors';
import UI from 'renderer/ui';

interface IPlaylistProps {
  playlistInfo: IPlaylist;
  isMainPlaylist?: boolean;
  allowReordering?: boolean;
  showCard?: boolean;
  actionElement?: JSX.Element;
}

const Playlist = ({
  playlistInfo,
  isMainPlaylist,
  allowReordering,
  showCard,
  actionElement,
}: IPlaylistProps) => {
  const dispatch = useAppDispatch();
  const currentPlayerState = useAppSelector((state) => state.player);
  const tracksInfo = useAppSelector(selectMultipleTracksInfo)(
    playlistInfo.trackIds
  );

  const onDragEnd = (
    { destination, source, draggableId }: DropResult,
    _: ResponderProvided
  ) => {
    if (
      !destination ||
      (destination.droppableId === source.droppableId &&
        destination.index === source.index)
    ) {
      return;
    }

    dispatch(
      changeTrackPositionInPlaylist({
        isMainPlaylist,
        prevIndex: source.index,
        newIndex: destination.index,
      })
    );
  };

  // return <DragDropContext onDragEnd={onDragEnd} />;
};
