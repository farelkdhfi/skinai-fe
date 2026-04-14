import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, Sun, ScanFace, CheckCircle2, 
    Layers, BookOpen, AlertCircle, Sparkles, XCircle, Camera
} from 'lucide-react';
import { ROUTES } from '../config'; // Adjust import path
import Header from '../components/Header'; // Adjust import path

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

export default function GuidancePage() {
    const navigate = useNavigate();

    const steps = [
        {
            icon: <Sun className="w-5 h-5 sm:w-6 sm:h-6" />,
            title: "Environment Setup",
            description: "Find a well-lit room. Natural daylight facing a window is highly recommended. Ensure your face is completely clean—remove any makeup, glasses, or heavy skincare products."
        },
        {
            icon: <Camera className="w-5 h-5 sm:w-6 sm:h-6" />,
            title: "Smart Camera Alignment",
            description: "Position your face within the camera frame. Our Smart Guidance System will strictly evaluate the environment. The capture button will only unlock when your face coverage exceeds 20% and the lighting intensity is optimal (130-240)."
        },
        {
            icon: <Layers className="w-5 h-5 sm:w-6 sm:h-6" />,
            title: "Micro-Texture Extraction",
            description: "Hold still. Once captured, the AI will automatically extract specific facial patches (forehead, nose, and both cheeks) to analyze your skin's micro-texture with high precision."
        },
        {
            icon: <ScanFace className="w-5 h-5 sm:w-6 sm:h-6" />,
            title: "Interpreting The Results",
            description: "Review your AI diagnosis. Toggle the 'Show Heatmaps' button to view the Composite Facial Condition Map (CFCM). The highlighted areas show exactly which regions influenced the AI's decision."
        },
        {
            icon: <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />,
            title: "Actionable Recommendations",
            description: "Explore your personalized active ingredient recommendations. These are algorithmically clustered to perfectly match your diagnosed skin condition, providing a scientifically-backed starting point for your regimen."
        }
    ];

    return (
        <div className="min-h-screen bg-white text-zinc-950 pb-16 sm:pb-24 font-sans selection:bg-zinc-200 selection:text-zinc-900">
            <Header />

            <motion.main
                // Konsisten dengan halaman lain: max-w-5xl & padding bertahap
                className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 md:pt-40"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* --- Top Nav --- */}
                <motion.div variants={itemVariants} className="flex items-center justify-between mb-8 sm:mb-12 md:mb-16">
                    <Link to={ROUTES.ANALYZE} className="group inline-flex items-center text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1.5 transition-transform" />
                        <span className="text-xs sm:text-sm font-medium">Back</span>
                    </Link>
                    <div className="text-[10px] md:text-xs font-medium text-zinc-300 uppercase tracking-widest">
                        User Guide
                    </div>
                </motion.div>

                {/* --- Headline --- */}
                <motion.div variants={itemVariants} className="mb-12 sm:mb-16 md:mb-20 text-center max-w-2xl mx-auto px-2 sm:px-0">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-[10px] sm:text-xs font-medium text-zinc-500 mb-6 md:mb-8">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                        Usage Instructions
                    </div>
                    {/* Tipografi yang mulus dari layar kecil ke besar */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-zinc-900 mb-6 leading-[1.2] sm:leading-[1.1] md:leading-[1]">
                        Mastering SkinAI <br className="hidden sm:block" />
                        <span className="text-zinc-400">for Perfect Results.</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-zinc-500 font-light leading-relaxed">
                        Follow these simple steps to ensure the highest accuracy for your facial skin condition analysis using our patch-based deep learning model.
                    </p>
                </motion.div>

                {/* --- Step-by-Step Timeline --- */}
                <motion.div variants={itemVariants} className="relative max-w-4xl mx-auto mb-16 sm:mb-20 md:mb-24">
                    {/* Vertical Line for Desktop & Tablet */}
                    <div className="hidden md:block absolute left-[31px] md:left-8 top-8 bottom-8 w-px bg-zinc-100"></div>

                    <div className="space-y-6 sm:space-y-8 md:space-y-10">
                        {steps.map((step, index) => (
                            <div key={index} className="relative flex flex-col md:flex-row gap-3 sm:gap-4 md:gap-8 group">
                                {/* Step Number / Icon */}
                                <div className="flex items-center gap-4 md:contents">
                                    <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shrink-0 rounded-xl sm:rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-zinc-900 shadow-sm group-hover:border-indigo-200 group-hover:text-indigo-600 transition-colors duration-300">
                                        {step.icon}
                                        <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold ring-2 ring-white">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-medium text-zinc-900 md:hidden">{step.title}</h3>
                                </div>

                                {/* Step Content */}
                                <div className="flex-1 bg-zinc-50/80 rounded-2xl md:rounded-3xl border border-zinc-100 p-5 sm:p-6 md:p-8 group-hover:border-zinc-300 group-hover:bg-white transition-all duration-300">
                                    <h3 className="hidden md:block text-lg md:text-xl font-medium text-zinc-900 mb-2 md:mb-3">{step.title}</h3>
                                    <p className="text-xs sm:text-sm md:text-base text-zinc-500 font-light leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* --- Do's and Don'ts Section --- */}
                <motion.div variants={itemVariants} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-16 sm:mb-20 md:mb-24">
                    {/* Do's */}
                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8">
                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <h3 className="text-base sm:text-lg font-medium text-emerald-900">Best Practices</h3>
                        </div>
                        <ul className="space-y-3 sm:space-y-4">
                            {[
                                "Ensure even lighting across your face",
                                "Look straight into the camera lens",
                                "Keep a neutral facial expression",
                                "Tie your hair back if it covers your forehead"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-emerald-800/80 font-light leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Don'ts */}
                    <div className="bg-red-50/50 border border-red-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 mt-2 md:mt-0">
                        <div className="flex items-center gap-2 mb-4 sm:mb-6">
                            <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                            <h3 className="text-base sm:text-lg font-medium text-red-900">Things to Avoid</h3>
                        </div>
                        <ul className="space-y-3 sm:space-y-4">
                            {[
                                "Avoid harsh shadows or backlighting",
                                "Do not wear glasses or thick accessories",
                                "Avoid scanning in extremely dark rooms",
                                "Do not use screen flash if it causes severe glare"
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-red-800/80 font-light leading-relaxed">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                {/* --- Call to Action --- */}
                <motion.div variants={itemVariants} className="text-center pb-8">
                    <div className="inline-flex flex-col items-center gap-3 sm:gap-4 bg-zinc-50 border border-zinc-100 rounded-2xl sm:rounded-[2rem] p-6 sm:p-8 md:p-12 w-full max-w-3xl mx-auto">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-zinc-900">Ready to analyze your skin?</h2>
                        <p className="text-xs sm:text-sm text-zinc-500 font-light max-w-md mx-auto mb-3 sm:mb-4">
                            Now that you know how the system works, experience the AI analysis firsthand.
                        </p>
                        <button 
                            onClick={() => navigate(ROUTES.LIVECAM)}
                            className="px-6 sm:px-8 py-3.5 sm:py-4 bg-zinc-900 text-white rounded-xl md:rounded-2xl font-medium text-sm md:text-base flex items-center justify-center gap-2 hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:w-auto"
                        >
                            <ScanFace className="w-4 h-4 sm:w-5 sm:h-5" />
                            Start Quick Scan
                        </button>
                    </div>
                </motion.div>

            </motion.main>
        </div>
    );
}