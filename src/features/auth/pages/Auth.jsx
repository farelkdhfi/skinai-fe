import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Environment, Float } from '@react-three/drei';
import { Mail, Lock, Loader2, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';

import { useAuth } from '../../../context/AuthContext';
import { ROUTES } from '../../../config';
import { authAPI } from '../../../services/api';

// --- 1. Komponen 3D Dual Bubble Mesh (Hitam & Putih) ---
const DualBubbleMesh = () => {
    const bubble1Ref = useRef();
    const bubble2Ref = useRef();

    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (bubble1Ref.current) {
            bubble1Ref.current.rotation.x = t * 0.1;
            bubble1Ref.current.rotation.y = t * 0.15;
            bubble1Ref.current.position.y = Math.sin(t * 0.5) * 0.2;
        }
        if (bubble2Ref.current) {
            bubble2Ref.current.rotation.x = -t * 0.12;
            bubble2Ref.current.rotation.y = t * 0.1;
            bubble2Ref.current.position.y = Math.cos(t * 0.4) * 0.3 - 0.5;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
            <Sphere ref={bubble1Ref} args={[2.2, 64, 64]} position={[-0.4, 0, 0]}>
                <MeshDistortMaterial
                    color="#000000" speed={3} distort={0.4} radius={1}
                    roughness={0.05} metalness={0.8} clearcoat={1}
                    clearcoatRoughness={0.1} transparent={true} opacity={0.85}
                />
            </Sphere>
            <Sphere ref={bubble2Ref} args={[1.6, 64, 64]} position={[1.2, -0.5, -0.8]}>
                <MeshDistortMaterial
                    color="#ffffff" speed={4} distort={0.5} radius={1}
                    roughness={0.05} metalness={0.1} clearcoat={1}
                    clearcoatRoughness={0.1} transparent={true} opacity={0.5}
                />
            </Sphere>
            <Environment preset="city" />
        </Float>
    );
};

// --- 2. Animation Variants ---
// OPTIMASI: Menambahkan tipe 'tween' agar tidak menggunakan kalkulasi 'spring' default yang berat
const formContainerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
        opacity: 1, x: 0,
        transition: {
            type: "tween",
            duration: 0.4, // Sedikit dipercepat agar terasa lebih responsif
            ease: "easeOut",
            staggerChildren: 0.05 // Jarak stagger diperkecil agar tidak ada delay lama
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "tween", duration: 0.3, ease: "easeOut" }
    }
};

// OPTIMASI: Variants untuk elemen yang menggunakan height: 'auto'
// Animasi height sangat berat karena memicu "Layout Reflow" di browser. Kita paksakan pakai tween simpel.
const collapseVariants = {
    hidden: { opacity: 0, height: 0, transition: { type: "tween", duration: 0.2, ease: "easeIn" } },
    visible: { opacity: 1, height: 'auto', transition: { type: "tween", duration: 0.25, ease: "easeOut" } }
};

// --- 3. Main Auth Page Component ---
export default function Auth() {
    const navigate = useNavigate();
    const { login, register, isAuthenticated } = useAuth();

    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate(ROUTES.DASHBOARD);
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setError('');
        setSuccess('');

        if (!email || !password) {
            setError('Email and password are required.');
            return;
        }

        if (mode === 'register') {
            if (password !== confirmPassword) {
                setError('Passwords do not match.');
                return;
            }
            if (password.length < 6) {
                setError('Password must be at least 6 characters long.');
                return;
            }
        }

        setLoading(true);

        try {
            if (mode === 'login') {
                await login(email, password);
                navigate(ROUTES.DASHBOARD);
            } else {
                await register(email, password);
                setSuccess('Account created successfully! Please check your email.');
                setMode('login');
                setPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            console.error("API Error:", err);

            if (!err.response) {
                setError('Network error. Please check your connection or try again.');
                return;
            }

            const errorMessage = err.response?.data?.error || err.message || 'An unexpected error occurred. Please try again later.';
            const errLower = errorMessage.toLowerCase();

            if (errLower.includes('invalid login credentials')) {
                setError('Incorrect credentials. Please verify your email and password.');
            }
            else if (errLower.includes('already registered')) {
                setError('This email address is already registered. Please sign in instead.');
            }
            else if (errLower.includes('not found') || errLower.includes('invalid user') || errLower.includes('user not found')) {
                setError('No account found with this email address. Please create an account.');
            }
            else if (errLower.includes('password should be at least')) {
                setError('Password is too short. It must contain at least 6 characters.');
            }
            else {
                setError(errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setGoogleLoading(true);
        try {
            await authAPI.loginWithGoogle();
            // browser redirect otomatis ke Google, tidak sampai baris ini kalau sukses
        } catch (err) {
            console.error('Google sign-in error:', err);
            setError('Failed to start Google sign-in. Please try again.');
            setGoogleLoading(false);
        }
    };

    const toggleMode = (newMode) => {
        setMode(newMode);
        setError('');
        setSuccess('');
    };

    return (
        <div className="h-[100dvh] w-full bg-white flex flex-col lg:flex-row overflow-hidden">

            {/* --- KIRI: 3D Visual Mesh --- */}
            <div className="relative w-full lg:w-[50%] h-[28dvh] lg:h-full bg-zinc-100 flex items-center justify-center overflow-hidden shrink-0">
                <div className="absolute top-4 left-4 lg:top-8 lg:left-8 z-20 pointer-events-none">
                    <span className="font-black text-xl lg:text-3xl tracking-tight text-zinc-900">SkinAI.</span>
                </div>
                <div className="absolute inset-0 bg-zinc-300/40 rounded-full blur-[100px] pointer-events-none scale-150" />

                <Canvas camera={{ position: [0, 0, 8.5], fov: 45 }} className="w-full h-full z-10 cursor-grab active:cursor-grabbing">
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
                    <directionalLight position={[-10, -10, -5]} intensity={1} color="#a1a1aa" />
                    <DualBubbleMesh />
                </Canvas>
            </div>

            {/* --- KANAN: Form Login --- */}
            <div className="w-full lg:w-[50%] h-[72dvh] lg:h-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-10 relative bg-white shrink-0 overflow-hidden">
                <motion.div
                    className="w-full max-w-[320px] sm:max-w-sm"
                    variants={formContainerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="mb-4 lg:mb-8">
                        <Link to={ROUTES.HOME} className="inline-flex items-center text-[11px] lg:text-sm text-zinc-400 hover:text-zinc-900 transition-colors mb-3 lg:mb-6 group">
                            <ArrowLeft className="w-3 h-3 lg:w-4 lg:h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                        <h1 className="text-2xl lg:text-4xl font-medium tracking-tight text-zinc-900 mb-1 lg:mb-2">
                            {mode === 'login' ? 'Welcome back' : 'Create account'}
                        </h1>
                        <p className="text-xs lg:text-base text-zinc-500 font-light">
                            {mode === 'login'
                                ? 'Enter your credentials to access your dashboard.'
                                : 'Start your journey to better skin health today.'}
                        </p>
                    </motion.div>

                    <motion.div variants={itemVariants} className="mb-4 lg:mb-6 p-1 bg-zinc-100 rounded-lg flex relative">
                        <motion.div
                            layoutId="activeTab"
                            className="absolute top-1 bottom-1 rounded-md bg-white shadow-sm border border-zinc-200/50"
                            initial={false}
                            animate={{
                                left: mode === 'login' ? '4px' : '50%',
                                right: mode === 'login' ? '50%' : '4px',
                            }}
                            // OPTIMASI: Ganti spring yang berat kalkulasinya dengan tween simple
                            transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
                        />
                        <button
                            type="button"
                            onClick={() => toggleMode('login')}
                            className={`flex-1 relative z-10 py-1.5 lg:py-2 text-[11px] lg:text-sm font-medium transition-colors text-center ${mode === 'login' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            onClick={() => toggleMode('register')}
                            className={`flex-1 relative z-10 py-1.5 lg:py-2 text-[11px] lg:text-sm font-medium transition-colors text-center ${mode === 'register' ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                        >
                            Sign Up
                        </button>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
                        <AnimatePresence mode="wait">
                            {error && (
                                <motion.div
                                    variants={collapseVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="p-2 lg:p-3 rounded-lg bg-red-50 text-red-600 text-[10px] lg:text-sm flex items-center gap-2 border border-red-100 overflow-hidden style={{ willChange: 'opacity, height' }}"
                                >
                                    <AlertCircle size={14} className="shrink-0" /> {error}
                                </motion.div>
                            )}
                            {success && (
                                <motion.div
                                    variants={collapseVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className="p-2 lg:p-3 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] lg:text-sm flex items-center gap-2 border border-emerald-100 overflow-hidden style={{ willChange: 'opacity, height' }}"
                                >
                                    <CheckCircle size={14} className="shrink-0" /> {success}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <motion.div variants={itemVariants} className="space-y-3">
                            <div className="group">
                                <label className="block text-[9px] lg:text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 ml-1">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="w-full pl-9 lg:pl-11 pr-3 py-2 lg:py-3 text-xs lg:text-sm bg-zinc-50 border border-zinc-200 rounded-lg lg:rounded-xl focus:bg-white focus:border-zinc-900 focus:ring-0 outline-none transition-all text-zinc-900 placeholder:text-zinc-400"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <div className="flex justify-between items-center mb-1 ml-1">
                                    <label className="text-[9px] lg:text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                        Password
                                    </label>
                                    {mode === 'login' && (
                                        <button type="button" className="text-[9px] lg:text-xs text-zinc-500 hover:text-zinc-900 font-medium">Forgot?</button>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-9 lg:pl-11 pr-3 py-2 lg:py-3 text-xs lg:text-sm bg-zinc-50 border border-zinc-200 rounded-lg lg:rounded-xl focus:bg-white focus:border-zinc-900 focus:ring-0 outline-none transition-all text-zinc-900 placeholder:text-zinc-400"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {mode === 'register' && (
                                    <motion.div
                                        variants={collapseVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        className="overflow-hidden group style={{ willChange: 'opacity, height' }}"
                                    >
                                        <label className="block text-[9px] lg:text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1 ml-1 pt-1.5 lg:pt-2">
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full pl-9 lg:pl-11 pr-3 py-2 lg:py-3 text-xs lg:text-sm bg-zinc-50 border border-zinc-200 rounded-lg lg:rounded-xl focus:bg-white focus:border-zinc-900 focus:ring-0 outline-none transition-all text-zinc-900 placeholder:text-zinc-400"
                                                required
                                                disabled={loading}
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <motion.button
                            variants={itemVariants}
                            // OPTIMASI: scale animation di hover/tap cukup ringan karena pakai transform
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 lg:py-3.5 bg-zinc-900 text-white rounded-lg lg:rounded-xl font-medium shadow-lg shadow-zinc-200 hover:bg-black hover:shadow-xl transition-all flex items-center justify-center gap-2 mt-4 lg:mt-6 disabled:opacity-70 disabled:cursor-not-allowed text-xs lg:text-base"
                        >
                            {loading ? (
                                <Loader2 className="w-3.5 h-3.5 lg:w-5 lg:h-5 animate-spin" />
                            ) : (
                                mode === 'login' ? 'Sign In' : 'Create Account'
                            )}
                        </motion.button>
                    </form>

                    <motion.div variants={itemVariants} className="flex items-center gap-3 my-4 lg:my-6">
                        <div className="flex-1 h-px bg-zinc-200" />
                        <span className="text-[9px] lg:text-xs text-zinc-400 font-medium uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-zinc-200" />
                    </motion.div>

                    {/* --- Google Sign-In --- */}
                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading || googleLoading}
                        className="w-full py-2.5 lg:py-3.5 bg-white text-zinc-900 rounded-lg lg:rounded-xl font-medium border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed text-xs lg:text-base"
                    >
                        {googleLoading ? (
                            <Loader2 className="w-3.5 h-3.5 lg:w-5 lg:h-5 animate-spin" />
                        ) : (
                            <>
                                <svg className="w-3.5 h-3.5 lg:w-5 lg:h-5" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                                Continue with Google
                            </>
                        )}
                    </motion.button>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    className="absolute bottom-3 lg:bottom-6 text-[9px] lg:text-xs text-zinc-400 text-center w-full"
                >
                    &copy; 2026 SkinAI Analysis. All rights reserved.
                </motion.div>
            </div>
        </div>
    );
}