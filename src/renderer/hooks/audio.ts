import { useEffect, useRef } from 'react';
import {
  changeTimePosition,
  playNextTrack,
  setDuration,
  togglePlayPause,
} from 'renderer/features/player/playerSlice';
import {
  canPlayNextTrackSelector,
  selectCurrentTrackVerboseInfo,
} from 'renderer/store/selectors';
import { useAppDispatch, useAppSelector } from './app';

const audioObject = new Audio();
let audioPlayPromiseInit: Promise<void> | undefined;

const useAudio = () => {
  const audio = useRef(audioObject);
  const audioPlayPromise = useRef(audioPlayPromiseInit);
  const dispatch = useAppDispatch();

  const currentPlayerState = useAppSelector((state) => state.player);
  const canPlayNextTrack = useAppSelector(canPlayNextTrackSelector);
  const currentTrackInfo = useAppSelector(selectCurrentTrackVerboseInfo);

  audio.current.onloadeddata = () => {
    dispatch(setDuration(audio.current.duration));
  };

  audio.current.ontimeupdate = () => {
    const trackPos = Math.ceil(audio.current.currentTime);
    dispatch(changeTimePosition(trackPos));
  };

  useEffect(() => {
    audio.current.onended = () => {
      if (canPlayNextTrack) {
        dispatch(playNextTrack());
      } else {
        audio.current.pause();
        dispatch(togglePlayPause());
        dispatch(changeTimePosition(0));
      }
    };
  }, [canPlayNextTrack, dispatch]);

  useEffect(() => {
    audio.current.volume = currentPlayerState.volume;
  }, [currentPlayerState.volume]);

  useEffect(() => {
    if (
      currentPlayerState.currentTrackId !== null &&
      currentTrackInfo.src !== 'null'
    ) {
      audio.current.src = currentTrackInfo.src;
    }
  }, [currentPlayerState.currentTrackId, currentTrackInfo.src]);

  useEffect(() => {
    if (audio.current.paused && currentPlayerState.isPlaying) {
      audioPlayPromise.current = audio.current.play();
    } else if (!audio.current.paused && !currentPlayerState.isPlaying) {
      audio.current.pause();
    }
  }, [currentPlayerState.isPlaying, currentPlayerState.currentTrackId]);

  return audio;
};

export default useAudio;
