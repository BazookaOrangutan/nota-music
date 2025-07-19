
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArtistsPage from './components/ArtistsPage';
import ArtistDetailsPage from './components/ArtistDetailsPage';
import AlbumCreatePage from './components/AlbumCreatePage';
import AlbumDetailsPage from './components/AlbumDetailsPage';
import GlobalPlayer from "./components/MusicPlayer.jsx";
import {PlayerProvider} from "./context/PlayerContext.jsx";
import MusicPlayer from "./components/MusicPlayer.jsx";

function App() {
    return (
        <Router>
            <PlayerProvider>
                <Routes>
                    <Route path="/artists" element={<ArtistsPage />} />
                    <Route path="/artists/:artistId" element={<ArtistDetailsPage />} />
                    <Route path="/artists/:artistId/create-album" element={<AlbumCreatePage />} />
                    <Route path="/albums/:albumId" element={<AlbumDetailsPage />} />
                </Routes>
                <MusicPlayer />
            </PlayerProvider>
        </Router>
    );
}

export default App;