import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Camera, 
    Upload, 
    ScanLine, 
    Maximize, 
    Droplets, 
    Focus,
    BookOpen,
    ArrowRight
} from 'lucide-react';
import { ROUTES } from '../config';
import Header from '../components/Header'; // Adjust the path

const AnalyzeIntroPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-zinc-900 selection:bg-zinc-900 selection:text-white font-sans overflow-x-hidden">
            <Header />

            {/* Padding adjusted to fit a single mobile screen (pt-24 for mobile) */}
            <main className="relative z-10 max-w-7xl mx-auto px-5 pt-24 pb-12 lg:pt-32 lg:pb-24">
                
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 lg:min-h-[calc(100vh-10rem)] items-center">
                    
                    {/* --- LEFT: Typography & Information --- */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        
                        <motion.div 
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "2rem" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-px bg-zinc-900 mb-6"
                        />

                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center gap-2 mb-4"
                        >
                            <ScanLine size={14} className="text-zinc-400" />
                            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] text-zinc-500 uppercase">
                                Diagnostic Module
                            </span>
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.05] text-zinc-950 mb-4"
                        >
                            Reveal your <br className="hidden sm:block" />
                            <span className="font-serif italic text-zinc-400">true profile.</span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-sm sm:text-base text-zinc-500 font-light leading-relaxed max-w-md mb-8"
                        >
                            Analyze skin conditions with precision. Identify acne-prone areas and oil levels in seconds.
                        </motion.p>

                        {/* Parameter List - Made more horizontal/compact on mobile */}
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="grid grid-cols-3 gap-3 max-w-md border-t border-zinc-200 pt-6"
                        >
                            {[
                                { icon: Focus, label: "Bright Light" },
                                { icon: Maximize, label: "Face Forward" },
                                { icon: Droplets, label: "Clean Face" }
                            ].map((item, index) => (
                                <div key={index} className="flex flex-col items-start gap-2">
                                    <item.icon size={18} className="text-zinc-400" strokeWidth={1.5} />
                                    <span className="text-[11px] sm:text-xs font-medium text-zinc-600 leading-tight">{item.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* --- RIGHT: Action Buttons (Compact Menu) --- */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center gap-3 sm:gap-4 mt-6 lg:mt-0">
                        
                        {/* 1. Primary Action: Live Analysis */}
                        <motion.button 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            onClick={() => navigate(ROUTES.LIVECAM)}
                            className="group relative w-full flex items-center justify-between p-4 sm:p-5 bg-zinc-950 rounded-2xl border border-zinc-900 hover:bg-zinc-900 transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-zinc-800 rounded-xl text-white">
                                    <Camera size={20} strokeWidth={1.5} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-sm sm:text-base font-medium text-white">Live Analysis</h3>
                                    <p className="text-xs text-zinc-400 mt-0.5">Instant face scan via webcam</p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-zinc-500 group-hover:text-white group-hover:-rotate-45 transition-all duration-300" />
                        </motion.button>

                        {/* 2. Secondary Action: Upload Image */}
                        <motion.button 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            onClick={() => navigate(ROUTES.UPLOAD)}
                            className="group relative w-full flex items-center justify-between p-4 sm:p-5 bg-white rounded-2xl border border-zinc-200 hover:border-zinc-400 shadow-sm transition-all active:scale-[0.98]"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-900">
                                    <Upload size={20} strokeWidth={1.5} />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-sm sm:text-base font-medium text-zinc-900">Upload Image</h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">Detailed evaluation from gallery photos</p>
                                </div>
                            </div>
                            <ArrowRight size={18} className="text-zinc-300 group-hover:text-zinc-900 group-hover:-rotate-45 transition-all duration-300" />
                        </motion.button>

                        {/* 3. Tertiary Action: Guide Book */}
                        <motion.button 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            // Replace ROUTES.GUIDEBOOK with your route path
                            onClick={() => navigate(ROUTES.GUIDANCE)} 
                            className="group w-full flex items-center justify-center gap-2 p-4 bg-transparent rounded-2xl text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-all active:scale-[0.98]"
                        >
                            <BookOpen size={16} strokeWidth={1.5} />
                            <span className="text-xs sm:text-sm font-medium">Read the User Guide</span>
                        </motion.button>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default AnalyzeIntroPage;