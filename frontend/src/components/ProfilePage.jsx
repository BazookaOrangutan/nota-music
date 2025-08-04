import React, { useEffect, useState, useContext } from 'react';
import apiClient from "../api/apiClient";
import { PlayerContext } from "../context/PlayerContext";
import {useNavigate} from "react-router-dom";
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import {IconButton} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

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
            <IconButton sx={{ color: 'var(--icon-color)' }}
                        onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>
                <ArrowBackIosNewOutlinedIcon/>
            </IconButton>
            <h2>Избранные треки</h2>

            {favoriteTracks.length === 0 ? (
                <p>Вы пока не добавили ни одного трека в избранное.</p>
            ) : (
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {favoriteTracks.map((track, index) => (
                        <li key={track.id} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
                            <IconButton sx={{ color: 'var(--icon-color)' }}
                                onClick={() => play(buildAlbumFromTracks(favoriteTracks), index)}
                                style={{ marginRight: '0.5rem' }}
                            >
                                <PlayArrowIcon/>
                            </IconButton>
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
