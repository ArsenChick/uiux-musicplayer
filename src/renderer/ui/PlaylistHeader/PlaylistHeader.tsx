import './PlaylistHeader.scss';

export interface IPlaylistHeaderProps {
  cover: string;
  name: string;
}

export const PlaylistHeader = ({ cover, name }: IPlaylistHeaderProps) => {
  return (
    <div className="playlistHeaderWrapper">
      <img src={cover} alt={`${name} album cover`} />
      <h3>{name}</h3>
    </div>
  );
};

export default PlaylistHeader;
