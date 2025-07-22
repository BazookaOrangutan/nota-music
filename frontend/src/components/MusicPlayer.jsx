// src/components/MusicPlayer.jsx

import React from 'react';
import { usePlayer } from '../context/PlayerContext';

const MusicPlayer = () => {
    const {
        isPlaying,
        togglePlayPause,
        nextTrack,
        prevTrack,
        seek,
        currentTime,
        duration,
        formatTime,
        album,
        currentTrackIndex
    } = usePlayer();

    if (!album || !album.tracks[currentTrackIndex]) return null;

    const currentTrack = album.tracks[currentTrackIndex];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            width: '100%',
            backgroundColor: '#111',
            color: 'white',
            padding: '10px',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div>
                <h4>{currentTrack.title}</h4>
                <p>{album.title}</p>
            </div>
            <div>
                <button onClick={prevTrack}>⏮️</button>
                <button onClick={togglePlayPause}>
                    {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button onClick={nextTrack}>⏭️</button>
            </div>
            <div style={{ width: '30%' }}>
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={seek}
                    style={{ width: '100%' }}
                />
                <small>
                    {formatTime(currentTime)} / {formatTime(duration)}
                </small>
            </div>
        </div>
    );
};

export default MusicPlayer;