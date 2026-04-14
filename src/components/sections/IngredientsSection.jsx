import React, { useRef, useState } from 'react';
import {
    motion,
    useScroll,
    useMotionValueEvent,
} from 'framer-motion';
import {
    ArrowUpRight
} from 'lucide-react';
import { ACTIVE_INGREDIENTS } from '../../data/data';

const IngredientsSection = () => {
    const [active, setActive] = useState(0);
    const containerRef = useRef(null);

    // 1. Setup Scroll Hook
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const itemsLength = ACTIVE_INGREDIENTS.length;
        const sectionSize = 1 / itemsLength;
        const newIndex = Math.floor(latest / sectionSize);
        const clampedIndex = Math.min(Math.max(newIndex, 0), itemsLength - 1);

        if (clampedIndex !== active) {
            setActive(clampedIndex);
        }
    });

    return (
        <div ref={containerRef} className="relative h-[300vh] bg-[#0A0A0A] py-10 md:py-20">

            {/* Sticky Container */}
            <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-start pt-20 md:pt-0 md:justify-center">

                <section className="w-full max-w-7xl mx-auto px-4 md:px-6 relative z-20">
                    {/* Header Section */}
                    <div className="mb-6 md:mb-12 border-b border-white/10 pb-4 md:pb-6 flex flex-col md:flex-row justify-between md:items-end">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white leading-tight">
                                Personalized <br />
                                <span className="text-neutral-500 font-serif italic">Recommendations.</span>
                            </h2>
                        </div>
                        <div className="text-left md:text-right mt-4 md:mt-0">
                            <p className="text-neutral-400 text-xs md:text-sm">Based on K-Means Clustering</p>
                            {/* Indikator Progress Scroll */}
                            <div className="w-full max-w-[150px] md:max-w-none md:w-full bg-neutral-800 h-1 mt-2 rounded-full overflow-hidden">
                                <motion.div
                                    style={{ scaleX: scrollYProgress, transformOrigin: "left" }}
                                    className="h-full bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Card Container */}
                    {/* Mobile: Tinggi disesuaikan (60vh) agar muat dengan header. Layout Column. */}
                    {/* Desktop: Tinggi 55vh. Layout Row. */}
                    <div className="flex flex-col md:flex-row gap-3 md:gap-4 h-[60vh] md:h-[55vh]">
                        {ACTIVE_INGREDIENTS.map((item, i) => (
                            <motion.div
                                key={i}
                                onClick={() => {
                                    setActive(i);
                                }}
                                className={`relative rounded-2xl md:rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-700 ease-[0.16,1,0.3,1] ${
                                    active === i ? 'flex-[3]' : 'flex-[1]'
                                }`}
                            >
                                {/* --- BACKGROUND IMAGE LAYER --- */}
                                <div className="absolute inset-0 bg-neutral-900">
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className={`w-full h-full object-cover transition-all duration-1000 
                                            ${active === i ? 'opacity-60 scale-110' : 'opacity-30 scale-100 grayscale'}
                                        `}
                                    />
                                </div>

                                {/* Abstract Color Glow */}
                                <div className={`absolute inset-0 opacity-40 ${item.color} mix-blend-overlay transition-opacity duration-500`}></div>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>

                                {/* CONTENT LAYER */}
                                <div className="absolute inset-0 p-5 md:p-8 flex flex-col justify-between z-10 text-white">
                                    <div className="flex justify-between items-start">
                                        <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase opacity-80 border border-white/20 px-2 py-1 rounded-full backdrop-blur-md bg-black/20">
                                            {item.role}
                                        </span>
                                        <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full bg-white text-black flex items-center justify-center transition-transform duration-500 ${active === i ? 'rotate-45 opacity-100' : 'rotate-0 opacity-0'}`}>
                                            <ArrowUpRight size={14} className="md:w-4 md:h-4" />
                                        </div>
                                    </div>

                                    <div>
                                        {/* LOGIKA RESPONSIF TITLE:
                                            - Mobile Active: text-2xl
                                            - Mobile Inactive: text-base, rotate-0 (karena strip horizontal)
                                            - Desktop Active: text-4xl
                                            - Desktop Inactive: text-xl, -rotate-90 (karena strip vertikal)
                                        */}
                                        <h3 className={`font-medium transition-all duration-500 origin-left md:origin-bottom-left
                                            ${active === i 
                                                ? 'text-2xl md:text-4xl mb-2 md:mb-4 translate-x-0 translate-y-0 rotate-0' 
                                                : 'text-base md:text-xl mb-0 translate-x-0 translate-y-0 rotate-0 md:-rotate-90 md:translate-x-8 md:-translate-y-8 whitespace-nowrap'
                                            }
                                        `}>
                                            {item.title}
                                        </h3>
                                        
                                        <div className={`overflow-hidden transition-all duration-700 ${active === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            <p className="text-neutral-300 text-sm md:text-lg leading-relaxed max-w-lg shadow-black drop-shadow-md line-clamp-3 md:line-clamp-none">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};
export default IngredientsSection;