

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const ArtistDetailsPage = () => {
    const { artistId } = useParams();
    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [, setError] = useState('');

    useEffect(() => {
        Promise.all([
            fetch(`http://localhost:8080/api/v1/artists/${artistId}`).then(res => res.json()),
            fetch(`http://localhost:8080/api/v1/artists/${artistId}/albums`).then(res => res.json())
        ])
            .then(([artistData, albumsData]) => {
                setArtist(artistData);
                setAlbums(albumsData);
            })
            .catch(() => setError('Ошибка загрузки данных'));
    }, [artistId]);

    if (!artist) return <div>Загрузка...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <h2>{artist.name}</h2>
            {artist.image && <img src={artist.image} alt={artist.name} style={{ maxWidth: '200px' }} />}
            <h3>Альбомы</h3>
            {albums.length === 0 ? (
                <p>Нет альбомов</p>
            ) : (
                <ul>
                    {albums.map(album => (
                        <li key={album.id}>{album.title} ({album.releaseDate})</li>
                    ))}
                </ul>
            )}
            <Link to={`/artists/${artistId}/create-album`} style={{ display: 'inline-block', marginTop: '1rem' }}>
                <button>Добавить альбом</button>
            </Link>
        </div>
    );
};

export default ArtistDetailsPage;