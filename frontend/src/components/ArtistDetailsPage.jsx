import React, {useContext, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import apiClient from "../api/apiClient.js";
import {AuthContext} from "../context/AuthContext.jsx";

const ArtistDetailsPage = () => {
    const {artistId} = useParams();
    const navigate = useNavigate();
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [err, setError] = useState('');
    const { hasRole } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [artistRes, albumsRes] = await Promise.all([
                    apiClient.get(`/artists/${artistId}`),
                    apiClient.get(`/artists/${artistId}/albums`),
                ]);
                setArtist(artistRes.data);
                setAlbums(albumsRes.data);
            } catch (err) {
                setError('Ошибка загрузки данных');
            }
        };

        fetchData();
    }, [artistId]);

    const handleDeleteAlbum = async (albumId) => {
        if (!window.confirm('Удалить этот альбом?')) return;

        try {
            await axios.delete(`http://localhost:8080/api/v1/albums/${albumId}`);
            setAlbums(albums.filter(a => a.id !== albumId));
        } catch (err) {
            setError('Не удалось удалить альбом');
        }
    };

    const handleDeleteArtist = async () => {
        if (!window.confirm('Вы уверены, что хотите удалить этого исполнителя и все его альбомы?')) return;

        try {
            await apiClient.delete(`/artists/${artistId}`);
            navigate('/artists');
        } catch (err) {
            setError('Ошибка при удалении исполнителя');
        }
    };


    if (!artist) return <div>Загрузка...</div>;

    return (
        <div style={{padding: '2rem'}}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
                ←
            </button>

            <h2>{artist.name}</h2>
            {artist.image && <img src={artist.image} alt={artist.name} style={{maxWidth: '200px'}}/>}
            <h3>Альбомы</h3>
            {err && <p style={{color: 'red'}}>{err}</p>}
            {albums.length === 0 ? (
                <p>Нет альбомов</p>
            ) : (
                <ul>
                    {albums.map(album => (
                        <li key={album.id} style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                            <Link to={`/albums/${album.id}`}>
                                {album.title} ({album.releaseDate})
                            </Link>
                            {hasRole('ROLE_ADMIN') && (<button
                                onClick={() => handleDeleteAlbum(album.id)}
                                style={{marginLeft: '1rem', color: 'red', border: 'none', background: 'transparent'}}
                            >
                                🗑️
                            </button>)}
                        </li>
                    ))}
                </ul>
            )}
            {hasRole('ROLE_ADMIN') && (<div style={{marginTop: '2rem'}}>
                <Link to={`/artists/${artistId}/create-album`} style={{textDecoration: 'none'}}>
                    <button>Добавить альбом</button>
                </Link>
            </div>)}

            <div style={{ marginTop: '1rem' }}>
                {hasRole('ROLE_ADMIN') && (<button onClick={handleDeleteArtist} style={{color: 'red'}}>
                    Удалить исполнителя
                </button>)}
            </div>
        </div>
    );
};

export default ArtistDetailsPage;