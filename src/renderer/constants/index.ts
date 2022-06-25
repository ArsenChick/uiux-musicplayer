import { IPlaylist } from 'renderer/features/library/librarySlice';

export const fakeMainPlaylistInfo: IPlaylist = {
  id: 'main',
  name: '',
  trackIds: [],
  cover: '',
};

export const fakeAAPlaylistInfo: IPlaylist = {
  id: 'type-error',
  name: '',
  trackIds: [],
  cover: '',
};

export const nullPlaylistInfo: IPlaylist = {
  id: 'none',
  name: '',
  trackIds: [],
  cover: '',
};
