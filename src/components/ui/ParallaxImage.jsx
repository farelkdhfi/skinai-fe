import React, { useRef } from 'react';
import {
    motion,
    useScroll,
    useTransform,
} from 'framer-motion';

const ParallaxImage = ({ src, alt, className, speed = 1 }) => {
    const ref = useRef(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    // Core motion
    const y = useTransform(scrollYProgress, [0, 1], [-60 * speed, 60 * speed]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1, 1.1]);
    const rotateX = useTransform(scrollYProgress, [0, 1], [6, -6]);
    const rotateY = useTransform(scrollYProgress, [0, 1], [-4, 4]);

    // Light sweep
    const lightX = useTransform(scrollYProgress, [0, 1], ["-40%", "140%"]);
    const lightOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.25, 0]);

    return (
        <div
            ref={ref}
            className={`flex items-center justify-center perspective-[1200px] ${className}`}
        >
            {/* DEVICE */}
            <motion.div
                style={{ rotateX, rotateY }}
                className="relative w-full h-full md:max-w-[95%] md:max-h-[100%]"
            >
                {/* Phone Body */}
                <div className="relative w-full h-full bg-[#0E0E0E] border-[14px] md:border-[18px] border-[#0E0E0E]
                        rounded-[3.5rem] shadow-[0_40px_120px_rgba(0,0,0,0.45)]
                        overflow-hidden ring-1 ring-white/10 z-10">

                    {/* Notch */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 h-7 w-32 bg-black rounded-b-2xl z-30" />

                    {/* Screen */}
                    <div className="relative w-full h-full rounded-[2.6rem] overflow-hidden bg-black">

                        {/* Background depth */}
                        <motion.div
                            style={{ y: useTransform(scrollYProgress, [0, 1], [-20, 20]) }}
                            className="absolute inset-0 bg-gradient-to-b from-neutral-900/40 to-black"
                        />

                        {/* Image */}
                        <motion.img
                            src={src}
                            alt={alt}
                            style={{ y, scale }}
                            className="relative w-full h-full object-cover z-10 will-change-transform"
                        />

                        {/* Cinematic light sweep */}
                        <motion.div
                            style={{ left: lightX, opacity: lightOpacity }}
                            className="absolute top-0 w-[60%] h-full
                         bg-gradient-to-r from-transparent via-white/25 to-transparent
                         skew-x-[-12deg] pointer-events-none z-20"
                        />

                        {/* Inner glass */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 via-transparent to-transparent z-20" />
                        <div className="absolute inset-0 border border-white/5 rounded-[2.6rem] z-20" />
                    </div>
                </div>

                {/* Side Buttons */}
                <div className="absolute top-36 -right-[18px] w-[3px] h-20 bg-neutral-800 rounded-r-md border-l border-white/10" />
                <div className="absolute top-36 -left-[18px] w-[3px] h-14 bg-neutral-800 rounded-l-md border-r border-white/10" />
                <div className="absolute top-56 -left-[18px] w-[3px] h-14 bg-neutral-800 rounded-l-md border-r border-white/10" />
            </motion.div>
        </div>
    );
};
export default ParallaxImage;