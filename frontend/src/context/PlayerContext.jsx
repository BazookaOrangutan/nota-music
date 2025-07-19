// src/context/PlayerContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [album, setAlbum] = useState(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio] = useState(new Audio());
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // --- Изменённый код ---
    const play = (albumToPlay, trackIndex = 0) => {
        console.log(trackIndex);
        setAlbum(albumToPlay);
        setCurrentTrackIndex(trackIndex);
        setIsPlaying(true);
    };
    // --- /Изменённый код ---

    useEffect(() => {
        if (album && album.tracks.length > 0) {
            const trackUrl = album.tracks[currentTrackIndex].filePath
                .replace('uploads\\', '')
                .replace(/\\/g, '/');
            const cleanTrackUrl = encodeURIComponent(trackUrl);

            audio.src = `http://localhost:8080/api/v1/files/tracks/${trackUrl}`;

            const onLoadedMetadata = () => {
                setDuration(audio.duration);
                if (isPlaying) {
                    audio.play();
                }
            };

            const onTimeUpdate = () => {
                setCurrentTime(audio.currentTime);
            };

            const onEnded = () => {
                if (currentTrackIndex < album.tracks.length - 1) {
                    setCurrentTrackIndex(currentTrackIndex + 1);
                } else {
                    setIsPlaying(false);
                }
            };

            audio.addEventListener('loadedmetadata', onLoadedMetadata);
            audio.addEventListener('timeupdate', onTimeUpdate);
            audio.addEventListener('ended', onEnded);

            return () => {
                audio.removeEventListener('loadedmetadata', onLoadedMetadata);
                audio.removeEventListener('timeupdate', onTimeUpdate);
                audio.removeEventListener('ended', onEnded);
            };
        }
    }, [album, currentTrackIndex]);

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const onEnd = () => {
            if (currentTrackIndex < album.tracks.length - 1) {
                setCurrentTrackIndex(currentTrackIndex + 1);
            } else {
                setIsPlaying(false); // закончили альбом
            }
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('ended', onEnd);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('ended', onEnd);
        };
    }, [audio, album, currentTrackIndex]);

    const togglePlayPause = () => {
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play();
            setIsPlaying(true);
        }
    };

    const nextTrack = () => {
        if (currentTrackIndex < album.tracks.length - 1) {
            setCurrentTrackIndex(currentTrackIndex + 1);
        }
    };

    const prevTrack = () => {
        if (currentTrackIndex > 0) {
            setCurrentTrackIndex(currentTrackIndex - 1);
        }
    };

    const seek = (e) => {
        const newTime = e.target.value;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <PlayerContext.Provider
            value={{
                album,
                currentTrackIndex,
                isPlaying,
                play, // теперь принимает альбом и индекс трека
                togglePlayPause,
                nextTrack,
                prevTrack,
                seek,
                currentTime,
                duration,
                formatTime
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);