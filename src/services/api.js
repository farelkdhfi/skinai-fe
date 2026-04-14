/**
 * API Service
 * Centralized API calls to Node.js Gateway
 */

import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
    baseURL: API_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token expiry
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Cek apakah request yang error berasal dari endpoint login
        const isLoginRequest = error.config && error.config.url && error.config.url.includes('/auth/login');

        // Jika error 401 DAN BUKAN dari proses login, baru redirect (karena token expired)
        if (error.response?.status === 401 && !isLoginRequest) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        
        return Promise.reject(error);
    }
);

// =============================================================================
// AUTH
// =============================================================================

export const authAPI = {
    register: (email, password) =>
        api.post('/auth/register', { email, password }),

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
        }
        return response;
    },

    logout: async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('access_token');
    },

    getMe: () => api.get('/auth/me'),
};

// =============================================================================
// ANALYZE
// =============================================================================

export const analyzeAPI = {
    analyze: (payload) =>
        api.post('/analyze', payload),

    analyzeWithoutGradCAM: (images) =>
        api.post('/analyze/predict-only', { images }),

    recommend: (skinCondition) =>
        api.post('/analyze/recommend', { skin_condition: skinCondition }),

    health: () => api.get('/analyze/health'),
};

// =============================================================================
// HISTORY
// =============================================================================

export const historyAPI = {
    getAll: (limit = 50, offset = 0) =>
        api.get(`/history?limit=${limit}&offset=${offset}`),

    getById: (id) => api.get(`/history/${id}`),

    save: (analysisData) => api.post('/history', analysisData),

    delete: (id) => api.delete(`/history/${id}`),
};

// =============================================================================
// DASHBOARD
// =============================================================================

export const dashboardAPI = {
    getStats: () => api.get('/dashboard'),
};

export default api;
