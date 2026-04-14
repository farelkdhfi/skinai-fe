import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Download, ExternalLink, Microscope } from 'lucide-react';
import { ROUTES } from '../config';
import HeaderLandingPage from '../components/HeaderLandingPage';

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

export default function PaperPage() {
    return (
        <div className="min-h-screen bg-white text-zinc-950 pb-16 sm:pb-24 font-sans selection:bg-zinc-200 selection:text-zinc-900">
            <HeaderLandingPage />

            <motion.main
                // Konsisten dengan AboutPage: max-w-5xl dan padding responsive
                className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 md:pt-40"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* --- Top Nav --- */}
                <motion.div variants={itemVariants} className="flex items-center justify-between mb-8 sm:mb-12 md:mb-16">
                    <Link to={ROUTES.HOME || '/'} className="group inline-flex items-center text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1.5 transition-transform" />
                        <span className="text-xs sm:text-sm font-medium">Back to Home</span>
                    </Link>
                    <div className="text-[10px] md:text-xs font-medium text-zinc-300 uppercase tracking-widest">
                        Research Paper
                    </div>
                </motion.div>

                {/* --- Paper Headline --- */}
                <motion.div variants={itemVariants} className="mb-10 sm:mb-12 md:mb-16">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] sm:text-xs font-medium text-emerald-600 mb-6 md:mb-8">
                        <Microscope className="w-3.5 h-3.5" />
                        Tugas Akhir
                    </div>
                    {/* Tipografi disesuaikan agar rapi di berbagai layar */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-zinc-900 mb-6 leading-[1.25] sm:leading-[1.15] md:leading-[1.1]">
                        Klasifikasi Kondisi Kulit Wajah Menggunakan MobileNetV2 Patch-Based dengan Explainable AI dan Sistem Rekomendasi Bahan Aktif Berbasis Clustering
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-sm md:text-base text-zinc-500 font-light">
                        <span>Penulis: <span className="font-medium text-zinc-900">Setia Farel Muamar Kadhafi</span></span>
                        <span className="hidden sm:block w-1 h-1 rounded-full bg-zinc-300" />
                        <span className="w-full sm:w-auto mt-1 sm:mt-0">2026</span>
                    </div>
                </motion.div>

                {/* --- Action Buttons --- */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16 md:mb-20">
                    <button className="w-full sm:w-auto px-6 py-3.5 bg-zinc-900 text-white rounded-xl md:rounded-2xl font-medium text-sm md:text-base flex items-center justify-center gap-2 hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all">
                        <Download className="w-4 h-4" />
                        Unduh Laporan (PDF)
                    </button>
                    <a 
                        href="https://github.com/your-repo" 
                        target="_blank" 
                        rel="noreferrer" 
                        className="w-full sm:w-auto px-6 py-3.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl md:rounded-2xl font-medium text-sm md:text-base flex items-center justify-center gap-2 hover:bg-zinc-50 hover:border-zinc-300 transition-all"
                    >
                        <ExternalLink className="w-4 h-4 text-zinc-400" />
                        Source Code
                    </a>
                </motion.div>

                {/* --- Abstract Section --- */}
                {/* Radius dibuat seragam dengan komponen AboutPage */}
                <motion.div variants={itemVariants} className="bg-zinc-50 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-zinc-100 overflow-hidden mb-12 sm:mb-16 md:mb-20">
                    <div className="px-5 sm:px-8 md:px-10 py-4 sm:py-5 border-b border-zinc-100 bg-white/50">
                        <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-zinc-400" />
                            <h2 className="text-base md:text-lg font-medium text-zinc-900">Abstrak</h2>
                        </div>
                    </div>
                    <div className="p-5 sm:p-8 md:p-10 space-y-4 sm:space-y-5 md:space-y-6 text-sm md:text-base text-zinc-500 font-light leading-relaxed">
                        <p>
                            Masalah kesehatan kulit wajah seperti jerawat (acne) dan kulit berminyak (oily) merupakan keluhan dermatologis yang umum, namun akses ke layanan profesional masih terbatas. Penelitian ini mengembangkan sistem analisis kondisi kulit wajah berbasis web <i>end-to-end</i> yang mengintegrasikan klasifikasi citra, penjelasan visual, dan rekomendasi perawatan.
                        </p>
                        <p>
                            Sistem memvalidasi input citra menggunakan Smart Camera Guidance sebelum mengekstraksi <i>patch</i> wajah (dahi, hidung, pipi). Model <strong className="font-medium text-zinc-700">MobileNetV2-Tuned</strong> digunakan untuk mengklasifikasikan kondisi kulit, didukung oleh mekanisme inovatif <strong className="font-medium text-zinc-700">Region-Aware Confidence Weighted Voting</strong> yang mengalokasikan bobot diagnostik spesifik pada tiap region, meningkatkan akurasi <i>face-level</i> secara signifikan.
                        </p>
                        <p>
                            Transparansi model diwujudkan melalui <strong className="font-medium text-zinc-700">Composite Facial Condition Map (CFCM)</strong> menggunakan Grad-CAM, memungkinkan interpretasi visual yang intuitif. Selanjutnya, rekomendasi perawatan dipersonalisasi menggunakan <strong className="font-medium text-zinc-700">Condition-Anchored Semantic Clustering</strong>, yang secara algoritmik mengelompokkan bahan aktif skincare tanpa pemetaan manual yang subjektif.
                        </p>
                    </div>
                </motion.div>

                {/* --- Key Findings Metrics --- */}
                <motion.div variants={itemVariants} className="pb-8">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6 md:mb-8">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-zinc-900">Hasil Evaluasi Utama</h3>
                        <span className="text-[10px] md:text-xs text-zinc-400 font-light uppercase tracking-wider">Metrics</span>
                    </div>
                    {/* Grid responsif: 1 kolom (mobile), 2 kolom (tablet), 3 kolom (desktop) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                        {/* Metric 1 */}
                        <div className="bg-white border border-zinc-100 rounded-2xl md:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-3xl md:text-4xl font-medium tracking-tighter text-indigo-600 mb-2 sm:mb-3">94.77%</div>
                            <div className="text-sm font-medium text-zinc-900 mb-1.5">Akurasi Klasifikasi</div>
                            <div className="text-xs text-zinc-500 font-light leading-relaxed">
                                Meningkat 2.14% dari baseline MobileNetV2 melalui hyperparameter tuning.
                            </div>
                        </div>
                        {/* Metric 2 */}
                        <div className="bg-white border border-zinc-100 rounded-2xl md:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="text-3xl md:text-4xl font-medium tracking-tighter text-emerald-500 mb-2 sm:mb-3">+2.65%</div>
                            <div className="text-sm font-medium text-zinc-900 mb-1.5">Region-Aware Voting</div>
                            <div className="text-xs text-zinc-500 font-light leading-relaxed">
                                Peningkatan akurasi absolut face-level dibandingkan majority voting konvensional.
                            </div>
                        </div>
                        {/* Metric 3 */}
                        <div className="bg-white border border-zinc-100 rounded-2xl md:rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
                            <div className="text-3xl md:text-4xl font-medium tracking-tighter text-zinc-900 mb-2 sm:mb-3">0.0149s</div>
                            <div className="text-sm font-medium text-zinc-900 mb-1.5">Waktu Inferensi</div>
                            <div className="text-xs text-zinc-500 font-light leading-relaxed">
                                Eksekusi model sangat responsif, optimal untuk deployment aplikasi web real-time.
                            </div>
                        </div>
                    </div>
                </motion.div>

            </motion.main>
        </div>
    );
}