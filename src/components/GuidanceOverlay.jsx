
import { motion, AnimatePresence } from 'framer-motion';

import {
    AlertCircle, Sun, Move, Maximize
} from 'lucide-react';

const GuidanceOverlay = ({ validations, mode, isAnalyzing, capturedFrame }) => {
    if (mode !== 'camera' || isAnalyzing || capturedFrame) return null;

    let guidance = null;

    if (!validations.faceDetected) {
        guidance = { text: "ALIGN FACE IN FRAME", icon: Maximize, color: "text-amber-400" };
    } else if (!validations.brightness.valid) {
        guidance = { text: "IMPROVE LIGHTING", icon: Sun, color: "text-amber-400" };
    } else if (!validations.roi.valid) {
        guidance = { text: "MOVE CLOSER", icon: Move, color: "text-amber-400" };
    } else if (!validations.orientation.valid) {
        guidance = { text: "LOOK STRAIGHT AHEAD", icon: AlertCircle, color: "text-amber-400" };
    }

    return (
        <AnimatePresence>
            {guidance && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-6 left-0 right-0 z-30 flex justify-center pointer-events-none"
                >
                    <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
                        <guidance.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 animate-pulse ${guidance.color}`} strokeWidth={2} />
                        <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-white/90 uppercase">
                            {guidance.text}
                        </span>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default GuidanceOverlay