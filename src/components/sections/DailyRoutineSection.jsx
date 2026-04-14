import React, { useRef } from 'react';
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
} from 'framer-motion';

import faceScan from '../../assets/video/facescan2.mp4';

const DailyRoutineSection = () => {
    const containerRef = useRef(null);

    // --- PARALLAX LOGIC ---
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 50,
        damping: 20
    });

    const usePhase = (start, end) => {
        const opacity = useTransform(smoothProgress, [start - 0.05, start, end, end + 0.05], [0, 1, 1, 0]);
        const scale = useTransform(smoothProgress, [start, end], [1, 0.95]);
        const y = useTransform(smoothProgress, [start, end], [50, -50]);
        return { opacity, scale, y };
    };
    const p1Opacity = useTransform(smoothProgress, [0, 0.3, 0.35], [1, 1, 0]);
    const p1Scale = useTransform(smoothProgress, [0, 0.35], [1, 0.9]);
    const p1Y = useTransform(smoothProgress, [0, 0.35], [0, -50]);

    const phase1 = {
        opacity: p1Opacity,
        scale: p1Scale,
        y: p1Y,
        pointerEvents: useTransform(p1Opacity, (v) => v < 0.1 ? 'none' : 'auto')
    };

    const phase2Helper = usePhase(0.4, 0.6);
    const phase2 = {
        ...phase2Helper,
        pointerEvents: useTransform(phase2Helper.opacity, (v) => v < 0.1 ? 'none' : 'auto')
    };

    const lightFlashOpacity = useTransform(smoothProgress, [0.70, 0.90], [0, 1]);
    const finaleTextOpacity = useTransform(smoothProgress, [0.75, 0.85], [0, 1]);
    const finaleTextScale = useTransform(smoothProgress, [0.75, 1], [0.9, 1.15]);

    return (
        <div ref={containerRef} className="relative h-[450vh] bg-[#F8F8F7] text-neutral-900 font-sans selection:bg-neutral-900 selection:text-white py-10 md:py-20">

            {/* Sticky Viewport */}
            <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">

                {/* --- PHASE 1: THE DAILY RITUAL --- */}
                <motion.div
                    style={phase1}
                    className="absolute inset-0 z-20 px-4 sm:px-6 md:px-20 flex items-center"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-center w-full max-w-7xl mx-auto">

                        {/* LEFT — CINEMATIC VISUAL */}
                        {/* Adjusted height for mobile and desktop */}
                        <div className="relative w-full h-[350px] sm:h-[450px] md:h-[520px] rounded-[2rem] md:rounded-[3rem] overflow-hidden group order-1 md:order-none">

                            {/* Ambient Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900/20 via-transparent to-neutral-900/30 z-10" />

                            {/* Video */}
                            <video
                                src={faceScan}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="w-full h-full object-cover scale-[1.03] group-hover:scale-[1.05] transition-transform duration-[3000ms] ease-out"
                            />

                            {/* Subtle Film Grain */}
                            <div className="absolute inset-0 bg-[url('/grain.png')] opacity-[0.06] mix-blend-overlay z-20" />

                            {/* Floating AI Marker */}
                            <motion.div
                                style={{
                                    y: useTransform(smoothProgress, [0, 0.3], [20, -20]),
                                    opacity: useTransform(smoothProgress, [0.05, 0.15], [0, 1])
                                }}
                                className="absolute bottom-4 left-4 md:bottom-6 md:left-6 px-3 py-1.5 md:px-4 md:py-2 rounded-full
                   bg-black/40 backdrop-blur-xl border border-white/20
                   text-white text-[10px] md:text-xs tracking-widest uppercase z-30"
                            >
                                Live Skin Capture
                            </motion.div>
                        </div>

                        {/* RIGHT — EDITORIAL + DATA */}
                        <div className="relative order-2 md:order-none pb-10 md:pb-0">

                            {/* Eyebrow */}
                            <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-neutral-400 mb-3 md:mb-6">
                                Daily Ritual
                            </p>

                            {/* Headline: Responsive Text Size */}
                            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05] text-neutral-900">
                                Discipline <br />
                                <span className="font-serif italic font-light text-neutral-500">
                                    becomes data.
                                </span>
                            </h2>

                            {/* Description */}
                            <p className="mt-4 md:mt-8 max-w-md text-neutral-600 text-sm md:text-base leading-relaxed">
                                Each morning scan is transformed into a living biometric timeline —
                                capturing subtle changes invisible to the human eye.
                            </p>

                            {/* DATA STRIP */}
                            <div className="mt-8 md:mt-12 space-y-3 md:space-y-4">

                                {[
                                    { label: "Scan Frequency", value: "Daily" },
                                    { label: "Precision Level", value: "Dermal Grade" },
                                    { label: "Data Points / Scan", value: "12,480+" }
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 * i }}
                                        className="flex items-center justify-between
                        border-b border-neutral-200/70 pb-2 md:pb-3"
                                    >
                                        <span className="text-xs md:text-sm text-neutral-500">
                                            {item.label}
                                        </span>
                                        <span className="text-xs md:text-sm font-semibold text-neutral-900">
                                            {item.value}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* DATA PULSE GRID */}
                            <div className="mt-8 md:mt-14 grid grid-cols-7 gap-1.5 md:gap-2 max-w-[200px] md:max-w-sm">
                                {[...Array(28)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{
                                            opacity: [0.2, 0.8, 0.2]
                                        }}
                                        transition={{
                                            duration: 4,
                                            delay: i * 0.04,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                        className={`aspect-square rounded-sm md:rounded-md
               ${i > 24
                                                ? 'bg-neutral-900 shadow-[0_0_12px_rgba(0,0,0,0.25)]'
                                                : 'bg-neutral-300'
                                            }`}
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                </motion.div>


                {/* --- PHASE 2: THE PREDICTIVE TRAJECTORY --- */}
                <motion.div
                    style={phase2}
                    className="absolute inset-0 z-10 flex items-center justify-center px-4 md:px-20"
                >
                    <div className="relative w-full max-w-7xl">

                        {/* HEADER */}
                        <motion.div
                            style={{
                                y: useTransform(smoothProgress, [0.4, 0.6], [60, -40]),
                                opacity: useTransform(smoothProgress, [0.42, 0.5], [0, 1])
                            }}
                            className="mb-8 md:mb-14 max-w-2xl mx-auto md:mx-0 text-center md:text-left"
                        >
                            <p className="text-[10px] md:text-xs tracking-[0.35em] uppercase text-neutral-400 mb-2 md:mb-4">
                                Predictive Layer
                            </p>

                            <h3 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[0.95] text-neutral-900">
                                Intelligence <br />
                                <span className="font-serif italic font-light text-neutral-500">
                                    takes form.
                                </span>
                            </h3>

                            <p className="mt-4 md:mt-6 text-neutral-600 text-sm md:text-lg">
                                Patterns converge. Signals align.
                                The system no longer observes — it anticipates.
                            </p>
                        </motion.div>

                        {/* MAIN CANVAS */}
                        <div className="relative h-[40vh] md:h-[50vh] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-neutral-950 shadow-2xl">

                            {/* AMBIENT DEPTH */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/10" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_60%)]" />

                            {/* AI CORE */}
                            <motion.div
                                style={{
                                    scale: useTransform(smoothProgress, [0.42, 0.6], [0.85, 1]),
                                    opacity: useTransform(smoothProgress, [0.42, 0.5], [0, 1])
                                }}
                                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-40 md:h-40 rounded-full"
                            >
                                <div className="absolute inset-0 rounded-full bg-white/10 blur-2xl animate-pulse" />
                                <div className="absolute inset-6 rounded-full bg-white/20 blur-xl" />
                                <div className="absolute inset-10 rounded-full bg-white/90 shadow-[0_0_40px_rgba(255,255,255,0.6)]" />
                            </motion.div>

                            {/* TRAJECTORY GRAPH */}
                            <motion.svg
                                viewBox="0 0 1000 400"
                                preserveAspectRatio="none"
                                className="absolute inset-0 w-full h-full"
                            >
                                <defs>
                                    <linearGradient id="ai-line" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
                                        <stop offset="50%" stopColor="#ffffff" />
                                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
                                    </linearGradient>
                                </defs>

                                <motion.path
                                    d="M 0 330
             C 160 310, 260 260, 420 240
             C 620 210, 760 140, 1000 90"
                                    fill="none"
                                    stroke="url(#ai-line)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    whileInView={{ pathLength: 1 }}
                                    transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
                                />
                            </motion.svg>

                            {/* FLOATING SIGNALS */}
                            {/* Adjusted text size and padding for mobile compatibility */}
                            {[
                                { x: "18%", y: "52%", label: "Inflammation Signal ↓" },
                                { x: "46%", y: "34%", label: "Barrier Recovery" },
                                { x: "78%", y: "14%", label: "Stability Zone" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    style={{
                                        left: item.x,
                                        top: item.y,
                                        y: useTransform(
                                            smoothProgress,
                                            [0.4, 0.6],
                                            [30 * (i + 1), -30 * (i + 1)]
                                        ),
                                        opacity: useTransform(smoothProgress, [0.45, 0.55], [0, 1])
                                    }}
                                    className="absolute px-2 py-1 md:px-4 md:py-2 rounded-full
                   bg-white/10 backdrop-blur-xl border border-white/20
                   text-white text-[9px] md:text-xs tracking-wide whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.div>
                            ))}

                            {/* AI THOUGHT */}
                            <motion.div
                                style={{
                                    opacity: useTransform(smoothProgress, [0.5, 0.65], [0, 1]),
                                    y: useTransform(smoothProgress, [0.5, 0.65], [20, 0])
                                }}
                                className="absolute bottom-4 right-4 md:bottom-8 md:right-8 max-w-[200px] md:max-w-sm
                   text-neutral-200 text-xs md:text-sm leading-relaxed text-right md:text-left"
                            >
                                <span className="text-neutral-400 tracking-widest text-[8px] md:text-[10px] uppercase block mb-1">
                                    System Insight
                                </span>
                                <p>
                                    Consistency detected.
                                    Predictive confidence reaches{" "}
                                    <span className="text-white font-semibold">high certainty</span>
                                    {" "}within a 21-day behavioral window.
                                </p>
                            </motion.div>

                        </div>
                    </div>
                </motion.div>



                {/* --- CLOSING PHASE --- */}
                {/* --- PHASE 3: THE LONG-TERM REVELATION --- */}
                <>
                    {/* LIGHT WASH */}
                    <motion.div
                        style={{
                            opacity: useTransform(smoothProgress, [0.68, 0.78], [0, 1])
                        }}
                        className="absolute inset-0 z-40
               bg-gradient-to-b from-white/80 via-white to-white
               pointer-events-none"
                    />

                    {/* FINAL MOMENT */}
                    <motion.div
                        style={{
                            opacity: useTransform(smoothProgress, [0.72, 0.85], [0, 1]),
                            scale: useTransform(smoothProgress, [0.72, 1], [0.96, 1.08]),
                            y: useTransform(smoothProgress, [0.72, 1], [40, -40])
                        }}
                        className="absolute inset-0 z-50 flex items-center justify-center text-center px-4 md:px-6"
                    >
                        <div className="max-w-4xl w-full">

                            {/* EYEBROW */}
                            <motion.p
                                style={{
                                    opacity: useTransform(smoothProgress, [0.74, 0.82], [0, 1])
                                }}
                                className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-neutral-400 mb-6 md:mb-10"
                            >
                                Long-Term Vision
                            </motion.p>

                            {/* MAIN STATEMENT */}
                            {/* Scaled text for mobile to prevent overflow */}
                            <h1 className="text-5xl sm:text-7xl md:text-[9rem] font-medium tracking-tighter
                      text-neutral-900 leading-[0.9] md:leading-[0.85]">
                                LONG<br />TERM
                            </h1>

                            {/* SUB STATEMENT */}
                            <motion.span
                                style={{
                                    opacity: useTransform(smoothProgress, [0.78, 0.9], [0, 1])
                                }}
                                className="block mt-4 md:mt-6 font-serif italic
                   text-2xl md:text-5xl text-neutral-500"
                            >
                                clarity.
                            </motion.span>

                            {/* SILENT DIVIDER */}
                            <motion.div
                                style={{
                                    scaleX: useTransform(smoothProgress, [0.8, 0.95], [0, 1])
                                }}
                                className="mx-auto mt-8 md:mt-14 h-px w-20 md:w-32 bg-neutral-300 origin-left"
                            />

                            {/* FINAL THOUGHT */}
                            <motion.p
                                style={{
                                    opacity: useTransform(smoothProgress, [0.82, 1], [0, 1])
                                }}
                                className="mx-auto mt-6 md:mt-10 max-w-xs md:max-w-xl
                   text-neutral-600 text-sm md:text-lg leading-relaxed"
                            >
                                When consistency compounds,
                                prediction becomes understanding.
                            </motion.p>
                        </div>
                    </motion.div>
                </>
            </div>
        </div>
    );
};
export default DailyRoutineSection;