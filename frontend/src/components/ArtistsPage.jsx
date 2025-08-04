import React, {useContext, useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import apiClient from '../api/apiClient';
import ArtistCreateModal from "./ArtistCreateModal.jsx";
import {AuthContext} from "../context/AuthContext.jsx";
import DeleteIcon from '@mui/icons-material/Delete';
import {IconButton} from "@mui/material";

const ArtistsPage = () => {
    const [artists, setArtists] = useState([]);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { hasRole } = useContext(AuthContext);

    useEffect(() => {
        const fetchArtists = async () => {
            try {
                const response = await apiClient.get('/artists');
                setArtists(response.data);
            } catch (err) {
                setError('Ошибка загрузки исполнителей');
            }
        };

        fetchArtists();
    }, []);

    const handleCreateArtist = (newArtist) => {
        setArtists([...artists, newArtist]);
    };

    const handleDeleteArtist = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить этого исполнителя?')) return;

        try {
            await apiClient.delete(`/artists/${id}`);
            setArtists(artists.filter((a) => a.id !== id));
        } catch (err) {
            setError('Ошибка при удалении исполнителя');
        }
    };

    return (
        <div style={{padding: '2rem'}}>

            <h2>Исполнители</h2>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {hasRole('ROLE_ADMIN') && (<button onClick={() => setIsModalOpen(true)}>Добавить исполнителя</button>)}

            <ul style={{listStyle: 'none', paddingLeft: 0, marginTop: '1rem'}}>
                {artists.map((artist) => (
                    <li key={artist.id} style={{marginBottom: '1rem'}}>
                        <Link to={`/artists/${artist.id}`}>{artist.name}</Link>
                        {hasRole('ROLE_ADMIN') && (<IconButton
                            onClick={() => handleDeleteArtist(artist.id)}
                            style={{color: 'red', border: 'none', background: 'transparent'}}
                        >
                            <DeleteIcon/>
                        </IconButton>)}
                    </li>
                ))}
            </ul>

            {isModalOpen && (
                <ArtistCreateModal
                    onClose={() => setIsModalOpen(false)}
                    onArtistCreated={handleCreateArtist}
                />
            )}
        </div>
    );
};

export default ArtistsPage;