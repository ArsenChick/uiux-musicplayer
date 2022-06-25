import { useLocation } from 'react-router-dom';
import { useAppSelector } from 'renderer/hooks/app';
import { selectGenericPlaylistInfo } from 'renderer/store/selectors';
import UI from 'renderer/ui';
import { Playlist } from '../Playlist';
import './PlaylistWrapper.scss';

export const AlbumArtistPlaylist = () => {
  const playlistId = useLocation().pathname.slice(1);
  const getPlaylistInfo = useAppSelector(selectGenericPlaylistInfo);
  const playlistInfo = getPlaylistInfo(playlistId)!;

  return (
    <div className="playlistViewWrapper">
      <UI.PlaylistHeader cover={playlistInfo.cover} name={playlistInfo.name} />
      {playlistInfo.trackIds.length !== 0 ? (
        <Playlist playlistInfo={playlistInfo} />
      ) : (
        <div className="noContent">
          <p>
            I don&#39;t know how you got here? but here you are.
            <br />
            Congratulations, I guess?
          </p>
        </div>
      )}
    </div>
  );
};

export default { AlbumArtistPlaylist };
