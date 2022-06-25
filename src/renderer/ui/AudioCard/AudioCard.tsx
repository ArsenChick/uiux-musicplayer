import { Icon } from '@fluentui/react';
import { PlaySolidIcon } from '@fluentui/react-icons-mdl2';

import './AudioCard.scss';

export interface IAudioCard {
  audioInfo: {
    id: number;
    src: string;
    title: string;
    cover: string;
    album: string | undefined;
    artist: string | undefined;
  };
  className?: string;
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
    <div className={`audioCard ${className}`}>
      <div className="playerImg">
        {active ? (
          <Icon
            iconName={isPlaying ? 'Pause' : 'PlaySolid'}
            className="activeTrackStatus"
            onClick={(e) => onClickPlayPauseButton(e)}
          />
        ) : null}

        <div className={`activeTrackStatus hover ${showHoverPlay && 'active'}`}>
          <PlaySolidIcon />
        </div>
        <img alt={audioInfo.title} src={audioInfo.cover} />
      </div>

      <div className="shortInfo">
        <div className="songTitle">{audioInfo.title}</div>
        <div className="songArtistAlbum">
          {`${audioInfo.artist} | ${audioInfo.album}`}
        </div>
      </div>
    </div>
  );
};

AudioCard.defaultProps = {
  className: '',
  active: undefined,
  isPlaying: false,
  onClickPlayPause: undefined,
  showHoverPlay: false,
};
