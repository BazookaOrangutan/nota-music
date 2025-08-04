import React, { useEffect, useState, useContext } from 'react';
import apiClient from "../api/apiClient";
import { PlayerContext } from "../context/PlayerContext";
import {useNavigate} from "react-router-dom";

const ProfilePage = () => {
    const [favoriteTracks, setFavoriteTracks] = useState([]);
    const [error, setError] = useState('');
    const userId = localStorage.getItem('userId');
    const { play } = useContext(PlayerContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const res = await apiClient.get(`/users/${userId}`);
                setFavoriteTracks(res.data.favouritesTracks || []);
            } catch (err) {
                setError('Ошибка загрузки избранных треков');
                console.error(err);
            }
        };

        if (userId) {
            fetchFavorites();
        }
    }, [userId]);

    const removeFromFavorites = async (trackId) => {
        try {
            await apiClient.delete(`/users/${userId}/favorites/${trackId}`);
            setFavoriteTracks(prev => prev.filter(track => track.id !== trackId));
        } catch (err) {
            console.error('Ошибка при удалении трека из избранного', err);
        }
    };

    const buildAlbumFromTracks = (tracks) => ({
        id: 'favorites',
        title: 'Избранное',
        tracks
    });

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div style={{ padding: '2rem' }}>
            <button onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>
                ←
            </button>
            <h2>Избранные треки</h2>

            {favoriteTracks.length === 0 ? (
                <p>Вы пока не добавили ни одного трека в избранное.</p>
            ) : (
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {favoriteTracks.map((track, index) => (
                        <li key={track.id} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                            <button
                                onClick={() => play(buildAlbumFromTracks(favoriteTracks), index)}
                                style={{ marginRight: '0.5rem' }}
                            >
                                ▶
                            </button>
                            {index + 1}. {track.title}
                            <button
                                onClick={() => removeFromFavorites(track.id)}
                                style={{
                                    marginLeft: '1rem',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '1.2rem',
                                    color: 'red'
                                }}
                            >
                                &#x2715;
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProfilePage;
