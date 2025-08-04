import React from 'react';
import { usePlayer } from '../../context/PlayerContext.jsx';
import './MusicPlayer.css';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import {IconButton} from "@mui/material";

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
                <IconButton sx={{color: 'white'}} onClick={prevTrack} className="control-btn" aria-label="Previous track">
                    <SkipPreviousIcon/>
                </IconButton>
                <IconButton sx={{color: 'white'}} onClick={togglePlayPause} className="control-btn big-btn" aria-label="Play/Pause">
                    {isPlaying ? <PauseIcon/> : <PlayArrowIcon/>}
                </IconButton>
                <IconButton sx={{color: 'white'}} onClick={nextTrack} className="control-btn" aria-label="Next track">
                    <SkipNextIcon/>
                </IconButton>
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