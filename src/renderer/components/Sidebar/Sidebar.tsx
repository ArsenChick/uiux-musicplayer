import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  INavLink,
  INavLinkGroup,
  IRenderGroupHeaderProps,
  Nav,
  PrimaryButton,
  TextField,
} from '@fluentui/react';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBoolean } from '@fluentui/react-hooks';

import { useAppDispatch, useAppSelector } from 'renderer/hooks/app';
import { createPlaylist } from 'renderer/features/library/librarySlice';

export const Sidebar = ({ className }: any) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [hideDialog, { toggle: toggleHideDialog }] = useBoolean(true);
  const [playlistName, setPlaylistName] = useState('');
  const [error, setError] = useState(false);

  const dispatch = useAppDispatch();
  const playlists = useAppSelector((state) => state.library.playlists);

  const navLinkGroups: INavLinkGroup[] = [
    {
      name: 'Library',
      links: [
        {
          name: 'Music',
          url: '/',
          icon: 'MusicInCollection',
          key: '',
        },
        {
          name: 'Artists',
          url: '/artists',
          icon: 'Contact',
          key: 'artists',
        },
        {
          name: 'Albums',
          url: '/albums',
          icon: 'Album',
          key: 'albums',
        },
      ],
    },
  ];
  const navPlaylistGroup: INavLinkGroup = {
    name: 'Playlists',
    links: [],
  };

  playlists.forEach((playlist, id) => {
    navPlaylistGroup.links.push({
      name: playlist.name,
      url: `/playlists/${id}`,
      key: `playlists/${id}`,
    });
  });
  navPlaylistGroup.links.push({
    name: 'Add a playlist',
    url: '#',
    icon: 'Add',
    key: 'add',
  });
  navLinkGroups.push(navPlaylistGroup);

  const onLinkClick = (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
    ev?.preventDefault();
    if (item) {
      switch (item.key) {
        case 'add': {
          toggleHideDialog();
          break;
        }
        default: {
          navigate(item.key ? item.key : '/');
        }
      }
    }
  };

  const onNameChange = (
    _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newName?: string
  ) => {
    if (newName === '') setError(true);
    else setError(false);
    setPlaylistName(newName!);
  };

  const onRenderGroupHeader = (props?: IRenderGroupHeaderProps) => {
    return <h3>{props?.name}</h3>;
  };

  const onSubmitCreation = () => {
    if (playlistName === '') {
      setError(true);
    } else {
      dispatch(createPlaylist(playlistName));
      setPlaylistName('');
      toggleHideDialog();
    }
  };

  const dialogContentProps = {
    type: DialogType.largeHeader,
    title: 'Create a playlist',
    subText: 'Please provide a name for your playlist',
  };

  return (
    <>
      <div className={`${className} sidebar-wrapper`}>
        <Nav
          onLinkClick={onLinkClick}
          selectedKey={location.pathname.slice(1)}
          onRenderGroupHeader={onRenderGroupHeader}
          groups={navLinkGroups}
        />
      </div>
      <Dialog
        hidden={hideDialog}
        onDismiss={toggleHideDialog}
        dialogContentProps={dialogContentProps}
      >
        <TextField
          value={playlistName}
          placeholder={`e.g. "Feel-Good Mix"`}
          onChange={onNameChange}
          errorMessage={error ? 'You must provide a name' : undefined}
        />
        <DialogFooter>
          <PrimaryButton onClick={onSubmitCreation} text="Create" />
          <DefaultButton onClick={toggleHideDialog} text="Cancel" />
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default { Sidebar };
