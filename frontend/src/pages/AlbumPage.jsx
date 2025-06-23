import React, { useEffect, useState } from "react";

export default function AlbumPage() {
    const [albums, setAlbums] = useState([]);
    const [tracks, setTracks] = useState([]);
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);
    const [loadingAlbums, setLoadingAlbums] = useState(true);
    const [loadingTracks, setLoadingTracks] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Загрузка альбомов при инициализации
        const fetchAlbums = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/v1/albums");
                if (!res.ok) throw new Error("Ошибка при загрузке альбомов");
                const data = await res.json();
                setAlbums(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingAlbums(false);
            }
        };

        fetchAlbums();
    }, []);

    const handleAlbumClick = async (albumId) => {
        setSelectedAlbumId(albumId);
        setLoadingTracks(true);
        setTracks([]);

        try {
            const res = await fetch(
                `http://localhost:8080/api/v1/tracks/album/${albumId}`
            );
            if (!res.ok) throw new Error("Ошибка при загрузке треков");
            const data = await res.json();
            setTracks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingTracks(false);
        }
    };

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Альбомы</h1>

            {loadingAlbums ? (
                <p>Загрузка альбомов...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <ul>
                    {albums.map((album) => (
                        <li
                            key={album.id}
                            style={{ cursor: "pointer", marginBottom: "8px" }}
                            onClick={() => handleAlbumClick(album.id)}
                        >
                            {album.title}
                        </li>
                    ))}
                </ul>
            )}

            {selectedAlbumId && (
                <div style={{ marginTop: "30px" }}>
                    <h2>Треки альбома</h2>
                    {loadingTracks ? (
                        <p>Загрузка треков...</p>
                    ) : (
                        <ul>
                            {tracks.map((track, index) => (
                                <li key={index}>{track.title}</li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
