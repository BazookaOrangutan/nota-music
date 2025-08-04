import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/apiClient.js';
import Select from 'react-select';

const AlbumEditPage = () => {
    const { albumId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [tracks, setTracks] = useState([]);
    const [allArtists, setAllArtists] = useState([]);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const { data } = await apiClient.get(`/albums/${albumId}`);
                setTitle(data.title);
                setReleaseDate(data.releaseDate);
                setTracks(data.tracks || []);

                const artistOptions = (await apiClient.get('/artists')).data;
                setAllArtists(artistOptions);
                const selected = artistOptions
                    .filter(a => data.artistIds.includes(a.id))
                    .map(a => ({ value: a.id, label: a.name }));
                setSelectedArtists(selected);
            } catch (err) {
                setError('Ошибка загрузки альбома');
            }
        };

        fetchAlbum();
    }, [albumId]);

    const handleTrackChange = (index, value) => {
        const updated = [...tracks];
        updated[index].title = value;
        setTracks(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();



        const payload = {
            title,
            releaseDate,
            tracks,
            artistIds: selectedArtists.map(a => a.value)
        };

        try {
            await apiClient.put(`/albums/${albumId}`, payload);
            alert('Альбом обновлён!');
            navigate(-1);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>←</button>
            <h2>Редактировать альбом</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Название"
                    required
                    style={{ width: '100%', marginBottom: '1rem' }}
                />

                <input
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    required
                    style={{ width: '100%', marginBottom: '1rem' }}
                />

                <label>Исполнители:</label>
                <Select
                    isMulti
                    options={allArtists.map(a => ({ value: a.id, label: a.name }))}
                    value={selectedArtists}
                    onChange={setSelectedArtists}
                    styles={{ container: base => ({ ...base, marginBottom: '1rem' }) }}
                />

                <label>Треки:</label>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {tracks.map((track, index) => (
                        <li key={index}>
                            <input
                                type="text"
                                value={track.title}
                                onChange={(e) => handleTrackChange(index, e.target.value)}
                                style={{ width: '100%', marginBottom: '0.5rem' }}
                            />
                        </li>
                    ))}
                </ul>

                <button type="submit">Сохранить изменения</button>
            </form>
        </div>
    );
};

export default AlbumEditPage;
