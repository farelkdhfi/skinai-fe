import { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    motion,
    useScroll,
    useTransform,
} from 'framer-motion';
import {
    ArrowRight,
    ArrowLeft,
    Camera,
} from 'lucide-react';

// --- ASSETS ---
import { ROUTES } from '../../../config';
import HeroImg from '../../../assets/others/heroImage2.png';

const HeroSection = ({ onStartClick }) => {
    const parallaxRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: parallaxRef,
        offset: ["start end", "end start"]
    });

    // Core motion
    const y = useTransform(scrollYProgress, [0, 1], [-30, 30]);
    const imgY = useTransform(scrollYProgress, [0, 1], [-15, 15]);
    const rotateX = useTransform(scrollYProgress, [0, 1], [6, -6]);
    const rotateY = useTransform(scrollYProgress, [0, 1], [-4, 4]);

    // Light sweep
    const lightX = useTransform(scrollYProgress, [0, 1], ["-40%", "140%"]);
    const lightOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.25, 0]);

    const tabs = ["RACWV", "CAAA", "FULL", "PATCH", "LIVE", "UPLOAD"];

    return (
        <section className="relative isolate w-full flex flex-col items-center px-4 sm:px-6 pt-6 md:pt-0">
            {/* Sticky Wrapper */}
            <div className="sticky top-24 md:top-30 text-center z-10 space-y-4 md:space-y-6 w-full max-w-4xl mx-auto">
                
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-white/50 backdrop-blur-sm"
                >
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] md:text-xs font-medium tracking-wide text-neutral-500 uppercase">PATCH-BASED SKIN ANALYSIS</span>
                </motion.div>

                {/* Main Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-6xl md:text-8xl font-medium tracking-tight leading-[0.95] md:leading-[0.9] text-center"
                >
                    Scan. <br className='block sm:hidden' /> Analyze.<br className="hidden sm:block" />
                    <span className="text-neutral-400 font-serif italic block sm:inline mt-1 sm:mt-0">Result.</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="max-w-xs sm:max-w-xl mx-auto text-neutral-500 text-sm md:text-lg leading-relaxed px-2"
                >
                    Employs MobileNetV2 with a patch-based strategy for micro-texture analysis and Smart Camera Guidance to ensure real-time input standardization.
                </motion.p>

                {/* BUTTON */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="pt-2 md:pt-0"
                >
                    <button onClick={onStartClick} className="group relative inline-flex h-12 md:h-14 items-center justify-center overflow-hidden rounded-full bg-[#111] px-6 md:px-8 font-medium text-neutral-50 transition-all hover:bg-neutral-800 w-44 md:w-48 hover:w-48 md:hover:w-52">
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                            <div className="relative h-full w-8 bg-white/20" />
                        </div>
                        <span className="mr-2 text-sm md:text-base">Start Analysis</span>
                        <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                    </button>
                </motion.div>
            </div>

            <div
                ref={parallaxRef}
                className="relative w-full flex items-start justify-center mt-24 sm:mt-32 md:mt-40 z-20 perspective-[1200px] pb-32 sm:pb-40 md:pb-56"
            >
                {/* Left side annotation — desktop only */}
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden md:flex flex-col items-end text-right gap-2.5 absolute left-[6%] lg:left-[13%] top-[20%] w-44 lg:w-48"
                >
                    <span className="text-[10px] font-mono tracking-[0.15em] text-neutral-400 uppercase">Patch 01 · Forehead</span>
                    <div className="w-8 h-px bg-neutral-300" />
                    <p className="text-sm text-neutral-500 leading-relaxed">
                        Texture and pore density sampled before classification.
                    </p>
                </motion.div>

                {/* Right side annotation — desktop only */}
                <motion.div
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="hidden md:flex flex-col items-start text-left gap-2.5 absolute right-[6%] lg:right-[13%] top-[46%] w-44 lg:w-48"
                >
                    <span className="text-[10px] font-mono tracking-[0.15em] text-neutral-400 uppercase">Confidence</span>
                    <span className="text-3xl font-medium text-neutral-800 tabular-nums">94<span className="text-lg text-neutral-400">%</span></span>
                    <p className="text-sm text-neutral-500 leading-relaxed">
                        Grad-CAM confirms the region driving this result.
                    </p>
                </motion.div>

                <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] -mb-70 sm:-mb-80 md:-mb-100 overflow-visible">
                    <motion.div
                        style={{ rotateX, rotateY }}
                        className="relative w-full aspect-[9/19]"
                    >
                        {/* Phone Body */}
                        <div className="relative w-full h-full bg-[#0E0E0E] border-[14px] md:border-[18px] border-[#0E0E0E]
                                rounded-[3.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.45)]
                                overflow-hidden ring-1 ring-white/10 z-10">

                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-2xl z-30" />

                            {/* Screen */}
                            <div className="relative w-full h-full rounded-[2.6rem] overflow-hidden bg-black flex flex-col">

                                {/* Top image area (always square) */}
                                <div className="relative w-full aspect-square overflow-hidden shrink-0">
                                    <motion.img
                                        src={HeroImg}
                                        alt="Face Analysis Hero"
                                        style={{ y: imgY }}
                                        className="absolute inset-0 w-full h-full object-cover scale-110 will-change-transform"
                                    />

                                    {/* Subtle dark overlay for readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />

                                    {/* Cinematic light sweep */}
                                    <motion.div
                                        style={{ left: lightX, opacity: lightOpacity }}
                                        className="absolute top-0 w-[60%] h-full
                                     bg-gradient-to-r from-transparent via-white/20 to-transparent
                                     skew-x-[-12deg] pointer-events-none"
                                    />
                                </div>

                                {/* White sheet panel */}
                                <motion.div
                                    style={{ y }}
                                    className="relative flex-1 bg-white rounded-t-[2rem] -mt-6 z-10 flex flex-col overflow-hidden min-h-0"
                                >
                                    {/* Handle bar */}
                                    <div className="w-9 h-1 bg-neutral-200 rounded-full mx-auto mt-2.5 mb-3" />

                                    {/* Tab bar */}
                                    <div className="flex items-center gap-1.5 px-3 mb-4 overflow-x-auto no-scrollbar">
                                        <button className="w-6 h-6 shrink-0 rounded-full border border-neutral-200 flex items-center justify-center">
                                            <ArrowLeft size={11} className="text-neutral-500" />
                                        </button>
                                        {tabs.map((tab, i) => (
                                            <button
                                                key={tab}
                                                className={`shrink-0 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-wide transition-colors ${
                                                    i === 2 || i === 5
                                                        ? 'bg-[#111] text-white'
                                                        : 'text-neutral-400'
                                                }`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col items-center justify-center px-5 text-center overflow-hidden gap-3">
                                        <h3 className="text-lg font-semibold text-neutral-900">Ready to Scan</h3>
                                        <p className="text-[10px] text-neutral-400 mb-1">Align your face within the frame.</p>

                                        {/* Shutter button */}
                                        <button
                                            aria-label="Capture"
                                            className="group relative w-16 h-16 rounded-full border-2 border-neutral-200 flex items-center justify-center transition-transform active:scale-95"
                                        >
                                            <span className="absolute inset-1.5 rounded-full bg-[#111] transition-transform group-hover:scale-[0.85]" />
                                            <Camera size={18} className="relative z-10 text-white" />
                                        </button>

                                        <span className="text-[9px] font-bold tracking-wide text-neutral-400 mt-1">TAP TO CAPTURE</span>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Side Buttons */}
                        <div className="absolute top-36 -right-[4px] w-[3px] h-20 bg-neutral-800 rounded-r-md border-l border-white/10" />
                        <div className="absolute top-36 -left-[4px] w-[3px] h-14 bg-neutral-800 rounded-l-md border-r border-white/10" />
                        <div className="absolute top-56 -left-[4px] w-[3px] h-14 bg-neutral-800 rounded-l-md border-r border-white/10" />
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
export default HeroSection;