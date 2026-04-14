import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, Sparkles, ScanFace, 
    Layers, Network, Eye, Code 
} from 'lucide-react';
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

export default function AboutPage() {
    const features = [
        { 
            icon: <ScanFace className="w-5 h-5 text-zinc-800" />, 
            title: "Smart Camera Guidance", 
            desc: "Standardisasi input citra real-time memastikan wajah berada di posisi optimal dengan pencahayaan ideal sebelum diproses." 
        },
        { 
            icon: <Layers className="w-5 h-5 text-zinc-800" />, 
            title: "Patch-Based MobileNetV2", 
            desc: "Mengekstrak tekstur mikro dari area spesifik menggunakan agregasi Region-Aware Confidence Weighted Voting." 
        },
        { 
            icon: <Eye className="w-5 h-5 text-zinc-800" />, 
            title: "Explainable AI (CFCM)", 
            desc: "Grad-CAM heatmaps disatukan menjadi Composite Facial Condition Map, menyoroti area problematik secara transparan." 
        },
        { 
            icon: <Network className="w-5 h-5 text-zinc-800" />, 
            title: "Semantic Clustering", 
            desc: "Rekomendasi bahan aktif perawatan kulit berbasis Condition-Anchored Clustering tanpa mapping manual." 
        }
    ];

    return (
        <div className="min-h-screen bg-white text-zinc-950 pb-16 sm:pb-24 font-sans selection:bg-zinc-200 selection:text-zinc-900">
            <HeaderLandingPage />

            <motion.main
                // Ditambahkan lg:px-8 dan penyesuaian padding top untuk berbagai layar
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
                        About Project
                    </div>
                </motion.div>

                {/* --- Header Section --- */}
                <motion.div variants={itemVariants} className="mb-12 sm:mb-16 md:mb-20 text-center px-2 sm:px-0">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-[10px] sm:text-xs font-medium text-zinc-500 mb-6 md:mb-8 mx-auto">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                        SkinAI Architecture
                    </div>
                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-zinc-900 mb-6 leading-[1.2] sm:leading-[1.1] md:leading-[1]">
                        Transparent, Accurate, <br className="hidden sm:block" />
                        <span className="text-zinc-400">and Educative.</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-zinc-500 font-light leading-relaxed max-w-2xl mx-auto">
                        Platform <i>end-to-end</i> berbasis kecerdasan buatan untuk analisis kesehatan kulit wajah yang dirancang untuk mengatasi keterbatasan akses layanan dermatologi konvensional.
                    </p>
                </motion.div>

                {/* --- Background Section --- */}
                <motion.div variants={itemVariants} className="bg-zinc-50 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] border border-zinc-100 p-5 sm:p-8 md:p-12 mb-12 sm:mb-16">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-zinc-900 mb-3 sm:mb-4">Latar Belakang</h2>
                    <p className="text-sm md:text-base text-zinc-500 font-light leading-relaxed mb-4">
                        Akses terhadap layanan dermatologi profesional seringkali terhambat oleh biaya dan distribusi tenaga medis yang tidak merata. SkinAI hadir sebagai alat bantu <i>self-assessment</i> yang memungkinkan pengguna menganalisis kondisi kulit (Acne, Oily, Normal) langsung dari perangkat mereka.
                    </p>
                    <p className="text-sm md:text-base text-zinc-500 font-light leading-relaxed">
                        Berbeda dengan AI pendeteksi kulit konvensional yang sering bersifat <i>black-box</i>, SkinAI dirancang untuk memberikan transparansi penuh melalui Explainable AI, sehingga pengguna bisa melihat langsung area wajah mana yang menjadi dasar analisis algoritma.
                    </p>
                </motion.div>

                {/* --- Core Technologies --- */}
                <motion.div variants={itemVariants} className="mb-16 sm:mb-24">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6 md:mb-10">
                        <h3 className="text-lg sm:text-xl md:text-2xl font-medium text-zinc-900">Teknologi Inti</h3>
                        <span className="text-[10px] md:text-xs text-zinc-400 font-light uppercase tracking-wider">System Components</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
                        {features.map((item, idx) => (
                            <div 
                                key={idx} 
                                className="group relative bg-zinc-50/80 rounded-2xl md:rounded-3xl border border-zinc-100 hover:border-zinc-300 transition-all duration-300 p-5 sm:p-6 md:p-8"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center border border-zinc-100 shadow-sm mb-4 md:mb-5">
                                    {item.icon}
                                </div>
                                <h4 className="font-medium text-base md:text-lg text-zinc-900 mb-2">{item.title}</h4>
                                <p className="text-xs sm:text-sm text-zinc-500 font-light leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* --- Developer Credit --- */}
                <motion.div variants={itemVariants} className="border-t border-zinc-100 pt-8 sm:pt-12 md:pt-16 pb-8 md:pb-12 flex flex-col-reverse sm:flex-row items-center sm:items-start md:items-center justify-between gap-6 sm:gap-8">
                    <div className="text-center sm:text-left">
                        <p className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 sm:mb-1.5">Developed By</p>
                        <h3 className="text-base sm:text-lg md:text-xl font-medium text-zinc-900">Setia Farel Muamar Kadhafi</h3>
                        <p className="text-xs sm:text-sm text-zinc-500 font-light mt-1">Jurusan Informatika, Universitas Siliwangi</p>
                    </div>
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-zinc-900 flex items-center justify-center text-white shrink-0 shadow-md">
                        <Code className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}