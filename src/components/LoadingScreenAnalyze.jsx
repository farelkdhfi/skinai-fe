import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingScreenAnalyze = () => {
    const [loadingText, setLoadingText] = useState("Loading Analysis");
    
    useEffect(() => {
        const phrases = [
            "Loading Analysis",
            "Generating Heatmap",
            "Clustering Data",
            "Identifying Skin Type",
            "Preparing Recommendations",
            "Finalizing Results"
        ];
        
        let i = 0;
        const interval = setInterval(() => {
            i = (i + 1) % phrases.length;
            setLoadingText(phrases[i]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="flex flex-col items-center gap-4">
                {/* Spinner: Responsive size */}
                <div className="w-8 h-8 md:w-10 md:h-10 border-2 border-zinc-100 border-t-zinc-900 rounded-full animate-spin"></div>
                
                {/* Text Animation */}
                <div className="h-4 flex items-center justify-center"> 
                    <AnimatePresence mode="wait">
                        <motion.p 
                            key={loadingText}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.3 }}
                            className="text-zinc-400 text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium text-center"
                        >
                            {loadingText}...
                        </motion.p>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LoadingScreenAnalyze;