import { Icon } from '@fluentui/react';
import { PlaySolidIcon } from '@fluentui/react-icons-mdl2';

export interface IAudioCard {
  audioInfo: {
    id: number;
    src: string;
    title: string;
    cover: string;
    album: string | undefined;
    artist: string | undefined;
  };
  className: string;
  active?: boolean;
  isPlaying?: boolean;
  onClickPlayPause?: () => void;
  showHoverPlay?: boolean;
}

export const AudioCard = ({
  audioInfo,
  className,
  active,
  isPlaying,
  onClickPlayPause,
  showHoverPlay,
}: IAudioCard) => {
  const onClickPlayPauseButton = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (onClickPlayPause) {
      onClickPlayPause();
    }
  };

  return (
    <div className={`audio-info ${className || ''}`}>
      <div className="player-img">
        {active ? (
          <Icon
            iconName={isPlaying ? 'CirclePause' : 'PlaySolid'}
            className="active-track-status"
            onClick={(e) => onClickPlayPauseButton(e)}
          />
        ) : null}

        <div
          className={`active-track-status hover ${showHoverPlay && 'active'}`}
        >
          <PlaySolidIcon />
        </div>
        <img alt={audioInfo.title} src={audioInfo.cover} />
      </div>

      <div className="short-info">
        <div className="audio-title">{audioInfo.title}</div>
        <div className="audio-artist-album">
          {`${audioInfo.artist} | ${audioInfo.album}`}
        </div>
      </div>
    </div>
  );
};

AudioCard.defaultProps = {
  active: undefined,
  isPlaying: false,
  onClickPlayPause: undefined,
  showHoverPlay: false,
};
