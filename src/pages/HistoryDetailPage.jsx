import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Calendar, Info, TrendingUp, AlertCircle,
    Check, ExternalLink, Trash2, Sparkles, Network, Eye, EyeOff,
    AlertTriangle, ArrowRight,
    X,
    Loader2
} from 'lucide-react';
import { historyAPI } from '../services/api';
import { DIAGNOSIS_COLORS, ROUTES, API_URL } from '../config';
import Header from '../components/Header';
import LoadingScreenAnalyze from '../components/LoadingScreenAnalyze';
import IngredientDetailModal from '../components/IngredientDetailModal';

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

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 50, damping: 20 }
    }
};

export default function HistoryDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // State untuk toggle heatmap & Modal AI Chat
    const [showHeatmap, setShowHeatmap] = useState(true);
    const [selectedIngredient, setSelectedIngredient] = useState(null);

    // modal delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleted, setIsDeleted] = useState(false);

    // Mencegah scroll body saat modal terbuka
    useEffect(() => {
        if (selectedIngredient) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [selectedIngredient]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await historyAPI.delete(id);
            setIsDeleted(true);
            navigate(ROUTES.DASHBOARD);
        } catch (err) {
            if (err.response?.status === 404) {
                console.warn("Data sudah tidak ada, anggap berhasil");
                navigate(ROUTES.DASHBOARD);
            } else {
                console.error('Error deleting scan:', err);
                alert('Failed to delete scan');
            }
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    useEffect(() => {
        const fetchAnalysis = async () => {
            try {
                const response = await historyAPI.getById(id);
                setAnalysis(response.data.analysis);
            } catch (err) {
                console.error('Fetch error:', err);
                setError('Failed to load analysis details');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchAnalysis();

        // Polling: refresh sampai semua gambar tersedia
        if (!isDeleted) {
            const interval = setInterval(async () => {
                try {
                    const response = await historyAPI.getById(id);
                    const data = response.data.analysis;
                    setAnalysis(data);

                    const mainImagesReady = data.image_url && data.heatmap_image_url;
                    const patchImagesReady = data.analysis_patches?.every(
                        p => p.image_url && p.heatmap_image_url
                    );
                    if (mainImagesReady && patchImagesReady) clearInterval(interval);
                } catch (err) {
                    if (err.response?.status === 404) {
                        clearInterval(interval); // STOP kalau data hilang
                    }
                }
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [id]);

    if (loading) {
        return <LoadingScreenAnalyze />;
    }

    if (error || !analysis) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-6">
                <div className="text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-2xl font-medium text-zinc-900 mb-2">Unable to load</h2>
                    <p className="text-zinc-500 mb-8 font-light">{error || 'Analysis not found'}</p>
                    <Link to={ROUTES.DASHBOARD} className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const colors = DIAGNOSIS_COLORS[analysis.skin_condition] || DIAGNOSIS_COLORS.Normal;
    const dateObj = new Date(analysis.created_at);
    const date = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        const baseUrl = API_URL.replace(/\/api\/?$/, '');
        return `${baseUrl}${path}`;
    };

    // Ambil gambar base dan overlay
    const baseImageUrl = getImageUrl(analysis.image_url);
    const overlayImageUrl = getImageUrl(analysis.cfcm_image_url || analysis.heatmap_image_url);
    const hasOverlay = !!overlayImageUrl;

    return (
        <div className="min-h-screen bg-white text-zinc-950 selection:bg-indigo-100 selection:text-indigo-900 pb-24">
            <Header />

            <motion.main
                className="max-w-5xl mx-auto px-4 md:px-6 pt-28 md:pt-36"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* --- Top Navigation --- */}
                <motion.div variants={itemVariants} className="flex items-center justify-between mb-10 md:mb-16">
                    <Link to={ROUTES.DASHBOARD} className="group inline-flex items-center text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2.5 group-hover:-translate-x-1.5 transition-transform" />
                        <span className="text-sm font-medium">Back to Dashboard</span>
                    </Link>

                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="text-zinc-400 hover:text-red-600 transition-colors p-2"
                        title="Delete Analysis"
                    >
                        <Trash2 className="w-5 h-5" strokeWidth={1.5} />
                    </button>
                </motion.div>

                {/* --- Main Grid Layout --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 mb-16 md:mb-24">

                    {/* --- Left Column: Result & Stats --- */}
                    <div className="lg:col-span-5 space-y-8 md:space-y-10 lg:pt-6">
                        {/* Hero Result */}
                        <motion.div variants={itemVariants}>
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-500 mb-6 md:mb-8">
                                <span className={`w-2 h-2 rounded-full ${colors.bg.replace('bg-', 'bg-').replace('100', '500')}`}></span>
                                History Record
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tighter text-zinc-900 mb-5 md:mb-6 capitalize leading-[0.95] md:leading-[0.9]">
                                {analysis.skin_condition}
                            </h1>
                            <p className="text-base md:text-lg text-zinc-500 font-light leading-relaxed max-w-xl lg:max-w-none">
                                Archived analysis report based on your skin's texture, oiliness, and pore profile.
                            </p>
                        </motion.div>

                        {/* Stats Grid */}
                        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 border-t border-zinc-100 pt-8">
                            <div className="flex items-center gap-5 md:gap-7">
                                <div className="relative w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 shrink-0">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-zinc-100" />
                                        <circle
                                            cx="50%" cy="50%" r="45%"
                                            stroke="currentColor" strokeWidth="5" fill="transparent"
                                            strokeDasharray={`${analysis.confidence_score * 280} 280`}
                                            className={`${colors.text.replace('text-', 'text-')}`}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                                        <span className="text-sm md:text-base font-bold text-zinc-900">{(analysis.confidence_score * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium text-zinc-900 text-sm md:text-base">Confidence Score</h3>
                                    <div className="text-xs md:text-sm text-zinc-400 font-light flex items-center gap-1.5 mt-1.5">
                                        <TrendingUp className="w-3.5 h-3.5" />
                                        <span className="truncate">High Precision</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-5 md:gap-7 mt-4 lg:mt-6">
                                <div className="w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 shrink-0 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-400">
                                    <Calendar className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-zinc-900 text-sm md:text-base">{date}</h3>
                                    <div className="text-xs md:text-sm text-zinc-400 font-light flex items-center gap-1.5 mt-1.5">
                                        <span>{time}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Technical Info */}
                        <motion.div variants={itemVariants} className="bg-indigo-50/50 rounded-2xl p-5 md:p-6 border border-indigo-100/50 mt-6">
                            <div className="flex items-center gap-2 mb-3 text-indigo-900">
                                <Info className="w-4 h-4" />
                                <span className="text-sm font-semibold">Methodology</span>
                            </div>
                            <p className="text-sm text-indigo-900/70 leading-relaxed font-light">
                                This analysis utilized the <strong>{analysis.voting_method}</strong> method, scanning <strong>{analysis.patches_analyzed} distinct regions</strong> of the face to ensure diagnostic accuracy.
                            </p>
                        </motion.div>
                    </div>

                    {/* --- Right Column: Visuals --- */}
                    <div className="lg:col-span-7">
                        <div className="space-y-12 md:space-y-16">
                            {/* 1. CFCM: Full Spectrum Scan */}
                            {(baseImageUrl || overlayImageUrl) ? (
                                <motion.div variants={itemVariants}>
                                    <div className="flex items-baseline justify-between mb-6 md:mb-8">
                                        <h3 className="text-base md:text-lg font-medium text-zinc-900">Composite Condition Map</h3>
                                        <span className="text-[10px] md:text-xs text-zinc-400 font-light uppercase tracking-wider">Holistic View</span>
                                    </div>
                                    <div className="relative bg-zinc-100 rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-zinc-200 shadow-sm aspect-square flex items-center justify-center">
                                        {/* Base Layer */}
                                        {baseImageUrl && (
                                            <img
                                                src={baseImageUrl}
                                                alt="Original Map Capture"
                                                className="w-full h-full object-cover absolute inset-0"
                                            />
                                        )}

                                        {/* Overlay Layer */}
                                        {hasOverlay && (
                                            <>
                                                <img
                                                    src={overlayImageUrl}
                                                    alt="Composite Facial Condition Map"
                                                    className={`w-full h-full object-cover relative z-10 transition-opacity duration-500 ${showHeatmap ? 'opacity-100' : 'opacity-0'}`}
                                                />
                                                <div className={`absolute bottom-5 right-5 px-4 py-2 bg-black/50 backdrop-blur text-white text-[10px] md:text-xs font-medium rounded-full border border-white/10 shadow-lg z-20 transition-opacity duration-500 ${showHeatmap ? 'opacity-100' : 'opacity-0'}`}>
                                                    Grad-CAM Overlay
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div variants={itemVariants} className="p-8 md:p-12 border border-dashed border-zinc-200 rounded-[2.5rem] text-center text-zinc-400 font-light text-sm md:text-base">
                                    Composite image not available in history.
                                </motion.div>
                            )}

                            {/* 2. Focus Patches (Regional Analysis) */}
                            {analysis.analysis_patches?.length > 0 && (
                                <motion.div variants={itemVariants}>
                                    <div className="flex items-baseline justify-between mb-6 md:mb-8">
                                        <h3 className="text-base md:text-lg font-medium text-zinc-900">Regional Analysis</h3>
                                        <span className="text-[10px] md:text-xs text-zinc-400 font-light uppercase tracking-wider">Micro-texture Features</span>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                                        {analysis.analysis_patches.map((patch, idx) => (
                                            <PatchCard
                                                key={idx}
                                                item={patch}
                                                imageUrl={getImageUrl(patch.image_url)}
                                                heatmapUrl={getImageUrl(patch.heatmap_image_url)}
                                                showHeatmap={showHeatmap}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* --- Heatmap Toggle Relocated Here --- */}
                            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 bg-zinc-50 border border-zinc-100 rounded-[1.25rem] sm:rounded-[1.5rem]">
                                <div>
                                    <h4 className="text-[11px] sm:text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                                        <Eye className="w-3.5 h-3.5 text-zinc-500" />
                                        Visual Controls
                                    </h4>
                                    <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-1">Toggle to see exactly what the AI sees</p>
                                </div>
                                <button
                                    onClick={() => setShowHeatmap(!showHeatmap)}
                                    className={`relative flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 text-[11px] sm:text-xs font-medium rounded-full transition-all shadow-sm w-full sm:w-auto ${
                                        showHeatmap 
                                            ? 'bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-md' 
                                            : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50'
                                    }`}
                                >
                                    {showHeatmap ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                    {showHeatmap ? 'Hide AI Heatmap' : 'Show AI Heatmap'}
                                </button>
                            </motion.div>

                        </div>
                    </div>
                </div>

                {/* --- Recommendations Section --- */}
                {analysis.recommended_ingredients && (
                    <motion.section variants={itemVariants} className="border-t border-zinc-100 pt-12 md:pt-20">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 md:mb-14">
                            <div className="flex gap-4">
                                <span className="hidden sm:block w-2 h-9 bg-indigo-600 rounded-full shrink-0"></span>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2.5">
                                        <h2 className="text-xl md:text-2xl font-medium text-zinc-900">Condition-Anchored Regimen</h2>
                                        <span className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0">
                                            <Network className="w-3.5 h-3.5" /> Semantic Clustering
                                        </span>
                                    </div>
                                    <p className="text-sm md:text-base text-zinc-400 font-light mt-2 max-w-2xl">
                                        Algorithmically clustered ingredients matching your {analysis.skin_condition} skin profile.
                                    </p>
                                </div>
                            </div>
                            {/* AI Chat Badge */}
                            <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-full shadow-sm">
                                <Sparkles className="w-4 h-4 text-indigo-300" />
                                <span className="text-xs font-medium text-white">SkinAI Assistant Ready</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
                            {/* Primary */}
                            {analysis.recommended_ingredients.primary_ingredients && (
                                <div className="space-y-6 md:space-y-8">
                                    <h3 className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                        Primary Match (Anchor Cluster)
                                    </h3>
                                    <div className="space-y-4">
                                        {analysis.recommended_ingredients.primary_ingredients.map((ing, i) => (
                                            <IngredientRow key={i} ingredient={ing} type="primary" onViewDetails={setSelectedIngredient} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Alternatives */}
                            {analysis.recommended_ingredients.alternative_ingredients?.length > 0 && (
                                <div className="space-y-6 md:space-y-8">
                                    <h3 className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-zinc-300"></span>
                                        Alternative Options (Supporting Clusters)
                                    </h3>
                                    <div className="space-y-4">
                                        {analysis.recommended_ingredients.alternative_ingredients.map((ing, i) => (
                                            <IngredientRow key={i} ingredient={ing} type="secondary" onViewDetails={setSelectedIngredient} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Fallback for simple array format from older database records */}
                            {Array.isArray(analysis.recommended_ingredients) && (
                                <div className="space-y-6 md:space-y-8 col-span-full">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        {analysis.recommended_ingredients.map((ing, i) => (
                                            <IngredientRow key={i} ingredient={ing} type="primary" onViewDetails={setSelectedIngredient} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.section>
                )}
            </motion.main>

            {/* --- Render Modal Detail --- */}
            <AnimatePresence>
                {selectedIngredient && (
                    <IngredientDetailModal 
                        ingredient={selectedIngredient} 
                        onClose={() => setSelectedIngredient(null)} 
                    />
                )}
            </AnimatePresence>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete History"
                message="Are you sure you want to delete this specific analysis record? This action cannot be undone."
                isLoading={isDeleting}
            />
        </div>
    );
}

// --- Sub-components ---

function PatchCard({ item, imageUrl, heatmapUrl, showHeatmap }) {
    const colors = DIAGNOSIS_COLORS[item.predicted_class] || DIAGNOSIS_COLORS.Normal;

    return (
        <div className="group relative bg-zinc-50 rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-100 hover:border-zinc-300 transition-all duration-300">
            <div className="aspect-square relative bg-zinc-200">
                {/* Base Image */}
                {imageUrl ? (
                    <img src={imageUrl} alt={item.region} className="w-full h-full object-cover absolute inset-0" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-300 text-xs bg-zinc-100 absolute inset-0">No Image</div>
                )}

                {/* Heatmap Overlay Toggleable */}
                {heatmapUrl && (
                    <div className={`absolute inset-0 transition-opacity duration-500 z-10 ${showHeatmap ? 'opacity-100' : 'opacity-0'}`}>
                        <img src={heatmapUrl} alt="Heatmap" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                )}

                {/* Floating Badge */}
                <div className="absolute top-2.5 left-2.5 md:top-3.5 md:left-3.5 z-20">
                    <span className={`text-[9px] md:text-[10px] font-bold px-2 py-1 md:px-2.5 md:py-1.5 rounded-full bg-white/90 backdrop-blur shadow-sm ${colors.text}`}>
                        {item.predicted_class}
                    </span>
                </div>
            </div>

            <div className="p-3 md:p-4 bg-white relative z-10">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] md:text-xs font-bold uppercase text-zinc-400 tracking-wider truncate pr-2">
                        {item.region}
                    </span>
                    <span className="font-mono text-[10px] md:text-xs font-bold text-zinc-900 shrink-0">
                        {(item.confidence * 100).toFixed(0)}%
                    </span>
                </div>
            </div>
        </div>
    );
}

function IngredientRow({ ingredient, type = 'primary', onViewDetails }) {
    const isPrimary = type === 'primary';
    return (
        <div className={`
            group flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 md:gap-5 p-3.5 sm:p-4 md:p-5 rounded-[1.25rem] sm:rounded-2xl border transition-all duration-300
            ${isPrimary
                ? 'bg-white border-zinc-200 hover:border-indigo-300 hover:shadow-lg'
                : 'bg-zinc-50/50 border-transparent hover:bg-white hover:border-zinc-200 hover:shadow-sm'
            }
        `}>
            <div className="flex items-start gap-3 w-full">
                <div className={`mt-0.5 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shrink-0 ${isPrimary ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-200 text-zinc-500'}`}>
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                        <h4 className="font-medium text-sm md:text-base text-zinc-900 truncate">{ingredient.name}</h4>
                    </div>
                    <p className="text-[11px] sm:text-xs md:text-sm text-zinc-500 font-light leading-relaxed line-clamp-2 mb-3 sm:mb-4">
                        {ingredient.what_it_does}
                    </p>
                    
                    {/* Tombol View Details dengan AI Prompt */}
                    <button 
                        onClick={() => onViewDetails(ingredient)}
                        className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] md:text-xs font-semibold px-3.5 py-2 sm:px-4 sm:py-2 rounded-full transition-all w-max
                            ${isPrimary 
                                ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-sm' 
                                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:shadow-sm'
                            }`}
                    >
                        <Sparkles className={`w-3 h-3 md:w-3.5 md:h-3.5 ${isPrimary ? 'text-indigo-500' : 'text-zinc-500'}`} />
                        Detail & Ask SkinAI <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}