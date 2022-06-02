/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

import { useEffect } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';
import {
  changeTrackPositionInPlaylist,
  IPlaylist,
} from 'renderer/features/library/librarySlice';
import {
  selectPlaylist,
  selectTrack,
  togglePlayPause,
} from 'renderer/features/player/playerSlice';
import { useAppDispatch, useAppSelector } from 'renderer/hooks/app';
import { selectMultipleTracksInfo } from 'renderer/store/selectors';
import UI from 'renderer/ui';

interface IPlaylistProps {
  playlistInfo: IPlaylist;
  isMainPlaylist?: boolean;
  allowReordering?: boolean;
  showCard?: boolean;
  ActionElement?: JSX.Element;
}

export const Playlist = ({
  playlistInfo,
  isMainPlaylist,
  allowReordering,
  showCard,
  ActionElement,
}: IPlaylistProps) => {
  const dispatch = useAppDispatch();
  const {
    currentTrackId: playingTrackId,
    currentPlaylist: currentlyPlayingPlaylist,
    isPlaying,
  } = useAppSelector((state) => state.player);
  const tracksInfo = useAppSelector(selectMultipleTracksInfo)(
    playlistInfo.trackIds
  );

  const onDragEnd = (
    { destination, source }: DropResult,
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
        playlistId: destination.droppableId,
        prevIndex: source.index,
        newIndex: destination.index,
      })
    );
  };

  useEffect(() => {
    if (currentlyPlayingPlaylist.id === playlistInfo.id)
      dispatch(
        selectPlaylist({
          id: playlistInfo.id,
          trackIds: playlistInfo.trackIds,
        })
      );
  }, [
    playlistInfo.trackIds,
    dispatch,
    currentlyPlayingPlaylist.id,
    playlistInfo.id,
  ]);

  const onTrackClick = (trackId: number) => {
    dispatch(
      selectPlaylist({
        id: playlistInfo.id,
        trackIds: playlistInfo.trackIds,
      })
    );
    if (playingTrackId !== trackId) {
      dispatch(selectTrack(trackId));
    } else {
      dispatch(togglePlayPause());
    }
  };

  return (
    <>
      {showCard && (
        <UI.PlaylistHeader
          cover={playlistInfo.cover}
          name={playlistInfo.name}
        />
      )}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="playlistWrapper">
          <Droppable droppableId={playlistInfo.id.toString()}>
            {(dropProvided, dropSnapshot) => (
              <div
                className={`songListWrapper ${
                  dropSnapshot.isDraggingOver ? 'dragging' : ''
                }`}
                ref={dropProvided.innerRef}
                {...dropProvided.droppableProps}
              >
                {playlistInfo.trackIds.map((trackId, index) => (
                  <div
                    key={`${trackId}_${tracksInfo[index].title}`}
                    onClick={() => onTrackClick(trackId)}
                  >
                    <Draggable draggableId={`${trackId}`} index={index}>
                      {(dragProvided, dragSnapshot) => (
                        <div
                          className={`songWrapper ${
                            dragSnapshot.isDragging ? 'dragging' : ''
                          }`}
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                        >
                          <UI.AudioCard
                            audioInfo={tracksInfo[index]}
                            className="audioCard"
                            active={trackId === playingTrackId}
                            isPlaying={isPlaying}
                            onClickPlayPause={() => {
                              dispatch(selectPlaylist(playlistInfo.trackIds));
                              dispatch(togglePlayPause());
                            }}
                            showHoverPlay={trackId !== playingTrackId}
                          />
                        </div>
                      )}
                    </Draggable>
                  </div>
                ))}
                {dropProvided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </>
  );
};

Playlist.defaultProps = {
  isMainPlaylist: false,
  allowReordering: false,
  showCard: true,
  ActionElement: <div />,
};

export default { Playlist };
