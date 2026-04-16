import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Calendar, Trash2,
    ChevronRight, AlertTriangle, X, Loader2, Sparkles, ScanLine,
    Filter, CalendarDays, ChevronDown
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { historyAPI } from '../services/api';
import { DIAGNOSIS_COLORS, ROUTES } from '../config';
import Header from '../components/Header';

// --- MODAL COMPONENT ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={!isLoading ? onClose : undefined}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-zinc-100 font-sans"
                    >
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-start mb-5">
                                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                </div>
                                <button onClick={onClose} disabled={isLoading} className="p-2 text-zinc-400 hover:text-zinc-800 transition-colors disabled:opacity-50">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <h3 className="text-xl font-medium text-zinc-900 mb-2">{title}</h3>
                            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">{message}</p>
                            <div className="flex gap-3">
                                <button onClick={onClose} disabled={isLoading} className="flex-1 px-4 py-2.5 rounded-lg border border-zinc-200 text-zinc-700 text-sm font-medium hover:bg-zinc-50 transition-colors disabled:opacity-50">Cancel</button>
                                <button onClick={onConfirm} disabled={isLoading} className="flex-1 px-4 py-2.5 rounded-lg bg-zinc-900 text-white text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                                    {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /><span>Deleting...</span></> : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

// --- HistoryCard Component (Minimalist & Elegant Style) ---
function HistoryCard({ analysis, onDelete, t }) {
    const colors = DIAGNOSIS_COLORS[analysis.skin_condition] || DIAGNOSIS_COLORS.Normal;
    const dateObj = new Date(analysis.created_at);
    const date = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

    const handleDeleteClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(analysis.id);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="col-span-1"
        >
            <Link
                to={`/history/${analysis.id}`}
                className="group flex flex-col bg-white rounded-2xl h-full shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-zinc-100/80 transition-all duration-500 relative overflow-hidden"
            >
                {/* Image Container */}
                <div className="aspect-[4/5] sm:aspect-square w-full bg-zinc-50/50 relative overflow-hidden shrink-0">
                    {analysis.image_url ? (
                        <img
                            src={analysis.image_url}
                            alt={`Scan ${analysis.skin_condition}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-zinc-300 gap-2">
                            <Sparkles className="w-6 h-6 opacity-50" />
                        </div>
                    )}

                    {/* Minimalist Badge */}
                    <div className="absolute top-4 right-4 px-2.5 py-1.5 bg-white/90 backdrop-blur-md rounded-md flex items-center gap-1.5 shadow-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${colors.bg.replace('bg-', 'bg-').replace('100', '500')}`} />
                        <span className="text-[10px] font-medium text-zinc-800 uppercase tracking-widest">{analysis.skin_condition}</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 p-5 bg-white relative z-10">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-zinc-400 font-medium tracking-wider uppercase">
                            {date}
                        </span>
                        <div className="flex items-center gap-1 text-zinc-900">
                            <span className="text-sm font-light">{(analysis.confidence_score * 100).toFixed(0)}% Match</span>
                        </div>
                    </div>

                    <div className="mt-auto pt-5 flex items-center justify-between group/action">
                        <span className="text-xs font-medium text-zinc-900 group-hover:text-zinc-600 transition-colors flex items-center gap-1">
                            Details
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform opacity-50" />
                        </span>

                        <button
                            onClick={handleDeleteClick}
                            className="text-zinc-300 hover:text-red-500 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 bg-white"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// --- MAIN PAGE ---
export default function HistoryListPage() {
    const { isAuthenticated } = useAuth();
    const { t } = useLanguage();

    // States Data
    const [analyses, setAnalyses] = useState([]);
    const [loading, setLoading] = useState(true);

    // States Filter
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterDate, setFilterDate] = useState('All');

    // Modal states
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);

    // Background Animation
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 1000], [0, 300]);

    // Fetch History
    useEffect(() => {
        const fetchHistory = async () => {
            if (!isAuthenticated) return;
            try {
                setLoading(true);
                const response = await historyAPI.getAll();
                setAnalyses(response.data.analyses || []);
            } catch (err) {
                console.error('Failed to fetch history:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();

        // Polling: cek ulang setiap 5 detik kalau ada gambar yang masih null
        const interval = setInterval(async () => {
            if (!isAuthenticated) return;
            try {
                const response = await historyAPI.getAll();
                const latest = response.data.analyses || [];
                const stillMissingImages = latest.some(a => !a.image_url);
                setAnalyses(latest);
                // Stop polling kalau semua gambar udah ada
                if (!stillMissingImages) clearInterval(interval);
            } catch { }
        }, 5000);

        return () => clearInterval(interval); // cleanup saat unmount
    }, [isAuthenticated]);

    // Delete Logic
    const promptDelete = (id) => setDeleteModal({ isOpen: true, id: id });

    const executeDelete = async () => {
        const id = deleteModal.id;
        if (!id) return;

        setIsDeleting(true);
        try {
            await historyAPI.delete(id);
        } catch (err) {
            // Cek apakah errornya karena data memang sudah tidak ada (404)
            if (err.response?.status !== 404) {
                console.error('Failed to delete analysis:', err);
                alert('Failed to delete analysis');
                setIsDeleting(false);
                return; // Stop eksekusi di sini kalau errornya bukan 404
            }
            console.warn("Data sudah tidak ada, anggap berhasil");
        }

        // Baris di bawah ini akan tereksekusi jika sukses API ATAU jika error 404
        setAnalyses(prev => prev.filter(item => item.id !== id));
        setDeleteModal({ isOpen: false, id: null });
        setIsDeleting(false);
    };

    // Extract unique categories for filter options
    const uniqueCategories = ['All', ...new Set(analyses.map(item => item.skin_condition))];

    // Filter Logic
    const filteredAnalyses = analyses.filter(item => {
        // Cek Kategori
        const matchCategory = filterCategory === 'All' ||
            item.skin_condition.toLowerCase() === filterCategory.toLowerCase();

        // Cek Tanggal
        let matchDate = true;
        if (filterDate !== 'All') {
            const itemDate = new Date(item.created_at);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (filterDate === 'Today') {
                matchDate = itemDate >= today;
            } else if (filterDate === 'Week') {
                const lastWeek = new Date(today);
                lastWeek.setDate(lastWeek.getDate() - 7);
                matchDate = itemDate >= lastWeek;
            } else if (filterDate === 'Month') {
                const lastMonth = new Date(today);
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                matchDate = itemDate >= lastMonth;
            }
        }

        return matchCategory && matchDate;
    });

    return (
        <div className="min-h-screen bg-[#F8F8F7] text-zinc-950 selection:bg-black selection:text-white pb-20 overflow-x-hidden font-sans">
            <Header />

            {/* Cinematic Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <motion.div
                    style={{ y: bgY }}
                    className="absolute -top-[10%] right-[10%] w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-gradient-to-b from-indigo-50/50 to-transparent rounded-full blur-[80px] md:blur-[120px] opacity-60"
                />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32">

                {/* --- HEADER --- */}
                <div className="mb-10 md:mb-16">
                    <Link to={ROUTES.DASHBOARD} className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-6 md:mb-8 text-sm font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Dashboard</span>
                    </Link>

                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-zinc-900 leading-tight mb-3">
                                Scan <span className="font-serif italic text-zinc-400">Gallery.</span>
                            </h1>
                            <p className="text-zinc-500 font-light text-base md:text-lg max-w-lg">
                                Visual repository of your dermatological journey. AI-powered insights, preserved.
                            </p>
                        </motion.div>

                        {/* --- FILTER CONTROLS --- */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto"
                        >
                            {/* Filter Kategori */}
                            <div className="relative w-full sm:w-48">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Filter className="w-4 h-4 text-zinc-400" />
                                </div>
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="appearance-none w-full bg-white/80 backdrop-blur-md border border-zinc-200/80 text-zinc-900 rounded-xl pl-11 pr-10 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-900 shadow-sm transition-all text-sm cursor-pointer font-medium"
                                >
                                    {uniqueCategories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat === 'All' ? 'All Conditions' : cat}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                                </div>
                            </div>

                            {/* Filter Tanggal */}
                            <div className="relative w-full sm:w-44">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <CalendarDays className="w-4 h-4 text-zinc-400" />
                                </div>
                                <select
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="appearance-none w-full bg-white/80 backdrop-blur-md border border-zinc-200/80 text-zinc-900 rounded-xl pl-11 pr-10 py-3 focus:outline-none focus:ring-1 focus:ring-zinc-900 shadow-sm transition-all text-sm cursor-pointer font-medium"
                                >
                                    <option value="All">All Time</option>
                                    <option value="Today">Today</option>
                                    <option value="Week">Last 7 Days</option>
                                    <option value="Month">This Month</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* --- HISTORY GRID --- */}
                <div className="min-h-[400px]">
                    <AnimatePresence>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 gap-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-zinc-100 shadow-sm">
                                <Loader2 className="w-6 h-6 animate-spin text-zinc-900" />
                            </div>
                        ) : filteredAnalyses.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {filteredAnalyses.map((analysis) => (
                                    <HistoryCard
                                        key={analysis.id}
                                        analysis={analysis}
                                        onDelete={promptDelete}
                                        t={t}
                                    />
                                ))}
                            </motion.div>
                        ) : (
                            <div className="py-24 text-center px-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-zinc-100 shadow-sm">
                                <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100">
                                    <Sparkles className="w-6 h-6 text-zinc-300" />
                                </div>
                                <p className="text-lg text-zinc-900 font-medium mb-1">No scans found</p>
                                <p className="text-sm text-zinc-400 max-w-sm mx-auto">
                                    {(filterCategory !== 'All' || filterDate !== 'All')
                                        ? `No scans found for ${filterCategory !== 'All' ? filterCategory : 'selected'} conditions in this timeframe.`
                                        : "Start your journey by running your first skin analysis."}
                                </p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Confirm Delete Modal */}
                <ConfirmModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, id: null })}
                    onConfirm={executeDelete}
                    title="Delete Scan"
                    message="This action cannot be undone. The scan image and its AI data will be permanently removed."
                    isLoading={isDeleting}
                />
            </main>
        </div>
    );
}