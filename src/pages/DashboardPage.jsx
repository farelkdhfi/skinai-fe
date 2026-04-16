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
    ChevronRight, ScanLine, ArrowUpRight, AlertTriangle, X, Loader2
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { dashboardAPI, historyAPI } from '../services/api';
import { DIAGNOSIS_COLORS, ROUTES } from '../config';
import Header from '../components/Header';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, isLoading }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={!isLoading ? onClose : undefined}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    />
                    
                    {/* Modal Box */}
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

// 1. Tilt Card (Kartu 3D)
const TiltCard = ({ children, className, noHover = false }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e) => {
        if (noHover || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: noHover ? 0 : rotateX,
                rotateY: noHover ? 0 : rotateY,
                transformStyle: "preserve-3d"
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className={`relative ${className}`}
        >
            {children}
        </motion.div>
    );
};

// 2. Stat Card (Glass Style)
const StatCard = ({ icon: Icon, label, value, trend, highlight }) => (
    <div className={`
        h-full p-4 sm:p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border relative overflow-hidden group transition-all duration-300
        ${highlight
            ? 'bg-[#1A1A1A] border-[#333] text-white shadow-2xl'
            : 'bg-white/60 backdrop-blur-xl border-white/40 hover:border-indigo-200/50 hover:bg-white/80'
        }
    `}>
        {/* Decorative Glow */}
        {highlight && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[50px] -mr-10 -mt-10" />
        )}

        <div className="relative z-10 flex flex-col h-full justify-between gap-4 md:gap-0">
            <div className="flex justify-between items-start mb-2 md:mb-4">
                <div className={`p-1.5 sm:p-2 md:p-2.5 rounded-xl md:rounded-2xl ${highlight ? 'bg-white/10' : 'bg-[#F4F4F5]'}`}>
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${highlight ? 'text-white' : 'text-zinc-700'}`} strokeWidth={1.5} />
                </div>
                {highlight && <ArrowUpRight className="text-zinc-500 w-4 h-4 md:w-5 md:h-5" />}
            </div>

            <div>
                {/* Responsive Text Size for Stats */}
                <h3 className={`text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-1 md:mb-2 ${highlight ? 'text-white' : 'text-zinc-900'}`}>
                    {value}
                </h3>
                <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 ${highlight ? 'text-zinc-400' : 'text-zinc-400'}`}>
                    {label}
                </p>
                <p className={`text-[9px] md:text-xs ${highlight ? 'text-indigo-400' : 'text-indigo-600'} flex items-center gap-1`}>
                    {trend}
                </p>
            </div>
        </div>
    </div>
);

// 3. Skeleton Loading Component
const DashboardSkeleton = () => (
    <div className="w-full animate-pulse">
        {/* Bento Grid Stats Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-8">
            {/* Highlight Card Skeleton */}
            <div className="h-[140px] sm:h-[200px] md:h-[240px] p-4 sm:p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1A1A]/80 border border-[#333] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-xl md:rounded-2xl" />
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-white/10 rounded" />
                </div>
                <div>
                    <div className="h-8 md:h-12 w-16 md:w-24 bg-white/10 rounded-lg mb-2" />
                    <div className="h-2.5 md:h-3 w-12 md:w-16 bg-white/10 rounded mb-1.5" />
                    <div className="h-2 md:h-2.5 w-10 md:w-12 bg-white/10 rounded" />
                </div>
            </div>

            {/* Normal Card Skeletons */}
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[140px] sm:h-[200px] md:h-[240px] p-4 sm:p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white/60 border border-white/40 flex flex-col justify-between">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-200/60 rounded-xl md:rounded-2xl" />
                    <div>
                        <div className="h-8 md:h-12 w-16 md:w-24 bg-zinc-200/60 rounded-lg mb-2" />
                        <div className="h-2.5 md:h-3 w-12 md:w-16 bg-zinc-200/60 rounded mb-1.5" />
                        <div className="h-2 md:h-2.5 w-10 md:w-12 bg-zinc-200/60 rounded" />
                    </div>
                </div>
            ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* Timeline Chart Skeleton */}
            <div className="lg:col-span-2 bg-white/60 border border-white/40 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 h-[260px] sm:h-[300px] md:h-[400px] flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="h-5 md:h-6 w-32 bg-zinc-200/60 rounded mb-2" />
                        <div className="h-3 md:h-4 w-48 bg-zinc-200/60 rounded" />
                    </div>
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-zinc-200/60 rounded-full" />
                </div>
                <div className="flex-1 w-full bg-zinc-200/40 rounded-xl" />
            </div>

            {/* Distribution Chart Skeleton */}
            <div className="lg:col-span-1 bg-white/60 border border-white/40 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 h-[320px] sm:h-[300px] md:h-[400px] flex flex-col">
                <div className="h-5 md:h-6 w-32 bg-zinc-200/60 rounded mb-2" />
                <div className="h-3 md:h-4 w-24 bg-zinc-200/60 rounded mb-6" />
                <div className="flex-1 relative flex items-center justify-center mb-6">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-zinc-200/60 rounded-full" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="h-6 md:h-8 w-12 bg-white/60 rounded mb-1" />
                        <div className="h-2 w-8 bg-white/60 rounded" />
                    </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-zinc-200/60" />
                                <div className="h-3 w-16 bg-zinc-200/60 rounded" />
                            </div>
                            <div className="h-3 w-8 bg-zinc-200/60 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* History List Skeleton */}
        <div className="w-full bg-white/80 border border-white/60 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
            <div className="p-5 md:p-8 border-b border-zinc-100 flex items-center justify-between">
                <div className="h-5 md:h-6 w-40 bg-zinc-200/60 rounded" />
                <div className="h-4 w-24 md:w-32 bg-zinc-200/60 rounded" />
            </div>
            <div className="divide-y divide-zinc-100">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-3 sm:p-4 md:p-6 lg:p-8 flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-6">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-zinc-200/60 shrink-0" />
                            <div>
                                <div className="h-4 md:h-5 w-24 md:w-32 bg-zinc-200/60 rounded mb-1.5 md:mb-2" />
                                <div className="h-2 md:h-3 w-32 md:w-40 bg-zinc-200/60 rounded" />
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="h-5 md:h-7 w-12 md:w-16 bg-zinc-200/60 rounded mb-1.5 ml-auto" />
                            <div className="h-2 md:h-2.5 w-16 md:w-20 bg-zinc-200/60 rounded ml-auto hidden sm:block" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- MAIN PAGE ---

export default function DashboardPage() {
    const { isAuthenticated } = useAuth();
    const { t } = useLanguage();
    const [stats, setStats] = useState(null);
    const [trendData, setTrendData] = useState([]);
    const [recentAnalyses, setRecentAnalyses] = useState([]);
    const [conditionDistribution, setConditionDistribution] = useState([]);
    const [loading, setLoading] = useState(true);

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null });
    const [isDeleting, setIsDeleting] = useState(false);

    // Parallax Background
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 1000], [0, 300]);

    const promptDelete = (id) => {
        setDeleteModal({ isOpen: true, id: id });
    }

    const executeDelete = async () => {
        const id = deleteModal.id;
        if (!id) return;

        setIsDeleting(true);
        try {
            await historyAPI.delete(id);
        } catch (err) {
            // Jika error BUKAN 404, tampilkan alert dan hentikan proses
            if (err.response?.status !== 404) {
                console.error('Failed to delete analysis:', err);
                alert('Failed to delete analysis');
                setIsDeleting(false);
                return; 
            }
            console.warn("Data sudah tidak ada, anggap berhasil");
        }

        // --- Proses ini akan berjalan jika API sukses ATAU error 404 ---
        try {
            // Optimistic update
            setRecentAnalyses(prev => prev.filter(item => item.id !== id));

            // Fetch data terbaru untuk stats
            const response = await dashboardAPI.getStats();
            setStats(response.data.stats);
            if (response.data.recent_analyses) {
                setRecentAnalyses(response.data.recent_analyses);
            }

            // Tutup modal setelah semuanya selesai
            setDeleteModal({ isOpen: false, id: null });
        } catch (err) {
            console.error('Error refreshing dashboard data:', err);
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        const fetchDashboard = async () => {
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }
            try {
                const response = await dashboardAPI.getStats();
                setStats(response.data.stats);
                setConditionDistribution(response.data.stats.condition_distribution || []);
                setTrendData(response.data.trend_data || []);
                setRecentAnalyses(response.data.recent_analyses || []);
            } catch (err) {
                console.error('Failed to fetch dashboard:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [isAuthenticated]);

    // Demo Data
    const demoStats = {
        total_analyses: 0,
        most_frequent_condition: 'None',
        average_confidence: 0,
        improvement_percentage: 0
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

                {loading ? (
                    <DashboardSkeleton />
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
                                    <Link to={ROUTES.LOGIN} className="font-bold text-zinc-900 hover:underline">{t('login')}</Link> to save your progress and access detailed history.
                                </p>
                            </motion.div>
                        )}

                        {/* --- BENTO GRID STATS --- */}
                        {/* Diubah menjadi grid-cols-2 untuk mobile agar lebih padat */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-8">
                            <TiltCard className="col-span-1 h-[140px] sm:h-[200px] md:h-[240px]">
                                <StatCard
                                    icon={BarChart3}
                                    label={t('stats_total')}
                                    value={displayStats.total_analyses}
                                    trend="Lifetime Scans"
                                    highlight={true}
                                />
                            </TiltCard>

                            <TiltCard className="col-span-1 h-[140px] sm:h-[200px] md:h-[240px]">
                                <StatCard
                                    icon={Target}
                                    label={t('stats_frequent')}
                                    value={displayStats.most_frequent_condition || '-'}
                                    trend="Dominant Condition"
                                />
                            </TiltCard>

                            <TiltCard className="col-span-1 h-[140px] sm:h-[200px] md:h-[240px]">
                                <StatCard
                                    icon={ScanLine}
                                    label={t('stats_confidence')}
                                    value={`${(displayStats.average_confidence * 100).toFixed(0)}%`}
                                    trend="AI Precision Score"
                                />
                            </TiltCard>

                            <TiltCard className="col-span-1 h-[140px] sm:h-[200px] md:h-[240px]">
                                <StatCard
                                    icon={TrendingUp}
                                    label={t('stats_improvement')}
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
                                            <h3 className="text-lg md:text-xl font-medium text-zinc-900">{t('chart_timeline')}</h3>
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
                                    <h3 className="text-lg md:text-xl font-medium text-zinc-900 mb-1">{t('chart_distribution')}</h3>
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
                                    <Link to={ROUTES.HISTORY_LIST || '#'} className="group flex items-center gap-1 md:gap-2 text-xs md:text-sm font-medium text-zinc-500 hover:text-indigo-600 transition-colors">
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
                                            <HistoryRow key={i} analysis={analysis} onDelete={promptDelete} t={t} />
                                        ))
                                    ) : (
                                        <div className="py-16 md:py-24 text-center px-4">
                                            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-zinc-50 to-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-inner">
                                                <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-zinc-300" />
                                            </div>
                                            <p className="text-lg md:text-xl text-zinc-900 font-medium mb-2">No analyses yet</p>
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
                    onClose={() => setDeleteModal({ isOpen: false, id: null })}
                    onConfirm={executeDelete}
                    title="Delete Analysis Record?"
                    message="This action cannot be undone. This scan and its AI confidence data will be permanently removed from your history."
                    isLoading={isDeleting}
                />
            </main>
        </div>
    );
}

// --- SUB-COMPONENTS ---

function HistoryRow({ analysis, onDelete, t }) {
    const colors = DIAGNOSIS_COLORS[analysis.skin_condition] || DIAGNOSIS_COLORS.Normal;
    const dateObj = new Date(analysis.created_at);
    const date = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const time = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    const handleDeleteClick = (e) => {
        e.preventDefault();
        onDelete(analysis.id);
    };

    return (
        <Link to={`/history/${analysis.id}`} className="group relative flex items-center justify-between p-3 sm:p-4 md:p-6 lg:p-8 hover:bg-white transition-colors duration-300">
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex items-center gap-3 md:gap-6 relative z-10">
                {/* Image UI */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl border border-zinc-200 bg-zinc-50 group-hover:scale-105 transition-transform duration-300 shrink-0 relative shadow-sm">
                    {analysis.image_url ? (
                        <img
                            src={analysis.image_url}
                            alt={`Scan ${analysis.skin_condition}`}
                            className="w-full h-full object-cover rounded-xl md:rounded-2xl"
                        />
                    ) : (
                        <div className="w-full h-full rounded-xl md:rounded-2xl flex items-center justify-center bg-zinc-100 text-zinc-400 text-[10px]">
                            No Img
                        </div>
                    )}

                    {/* Status Dot */}
                    <div className="absolute -bottom-1 -right-1 md:-bottom-1.5 md:-right-1.5">
                        <div
                            className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white"
                            style={{ backgroundColor: colors.hex || '#e4e4e7' }}
                        />
                    </div>
                </div>

                <div>
                    <p className="font-medium text-zinc-900 text-sm md:text-lg mb-0.5 md:mb-1">{analysis.skin_condition}</p>
                    <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-zinc-400 font-mono tracking-wide uppercase">
                        <span>{date}</span>
                        <span className="w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-zinc-300" />
                        <span>{time}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-8 relative z-10">
                {/* Menampilkan Persentase Confidence di Mobile, tidak disembunyikan lagi */}
                <div className="text-right block">
                    <span className="block text-base sm:text-xl md:text-2xl font-light text-zinc-900">
                        {(analysis.confidence_score * 100).toFixed(0)}%
                    </span>
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-zinc-300 uppercase tracking-widest hidden sm:block">Confidence</span>
                </div>

                <div className="flex items-center gap-1 md:gap-2">
                    <button
                        onClick={handleDeleteClick}
                        className="p-2 md:p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg md:rounded-xl transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-x-4 md:group-hover:translate-x-0 duration-300 z-20 relative"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-2 md:p-3 text-zinc-300 group-hover:text-indigo-600 transition-colors">
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md p-3 md:p-4 border border-zinc-200/50 shadow-2xl rounded-xl md:rounded-2xl">
                <p className="text-xs md:text-sm font-semibold text-zinc-900 mb-1">{payload[0].payload.name || payload[0].payload.date}</p>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-indigo-500" />
                    <p className="text-[10px] md:text-xs text-zinc-500 font-mono">
                        Value: <span className="text-zinc-900 font-bold">{payload[0].value}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};