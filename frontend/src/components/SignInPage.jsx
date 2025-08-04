
import React, { useState } from 'react';
import apiClient from '../api/apiClient';
import { useNavigate } from 'react-router-dom';
import {parseJwt} from "../utils/jwt.js";

const SignInPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
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
            const response = await apiClient.post('/auth/sign-in', formData);
            const payload = parseJwt(response.data.token);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('role', payload.role);
            localStorage.setItem('userId', payload.id);
            console.log(payload.role);
            navigate('/artists');
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка входа');
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Вход</h2>
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

                <button type="submit">Войти</button>
            </form>

            <p style={{ marginTop: '1rem' }}>
                Нет аккаунта? <a href="/sign-up">Зарегистрируйтесь</a>
            </p>
        </div>
    );
};

export default SignInPage;