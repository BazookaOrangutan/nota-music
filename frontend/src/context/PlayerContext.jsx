import React, {createContext, useContext, useEffect, useRef, useState} from 'react';

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
    const [album, setAlbum] = useState(null);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const audioRef = useRef(new Audio());

    // const loadTrack = async (albumToPlay, trackIndex) => {
    //     const trackUrl = albumToPlay.tracks[trackIndex].filePath
    //         .replace(/\\/g, '/')
    //         .replace('uploads/', '');
    //
    //     try {
    //         const response = await apiClient.get(`/files/tracks/${trackUrl}`, {
    //             responseType: 'blob',
    //         });
    //
    //         const blob = new Blob([response.data], { type: 'audio/mpeg' });
    //         const url = URL.createObjectURL(blob);
    //
    //         if (audioRef.current.src) {
    //             URL.revokeObjectURL(audioRef.current.src);
    //         }
    //
    //         audioRef.current.src = url;
    //
    //         setIsPlaying(true);
    //
    //         return url;
    //     } catch (error) {
    //         console.error('Ошибка загрузки аудио:', error);
    //         return null;
    //     }
    // };

    const loadTrack = async (albumToPlay, trackIndex) => {
        const token = localStorage.getItem('token');
        const trackPath = albumToPlay.tracks[trackIndex].filePath
            .replace(/\\/g, '/')
            .replace('uploads/', '');

        const url = `/api/v1/files/tracks/${trackPath}?token=${token}`;
        audioRef.current.src = url;
        audioRef.current.load();
        setIsPlaying(true);
        return url;
    };

    const play = (albumToPlay, trackIndex = 0) => {
        setAlbum(albumToPlay);
        setCurrentTrackIndex(trackIndex);
        setIsPlaying(true);
    };


    useEffect(() => {
        if (!album || !album.tracks || album.tracks.length === 0) return;

        const trackIndex = currentTrackIndex;

        const loadAndSetupAudio = async () => {
            const url = await loadTrack(album, trackIndex);
            if (!url) return;

            const audio = audioRef.current;

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
                if (trackIndex < album.tracks.length - 1) {
                    setCurrentTrackIndex(trackIndex + 1);
                } else {
                    setIsPlaying(false);
                }
            };

            // audio.addEventListener('loadedmetadata', onLoadedMetadata);
            // audio.addEventListener('timeupdate', onTimeUpdate);
            // audio.addEventListener('ended', onEnded);
            //
            // return () => {
            //     audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            //     audio.removeEventListener('timeupdate', onTimeUpdate);
            //     audio.removeEventListener('ended', onEnded);
            // };

            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('ended', onEnded);


            audio.addEventListener('loadedmetadata', onLoadedMetadata);
            audio.addEventListener('timeupdate', onTimeUpdate);
            audio.addEventListener('ended', onEnded);

        };

        loadAndSetupAudio();
    }, [album, currentTrackIndex]);

    useEffect(() => {
        const audio = audioRef.current;

        if(audio.src){
            if (isPlaying) {
                audio.play().catch((e) => console.error("Play error:", e));
            } else {
                audio.pause();
            }
        }
    }, [isPlaying]);

    const updateTime = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    const onEnd = () => {
        setCurrentTrackIndex(prevIndex => {
            if (prevIndex < album.tracks.length - 1) {
                return prevIndex + 1;
            } else {
                setIsPlaying(false);
                return prevIndex;
            }
        });
    };

    useEffect(() => {
        const audio = audioRef.current;

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('ended', onEnd);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('ended', onEnd);
        };
    }, [album]);

    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const nextTrack = () => {
        if (currentTrackIndex < album?.tracks.length - 1) {
            setCurrentTrackIndex(currentTrackIndex + 1);
        }
    };

    const prevTrack = () => {
        if (currentTrackIndex > 0) {
            setCurrentTrackIndex(currentTrackIndex - 1);
        }
    };

    const seek = (e) => {
        const newTime = parseFloat(e.target.value);
        audioRef.current.currentTime = newTime;
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
                play,
                togglePlayPause,
                nextTrack,
                prevTrack,
                seek,
                currentTime,
                duration,
                formatTime,
            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);