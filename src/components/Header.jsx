import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import {
    Camera, LayoutDashboard, User, Menu, X, LogOut, ChevronRight, Loader2
} from 'lucide-react';

import { ROUTES } from '../config.js';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();

    const [isScrolled, setIsScrolled] = useState(false);
    const [isVisible, setIsVisible] = useState(true); 
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    // State untuk modal konfirmasi dan proses loading
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Detect scroll direction and styling
    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            setIsScrolled(currentScrollY > 20);

            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    // Prevent body scroll when mobile menu or logout modal is open
    useEffect(() => {
        if (isMobileMenuOpen || showLogoutConfirm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen, showLogoutConfirm]);

    // Fungsi async untuk handle proses logout
    const handleConfirmLogout = async () => {
        setIsLoggingOut(true);
        try {
            await logout();
            setShowLogoutConfirm(false);
            navigate('/');
        } catch (error) {
            console.error("Gagal logout:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    const navItems = [
        { path: ROUTES.ANALYZE, label: 'Analyze', icon: Camera },
        { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: (isVisible || isMobileMenuOpen) ? 0 : '-100%' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} 
                className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${isScrolled || isMobileMenuOpen
                        ? 'bg-white/80 md:bg-white/70 backdrop-blur-xl border-b border-zinc-200/50 py-3 md:py-3 shadow-sm'
                        : 'bg-transparent py-4 md:py-6'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">

                    {/* --- LOGO (Cinematic Style) --- */}
                    <div className="relative z-50 flex items-center gap-2 group">
                        <div className="flex items-center text-xl md:text-2xl tracking-tighter">
                            <span className="font-semibold text-zinc-900">SKin</span>
                            <span className="font-serif italic text-zinc-500 group-hover:text-indigo-600 transition-colors duration-500">AI</span>
                        </div>
                    </div>

                    {/* --- DESKTOP NAV --- */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* Navigation Links */}
                        <nav className="flex items-center gap-1 bg-zinc-100/50 p-1 rounded-full border border-white/50 backdrop-blur-md">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`relative px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${isActive
                                                ? 'text-zinc-900 bg-white shadow-sm'
                                                : 'text-zinc-500 hover:text-zinc-900 hover:bg-white/50'
                                            }`}
                                    >
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    className="group px-5 py-2.5 rounded-full bg-zinc-50 border border-zinc-200 text-zinc-600 text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex items-center gap-2"
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            ) : (
                                <Link to={ROUTES.LOGIN}>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-6 py-2.5 rounded-full bg-[#111] text-white text-sm font-medium hover:bg-black transition-all shadow-lg shadow-zinc-900/20 flex items-center gap-2"
                                    >
                                        <User size={16} />
                                        <span>Login</span>
                                    </motion.button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* --- MOBILE HAMBURGER --- */}
                    <button
                        className="md:hidden z-50 p-2 text-zinc-900 rounded-full hover:bg-zinc-100 active:bg-zinc-200 transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </motion.header>

            {/* --- MOBILE MENU OVERLAY --- */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl pt-24 px-4 pb-10 md:hidden flex flex-col justify-between overflow-y-auto"
                    >
                        {/* --- TOMBOL CLOSE (X) TAMBAHAN --- */}
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-zinc-900 bg-white/80 rounded-full hover:bg-zinc-100 active:bg-zinc-200 transition-colors z-50"
                            aria-label="Close mobile menu"
                        >
                            <X size={28} />
                        </button>

                        <div className="flex flex-col gap-6">
                            <nav className="flex flex-col gap-3">
                                {navItems.map((item, idx) => (
                                    <motion.div
                                        key={item.path}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + (idx * 0.1) }}
                                    >
                                        <Link
                                            to={item.path}
                                            className={`flex items-center justify-between p-4 rounded-xl border transition-all active:scale-[0.98] ${
                                                location.pathname === item.path 
                                                ? 'bg-zinc-50 border-zinc-200 shadow-sm' 
                                                : 'bg-white border-transparent shadow-none hover:bg-zinc-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full ${
                                                    location.pathname === item.path ? 'bg-white text-black' : 'bg-zinc-100 text-zinc-500'
                                                }`}>
                                                    <item.icon size={20} />
                                                </div>
                                                <span className={`text-base font-medium ${
                                                    location.pathname === item.path ? 'text-zinc-900' : 'text-zinc-600'
                                                }`}>{item.label}</span>
                                            </div>
                                            <ChevronRight size={18} className="text-zinc-300" />
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="h-px bg-zinc-100 w-full my-1"
                            />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-4"
                        >
                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        setShowLogoutConfirm(true);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full py-3.5 rounded-xl bg-red-50 text-red-600 font-semibold flex items-center justify-center gap-2 border border-red-100 active:scale-[0.98] transition-transform"
                                >
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to={ROUTES.LOGIN}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-3.5 rounded-xl bg-[#111] text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10 active:scale-[0.98] transition-transform"
                                >
                                    <User size={20} />
                                    Login
                                </Link>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* --- LOGOUT CONFIRMATION MODAL --- */}
            <AnimatePresence>
                {showLogoutConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl"
                        >
                            <h3 className="text-xl font-semibold text-zinc-900 mb-2">Confirm Logout</h3>
                            <p className="text-zinc-600 mb-6 text-sm">
                                Are you sure you want to log out of your account?
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    disabled={isLoggingOut}
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmLogout}
                                    disabled={isLoggingOut}
                                    className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center gap-2 disabled:bg-red-400 disabled:cursor-not-allowed"
                                >
                                    {isLoggingOut ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Logging out...
                                        </>
                                    ) : (
                                        <>
                                            <LogOut size={16} />
                                            Logout
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export default Header;