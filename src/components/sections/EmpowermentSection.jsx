import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    motion,
    useScroll,
    useTransform,
} from 'framer-motion';
import {
    ArrowUpRight
} from 'lucide-react';

// --- 3D ASSETS ---
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Environment } from '@react-three/drei';
import { ROUTES } from '../../config';

// --- Komponen 3D Dual Bubble Mesh (Hitam & Putih) ---
const DualBubbleMesh = () => {
    const bubble1Ref = useRef();
    const bubble2Ref = useRef();
    
    useFrame((state) => {
        const t = state.clock.elapsedTime;
        if (bubble1Ref.current) {
            bubble1Ref.current.rotation.x = t * 0.1;
            bubble1Ref.current.rotation.y = t * 0.15;
            bubble1Ref.current.position.y = Math.sin(t * 0.5) * 0.2; 
        }
        if (bubble2Ref.current) {
            bubble2Ref.current.rotation.x = -t * 0.12;
            bubble2Ref.current.rotation.y = t * 0.1;
            bubble2Ref.current.position.y = Math.cos(t * 0.4) * 0.3 - 0.5; 
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
            {/* Gelembung Utama - Hitam Kaca (Dark Glass) */}
            <Sphere ref={bubble1Ref} args={[2.2, 64, 64]} position={[-0.4, 0, 0]}>
                <MeshDistortMaterial 
                    color="#000000" 
                    speed={3} 
                    distort={0.4} 
                    radius={1} 
                    roughness={0.05}     
                    metalness={0.8}      
                    clearcoat={1} 
                    clearcoatRoughness={0.1} 
                    transparent={true} 
                    opacity={0.85}       
                />
            </Sphere>

            {/* Gelembung Kedua - Putih Bening (Clear Light Glass) */}
            <Sphere ref={bubble2Ref} args={[1.6, 64, 64]} position={[1.2, -0.5, -0.8]}>
                <MeshDistortMaterial 
                    color="#ffffff" 
                    speed={4} 
                    distort={0.5} 
                    radius={1} 
                    roughness={0.05} 
                    metalness={0.1}      
                    clearcoat={1} 
                    clearcoatRoughness={0.1} 
                    transparent={true} 
                    opacity={0.5}        
                />
            </Sphere>
            
            <Environment preset="city" />
        </Float>
    );
};

const EmpowermentSection = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end end"]
    });

    // Efek Zoom-Out perlahan pada background agar tidak statis
    const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

    // Efek Reveal Teks
    const y = useTransform(scrollYProgress, [0.2, 0.8], [100, 0]);
    const opacity = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);

    return (
        // Mengubah bg-black menjadi bg-white
        <section ref={containerRef} className="relative h-screen bg-white flex flex-col justify-center items-center overflow-hidden">

            {/* --- 3D BUBBLE MASKING LAYER --- */}
            {/* Ditambahkan flex items-center justify-center untuk mengunci canvas tepat di tengah */}
            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none flex items-center justify-center">
                
                {/* motion.div dengan efek scale dihapus agar tidak terjadi ilusi shifting */}
                <Canvas camera={{ position: [0, 0, 8.5], fov: 45 }} className="w-full h-full">
                    <ambientLight intensity={1.5} />
                    <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
                    <directionalLight position={[-10, -10, -5]} intensity={1} color="#a1a1aa" />
                    <DualBubbleMesh />
                </Canvas>

                {/* Overlay Gradient putih transparan agar bubble tetap terlihat tapi teks tidak tabrakan */}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-white" />
            </div>

            {/* --- MAIN CONTENT --- */}
            {/* Menghapus mix-blend-screen karena background putih */}
            <div className="relative z-10 flex flex-col items-center text-center px-4 md:px-6 w-full">

                {/* Small Label */}
                <motion.p
                    style={{ opacity }}
                    className="text-neutral-500 text-[10px] md:text-sm tracking-[0.3em] uppercase font-medium mb-4 md:mb-6"
                >
                    The Future is Personal
                </motion.p>

                {/* GIANT TYPOGRAPHY */}
                <motion.div style={{ y, opacity }} className="flex flex-col items-center justify-center">
                    {/* Teks diubah menjadi gelap (zinc-900) */}
                    <h2 className="text-[18vw] sm:text-[15vw] md:text-[10rem] font-medium tracking-tighter leading-[0.8] md:leading-[0.85] text-zinc-900">
                        SMART
                    </h2>
                    
                    {/* Baris kedua */}
                    <div className="flex items-center justify-center gap-3 md:gap-8 mt-2 md:mt-0 w-full">
                        <span className="block h-[1px] w-8 sm:w-16 md:w-32 bg-zinc-300"></span>
                        <h2 className="text-[8vw] sm:text-[6vw] md:text-[5rem] font-serif italic text-zinc-800 leading-tight">
                            Insight.
                        </h2>
                        <span className="block h-[1px] w-8 sm:w-16 md:w-32 bg-zinc-300"></span>
                    </div>
                </motion.div>

                {/* CALL TO ACTION */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="mt-8 md:mt-20"
                >
                    {/* Warna link disesuaikan untuk tema terang */}
                    <Link to={ROUTES.INTRO_WEB} className="group flex items-center gap-3 md:gap-4 text-zinc-900 transition-all hover:opacity-70 cursor-pointer">
                        <div className="h-12 w-12 md:h-16 md:w-16 rounded-full border border-zinc-300 flex items-center justify-center group-hover:scale-110 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-500">
                            <ArrowUpRight size={20} className="md:w-6 md:h-6" />
                        </div>
                        <span className="text-xs md:text-lg tracking-widest uppercase font-medium">
                            Start Diagnosis
                        </span>
                    </Link>
                </motion.div>

            </div>

            {/* Footer Credit Kecil */}
            <div className="absolute bottom-6 md:bottom-10 w-full flex justify-between px-6 md:px-10 text-[9px] md:text-[10px] text-neutral-400 font-mono uppercase tracking-widest">
                <span>© 2026 UNSIL INFORMATICS</span>
                <span>SCROLL TO TOP</span>
            </div>

        </section>
    );
};

export default EmpowermentSection;