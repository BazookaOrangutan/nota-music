import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/apiClient.js';
import Select from 'react-select';
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import {IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';


const AlbumEditPage = () => {
    const { albumId } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const [tracks, setTracks] = useState([]);
    const [allArtists, setAllArtists] = useState([]);
    const [selectedArtists, setSelectedArtists] = useState([]);
    const [error, setError] = useState('');
    const [deletedTrackIds, setDeletedTrackIds] = useState(new Set());
    const [updatedTrackFiles, setUpdatedTrackFiles] = useState({});



    useEffect(() => {
        const fetchAlbum = async () => {
            try {
                const { data } = await apiClient.get(`/albums/${albumId}`);
                setTitle(data.title);
                setReleaseDate(data.releaseDate);
                setTracks((data.tracks || []).sort(sortTracksByFilePath));

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

    const handleFileChange = (trackId, file) => {
        setUpdatedTrackFiles(prev => ({ ...prev, [trackId]: file }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            title,
            releaseDate,
            tracks: tracks.filter(track => !deletedTrackIds.has(track.id)),
            artistIds: selectedArtists.map(a => a.value),
        };

        try {
            for (const trackId of deletedTrackIds) {
                await apiClient.delete(`/tracks/${trackId}`);
            }

            await apiClient.put(`/albums/${albumId}`, payload);

            for (const [trackId, file] of Object.entries(updatedTrackFiles)) {
                if (deletedTrackIds.has(trackId)) continue;

                const formData = new FormData();
                formData.append('file', file);
                await apiClient.put(`/tracks/${trackId}/file`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            alert('Альбом обновлён!');
            navigate(-1);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const sortTracksByFilePath = (a, b) => {
        const extractTrackNumber = (filePath) => {
            const fileName = filePath.replace(/\\/g, '/').split('/').pop();
            const match = fileName.match(/^(\d+)[-_]?(\d+)?/);
            if (!match) return Infinity;

            const part1 = parseInt(match[1], 10);
            const part2 = match[2] ? parseInt(match[2], 10) : 0;

            return part1 * 1000 + part2; // чтобы 1-02 < 2-01
        };

        return extractTrackNumber(a.filePath) - extractTrackNumber(b.filePath);
    };

    const toggleTrackDeletion = (trackId) => {
        setDeletedTrackIds(prev => {
            const updated = new Set(prev);
            if (updated.has(trackId)) {
                updated.delete(trackId);
            } else {
                updated.add(trackId);
            }
            return updated;
        });
    };


    return (
        <div style={{ padding: '2rem' }}>
            <IconButton sx={{ color: 'var(--icon-color)' }}
                        onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
                <ArrowBackIosNewOutlinedIcon/>
            </IconButton>
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
                    styles={{option: (base) => ({
                            ...base,
                            backgroundColor: '#f9f9f9',
                            color: '#333',
                        })}}
                />

                <label>Треки:</label>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {tracks.map((track, index) => {
                        const isMarkedForDeletion = deletedTrackIds.has(track.id);
                        return (
                            <li key={track.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={track.title}
                                    onChange={(e) => handleTrackChange(index, e.target.value)}
                                    style={{ flexGrow: 1 }}
                                />
                                <input
                                    disabled={deletedTrackIds.has(track.id)}
                                    type="file"
                                    accept="audio/*"
                                    style={{ marginLeft: '1rem' }}
                                    onChange={(e) => handleFileChange(track.id, e.target.files[0])}
                                />
                                <IconButton
                                    onClick={() => toggleTrackDeletion(track.id)}
                                    style={{ color: isMarkedForDeletion ? 'red' : 'gray' }}
                                    aria-label="Удалить трек"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </li>
                        );
                    })}
                </ul>

                <button disabled={selectedArtists.length === 0} type="submit">Сохранить изменения</button>
            </form>
        </div>
    );
};

export default AlbumEditPage;
