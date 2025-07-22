import React from 'react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import './MusicPlayer.css';

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
        currentTrackIndex,
    } = usePlayer();

    if (!album || !album.tracks[currentTrackIndex]) return null;

    const currentTrack = album.tracks[currentTrackIndex];

    return (
        <div className="music-player">
            <div className="player-track-info">
                <h4 className="track-title">{currentTrack.title}</h4>
                <p className="album-title">{album.title}</p>
            </div>

            <div className="player-controls">
                <button onClick={prevTrack} className="control-btn" aria-label="Previous track">
                    ⏮️
                </button>
                <button onClick={togglePlayPause} className="control-btn big-btn" aria-label="Play/Pause">
                    {isPlaying ? '⏸️' : '▶️'}
                </button>
                <button onClick={nextTrack} className="control-btn" aria-label="Next track">
                    ⏭️
                </button>
            </div>

            <div className="player-progress">
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={seek}
                    className="progress-slider"
                    aria-label="Progress"
                />
                <small className="time-display">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </small>
            </div>
        </div>
    );
};

export default MusicPlayer;