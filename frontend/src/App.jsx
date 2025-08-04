import React from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import ArtistsPage from './components/ArtistsPage';
import ArtistDetailsPage from './components/ArtistDetailsPage';
import AlbumCreatePage from './components/AlbumCreatePage';
import AlbumDetailsPage from './components/AlbumDetailsPage';
import MusicPlayer from "./components/MusicPlayer/MusicPlayer.jsx";
import {PlayerProvider} from "./context/PlayerContext.jsx";
import SignInPage from "./components/SignInPage.jsx";
import SignUpPage from "./components/SignUpPage.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import {AuthProvider} from "./context/AuthContext.jsx";
import Header from "./components/Header/Header.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import AlbumEditPage from "./components/AlbumEditPage.jsx";

function App() {
    return (
        <Router>
            <AuthProvider>
                <PlayerProvider>
                    <Header />
                    <div style={{paddingBottom: '150px', paddingTop: '50px'}}>
                        <Routes>
                            <Route path="/sign-up" element={<SignUpPage/>}/>
                            <Route path="/sign-in" element={<SignInPage/>}/>

                            <Route element={<PrivateRoute/>}>
                                <Route path="/profile" element={<ProfilePage />} />
                                <Route path="/artists" element={<ArtistsPage/>}/>
                                <Route path="/artists/:artistId" element={<ArtistDetailsPage/>}/>
                                <Route path="/artists/:artistId/create-album" element={<AlbumCreatePage/>}/>
                                <Route path="/albums/:albumId" element={<AlbumDetailsPage/>}/>
                                <Route path="/albums/:albumId/edit" element={<AlbumEditPage />} />
                            </Route>

                            <Route path="*" element={<Navigate to="/sign-in"/>}/>
                        </Routes>
                    </div>
                    <MusicPlayer/>
                </PlayerProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;