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
import { selectTrackVerboseInfo } from 'renderer/store/selectors';
import UI from 'renderer/ui';
import handleImg from '../../../../assets/img/dots.png';
import './Playlist.scss';

interface IPlaylistProps {
  playlistInfo: IPlaylist;
  isMainPlaylist?: boolean;
  allowReordering?: boolean;
  ActionElement?: React.FC<{ playlistId?: string; trackId?: number }>;
}

export const Playlist = ({
  playlistInfo,
  isMainPlaylist,
  allowReordering,
  ActionElement,
}: IPlaylistProps) => {
  const dispatch = useAppDispatch();
  const getTrackInfo = useAppSelector(selectTrackVerboseInfo);
  const { currentTrackId, currentPlaylist, isPlaying } = useAppSelector(
    (state) => state.player
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

  const onTrackClick = (trackId: number) => {
    dispatch(
      selectPlaylist({
        id: playlistInfo.id,
        trackIds: playlistInfo.trackIds,
      })
    );
    if (currentTrackId !== trackId) {
      dispatch(selectTrack(trackId));
    } else {
      dispatch(togglePlayPause());
    }
  };

  useEffect(() => {
    if (playlistInfo.id !== 'main' && playlistInfo.id === currentPlaylist.id) {
      dispatch(
        selectPlaylist({
          id: playlistInfo.id,
          trackIds: playlistInfo.trackIds,
        })
      );
    }
  }, [currentPlaylist.id, dispatch, playlistInfo.id, playlistInfo.trackIds]);

  return (
    <>
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
                {playlistInfo.trackIds.map((trackId, index) => {
                  const trackInfo = getTrackInfo(trackId);
                  return (
                    <div
                      key={`${trackId}_${trackInfo.title}`}
                      onClick={() => onTrackClick(trackId)}
                    >
                      <Draggable
                        draggableId={`${trackId}`}
                        index={index}
                        isDragDisabled={!allowReordering}
                      >
                        {(dragProvided, dragSnapshot) => (
                          <div
                            className={`songWrapper ${
                              dragSnapshot.isDragging ? 'dragging' : ''
                            } ${index % 2 === 0 ? 'even' : 'odd'}`}
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                          >
                            <div
                              className={`${
                                allowReordering ? '' : 'hidden'
                              } dragHandle`}
                              {...dragProvided.dragHandleProps}
                            >
                              <img src={handleImg} alt="drag here" />
                            </div>
                            <UI.AudioCard
                              audioInfo={trackInfo}
                              className="audioCard"
                              active={trackId === currentTrackId}
                              isPlaying={isPlaying}
                              onClickPlayPause={() => {
                                dispatch(
                                  selectPlaylist({
                                    id: playlistInfo.id,
                                    trackIds: playlistInfo.trackIds,
                                  })
                                );
                                dispatch(togglePlayPause());
                              }}
                              showHoverPlay={trackId !== currentTrackId}
                            />
                            {ActionElement && (
                              <ActionElement
                                playlistId={playlistInfo.id}
                                trackId={trackId}
                              />
                            )}
                          </div>
                        )}
                      </Draggable>
                    </div>
                  );
                })}
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
  ActionElement: undefined,
};

export default { Playlist };
