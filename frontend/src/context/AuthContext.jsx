
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('role');

        if (token && userRole) {
            setIsAuthenticated(true);
            setRole(userRole);
        }
    }, []);

    const login = (token, userRole) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', userRole);
        setIsAuthenticated(true);
        setRole(userRole);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsAuthenticated(false);
        setRole(null);
    };

    const hasRole = (requiredRole) => {
        return role === requiredRole;
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, role, hasRole, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};