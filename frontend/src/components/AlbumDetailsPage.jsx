
import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {PlayerContext} from '../context/PlayerContext';
import apiClient from "../api/apiClient.js";

const AlbumDetailsPage = () => {
    const {albumId} = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const {play} = useContext(PlayerContext);
    const [artists, setArtists] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAlbumAndArtists = async () => {
            try {

                const albumRes = await apiClient.get(`/albums/${albumId}`);
                const albumData = albumRes.data;
                setAlbum(albumData);


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
        fetchAlbumAndArtists();
    }, [albumId]);

    if (!album) return <div>Загрузка альбома...</div>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!album) return <div>Альбом не найден</div>;

    return (
        <div style={{padding: '2rem'}}>
            <button onClick={() => navigate(-1)} style={{marginBottom: '1rem'}}>
                ←
            </button>

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

            <button onClick={() => play(album)} style={{marginBottom: '1rem'}}>
                ▶️ Слушать весь альбом
            </button>

            <h3>Треки</h3>
            <ul style={{listStyle: 'none', paddingLeft: 0}}>
                {album.tracks.map((track, index) => (
                    <li key={track.id} style={{marginBottom: '0.5rem'}}>
                        <button
                            onClick={() => play(album, index)}
                            style={{marginRight: '0.5rem'}}
                        >
                            ▶
                        </button>
                        {index + 1}. {track.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AlbumDetailsPage;