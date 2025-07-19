//
// import React, {useEffect, useRef, useState} from 'react';
// import { useParams } from 'react-router-dom';
// import apiClient from '../api/apiClient';
//
// const AlbumDetailsPage = () => {
//     const { albumId } = useParams();
//     const [album, setAlbum] = useState(null);
//     const [currentTrack, setCurrentTrack] = useState(null);
//     const [error, setError] = useState('');
//     const [isPlaying, setIsPlaying] = useState(false);
//     const audioRef = useRef(null);
//     const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
//
//     useEffect(() => {
//         const fetchAlbum = async () => {
//             try {
//                 const response = await apiClient.get(`/albums/${albumId}`);
//                 setAlbum(response.data);
//                 console.log(response.data)
//             } catch (err) {
//                 setError('Ошибка загрузки альбома');
//             }
//         };
//
//         fetchAlbum();
//     }, [albumId]);
//
//     const handlePlayTrack = (track) => {
//
//         const relativePath = track.filePath
//             .replace('uploads\\', '')
//             .replace(/\\/g, '/');
//
//         const fileUrl = `/api/v1/files/tracks/${relativePath}`;
//         console.log(fileUrl);
//         setCurrentTrack({ ...track, fileUrl });
//     };
//
//     const handlePlay = (index) => {
//         setCurrentTrackIndex(index);
//         setIsPlaying(true);
//     };
//
//     const handleEnded = () => {
//         if (currentTrackIndex !== null && album && currentTrackIndex < album.tracks.length - 1) {
//             setCurrentTrackIndex(currentTrackIndex + 1);
//         } else {
//             setIsPlaying(false);
//         }
//     };
//
//
//     useEffect(() => {
//         if (currentTrackIndex !== null && album) {
//             const track = album.tracks[currentTrackIndex];
//
//             const relativePath = track.filePath
//                 .replace('uploads\\', '')
//                 .replace(/\\/g, '/');
//
//             const fileUrl = `/api/v1/files/tracks/${relativePath}`;
//             audioRef.current.src = fileUrl;
//             audioRef.current.play().catch((e) => {
//                 console.error('Ошибка автовоспроизведения:', e);
//                 setIsPlaying(false);
//             });
//         }
//     }, [currentTrackIndex, album]);
//
//     if (!album) return <div>Загрузка...</div>;
//
//     return (
//         <div style={{ padding: '2rem' }}>
//             <h2>{album.title}</h2>
//             <p>Дата релиза: {album.releaseDate}</p>
//
//             <h3>Треки</h3>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//
//             <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
//                 {album.tracks.map((track, index) => (
//                     <li key={track.id} style={{ marginBottom: '1rem' }}>
//                         <button
//                             onClick={() => handlePlay(index)}
//                             style={{ marginRight: '1rem' }}
//                         >
//                             {currentTrackIndex === index && isPlaying ? '❚❚' : '▶'}
//                         </button>
//                         {index + 1}. {track.title}
//                     </li>
//                 ))}
//             </ul>
//
//             {currentTrackIndex !== null && (
//                 <div style={{ marginTop: '1rem' }}>
//                     <strong>Сейчас играет:</strong> {album.tracks[currentTrackIndex].title}
//                 </div>
//             )}
//
//             <audio
//                 ref={audioRef}
//                 onEnded={handleEnded}
//                 onPlay={() => setIsPlaying(true)}
//                 onPause={() => setIsPlaying(false)}
//                 style={{ width: '100%', marginTop: '1rem' }}
//                 controls
//                 autoPlay
//             />
//         </div>
//     );
// };
//
// export default AlbumDetailsPage;

// src/components/AlbumDetailsPage.jsx

// src/components/AlbumDetailsPage.jsx

import React, {useContext, useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext';
import apiClient from "../api/apiClient.js";

const AlbumDetailsPage = () => {
    const { albumId } = useParams();
    const navigate = useNavigate();
    const [album, setAlbum] = useState(null);
    const { play } = useContext(PlayerContext);


    useEffect(() => {
        const fetchAlbum = async () => {
            const response = await apiClient.get(`/albums/${albumId}`);
            const data = await response.data;
            setAlbum(data);
        };

        fetchAlbum();
    }, [albumId]);

    if (!album) return <div>Загрузка альбома...</div>;

    return (
        <div style={{ padding: '2rem' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '1rem' }}>
                ←
            </button>


            <h2>{album.title}</h2>
            <p>Дата релиза: {album.releaseDate}</p>

            <button onClick={() => play(album)} style={{ marginBottom: '1rem' }}>
                ▶️ Слушать весь альбом
            </button>

            <h3>Треки</h3>
            <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                {album.tracks.map((track, index) => (
                    <li key={track.id} style={{ marginBottom: '0.5rem' }}>
                        <button
                            onClick={() => play( album, index )}
                            style={{ marginRight: '0.5rem' }}
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