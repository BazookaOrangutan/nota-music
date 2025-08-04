
import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import {parseJwt} from "../utils/jwt.js";

const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            formData.username = formData.username.trim();
            formData.password = formData.password.trim();
            formData.email = formData.email.trim();
            const response = await apiClient.post('/auth/sign-up', formData);
            const payload = parseJwt(response.data.token);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', payload.role);
            localStorage.setItem('userId', payload.id);
            navigate('/artists');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка регистрации');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Регистрация</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Имя пользователя:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', marginBottom: '1rem' }}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', marginBottom: '1rem' }}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Пароль:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', marginBottom: '1rem' }}
                        />
                    </label>
                </div>

                <button type="submit">Зарегистрироваться</button>
            </form>

            <p style={{ marginTop: '1rem' }}>
                Уже есть аккаунт? <a href="/sign-in">Войдите</a>
            </p>
        </div>
    );
};

export default SignUpPage;