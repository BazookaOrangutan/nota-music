
import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {PlayerContext} from '../context/PlayerContext';
import apiClient from "../api/apiClient.js";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {IconButton} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';

const AlbumDetailsPage = () => {
    const {albumId} = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const {play} = useContext(PlayerContext);
    const [artists, setArtists] = useState([]);
    const [error, setError] = useState('');
    const [favoriteTrackIds, setFavoriteTrackIds] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const fetchAlbumAndArtists = async () => {
            try {

                const albumRes = await apiClient.get(`/albums/${albumId}`);
                const albumData = albumRes.data;
                setAlbum({ ...albumData, tracks: [...(albumData.tracks || [])].sort(sortTracksByFilePath) });

                console.log(albumData);

                if (albumData.artistIds && albumData.artistIds.length > 0) {
                    const artistPromises = albumData.artistIds.map(id =>
                        apiClient.get(`/artists/${id}`).then(res => res.data)
                    );

                    const artistData = await Promise.all(artistPromises);

                    setArtists(artistData);
                }

            } catch (err) {
                setError('Ошибка загрузки данных')
            }
        };

        const fetchFavorites = async () => {
            if (!userId) return;

            try {
                const res = await apiClient.get(`/users/${userId}`);
                const favorites = res.data.favouritesTracks || [];
                setFavoriteTrackIds(favorites.map(track => track.id));
            } catch (err) {
                console.error('Ошибка загрузки избранного', err);
            }
        };

        fetchAlbumAndArtists();
        fetchFavorites();

    }, [albumId, userId]);


    const toggleFavorite = async (trackId) => {
        try {
            const isFav = favoriteTrackIds.includes(trackId);
            if (isFav) {
                await apiClient.delete(`/users/${userId}/favorites/${trackId}`);
                setFavoriteTrackIds(prev => prev.filter(id => id !== trackId));
            } else {
                await apiClient.post(`/users/${userId}/favorites/${trackId}`);
                setFavoriteTrackIds(prev => [...prev, trackId]);
            }
        } catch (err) {
            console.error('Ошибка при изменении избранного', err);
        }
    };

    const sortTracksByFilePath = (a, b) => {
        const extractTrackNumber = (filePath) => {
            const fileName = filePath.split(/[\\/]/).pop();
            const match = fileName.match(/^(\d+)/);
            return match ? parseInt(match[1], 10) : Infinity;
        };

        return extractTrackNumber(a.filePath) - extractTrackNumber(b.filePath);
    };



    if (!album) return <div>Загрузка альбома...</div>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!album) return <div>Альбом не найден</div>;

    return (
        <div style={{padding: '2rem'}}>
            <IconButton sx={{ color: 'var(--icon-color)' }}
                        onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>
                <ArrowBackIosNewOutlinedIcon/>
            </IconButton>

            <h2>{album.title}</h2>

            <div style={{ marginBottom: '1rem' }}>
                <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex'}}>
                    {artists.map((artist, index) => (
                            <li key={artist.id}>
                                {index === 0 ? artist.name : ', ' + artist.name}
                            </li>
                        ))
                    }
                </ul>
            </div>

            <p>Дата релиза: {album.releaseDate}</p>

            <h3>Треки</h3>
            <ul style={{listStyle: 'none', paddingLeft: 0}}>
                {album.tracks.map((track, index) => (
                    <li key={track.id} style={{marginBottom: '0.5rem'}}>
                        <IconButton sx={{ color: 'var(--icon-color)' }}
                            onClick={() => play(album, index)}
                            style={{marginRight: '0.5rem'}}
                        >
                            <PlayArrowIcon/>
                        </IconButton>
                        {index + 1}. {track.title}
                        <IconButton sx={{ color: 'var(--icon-color)' }}
                            onClick={() => toggleFavorite(track.id)} style={{marginLeft: '1rem'}}>
                            {favoriteTrackIds.includes(track.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                    </li>

                ))}
            </ul>
        </div>
    );
};

export default AlbumDetailsPage;