

import React, { useState } from 'react';

const AlbumCreatePage = () => {
    const [title, setTitle] = useState('');
    const [tracks, setTracks] = useState([]);
    const [files, setFiles] = useState([]);
    const [error, setError] = useState('');
    const artistId = "b13b29b9-753f-4a87-84f8-2d647aafdd2b";

    const handleTrackChange = (index, value) => {
        const updatedTracks = [...tracks];
        updatedTracks[index].title = value;
        setTracks(updatedTracks);
    };
    //
    // const addTrack = () => {
    //     setTracks([...tracks, { title: '' }]);
    // };

    const removeTrack = (index) => {
        const updatedTracks = tracks.filter((_, i) => i !== index);
        setTracks(updatedTracks);
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.some(file => !file.name.endsWith('.mp3'))) {
            setError('Можно загружать только .mp3 файлы');
            return;
        }

        setFiles(selectedFiles);

        // Автоматическое заполнение треков из имён файлов (опционально)
        const trackList = selectedFiles.map((file) => ({
            title: file.name.replace(/\.[^/.]+$/, ""), // Удаляем расширение
        }));
        setTracks(trackList);
        setError('');

    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || tracks.length === 0 || files.length === 0) {
            setError('Заполните все поля и загрузите хотя бы один трек.');
            return;
        }

        const albumData = {
            title,
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
            const response = await fetch('http://localhost:8080/api/v1/albums', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Ошибка при создании альбома');
            }

            alert('Альбом успешно создан!');
            // Очистка формы
            setTitle('');
            setTracks([]);
            setFiles([]);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
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
                                    <button type="button" onClick={() => removeTrack(index)} style={{ marginLeft: '0.5rem' }}>
                                        Удалить
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </label>
                    {/*<button type="button" onClick={addTrack}>*/}
                    {/*    Добавить трек*/}
                    {/*</button>*/}
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