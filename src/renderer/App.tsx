import { Routes, Route } from 'react-router-dom';
import './App.css';
import { Player } from './components/Player/Player';
import { Sidebar } from './components/Sidebar/Sidebar';

const Hello = ({ name }: any) => {
  return (
    <div>
      <h1>{name}</h1>
    </div>
  );
};

export default function App() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Hello name="Main" />} />
        <Route path="albums" element={<Hello name="Albums" />} />
        <Route path="artists" element={<Hello name="Artists" />} />
      </Routes>
      <Player />
    </>
  );
}
