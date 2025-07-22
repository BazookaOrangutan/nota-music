import React, {useEffect, useState} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from "../api/apiClient.js";
import Select from 'react-select';

const AlbumCreatePage = () => {
    const navigate = useNavigate();
    const { artistId } = useParams();
    const [title, setTitle] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [tracks, setTracks] = useState([]);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const [additionalArtists, setAdditionalArtists] = useState([]);
    const [allArtists, setAllArtists] = useState([]);
    const [mainArtist, setMainArtist] = useState(null);

    useEffect(() => {
        const fetchMainArtist = async () => {
            try {
                const response = await apiClient.get(`/artists/${artistId}`);
                setMainArtist(response.data);
            } catch (err) {
                setError('Ошибка загрузки основного исполнителя');
            }
        };

        fetchMainArtist();
    }, [artistId]);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await apiClient.get('/artists');
                const artists = response.data;

                const filteredArtists = artists.filter(a => a.id !== artistId);
                setAllArtists(filteredArtists);
            } catch (err) {
                setError('Ошибка загрузки исполнителей');
            }
        };

        fetchArtists();
    }, [artistId, mainArtist]);

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
            title: file.name.replace(/\.[^/.]+$/, ""),
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
            artistIds: [artistId, ...(additionalArtists.map(a => a.value))],
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

    const artistOptions = allArtists.map(artist => ({
        value: artist.id,
        label: artist.name,
    }));

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

                {mainArtist && (
                    <div style={{ marginBottom: '1rem' }}>
                        <label>
                            <strong>Исполнитель:</strong>
                            <p style={{ margin: '0.5rem 0', fontWeight: 'bold' }}>
                                {mainArtist?.name || 'Загрузка...'}
                            </p>
                        </label>
                    </div>
                )}

                <div>
                    <label>
                        Соавторы альбома:
                        <Select
                            isMulti
                            options={artistOptions}
                            value={additionalArtists}
                            onChange={setAdditionalArtists}
                            placeholder="Выберите исполнителей"
                            noOptionsMessage={() => 'Нет доступных исполнителей'}
                            styles={{option: (base) => ({
                                    ...base,
                                    backgroundColor: '#f9f9f9',
                                    color: '#333',
                                })}}
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