

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const ArtistsPage = () => {
    const [artists, setArtists] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('http://localhost:8080/api/v1/artists')
            .then(res => res.json())
            .then(data => setArtists(data))
            .catch(() => setError('Ошибка загрузки исполнителей'));
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Исполнители</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {artists.map(artist => (
                    <li key={artist.id} style={{ marginBottom: '1rem' }}>
                        <Link to={`/artists/${artist.id}`}>
                            {artist.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ArtistsPage;