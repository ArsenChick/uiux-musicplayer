import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import App from './App';
import { store } from './store';

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <MemoryRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </MemoryRouter>
);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
