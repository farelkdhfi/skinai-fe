import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Environment, Float } from "@react-three/drei";
import { ROUTES } from "../config";

// --- 1. Komponen 3D Dual Bubble Mesh (Selaras dengan Intro & Auth) ---
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
            <Sphere ref={bubble1Ref} args={[2.2, 64, 64]} position={[-0.4, 0, 0]}>
                <MeshDistortMaterial
                    color="#000000" speed={3} distort={0.4} radius={1}
                    roughness={0.05} metalness={0.8} clearcoat={1}
                    clearcoatRoughness={0.1} transparent={true} opacity={0.85}
                />
            </Sphere>
            <Sphere ref={bubble2Ref} args={[1.6, 64, 64]} position={[1.2, -0.5, -0.8]}>
                <MeshDistortMaterial
                    color="#ffffff" speed={4} distort={0.5} radius={1}
                    roughness={0.05} metalness={0.1} clearcoat={1}
                    clearcoatRoughness={0.1} transparent={true} opacity={0.5}
                />
            </Sphere>
            <Environment preset="city" />
        </Float>
    );
};

// --- 2. Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
};

// --- 3. Main Success Page Component ---
export default function SuccessPage() {
    const navigate = useNavigate();

    useEffect(() => {
        // Durasi ditambah jadi 4s agar animasi dan 3D render sempat dinikmati user
        const timer = setTimeout(() => {
            navigate(ROUTES.LOGIN);
        }, 4000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="h-[100dvh] w-full bg-white flex flex-col items-center justify-center relative overflow-hidden font-sans selection:bg-zinc-200 selection:text-zinc-900">

            {/* Logo Kiri Atas (Konsisten dengan AuthPage) */}
            <div className="absolute top-4 left-4 lg:top-8 lg:left-8 z-20 pointer-events-none">
                <span className="font-black text-xl lg:text-3xl tracking-tight text-zinc-900">SkinAI.</span>
            </div>

            {/* Background Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-100 rounded-full blur-[100px] pointer-events-none" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-2xl text-center px-6 flex flex-col items-center"
            >
                {/* Visual 3D + Icon Centang */}
                <motion.div variants={itemVariants} className="relative w-[220px] h-[220px] md:w-[280px] md:h-[280px] mb-6 flex items-center justify-center shrink-0">
                    {/* Subtle pulse background */}
                    <div className="absolute inset-0 bg-zinc-400/10 rounded-full blur-[40px] animate-pulse pointer-events-none" />

                    {/* Canvas 3D */}
                    <Canvas camera={{ position: [0, 0, 8.5], fov: 45 }} className="w-full h-full z-10 cursor-grab active:cursor-grabbing">
                        <ambientLight intensity={1.5} />
                        <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
                        <directionalLight position={[-10, -10, -5]} intensity={1} color="#a1a1aa" />
                        <DualBubbleMesh />
                    </Canvas>

                    {/* Icon Centang di tengah (Glassmorphism overlay) */}
                    <div className="absolute z-20 bg-white/70 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-lg border border-white/50 flex items-center justify-center pointer-events-none">
                        <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-zinc-900" strokeWidth={2} />
                    </div>
                </motion.div>

                {/* Title & Description */}
                <motion.div variants={itemVariants} className="space-y-3 mb-8">
                    <h1 className="text-3xl md:text-5xl font-medium tracking-tighter text-zinc-900">
                        Verification Complete
                    </h1>
                    <p className="text-sm md:text-base text-zinc-500 font-light max-w-sm md:max-w-md mx-auto leading-relaxed">
                        Your account is now active. You can continue to sign in and start exploring your high-precision skin analysis.
                    </p>
                </motion.div>

                {/* Action Button */}
                <motion.div variants={itemVariants} className="w-full sm:w-auto flex flex-col items-center gap-4">
                    <button
                        onClick={() => navigate(ROUTES.LOGIN)}
                        className="group px-8 py-3.5 bg-zinc-900 text-white rounded-xl font-medium shadow-lg shadow-zinc-200 hover:bg-black hover:shadow-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto text-sm md:text-base"
                    >
                        Continue to Login
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <p className="text-[11px] md:text-xs text-zinc-400 font-light animate-pulse">
                        Redirecting automatically in a few seconds...
                    </p>
                </motion.div>
            </motion.div>

            {/* Footer Copyright */}
            <div className="absolute bottom-4 lg:bottom-6 text-[9px] lg:text-xs text-zinc-400 text-center w-full pointer-events-none">
                &copy; 2026 SkinAI Analysis. All rights reserved.
            </div>
        </div>
    );
}