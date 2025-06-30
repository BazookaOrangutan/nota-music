
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ArtistsPage from './components/ArtistsPage';
import ArtistDetailsPage from './components/ArtistDetailsPage';
import AlbumCreatePage from './components/AlbumCreatePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/artists" element={<ArtistsPage />} />
                <Route path="/artists/:artistId" element={<ArtistDetailsPage />} />
                <Route path="/artists/:artistId/create-album" element={<AlbumCreatePage />} />
            </Routes>
        </Router>
    );
}

export default App;