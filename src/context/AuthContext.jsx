/**
 * Auth Context
 * Global authentication state management
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check auth status on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('access_token');
            if (token) {
                try {
                    const response = await authAPI.getMe();

                    setUser(response.data.user);
                    setSession({ access_token: token });
                    setIsAuthenticated(true);
                } catch (err) {
                    if (!err.response) {
                        console.warn('Network issue, assume still logged in');

                        setIsAuthenticated(true); // 🔥 ini kuncinya
                        setSession({ access_token: token });

                        setLoading(false);
                        return;
                    }

                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    const login = useCallback(async (email, password) => {
        const response = await authAPI.login(email, password);

        const token = response.data.access_token;

        localStorage.setItem('access_token', token);

        setUser(response.data.user);
        setSession({ access_token: token });
        setIsAuthenticated(true);

        return response.data;
    }, []);

    const register = useCallback(async (email, password) => {
        const response = await authAPI.register(email, password);
        return response.data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await authAPI.logout();
        } finally {
            setUser(null);
            setSession(null);
            setIsAuthenticated(false);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
    }, []);

    const value = {
        user,
        session,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
