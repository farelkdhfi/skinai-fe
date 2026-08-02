import React, { useRef } from 'react';
import {
    motion,
    useScroll,
    useTransform,
    useSpring
} from 'framer-motion';

const DisclaimerSection = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "center center"]
    });

    const smooth = useSpring(scrollYProgress, { stiffness: 30, damping: 20 });

    const opacity = useTransform(smooth, [0, 0.3], [0, 1]);
    const y = useTransform(smooth, [0, 1], [40, 0]);
    const scale = useTransform(smooth, [0, 1], [0.95, 1]);

    return (
        <section
            ref={ref}
            className="relative min-h-[100vh] md:min-h-[110vh] bg-[#020202] flex items-center justify-center px-4 md:px-6 py-12 md:py-20"
        >
            {/* Background wordmark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden">
                <h1 className="text-[22vw] font-bold tracking-tight text-white whitespace-nowrap select-none">
                    DISCLAIMER
                </h1>
            </div>

            <motion.div
                style={{ opacity, y, scale }}
                className="relative z-10 max-w-3xl w-full"
            >
                <div className="rounded-[2rem] md:rounded-[2.5rem] bg-[#0B0B0B] border border-white/10 px-6 py-10 sm:px-10 sm:py-12 md:px-16 md:py-20 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)]">

                    {/* Label */}
                    <p className="text-[10px] md:text-[11px] tracking-[0.35em] uppercase text-neutral-500 mb-6 md:mb-10">
                        Academic Notice
                    </p>

                    {/* Title */}
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight">
                        Research Context<br />
                        <span className="font-serif italic font-light text-neutral-500">
                            & Usage Boundaries
                        </span>
                    </h2>

                    {/* Divider */}
                    <div className="mt-8 mb-8 md:mt-10 md:mb-12 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    {/* Content */}
                    <div className="space-y-4 md:space-y-6 text-neutral-400 text-sm md:text-lg leading-relaxed font-light max-w-2xl">
                        <p>
                            This system was developed exclusively for 
                            <strong className="text-white font-medium"> academic research </strong>
                            purposes at Siliwangi University.
                        </p>
                        <p>
                            All outputs from the MobileNetV2-based model are probabilistic 
                            and are not designed as a substitute for clinical evaluation, 
                            medical diagnosis, or professional dermatological decisions.
                        </p>
                    </div>

                    {/* Footer mark */}
                    <div className="mt-10 md:mt-14 text-[9px] md:text-[10px] tracking-[0.4em] text-neutral-600 uppercase">
                        For Research Use Only
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
export default DisclaimerSection;