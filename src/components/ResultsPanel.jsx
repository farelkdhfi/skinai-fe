/**
 * ResultsPanel Component
 * Displays skin analysis results with animations
 */

import { motion } from 'framer-motion';
import { Check, Sparkles, Droplets, Info } from 'lucide-react';
import { DIAGNOSIS_COLORS } from '../config';

export function ResultsPanel({ results, patches }) {
    if (!results) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-16"
        >
            {/* Main Diagnosis Card */}
            <motion.div
                variants={itemVariants}
                className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <div className="absolute top-4 right-4">
                    <Sparkles className="w-6 h-6 text-indigo-300" />
                </div>

                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
                >
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Overall Diagnosis
                    </h2>
                    <div className="text-5xl font-black text-slate-800 mb-2">
                        {results.final_diagnosis}
                    </div>
                    <p className="text-slate-500">Based on multi-patch facial analysis</p>
                </motion.div>
            </motion.div>

            {/* Patch Results Grid */}
            <motion.div variants={itemVariants} className="mt-10">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-indigo-600 rounded-full" />
                    AI Focus Analysis
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {results.patch_results.map((item, idx) => (
                        <PatchCard key={idx} item={item} patch={patches[item.area]} />
                    ))}
                </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
                variants={itemVariants}
                className="mt-12 bg-white rounded-3xl p-8 shadow-xl border border-slate-100"
            >
                <h3 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-indigo-500" />
                    Recommended Ingredients
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {results.recommendations.map((rec, i) => (
                        <RecommendationCard key={i} recommendation={rec} index={i} />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}

function PatchCard({ item, patch }) {
    const colors = DIAGNOSIS_COLORS[item.diagnosis] || DIAGNOSIS_COLORS.Normal;

    return (
        <motion.div
            whileHover={{ y: -5, boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.15)' }}
            className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 transition-shadow"
        >
            <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold uppercase text-slate-400">
                    {item.area}
                </span>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}>
                    {item.diagnosis}
                </span>
            </div>

            <div className="relative aspect-square rounded-xl overflow-hidden group">
                <img
                    src={patch}
                    alt={`${item.area} patch`}
                    className="w-full h-full object-cover"
                />
                {item.heatmap && (
                    <img
                        src={item.heatmap}
                        alt="Heatmap overlay"
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-[10px] text-white font-medium flex items-center justify-center gap-1">
                        <Info className="w-3 h-3" />
                        Hover for Heatmap
                    </p>
                </div>
            </div>

            <div className="mt-3 text-center">
                <div className="text-xs text-slate-400">Confidence</div>
                <div className="font-mono text-sm font-bold text-slate-700">
                    {item.confidence}
                </div>
            </div>
        </motion.div>
    );
}

function RecommendationCard({ recommendation, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="flex gap-4 p-4 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 transition-colors cursor-default"
        >
            <div className="mt-1 w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4" />
            </div>
            <div>
                <h4 className="font-bold text-slate-800">{recommendation.name}</h4>
                <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {recommendation.function}
                </p>
            </div>
        </motion.div>
    );
}
