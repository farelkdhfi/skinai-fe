/**
 * Auth Callback
 * Dipanggil Supabase setelah user selesai login via Google.
 * Tugas: ambil session dari Supabase, simpan ke localStorage
 * dengan key yang sama seperti login email/password biasa.
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../services/supabaseClient';
import { ROUTES } from '../../../config';

export default function AuthCallback() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleCallback = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error || !data.session) {
                console.error('Auth callback error:', error);
                setError('Gagal login dengan Google. Silakan coba lagi.');
                setTimeout(() => navigate(ROUTES.LOGIN), 2000);
                return;
            }

            const { access_token, refresh_token } = data.session;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            // full reload supaya AuthProvider re-check auth dari localStorage
            window.location.href = ROUTES.DASHBOARD;
        };

        handleCallback();
    }, [navigate]);

    if (error) {
        return <div style={{ padding: 40, textAlign: 'center' }}>{error}</div>;
    }

    return <div style={{ padding: 40, textAlign: 'center' }}>Menyelesaikan login...</div>;
}