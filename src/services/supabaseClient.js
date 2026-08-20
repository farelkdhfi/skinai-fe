/**
 * Supabase Client (Browser)
 * Dipakai khusus untuk trigger OAuth (Google Sign-In).
 * Operasi lain (query data, dsb) tetap lewat Node.js backend seperti biasa.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase env vars (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) belum diset.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);