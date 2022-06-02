import { registerIcons } from '@fluentui/react';
import {
  MusicInCollectionIcon,
  ContactIcon,
  StorageOpticalIcon,
  AddIcon,
  PlaySolidIcon,
  PauseIcon,
  PreviousIcon,
  NextIcon,
  Volume0Icon,
  Volume1Icon,
  Volume2Icon,
  Volume3Icon,
  CirclePauseSolidIcon,
} from '@fluentui/react-icons-mdl2';
// import { initializeIcons } from '@fluentui/react';

registerIcons({
  icons: {
    MusicInCollection: <MusicInCollectionIcon />,
    Contact: <ContactIcon />,
    Album: <StorageOpticalIcon />,
    Add: <AddIcon />,
    Play: <PlaySolidIcon />,
    Pause: <PauseIcon />,
    Previous: <PreviousIcon />,
    Next: <NextIcon />,
    Volume0: <Volume0Icon />,
    Volume1: <Volume1Icon />,
    Volume2: <Volume2Icon />,
    Volume3: <Volume3Icon />,
    PlaySolid: <PlaySolidIcon />,
    CirclePause: <CirclePauseSolidIcon />,
  },
});

// initializeIcons();
