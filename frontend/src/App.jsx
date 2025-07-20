import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import ArtistsPage from './components/ArtistsPage';
import ArtistDetailsPage from './components/ArtistDetailsPage';
import AlbumCreatePage from './components/AlbumCreatePage';
import AlbumDetailsPage from './components/AlbumDetailsPage';
import MusicPlayer from "./components/MusicPlayer.jsx";
import {PlayerProvider} from "./context/PlayerContext.jsx";
import SignInPage from "./components/SignInPage.jsx";
import SignUpPage from "./components/SignUpPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";

function App() {
    return (
        <Router>
            <AuthProvider>
                <PlayerProvider>
                    <Routes>
                        <Route path="/sign-up" element={<SignUpPage/>}/>
                        <Route path="/sign-in" element={<SignInPage/>}/>

                        <Route element={<PrivateRoute/>}>
                            <Route path="/artists" element={<ArtistsPage/>}/>
                            <Route path="/artists/:artistId" element={<ArtistDetailsPage/>}/>
                            <Route path="/artists/:artistId/create-album" element={<AlbumCreatePage/>}/>
                            <Route path="/albums/:albumId" element={<AlbumDetailsPage/>}/>
                        </Route>

                        <Route path="*" element={<Navigate to="/sign-in"/>}/>
                    </Routes>
                    <MusicPlayer/>
                </PlayerProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;