
import React, { useState } from 'react';
import apiClient from '../api/apiClient';

const ArtistCreateModal = ({ onClose, onArtistCreated }) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Введите имя исполнителя');
            return;
        }

        try {
            const response = await apiClient.post('/artists', { name });
            onArtistCreated(response.data);
            setName('');
            onClose();
        } catch (err) {
            setError('Ошибка при создании исполнителя');
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#2c2c2c',
            padding: '2rem',
            boxShadow: '0 0 10px rgba(0,0,0,0.3)',
            zIndex: 1000,
            borderRadius: '5%'
        }}>
            <h3>Создать исполнителя</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>
                    Имя:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', marginBottom: '1rem' }}
                    />
                </label>
                <div>
                    <button type="submit">Создать</button>
                    <button type="button" onClick={onClose} style={{ marginLeft: '1rem' }}>Отмена</button>
                </div>
            </form>
        </div>
    );
};

export default ArtistCreateModal;