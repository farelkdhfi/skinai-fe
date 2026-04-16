import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft, Save, RefreshCw, Sparkles,
    Check, Info, ExternalLink,
    Loader2, Network, Eye, EyeOff
} from 'lucide-react';

import { useAnalysis } from '../context/AnalysisContext';
import { useAuth } from '../context/AuthContext';
import { DIAGNOSIS_COLORS, ROUTES } from '../config';
import Header from '../components/Header';

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
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

export default function ResultsPage() {
    const navigate = useNavigate();
    const { results, patches, recommendations, saveToHistory } = useAnalysis();
    const { isAuthenticated } = useAuth();
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // State untuk toggle heatmap
    const [showHeatmap, setShowHeatmap] = useState(true);

    const { user, session } = useAuth()

    // Redirect if no results
    useEffect(() => {
        if (!results) {
            navigate(ROUTES.ANALYZE);
        }
    }, [results, navigate]);

    if (!results) return null;

    const diagnosis = results.final_result?.class || 'Unknown';
    const confidence = results.final_result?.confidence || 0;
    const votingMethod = results.final_result?.voting_method || '';
    const colors = DIAGNOSIS_COLORS[diagnosis] || DIAGNOSIS_COLORS.Normal;

    // Mendapatkan gambar full face asli dari context untuk dijadikan base
    const originalFullImage = patches['full_image'] || patches['camera_capture'] || patches['single_patch'];

    const handleSave = async () => {
        if (isSaved || isSaving) return;

        setIsSaving(true);
        try {
            const saved = await saveToHistory(user.id, session?.access_token);
            if (saved) {
                setIsSaved(true);
                navigate(ROUTES.DASHBOARD)
            }
        } catch (error) {
            console.error("Failed to save", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-zinc-950 pb-36 sm:pb-32 md:pb-24">
            <Header />

            <motion.main
                className="max-w-5xl mx-auto px-4 md:px-6 pt-24 sm:pt-28 md:pt-36 pb-8 md:pb-12"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* --- Top Nav --- */}
                <motion.div variants={itemVariants} className="flex items-center justify-between mb-8 sm:mb-10 md:mb-16">
                    <Link to={ROUTES.ANALYZE} className="group inline-flex items-center text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2 sm:mr-2.5 group-hover:-translate-x-1.5 transition-transform" />
                        <span className="text-xs sm:text-sm font-medium">Discard & Return</span>
                    </Link>
                    <div className="text-[9px] sm:text-[10px] md:text-xs font-medium text-zinc-300 uppercase tracking-widest text-right">
                        Analysis Complete
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 md:gap-16 mb-12 sm:mb-16 md:mb-24">
                    {/* --- Left Column: Diagnosis Headline --- */}
                    <div className="lg:col-span-5 space-y-6 sm:space-y-8 md:space-y-10 lg:pt-6">
                        <motion.div variants={itemVariants} className="relative">
                            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-[10px] sm:text-xs font-medium text-zinc-500 mb-5 md:mb-8">
                                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-500" />
                                AI Diagnosis
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-zinc-900 mb-4 md:mb-6 leading-[1.1] sm:leading-[0.95] md:leading-[0.9]">
                                {diagnosis}
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg text-zinc-500 font-light leading-relaxed max-w-xl lg:max-w-none">
                                Our deep learning model identified this condition based on texture, oiliness, and pore analysis.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="flex items-center gap-4 sm:gap-5 md:gap-7 pt-6 sm:pt-8 border-t border-zinc-100">
                            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 shrink-0">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-zinc-100" />
                                    <circle
                                        cx="50%" cy="50%" r="45%"
                                        stroke="currentColor" strokeWidth="5" fill="transparent"
                                        strokeDasharray={`${confidence * 280} 280`}
                                        className={`${colors.text.replace('text-', 'text-')}`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className="text-xs sm:text-sm md:text-base font-bold text-zinc-900">{(confidence * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                            <div>
                                <h3 className="font-medium text-zinc-900 text-sm md:text-base">Confidence Score</h3>
                                <div className="text-[10px] sm:text-xs md:text-sm text-zinc-400 font-light flex items-center gap-1.5 mt-1 sm:mt-1.5">
                                    <Info className="w-3.5 h-3.5 shrink-0" />
                                    <span className="truncate max-w-[150px] sm:max-w-[200px]">Method: {votingMethod}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* --- Right Column: Visuals --- */}
                    <div className="lg:col-span-7">
                        {/* Tombol Toggle Heatmap - Posisi Diperbaiki agar enak dilihat */}
                        <motion.div variants={itemVariants} className="flex justify-end mb-6 md:mb-8">
                            <button
                                onClick={() => setShowHeatmap(!showHeatmap)}
                                className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 text-[11px] sm:text-xs font-medium rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                            >
                                {showHeatmap ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                                {showHeatmap ? 'Hide Heatmaps' : 'Show Heatmaps'}
                            </button>
                        </motion.div>

                        <div className="space-y-10 md:space-y-16">
                            {results.cfcm_image && (
                                <motion.div variants={itemVariants}>
                                    <div className="flex items-baseline justify-between mb-4 sm:mb-6 md:mb-8">
                                        <h3 className="text-sm sm:text-base md:text-lg font-medium text-zinc-900">Composite Condition Map</h3>
                                        <span className="text-[9px] sm:text-[10px] md:text-xs text-zinc-400 font-light uppercase tracking-wider">Holistic View</span>
                                    </div>
                                    <div className="relative bg-zinc-100 rounded-[1.5rem] sm:rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-zinc-200 shadow-sm aspect-square flex items-center justify-center">
                                        {/* Base Layer: Gambar Wajah Asli */}
                                        {originalFullImage && (
                                            <img 
                                                src={originalFullImage} 
                                                alt="Original Facial Map" 
                                                className="w-full h-full object-cover absolute inset-0" 
                                            />
                                        )}
                                        
                                        {/* Overlay Layer: Heatmap CFCM */}
                                        <img
                                            src={results.cfcm_image}
                                            alt="Composite Facial Condition Map"
                                            className={`w-full h-full object-cover relative z-10 transition-opacity duration-500 ${showHeatmap ? 'opacity-100' : 'opacity-0'}`}
                                        />
                                        <div className={`absolute bottom-3 right-3 sm:bottom-5 sm:right-5 px-3 py-1.5 sm:px-4 sm:py-2 bg-black/50 backdrop-blur text-white text-[9px] sm:text-[10px] md:text-xs font-medium rounded-full border border-white/10 shadow-lg transition-opacity duration-500 z-20 ${showHeatmap ? 'opacity-100' : 'opacity-0'}`}>
                                            Grad-CAM Overlay
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {results.predictions?.length === 1 && (results.predictions[0].region === 'full_image' || results.predictions[0].region === 'single_patch') ? (
                                <motion.div variants={itemVariants}>
                                    <SingleImageCard
                                        item={results.predictions[0]}
                                        patch={patches[results.predictions[0].region] || originalFullImage}
                                        heatmap={results.gradcam_heatmaps?.[results.predictions[0].region]}
                                        showHeatmap={showHeatmap}
                                    />
                                </motion.div>
                            ) : (
                                <motion.div variants={itemVariants}>
                                    <div className="flex items-baseline justify-between mb-4 sm:mb-6 md:mb-8">
                                        <h3 className="text-sm sm:text-base md:text-lg font-medium text-zinc-900">Regional Analysis</h3>
                                        <span className="text-[9px] sm:text-[10px] md:text-xs text-zinc-400 font-light uppercase tracking-wider">Micro-texture Features</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                                        {results.predictions?.map((item, idx) => (
                                            <PatchCard
                                                key={idx}
                                                item={item}
                                                patch={patches[item.region]}
                                                heatmap={results.gradcam_heatmaps?.[item.region]}
                                                showHeatmap={showHeatmap}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- Recommendations Section --- */}
                {recommendations && (
                    <motion.section variants={itemVariants} className="border-t border-zinc-100 pt-10 md:pt-20">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8 md:mb-14">
                            <span className="hidden sm:block w-2 h-9 bg-indigo-600 rounded-full shrink-0"></span>
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-zinc-900">Condition-Anchored Regimen</h2>
                                    <span className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-bold uppercase tracking-wider shrink-0">
                                        <Network className="w-3.5 h-3.5" /> Semantic Clustering
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm md:text-base text-zinc-400 font-light mt-1.5 sm:mt-2 max-w-2xl">Algorithmically clustered ingredients matching your {diagnosis} skin profile.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                            <div className="space-y-5 sm:space-y-6 md:space-y-8">
                                <h3 className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 sm:gap-2.5">
                                    <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
                                    Primary Match (Anchor Cluster)
                                </h3>
                                <div className="space-y-3 sm:space-y-4">
                                    {recommendations.primary_ingredients?.map((ing, i) => (
                                        <IngredientRow key={i} ingredient={ing} type="primary" />
                                    ))}
                                </div>
                            </div>

                            {recommendations.alternative_ingredients?.length > 0 && (
                                <div className="space-y-5 sm:space-y-6 md:space-y-8">
                                    <h3 className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 sm:gap-2.5">
                                        <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-zinc-300 shrink-0"></span>
                                        Alternative Options (Supporting Clusters)
                                    </h3>
                                    <div className="space-y-3 sm:space-y-4">
                                        {recommendations.alternative_ingredients?.map((ing, i) => (
                                            <IngredientRow key={i} ingredient={ing} type="secondary" />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.section>
                )}

                {/* --- Sticky Action Bar --- */}
                <motion.div
                    variants={itemVariants}
                    className="fixed bottom-0 left-0 right-0 p-4 sm:p-5 md:p-7 bg-white/90 backdrop-blur-xl border-t border-zinc-200 z-50 safe-area-pb"
                >
                    <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-end gap-3 sm:gap-4 md:gap-5">
                        <span className="hidden sm:block text-[10px] sm:text-xs md:text-sm text-zinc-400 mr-auto">
                            Analysis ID: <span className="font-mono text-zinc-900">{results.analysis_id?.substring(0, 8) || '---'}</span>
                        </span>

                        <div className="flex w-full sm:w-auto gap-2.5 sm:gap-4">
                            <Link
                                to={ROUTES.ANALYZE}
                                className="flex-1 sm:flex-none sm:w-auto px-2 py-3 sm:px-5 md:px-7 sm:py-3.5 rounded-xl font-medium text-[13px] sm:text-sm md:text-base text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border border-transparent hover:border-zinc-200 transition-all flex items-center justify-center gap-1.5 sm:gap-2.5"
                            >
                                <RefreshCw className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                                Discard
                            </Link>

                            {isAuthenticated ? (
                                <button
                                    onClick={handleSave}
                                    disabled={isSaved || isSaving}
                                    className={`
                                        flex-1 sm:flex-none sm:w-auto px-4 py-3 sm:px-7 md:px-9 sm:py-3.5 rounded-xl font-medium text-[13px] sm:text-sm md:text-base flex items-center justify-center gap-1.5 sm:gap-2.5 transition-all shadow-lg
                                        ${isSaved
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            : 'bg-zinc-900 text-white hover:bg-zinc-800 hover:shadow-xl hover:-translate-y-0.5'
                                        }
                                    `}
                                >
                                    {isSaved ? (
                                        <>
                                            <Check className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> Saved
                                        </>
                                    ) : isSaving ? (
                                        <>
                                            <Loader2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 sm:w-4.5 sm:h-4.5" /> Save<span className="hidden sm:inline"> Analysis</span>
                                        </>
                                    )}
                                </button>
                            ) : (
                                <Link
                                    to={ROUTES.LOGIN}
                                    className="flex-1 sm:flex-none sm:w-auto px-4 py-3 sm:px-7 md:px-9 sm:py-3.5 bg-indigo-600 text-white rounded-xl font-medium text-[13px] sm:text-sm md:text-base flex items-center justify-center gap-1.5 sm:gap-2.5 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                >
                                    Login <span className="hidden sm:inline">to Save</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}

// --- Sub-components ---

function PatchCard({ item, patch, heatmap, showHeatmap }) {
    const colors = DIAGNOSIS_COLORS[item.predicted_class] || DIAGNOSIS_COLORS.Normal;

    return (
        <div className="group relative bg-zinc-50 rounded-[1rem] sm:rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-100 hover:border-zinc-300 transition-all duration-300">
            <div className="aspect-square relative bg-zinc-200">
                {patch && (
                    <img src={patch} alt={item.region} className="w-full h-full object-cover absolute inset-0" />
                )}
                {heatmap && (
                    <div className={`absolute inset-0 transition-opacity duration-500 z-10 ${showHeatmap ? 'opacity-100' : 'opacity-0'}`}>
                        <img src={heatmap} alt="Heatmap" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                )}
                <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 md:top-3.5 md:left-3.5 z-20">
                    <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 rounded-full bg-white/90 backdrop-blur shadow-sm ${colors.text}`}>
                        {item.predicted_class}
                    </span>
                </div>
            </div>

            <div className="p-2.5 sm:p-3 md:p-4 bg-white relative z-10">
                <div className="flex justify-between items-center gap-1 sm:gap-2">
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase text-zinc-400 tracking-wider truncate">
                        {item.region}
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] md:text-xs font-bold text-zinc-900 shrink-0">
                        {(item.confidence * 100).toFixed(0)}%
                    </span>
                </div>
            </div>
        </div>
    );
}

function SingleImageCard({ item, patch, heatmap, showHeatmap }) {
    const colors = DIAGNOSIS_COLORS[item.predicted_class] || DIAGNOSIS_COLORS.Normal;

    return (
        <div className="group relative bg-zinc-50 rounded-[1.5rem] sm:rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-zinc-200 shadow-sm aspect-4/3 flex items-center justify-center">
            {patch && (
                <img src={patch} alt="Analyzed skin" className="w-full h-full object-cover p-2.5 sm:p-3 md:p-4 absolute inset-0" />
            )}
            {heatmap && (
                <div className={`absolute inset-0 transition-opacity duration-500 z-10 ${showHeatmap ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={heatmap} alt="Heatmap" className="w-full h-full object-cover p-2.5 sm:p-3 md:p-4" />
                    <div className="absolute inset-0 bg-zinc-900/5 mix-blend-multiply pointer-events-none" />
                </div>
            )}
            <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/50 flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap z-20">
                <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-zinc-500">Prediction:</span>
                <span className={`text-[10px] sm:text-xs md:text-sm font-bold ${colors.text}`}>
                    {item.predicted_class}
                </span>
            </div>
        </div>
    );
}

function IngredientRow({ ingredient, type = 'primary' }) {
    const isPrimary = type === 'primary';

    return (
        <div className={`
            group flex items-start gap-3 sm:gap-4 md:gap-5 p-3.5 sm:p-4 md:p-5 rounded-[1.25rem] sm:rounded-2xl border transition-all duration-300
            ${isPrimary
                ? 'bg-white border-zinc-200 hover:border-indigo-300 hover:shadow-lg'
                : 'bg-zinc-50/50 border-transparent hover:bg-white hover:border-zinc-200'
            }
        `}>
            <div className={`mt-0.5 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shrink-0 ${isPrimary ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-200 text-zinc-500'}`}>
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" strokeWidth={3} />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 sm:gap-2.5 mb-1 md:mb-1.5">
                    <h4 className="font-medium text-sm md:text-base text-zinc-900 truncate">{ingredient.name}</h4>
                    {ingredient.reference_url && (
                        <a
                            href={ingredient.reference_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-300 hover:text-indigo-600 transition-colors shrink-0"
                        >
                            <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </a>
                    )}
                </div>
                <p className="text-[11px] sm:text-xs md:text-sm text-zinc-500 font-light leading-relaxed">
                    {ingredient.what_it_does}
                </p>
            </div>
        </div>
    );
}