import { useEffect, useState } from 'react';
import { Icon, IconButton, Slider } from '@fluentui/react';

import { useAppDispatch, useAppSelector } from 'renderer/hooks/app';
import useAudio from 'renderer/hooks/audio';
import {
  canPlayNextTrackSelector,
  canPlayPrevTrackSelector,
  selectCurrentTrackInfo,
} from 'renderer/store/selectors';
import {
  changeTimePosition,
  changeVolume,
  playNextTrack,
  playPrevTrack,
  togglePlayPause,
} from 'renderer/features/player/playerSlice';
import {
  fromSecondsToFormattedTime,
  getVolumeIconName,
  toPercentString,
} from 'renderer/utils';
import UI from 'renderer/ui';

export const Player = ({ className }: any) => {
  const audio = useAudio();
  const dispatch = useAppDispatch();

  const [currentTrackPosUX, setCurrentTrackPosUX] = useState(0);
  const [isUserSeekingPos, setUserSeekingPos] = useState(false);

  const currentPlayerState = useAppSelector((state) => state.player);
  const currentTrackInfo = useAppSelector(selectCurrentTrackInfo);
  const canPlayNextTrack = useAppSelector(canPlayNextTrackSelector);
  const canPlayPrevTrack = useAppSelector(canPlayPrevTrackSelector);

  useEffect(() => {
    if (!isUserSeekingPos)
      setCurrentTrackPosUX(currentPlayerState.timePosInSeconds);
  }, [currentPlayerState.timePosInSeconds, isUserSeekingPos]);

  useEffect(() => {
    const spaceListenter = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        dispatch(togglePlayPause());
      }
    };
    window.addEventListener('keydown', spaceListenter);
    return () => window.removeEventListener('keydown', spaceListenter);
  });

  const onClickPlayPauseButton = () => {
    dispatch(togglePlayPause());
  };

  const onSeekingNewPos = (timePos: number) => {
    setUserSeekingPos(true);
    setCurrentTrackPosUX(timePos);
  };

  const onChangedCurrentPos = (_: any, newTimePos: number) => {
    setUserSeekingPos(false);
    audio.current.currentTime = newTimePos;
    dispatch(changeTimePosition(newTimePos));
  };

  const onChangeVolume = (vol: number) => {
    dispatch(changeVolume(vol));
  };

  const onSelectNextTrack = () => {
    if (canPlayNextTrack) {
      dispatch(playNextTrack());
    }
  };

  const onSelectPrevTrack = () => {
    if (canPlayPrevTrack) {
      dispatch(playPrevTrack());
    }
  };

  return (
    <div className={`${className || ''} player-wrapper`}>
      {currentPlayerState.currentTrackId !== null ? (
        <div className="player-content">
          <UI.AudioCard
            className="player-audio-short-info"
            audioInfo={currentTrackInfo!}
          />

          <div className="play-area">
            <div className="control-panel">
              <IconButton
                iconProps={{ iconName: 'Previous' }}
                onClick={onSelectPrevTrack}
                disabled={!canPlayPrevTrack}
              />
              <IconButton
                iconProps={
                  currentPlayerState.isPlaying
                    ? { iconName: 'Pause' }
                    : { iconName: 'PlaySolid' }
                }
                onClick={onClickPlayPauseButton}
              />
              <IconButton
                iconProps={{ iconName: 'Next' }}
                onClick={onSelectNextTrack}
                disabled={!canPlayNextTrack}
              />
            </div>

            <div className="track-timeline">
              <Slider
                min={0}
                max={Math.ceil(currentPlayerState.durationInSeconds)}
                step={1}
                value={
                  isUserSeekingPos
                    ? currentTrackPosUX
                    : currentPlayerState.timePosInSeconds
                }
                onChange={onSeekingNewPos}
                onChanged={onChangedCurrentPos}
                valueFormat={fromSecondsToFormattedTime}
              />
            </div>
          </div>

          <div className="volume-editor">
            <Icon iconName={getVolumeIconName(currentPlayerState.volume)} />
            <Slider
              className="volume-slider"
              min={0}
              max={1}
              step={0.01}
              value={currentPlayerState.volume}
              onChange={onChangeVolume}
              valueFormat={toPercentString}
            />
          </div>
        </div>
      ) : (
        <div className="no-track-message">
          It&#39;s quiet here... Choose any track to listen to!
        </div>
      )}
    </div>
  );
};

export default Player;
