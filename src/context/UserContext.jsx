import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetch(`${API_URL}/api/users/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => res.ok ? res.json() : null)
                .then(data => {
                    setUser(data || null);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
}; 