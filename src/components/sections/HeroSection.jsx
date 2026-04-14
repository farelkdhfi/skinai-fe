import { Link } from 'react-router-dom';
import {
    motion,
} from 'framer-motion';
import {
    ArrowRight
} from 'lucide-react';

// --- ASSETS ---
import { ROUTES } from '../../config';

import HeroImg from '../../assets/fullface.png';
import ParallaxImage from '../ui/ParallaxImage';

const HeroSection = () => {
    return (
        <section className="relative w-full flex flex-col items-center px-4 sm:px-6 pb-12 md:pb-20 pt-6 md:pt-0">
            {/* Sticky Wrapper: Adjusted top position for mobile to prevent header overlap */}
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

                {/* Main Heading: Scaled down for mobile (4xl) up to original desktop size (8xl) */}
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="text-4xl sm:text-6xl md:text-8xl font-medium tracking-tight leading-[0.95] md:leading-[0.9] text-center"
                >
                    Scan. <br className='block sm:hidden' /> Analyze.<br className="hidden sm:block" />
                    <span className="text-neutral-400 font-serif italic block sm:inline mt-1 sm:mt-0">Result.</span>
                </motion.h1>

                {/* Subtitle: Adjusted text size and max-width for readability on small screens */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="max-w-xs sm:max-w-xl mx-auto text-neutral-500 text-sm md:text-lg leading-relaxed px-2"
                >
                    Menggunakan MobileNetV2 dengan strategi patch-based untuk analisis tekstur mikro dan Smart Camera Guidance untuk standarisasi input real-time.
                </motion.p>

                {/* BUTTON */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="pt-2 md:pt-0"
                >
                    <Link to={ROUTES?.INTRO_WEB || '#'} className="group relative inline-flex h-12 md:h-14 items-center justify-center overflow-hidden rounded-full bg-[#111] px-6 md:px-8 font-medium text-neutral-50 transition-all hover:bg-neutral-800 w-44 md:w-48 hover:w-48 md:hover:w-52">
                        <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
                            <div className="relative h-full w-8 bg-white/20" />
                        </div>
                        <span className="mr-2 text-sm md:text-base">Mulai Analisis</span>
                        <ArrowRight size={18} className='group-hover:translate-x-1 transition-transform' />
                    </Link>
                </motion.div>
            </div>

            {/* Parallax Hero Image */}
            {/* Adjusted Margin Top (mt) and Height (h) for mobile smoothness */}
            <div className="relative w-full md:max-w-[90rem] mt-24 sm:mt-32 md:mt-40 h-[50vh] sm:h-[60vh] md:h-[80vh] z-20 px-0 sm:px-4 md:px-0">
                <ParallaxImage
                    src={HeroImg}
                    alt="Face Analysis Hero"
                    className="w-full h-full object-cover rounded-none sm:rounded-2xl md:rounded-3xl"
                    speed={1.2}
                />

                {/* Info Cards Overlay */}
                {/* Adjusted positioning (left/bottom) to prevent cutting off on small screens */}
                <div className="absolute bottom-4 left-4 sm:bottom-10 sm:left-10 md:bottom-16 md:left-16 text-white z-30 max-w-[90%]">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">

                        {/* Card 1 */}
                        <div className="bg-black/40 backdrop-blur-md p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 shadow-lg">
                            <p className="text-[10px] md:text-xs uppercase tracking-widest opacity-80 mb-0.5 md:mb-1 text-neutral-300">Powered by</p>
                            <p className="text-lg sm:text-xl md:text-3xl font-light">MobileNetV2</p>
                        </div>

                        {/* Card 2 - Hidden on mobile as per original design, kept visible on md+ */}
                        <div className="bg-black/40 backdrop-blur-md p-3 md:p-4 rounded-xl md:rounded-2xl border border-white/10 shadow-lg hidden md:block">
                            <p className="text-[10px] md:text-xs uppercase tracking-widest opacity-80 mb-0.5 md:mb-1 text-neutral-300">Method</p>
                            <p className="text-lg sm:text-xl md:text-3xl font-light">Patch-Based</p>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    )
}
export default HeroSection;