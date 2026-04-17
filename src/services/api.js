/**
 * API Service
 * Centralized API calls to Node.js Gateway
 */

import axios from 'axios';
import { API_URL } from '../config';

const api = axios.create({
    baseURL: API_URL,
    timeout: 60000,
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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Handle token expiry + auto retry saat timeout
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (!error.response) {
            console.error('Network error / failed to fetch');

            error.message = 'Network error. Please check your connection.';
            return Promise.reject(error);
        }
        const isLoginRequest = error.config?.url?.includes('/auth/login');

        // Auto retry kalau timeout (maksimal 2x retry)
        if (error.code === 'ECONNABORTED') {
            const retryCount = error.config._retryCount || 0;
            if (retryCount < 2) {
                error.config._retryCount = retryCount + 1;
                console.warn(`⏱️ Timeout, mencoba ulang... (percobaan ${retryCount + 1}/2)`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return api(error.config);
            }
        }

        // Auto refresh token kalau 401
        if (error.response?.status === 401 && !isLoginRequest && !error.config._retry) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    error.config.headers.Authorization = 'Bearer ' + token;
                    return api(error.config);
                });
            }

            error.config._retry = true;
            isRefreshing = true;

            try {
                const res = await authAPI.refreshToken();
                const newToken = res.data.access_token;

                processQueue(null, newToken);

                error.config.headers.Authorization = 'Bearer ' + newToken;
                return api(error.config);

            } catch (err) {
                processQueue(err, null);

                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        // Server error (500 dll)
        if (error.response?.status >= 500) {
            console.error('Server error:', error.response?.data);
        }

        // ✅ WAJIB ADA
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
        // Simpan refresh_token juga
        if (response.data.refresh_token) {
            localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        return response;
    },

    logout: async () => {
        await api.post('/auth/logout');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

    getMe: () => api.get('/auth/me'),

    // Tambahkan ini ↓
    refreshToken: async () => {
        const refresh_token = localStorage.getItem('refresh_token');
        if (!refresh_token) throw new Error('No refresh token');
        const response = await api.post('/auth/refresh', { refresh_token });
        if (response.data.access_token) {
            localStorage.setItem('access_token', response.data.access_token);
        }
        if (response.data.refresh_token) {
            localStorage.setItem('refresh_token', response.data.refresh_token);
        }
        return response;
    },
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
