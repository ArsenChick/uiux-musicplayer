/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { CompoundButton } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import { IPlaylist } from 'renderer/features/library/librarySlice';
import './MediaGrid.scss';

export const MediaGrid = ({
  className,
  header,
  items,
}: {
  className?: string;
  header: string;
  items: IPlaylist[];
}) => {
  const navigate = useNavigate();
  const gridItems = items.reduce((gridItemsContainer, playlist, index) => {
    if (index !== 0 || playlist.trackIds.length !== 0) {
      gridItemsContainer.push(
        <div
          className="gridItemWrapper"
          key={playlist.id}
          onClick={() => navigate(`/${playlist.id}`)}
        >
          <img src={playlist.cover} alt={`${playlist.name} album cover`} />
          <div className="albumName">{playlist.name}</div>
        </div>
      );
    }
    return gridItemsContainer;
  }, new Array<JSX.Element>());

  return (
    <div className={`${className || ''} gridWrapper`}>
      <div className="gridHeader">
        <h2>{header}</h2>
      </div>
      {gridItems.length === 0 ? (
        <div className="noContent">
          <p>
            No song collections were found! Maybe adding some tracks will help?
          </p>
          <CompoundButton
            text="Add some tracks"
            secondaryText="Go to My Music"
            iconProps={{ iconName: 'MusicInCollection' }}
            onClick={() => navigate('/')}
          />
        </div>
      ) : (
        <div className="gridContainer">
          <div className="gridContent">{gridItems}</div>
        </div>
      )}
    </div>
  );
};

MediaGrid.defaultProps = {
  className: '',
};

export default { MediaGrid };
