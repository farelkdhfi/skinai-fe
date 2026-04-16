
import { motion } from 'framer-motion';


const ScanOverlay = ({ isActive, validations }) => {
    if (!isActive) return null;

    const isReady = validations?.faceDetected &&
        validations?.brightness?.valid &&
        validations?.roi?.valid &&
        validations?.orientation?.valid;

    // Teal/Hijau kalem jika siap, Amber/Orange jika belum
    const strokeColor = isReady
        ? 'rgba(20, 184, 166, 0.6)' // Teal dengan 60% opacity
        : 'rgba(255, 255, 255, 0.7)';
    const glowColor = isReady ? 'rgba(20, 184, 166, 0.5)' : 'rgba(255, 255, 255, 0.2)';

    // Definisi titik Hexagon yang proporsional
    const hexPoints = "50,2 95,25 95,75 50,98 5,75 5,25";

    return (
        <div className="absolute inset-0 z-20 pointer-events-none p-4 md:p-8 flex items-center justify-center">

            {/* SVG Hexagon Container */}
            <div className="relative w-full max-w-[85%] aspect-square flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible drop-shadow-2xl">
                    <motion.polygon
                        points={hexPoints}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="0.4"
                        animate={{
                            filter: [`drop-shadow(0 0 5px ${glowColor})`, `drop-shadow(0 0 15px ${glowColor})`, `drop-shadow(0 0 5px ${glowColor})`]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Corner accents for the hexagon */}
                    <polygon points="48,2 52,2 52,4 48,4" fill={strokeColor} />
                    <polygon points="48,98 52,98 52,96 48,96" fill={strokeColor} />
                </svg>

                {/* Masking the scanner line inside the hexagon shape */}
                <div
                    className="absolute inset-0 overflow-hidden"
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                    <motion.div
                        initial={{ top: "-10%", opacity: 0 }}
                        animate={{ top: "110%", opacity: [0, 1, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[1.5px] bg-white shadow-[0_0_20px_rgba(255,255,255,1)]"
                    />
                </div>

                {/* Titik Fokus Tengah (Soft) */}
                <div className="w-1 h-1 bg-white/40 rounded-full" />
            </div>

            {/* Indikator Sistem Bawah */}
            <div className="absolute bottom-6 md:bottom-10 left-0 right-0 text-center">
                <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-xl border border-white/10"
                >
                    <div className={`w-1.5 h-1.5 rounded-full ${isReady ? 'bg-teal-400' : 'bg-amber-400'} animate-pulse transition-colors duration-500`} />
                    <span className="text-[9px] md:text-[10px] font-medium tracking-[0.2em] text-white/90 uppercase">
                        {isReady ? 'System Locked' : 'Scanning'}
                    </span>
                </motion.div>
            </div>
        </div>
    );
};

export default ScanOverlay