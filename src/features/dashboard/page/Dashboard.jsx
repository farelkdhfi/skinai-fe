import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
    AnimatePresence
} from 'framer-motion';
import {
    BarChart3, TrendingUp, Calendar, ArrowRight,
    Activity, Target, Trash2, Plus, Sparkles,
    ChevronRight, ScanLine, ArrowUpRight, AlertTriangle, X, Loader2,
    Smile
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

import { useAuth } from '../../../context/AuthContext';
import { dashboardAPI } from '../../../services/api';
import { DIAGNOSIS_COLORS, ROUTES } from '../../../config';
import Header from '../../../components/Header';
import { useQuery } from '@tanstack/react-query';
// PERUBAHAN 1: pakai mutation delete yang sudah ada (useDeleteHistory) alih-alih
// bikin useMutation manual di dalam komponen ini. Keuntungannya: onSuccess di
// dalamnya sudah otomatis invalidate ['history'] (list & detail history ikut
// fresh), tinggal kita tambahkan invalidate ['dashboard'] juga di sini karena
// dashboard adalah data agregat yang tidak diketahui oleh useDeleteHistory.
import { useDeleteHistory } from '../../history/useDeleteHistory';
import { Skeleton } from '../components/Skeleton';
import { HistoryRow, StatCard, TiltCard } from '../components/Card';
import { CustomTooltip } from '../components/CustomTooltip';

const getDashboardData = async () => {
    const res = await dashboardAPI.getStats()
    return res.data
}

// Diaktifkan lagi (sempat dinonaktifkan) - komponen sama persis dengan yang
// dipakai di HistoryDetail.jsx, supaya delete di Dashboard juga minta
// konfirmasi dulu sebelum benar-benar menghapus.
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

export default function Dashboard() {
    const { isAuthenticated } = useAuth();

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['dashboard'],
        queryFn: getDashboardData,
        enabled: !!isAuthenticated
    })

    const stats = data?.stats
    const trendData = data?.trend_data ?? []
    const recentAnalyses = data?.recent_analyses ?? []
    const conditionDistribution = data?.stats?.condition_distribution ?? []

    // Parallax Background
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 1000], [0, 300]);

    // PERUBAHAN 2: deleteMutation sekarang dari useDeleteHistory() (sudah
    // otomatis invalidate ['history'] di onSuccess-nya sendiri). Di sini kita
    // tambahkan refetch ['dashboard'] juga supaya stats & recent list di
    // halaman ini ikut ter-update setelah delete berhasil.
    const deleteMutation = useDeleteHistory();

    // Modal konfirmasi delete diaktifkan lagi: klik tombol delete di
    // HistoryRow tidak langsung menghapus, tapi buka modal dulu lewat
    // promptDelete(). Mutation baru dijalankan setelah user menekan
    // tombol "Delete" di dalam ConfirmModal (lihat handleConfirmDelete).
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });

    const promptDelete = (id) => {
        setDeleteModal({ isOpen: true, id });
    };

    const closeDeleteModal = () => {
        if (deleteMutation.isPending) return;
        setDeleteModal({ isOpen: false, id: null });
    };

    const handleConfirmDelete = () => {
        if (!deleteModal.id) return;
        deleteMutation.mutate(deleteModal.id, {
            onSuccess: () => {
                // ['history'] sudah diinvalidate oleh useDeleteHistory sendiri.
                // ['dashboard'] perlu direfresh manual di sini karena berisi
                // data agregat (stats, trend, recent_analyses) yang tidak
                // diketahui oleh hook useDeleteHistory.
                refetch();
            },
            onSettled: () => {
                setDeleteModal({ isOpen: false, id: null });
            },
        });
    };

    // Demo Data
    const demoStats = {
        total_analyses: 0,
        most_frequent_condition: 'None',
        average_confidence: 0,
        improvement_percentage: 100
    };
    const demoPieData = [
        { name: 'Normal', value: 1 }, { name: 'Oily', value: 1 }, { name: 'Acne', value: 1 }
    ];

    const displayStats = stats || demoStats;
    const displayTrend = trendData.length > 0 ? trendData : [];
    const displayDistribution = conditionDistribution.length > 0 ? conditionDistribution : demoPieData;
    const hasData = recentAnalyses.length > 0;

    return (
        <div className="min-h-screen bg-[#F8F8F7] text-zinc-950 selection:bg-black selection:text-white pb-20 overflow-x-hidden font-sans">
            <Header />

            {/* Cinematic Background */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <motion.div
                    style={{ y: bgY }}
                    className="absolute -top-[10%] left-[20%] w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-gradient-to-b from-indigo-100/40 to-transparent rounded-full blur-[80px] md:blur-[120px] opacity-60"
                />
            </div>

            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32">

                {/* --- HEADER SECTION --- */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 md:mb-16 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className='max-w-2xl'
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-white/50 backdrop-blur-sm mb-4 md:mb-6">
                            <Activity size={12} className="text-indigo-600 animate-pulse" />
                            <span className="text-[10px] md:text-xs font-semibold tracking-wide text-neutral-500 uppercase">Live Dashboard</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-zinc-900 leading-[0.95] md:leading-[0.9] mb-4 md:mb-6">
                            Skin Health <br />
                            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-200">Overview.</span>
                        </h1>
                        <p className="text-zinc-500 font-light text-base md:text-xl leading-relaxed max-w-lg">
                            Track dermatological progression. AI-driven insights for your optimal skin health.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="w-full sm:w-auto"
                    >
                        <Link
                            to={ROUTES.ANALYZE}
                            className="group relative inline-flex h-12 md:h-14 items-center justify-center overflow-hidden rounded-full bg-[#111] px-8 font-medium text-white transition-all hover:bg-zinc-800 w-full sm:w-48 hover:sm:w-56 shadow-xl shadow-zinc-200"
                        >
                            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                                <div className="relative h-full w-8 bg-white/20" />
                            </div>
                            <Plus className="w-5 h-5 mr-2" />
                            <span>New Analysis</span>
                        </Link>
                    </motion.div>
                </div>

                {isLoading ? (
                    <Skeleton />
                ) : (
                    <>
                        {!isAuthenticated && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-4 md:p-6 mb-8 md:mb-12 flex items-center gap-4 shadow-sm"
                            >
                                <div className="p-2 md:p-3 bg-white rounded-full shadow-sm shrink-0">
                                    <Activity className="w-4 h-4 md:w-5 md:h-5 text-indigo-600" />
                                </div>
                                <p className="text-zinc-600 text-sm md:text-base">
                                    <Link to={ROUTES.LOGIN} className="font-bold text-zinc-900 hover:underline">login</Link> to save your progress and access detailed history.
                                </p>
                            </motion.div>
                        )}

                        {/* --- BENTO GRID STATS --- */}
                        {/* Diubah menjadi grid-cols-2 untuk mobile agar lebih padat */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-8">
                            <TiltCard className="col-span-1 h-[140px] sm:h-[200px] md:h-[240px]">
                                <StatCard
                                    icon={BarChart3}
                                    label='Total Analyses'
                                    value={displayStats.total_analyses}
                                    trend="Lifetime Scans"
                                    highlight={true}
                                />
                            </TiltCard>

                            <TiltCard className="col-span-1 h-[140px] sm:h-[200px] md:h-[240px]">
                                <StatCard
                                    icon={Target}
                                    label='Most Frequent'
                                    value={displayStats.most_frequent_condition || '-'}
                                    trend="Dominant Condition"
                                />
                            </TiltCard>

                            <TiltCard className="col-span-1 h-[140px] sm:h-[200px] md:h-[240px]">
                                <StatCard
                                    icon={ScanLine}
                                    label='Avg Confidence'
                                    value={`${(displayStats.average_confidence * 100).toFixed(0)}%`}
                                    trend="AI Precision Score"
                                />
                            </TiltCard>

                            <TiltCard className="col-span-1 h-[140px] sm:h-[200px] md:h-[240px]">
                                <StatCard
                                    icon={TrendingUp}
                                    label='Improvement'
                                    value={displayStats.improvement_percentage ? `+${displayStats.improvement_percentage}%` : '-'}
                                    trend="Health Index"
                                />
                            </TiltCard>
                        </div>

                        {/* --- CHARTS SECTION --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">

                            {/* Timeline Chart */}
                            <TiltCard className="lg:col-span-2" noHover={true}>
                                <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 h-[260px] sm:h-[300px] md:h-[400px] shadow-sm flex flex-col">
                                    <div className="flex justify-between items-start mb-4 md:mb-6">
                                        <div>
                                            <h3 className="text-lg md:text-xl font-medium text-zinc-900">Analysis Timeline</h3>
                                            <p className="text-xs md:text-sm text-zinc-400">Analysis frequency over time</p>
                                        </div>
                                        <Calendar className="text-zinc-300 w-5 h-5 md:w-6 md:h-6" />
                                    </div>

                                    <div className="flex-1 w-full -ml-2">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={displayTrend}>
                                                <defs>
                                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" strokeOpacity={0.5} />
                                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 10 }} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }} />
                                                <Area
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#6366f1"
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorValue)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </TiltCard>

                            {/* Distribution Chart */}
                            <TiltCard className="lg:col-span-1" noHover={true}>
                                <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 h-[320px] sm:h-[300px] md:h-[400px] shadow-sm flex flex-col relative overflow-hidden">
                                    <h3 className="text-lg md:text-xl font-medium text-zinc-900 mb-1">Condition Distribution</h3>
                                    <p className="text-xs md:text-sm text-zinc-400 mb-2 md:mb-4">Condition Ratio</p>

                                    <div className="flex-1 relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={displayDistribution}
                                                    cx="50%" cy="50%"
                                                    innerRadius={50} outerRadius={70}
                                                    dataKey="value"
                                                    paddingAngle={5}
                                                    stroke="none"
                                                    cornerRadius={8}
                                                >
                                                    {displayDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={DIAGNOSIS_COLORS[entry.name]?.hex || '#e4e4e7'} />
                                                    ))}
                                                </Pie>
                                                <Tooltip content={<CustomTooltip />} />
                                            </PieChart>
                                        </ResponsiveContainer>

                                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                            <span className="text-2xl sm:text-3xl md:text-4xl font-light text-zinc-900">{displayStats.total_analyses}</span>
                                            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Total</span>
                                        </div>
                                    </div>

                                    <div className="mt-2 md:mt-4 space-y-1 md:space-y-2 overflow-y-auto max-h-[80px] md:max-h-none">
                                        {displayDistribution.map((entry, index) => (
                                            <div key={index} className="flex items-center justify-between text-xs md:text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: DIAGNOSIS_COLORS[entry.name]?.hex || '#e4e4e7' }} />
                                                    <span className="text-zinc-600 truncate max-w-[100px]">{entry.name}</span>
                                                </div>
                                                <span className="font-mono text-zinc-400">
                                                    {hasData ? `${((entry.value / displayStats.total_analyses) * 100).toFixed(0)}%` : '-'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </TiltCard>
                        </div>

                        {/* --- RECENT HISTORY LIST --- */}
                        <TiltCard className="w-full" noHover={true}>
                            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-sm">
                                <div className="p-5 md:p-8 border-b border-zinc-100 flex items-center justify-between bg-white/50">
                                    <div>
                                        <h3 className="font-medium text-lg md:text-xl text-zinc-900 flex items-center gap-2">
                                            Recent Analysis
                                        </h3>
                                    </div>
                                    <Link to={ROUTES.HISTORY} className="group flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium text-zinc-500 hover:text-indigo-600 transition-colors">
                                        <span className="hidden sm:inline">View Full History</span>
                                        <span className="sm:hidden">View All</span>
                                        <span className="p-1 rounded-full bg-zinc-100 group-hover:bg-indigo-100 transition-colors">
                                            <ArrowRight size={12} className="md:w-3.5 md:h-3.5" />
                                        </span>
                                    </Link>
                                </div>

                                <div className="divide-y divide-zinc-100">
                                    {hasData ? (
                                        recentAnalyses.map((analysis, i) => (
                                            <HistoryRow key={i} analysis={analysis} onDelete={promptDelete} />
                                        ))
                                    ) : (
                                        <div className="py-16 md:py-24 text-center px-4">
                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-zinc-50 to-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner">
                                                <Smile className="w-6 h-6 md:w-8 md:h-8 text-zinc-300" />
                                            </div>
                                            <p className="text-lg md:text-xl text-zinc-900 font-medium mb-2">No analysis yet</p>
                                            <p className="text-sm md:text-base text-zinc-400">Start your journey to better skin health today.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </TiltCard>
                    </>
                )}

                <ConfirmModal
                    isOpen={deleteModal.isOpen}
                    onClose={closeDeleteModal}
                    onConfirm={handleConfirmDelete}
                    title="Delete Analysis Record?"
                    message="This action cannot be undone. This scan and its AI confidence data will be permanently removed from your history."
                    isLoading={deleteMutation.isPending}
                />
            </main>
        </div>
    );
}