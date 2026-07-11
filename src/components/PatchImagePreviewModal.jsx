import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

export default function PatchImagePreviewModal ({ data, showHeatmap, onClose }) {
    return (
        <AnimatePresence>
            {data && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 cursor-zoom-out"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-4xl p-4 flex flex-col items-center pointer-events-none"
                    >
                        <div className="relative w-full aspect-square md:aspect-auto md:h-[75vh] bg-zinc-950 rounded-2xl md:rounded-[2rem] overflow-hidden pointer-events-auto shadow-2xl border border-zinc-800">
                            {data.imageUrl || data.patch && (
                                <img src={data.imageUrl || data.patch} alt={data.region} className="w-full h-full object-contain absolute inset-0" />
                            )}
                            
                            {data.heatmapUrl || data.heatmap && (
                                <div className={`absolute inset-0 transition-opacity duration-500 ${showHeatmap ? 'opacity-100' : 'opacity-0'}`}>
                                    <img src={data.heatmapUrl || data.heatmap } alt="Heatmap" className="w-full h-full object-contain" />
                                </div>
                            )}

                            <button 
                                onClick={onClose} 
                                className="absolute top-4 right-4 md:top-6 md:right-6 p-2.5 bg-black/50 text-white rounded-full hover:bg-black/80 backdrop-blur-md transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="mt-6 px-6 py-2.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white text-sm md:text-base font-medium tracking-wide uppercase pointer-events-auto shadow-lg">
                            {data.region}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};