import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from "../api/apiClient.js";

const AlbumCreatePage = () => {
    const navigate = useNavigate();
    const { artistId } = useParams(); // Получаем UUID из URL

    const [title, setTitle] = useState('');
    const [releaseDate, setReleaseDate] = useState(''); // YYYY-MM-DD
    const [tracks, setTracks] = useState([]);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');

    const handleTrackChange = (index, value) => {
        const updatedTracks = [...tracks];
        updatedTracks[index].title = value;
        setTracks(updatedTracks);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.some(file => !file.name.endsWith('.mp3'))) {
            setError('Можно загружать только .mp3 файлы');
            return;
        }

        setFiles(selectedFiles);

        const trackList = selectedFiles.map((file) => ({
            title: file.name.replace(/\.[^/.]+$/, ""), // Удаляем расширение
        }));
        setTracks(trackList);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !releaseDate || tracks.length === 0 || files.length === 0) {
            setError('Заполните все поля и загрузите хотя бы один трек.');
            return;
        }

        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(releaseDate)) {
            setError('Дата релиза должна быть в формате YYYY-MM-DD');
            return;
        }

        const albumData = {
            title,
            releaseDate,
            tracks,
            artistId,
        };

        const formData = new FormData();
        const albumJson = new Blob(
            [JSON.stringify(albumData)],
            { type: 'application/json' }
        );
        formData.append('album', albumJson, 'album.json');

        files.forEach((file) => {
            formData.append('files', file);
        });

        try {
            await apiClient.post('/albums', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });

            alert('Альбом успешно создан!');
            navigate(`/artists/${artistId}`);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
                ←
            </button>
            <h2>Создать альбом</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Название альбома:
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            style={{ width: '100%', marginBottom: '1rem' }}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Дата релиза (YYYY-MM-DD):
                        <input
                            type="date"
                            value={releaseDate}
                            onChange={(e) => setReleaseDate(e.target.value)}
                            required
                            style={{ width: '100%', marginBottom: '1rem' }}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Треки:
                        <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                            {tracks.map((track, index) => (
                                <li key={index} style={{ marginBottom: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={track.title}
                                        onChange={(e) => handleTrackChange(index, e.target.value)}
                                        placeholder={`Название трека ${index + 1}`}
                                        style={{ width: '80%' }}
                                    />
                                </li>
                            ))}
                        </ul>
                    </label>
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <label>
                        MP3 файлы:
                        <input
                            type="file"
                            multiple
                            accept=".mp3"
                            onChange={handleFileChange}
                            required
                        />
                    </label>
                </div>

                <button type="submit" style={{ marginTop: '1rem' }}>
                    Создать альбом
                </button>
            </form>
        </div>
    );
};

export default AlbumCreatePage;