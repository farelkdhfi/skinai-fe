import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../config';

import faceAnalysisImg from '../../assets/facewithhandphone.jpg';
import processAnalysisImg from '../../assets/processAnalysis.jpg';
import resultAnalysisImg from '../../assets/resultAnalysis.jpg';

const slides = [
    { type: "step", id: "01", title: "Face Capture", desc: "Image capture with automatic grid guidance.", img: faceAnalysisImg },
    { type: "step", id: "02", title: "Segmentation", desc: "Precise separation of ROI (Region of Interest) areas.", img: processAnalysisImg },
    { type: "step", id: "03", title: "Result & Heatmap", desc: "Final diagnosis with validation of affected areas.", img: resultAnalysisImg },
    {
        type: "cta",
        id: "04",
        title: "Ready to Analyze?",
        desc: "Get precise skin analysis results in seconds. Experience advanced AI technology tailored for your skincare routine."
    }
];

const HorizontalProcessSection = ({ onStartClick }) => {
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        const autoPlayTimer = setTimeout(() => {
            const nextIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
            setDirection(1);
            setCurrentIndex(nextIndex);
        }, 3000);

        return () => clearTimeout(autoPlayTimer);
    }, [currentIndex]);

    const paginate = (newDirection) => {
        const newIndex = currentIndex + newDirection;
        if (newIndex >= 0 && newIndex < slides.length) {
            setDirection(newDirection);
            setCurrentIndex(newIndex);
        }
    };

    const handleDragEnd = (event, info) => {
        const swipeThreshold = 50;
        if (info.offset.x < -swipeThreshold && currentIndex < slides.length - 1) {
            paginate(1);
        } else if (info.offset.x > swipeThreshold && currentIndex > 0) {
            paginate(-1);
        }
    };

    return (
        <section className="relative w-full py-16 md:py-24 bg-[#f2f2f0] flex flex-col items-center justify-center overflow-hidden">
            <div className="relative w-[85vw] md:w-[60vw] h-[55vh] md:h-[65vh] flex items-center justify-center">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: direction < 0 ? "100%" : "-100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={handleDragEnd}
                        className="absolute w-full h-full rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-[#151515] shadow-2xl border border-neutral-800 cursor-grab active:cursor-grabbing flex"
                    >
                        {slides[currentIndex].type === "step" ? (
                            <>
                                <div className="absolute top-8 left-8 md:top-12 md:left-12 z-20 text-white pr-8 pointer-events-none">
                                    <span className="text-5xl md:text-7xl font-bold text-neutral-600 tracking-tighter mb-4 block">
                                        {slides[currentIndex].id}
                                    </span>
                                    {/* Mengikuti gaya Hero: font-medium dan tracking-tight */}
                                    <h3 className="text-3xl md:text-5xl font-medium tracking-tight mt-2 leading-tight">
                                        {slides[currentIndex].title}
                                    </h3>
                                    {/* Dihapus font-light nya */}
                                    <p className="mt-4 max-w-[85%] md:max-w-md text-sm md:text-lg text-neutral-300 leading-relaxed">
                                        {slides[currentIndex].desc}
                                    </p>
                                </div>
                                <img
                                    src={slides[currentIndex].img}
                                    alt={slides[currentIndex].title}
                                    className="w-full h-full object-cover pointer-events-none opacity-[0.65]"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#151515] via-[#151515]/60 to-transparent pointer-events-none" />
                            </>
                        ) : (
                            <div className="w-full h-full flex flex-col justify-center items-start text-left p-8 md:p-16 bg-[#151515] text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                                <div className="relative z-10 w-full">
                                    {/* Mengikuti gaya Badge Hero: font-medium tracking-wide */}
                                    <span className="text-[10px] md:text-xs font-medium tracking-wide text-neutral-500 uppercase mb-4 block">
                                        Final Step
                                    </span>

                                    {/* Mengikuti gaya Hero Heading: font-medium tracking-tight */}
                                    <h3 className="text-4xl md:text-6xl font-medium tracking-tight mb-4 leading-tight text-neutral-100">
                                        Ready to <br />
                                        <span className="font-serif italic text-neutral-400">Analyze?</span>
                                    </h3>

                                    {/* Dihapus font-light nya biar lebih solid */}
                                    <p className="text-sm md:text-lg text-neutral-400 mb-8 max-w-sm md:max-w-md leading-relaxed">
                                        {slides[currentIndex].desc}
                                    </p>

                                    <button
                                        onClick={onStartClick}
                                        className="group flex items-center gap-3 px-8 py-3 md:px-10 md:py-4 bg-white text-black rounded-full text-sm md:text-base font-medium transition-all duration-300 hover:bg-neutral-200 active:scale-95"
                                    >
                                        <span>Start Now</span>
                                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            <div className="flex gap-3 mt-10 z-10">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setDirection(index > currentIndex ? 1 : -1);
                            setCurrentIndex(index);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-500 ease-out ${currentIndex === index ? "w-10 bg-neutral-800" : "w-2 bg-neutral-300 hover:bg-neutral-400"
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HorizontalProcessSection;