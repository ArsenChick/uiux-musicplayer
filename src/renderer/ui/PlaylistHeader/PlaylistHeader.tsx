import './PlaylistHeader.scss';

export interface IPlaylistHeaderProps {
  cover: string;
  name: string;
  className?: string;
  DeleteElement?: JSX.Element;
}

export const PlaylistHeader = ({
  cover,
  name,
  className,
  DeleteElement,
}: IPlaylistHeaderProps) => {
  return (
    <div className={`${className} playlistHeaderWrapper`}>
      <img src={cover} alt={`${name} album cover`} />
      <div className="playlistInfo">
        <h2>{name}</h2>
        {DeleteElement}
      </div>
    </div>
  );
};

PlaylistHeader.defaultProps = {
  className: '',
  DeleteElement: undefined,
};

export default PlaylistHeader;
