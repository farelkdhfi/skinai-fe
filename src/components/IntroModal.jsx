import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Environment, Float } from '@react-three/drei';
import { 
    Fingerprint, 
    ScanFace, 
    Cpu, 
    ArrowRight,
    Activity,
    Layers,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';
import { ROUTES } from '../config';

// --- Komponen 3D Dual Bubble Mesh ---
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
            <Sphere ref={bubble1Ref} args={[2.2, 64, 64]} position={[-0.8, 0.15, 0]}>
                <MeshDistortMaterial 
                    color="#000000" speed={3} distort={0.4} radius={1} roughness={0.05}     
                    metalness={0.8} clearcoat={1} clearcoatRoughness={0.1} transparent={true} opacity={0.85}       
                />
            </Sphere>
            <Sphere ref={bubble2Ref} args={[1.6, 64, 64]} position={[0.8, -0.65, -0.8]}>
                <MeshDistortMaterial 
                    color="#ffffff" speed={4} distort={0.5} radius={1} roughness={0.05} 
                    metalness={0.1} clearcoat={1} clearcoatRoughness={0.1} transparent={true} opacity={0.5}        
                />
            </Sphere>
            <Environment preset="city" />
        </Float>
    );
};

// --- Container Visual AI ---
const BiometricBubbleIllustrator = () => {
    return (
        <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] md:w-[400px] md:h-[400px] shrink-0 flex items-center justify-center mx-auto">
            <div className="absolute inset-0 bg-zinc-400/20 rounded-full blur-[60px] animate-pulse pointer-events-none" />
            <Canvas camera={{ position: [0, 0, 8.5], fov: 45 }} className="z-10 cursor-grab active:cursor-grabbing" style={{ width: '100%', height: '100%' }}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
                <directionalLight position={[-10, -10, -5]} intensity={1} color="#a1a1aa" />
                <DualBubbleMesh />
            </Canvas>
        </div>
    );
};

// OPTIMASI: Ganti 'spring' yang berat kalkulasinya dengan 'tween' yang jauh lebih ringan dan mulus
const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { type: "tween", duration: 0.35, ease: "easeOut" } 
    },
    exit: { 
        opacity: 0, 
        y: -15, 
        transition: { type: "tween", duration: 0.2, ease: "easeIn" } 
    }
};

const IntroModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState(0);
    const [isPopping, setIsPopping] = useState(false);
    const utteranceRef = useRef(null); 

    const stepData = [
        { title: "System initialized.", subtitle: "Preparing high-precision facial skin analysis...", spoken: "System initialized. Preparing high-precision facial skin analysis." },
        { title: "Advanced Biometric AI", subtitle: "Powered by cutting-edge technology for absolute precision.", spoken: "Our advanced architecture utilizes Region-Aware Voting, Explainable A I, and Real-Time Processing to guarantee accuracy." },
        { title: "Ready to Start", subtitle: "Choose how you would like to proceed.", spoken: "Please select an option to continue. Authenticate to save your history, or proceed with a Quick Scan as a guest." }
    ];

    const features = [
        { icon: <Layers className="w-4 h-4 md:w-5 md:h-5 text-zinc-800" />, title: "Region-Aware Voting", desc: "Patch-based texture extraction aggregated through region-specific weighting." },
        { icon: <Cpu className="w-4 h-4 md:w-5 md:h-5 text-zinc-800" />, title: "Explainable AI", desc: "Transparent Grad-CAM heatmaps reveal the exact micro-features driving diagnosis." },
        { icon: <Activity className="w-4 h-4 md:w-5 md:h-5 text-zinc-800" />, title: "Real-Time Processing", desc: "Seamless edge-level inference ensuring your data is processed swiftly." }
    ];

    useEffect(() => {
        if (!isOpen) {
            setStep(0);
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            return;
        }

        let isCancelled = false;
        let fallbackTimer;
        let delayTimer;

        const proceedToNextStep = () => {
            if (isCancelled) return;
            setIsPopping(true);
            setTimeout(() => {
                if (!isCancelled) {
                    setStep(1);
                    setIsPopping(false);
                }
            }, 400); 
        };

        const speakCurrentStep = () => {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel(); 

                const utterance = new SpeechSynthesisUtterance(stepData[step].spoken);
                utteranceRef.current = utterance; 
                utterance.lang = 'en-US';
                utterance.rate = 0.95;
                utterance.pitch = 1.0;
                
                if (step === 0) {
                    let stepProceeded = false;
                    const safeProceed = () => {
                        if (stepProceeded || isCancelled) return;
                        stepProceeded = true;
                        clearTimeout(fallbackTimer);
                        proceedToNextStep();
                    };

                    utterance.onend = safeProceed;
                    utterance.onerror = safeProceed;
                    fallbackTimer = setTimeout(safeProceed, 10000);
                }

                window.speechSynthesis.speak(utterance);
            } else if (step === 0) {
                fallbackTimer = setTimeout(proceedToNextStep, 5000); 
            }
        };

        delayTimer = setTimeout(() => speakCurrentStep(), 400);

        return () => {
            isCancelled = true;
            clearTimeout(delayTimer);
            clearTimeout(fallbackTimer); 
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, [step, isOpen]); 

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 2));
    const handlePrev = () => setStep((prev) => Math.max(prev - 1, 0));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    // OPTIMASI: Ganti y: "100vh" menjadi y: "100%"
                    // 100vh di HP memicu kalkulasi ulang browser tiap kali address bar muncul/hilang (Layout Thrashing). 100% menggunakan ukuran relatif elemen, jauh lebih ringan.
                    initial={{ opacity: 0, y: "100%" }} 
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "100%" }}
                    // Sedikit dipercepat (0.5) agar feels responsif tapi tetap punya kurva easing yang sama nyamannya
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} 
                    className="fixed inset-0 z-[100] h-[100dvh] w-full bg-white text-zinc-950 flex flex-col items-center justify-between p-4 md:p-6 overflow-hidden font-sans selection:bg-zinc-200 selection:text-zinc-900 will-change-transform"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zinc-100 rounded-full blur-[100px] pointer-events-none" />

                    <div className="max-w-4xl w-full flex-grow flex flex-col items-center justify-center z-10">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={step} 
                                variants={itemVariants} 
                                initial="hidden" 
                                animate="visible" 
                                exit="exit"
                                // OPTIMASI: delegasi layer komposisi ke GPU saat ganti step
                                style={{ willChange: "opacity, transform" }}
                                className="w-full flex flex-col items-center text-center space-y-4 md:space-y-8"
                            >
                                <div className="space-y-2 md:space-y-4 w-full flex flex-col items-center">
                                    {step === 0 && (
                                        <div className={`transform transition-all duration-500 ease-in-out w-full flex justify-center items-center ${isPopping ? 'opacity-0 scale-125 blur-md' : 'opacity-100 scale-100 blur-none'}`}>
                                            <BiometricBubbleIllustrator />
                                        </div>
                                    )}
                                    
                                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-zinc-900 max-w-2xl mx-auto leading-tight">
                                        {stepData[step].title}
                                    </h1>
                                    <p className="text-sm md:text-lg text-zinc-500 font-light leading-relaxed max-w-xl mx-auto px-4">
                                        {stepData[step].subtitle}
                                    </p>
                                </div>

                                {step === 1 && (
                                    <div className="w-full max-w-4xl flex flex-col md:grid md:grid-cols-3 gap-2 md:gap-6 pt-2 md:pt-4 px-2">
                                        {features.map((item, idx) => (
                                            <motion.div 
                                                key={idx} 
                                                initial={{ opacity: 0, y: 10 }} 
                                                animate={{ opacity: 1, y: 0 }} 
                                                // OPTIMASI: Pastikan stagger pakai tween biasa, dan paksa GPU rendering via willChange
                                                transition={{ delay: idx * 0.1, duration: 0.35, type: "tween", ease: "easeOut" }} 
                                                style={{ willChange: "opacity, transform" }}
                                                className="group relative bg-zinc-50/80 rounded-xl md:rounded-3xl border border-zinc-100 hover:border-zinc-300 transition-all duration-300 flex flex-row md:flex-col items-center md:items-start p-3 md:p-8 text-left gap-3 md:gap-0"
                                            >
                                                <div className="p-2.5 md:p-4 bg-white rounded-lg md:rounded-2xl shrink-0 md:mb-5 border border-zinc-100 shadow-sm">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-sm md:text-base text-zinc-900 mb-0.5 md:mb-2">{item.title}</h4>
                                                    <p className="text-[11px] md:text-sm text-zinc-500 font-light leading-snug line-clamp-2 md:line-clamp-none">{item.desc}</p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}

                                {step === 2 && (
                                    <div className="w-full max-w-2xl flex flex-col sm:grid sm:grid-cols-2 gap-3 md:gap-5 pt-4 px-2">
                                        <button onClick={() => navigate(ROUTES.LOGIN)} className="group relative flex items-center justify-between p-4 md:p-6 bg-zinc-900 rounded-xl md:rounded-3xl border border-zinc-800 text-white hover:bg-black transition-all duration-300">
                                            <div className="text-left flex flex-col justify-center">
                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white mb-2">
                                                    <Fingerprint className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2} />
                                                </div>
                                                <h3 className="font-medium text-sm md:text-base text-white mb-0.5 group-hover:text-zinc-200 transition-colors">Authenticate</h3>
                                                <p className="text-[11px] md:text-sm text-zinc-400 font-light leading-snug">Unlock full history & metrics</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1.5 transition-all self-center md:self-end" />
                                        </button>
                                        
                                        <button onClick={() => navigate(ROUTES.LIVECAM)} className="group flex items-center justify-between p-4 md:p-6 bg-zinc-50 border border-zinc-100 rounded-xl md:rounded-3xl hover:bg-white hover:border-zinc-200 hover:shadow-sm transition-all duration-300">
                                            <div className="text-left flex flex-col justify-center">
                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center text-zinc-400 border border-zinc-100 mb-2">
                                                    <ScanFace className="w-3.5 h-3.5 md:w-4 md:h-4" strokeWidth={2} />
                                                </div>
                                                <h3 className="font-medium text-sm md:text-base text-zinc-900 mb-0.5 group-hover:text-zinc-600 transition-colors">Quick Scan</h3>
                                                <p className="text-[11px] md:text-sm text-zinc-500 font-light leading-snug">Proceed as guest, no data saved</p>
                                            </div>
                                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-zinc-400 group-hover:text-zinc-600 group-hover:translate-x-1.5 transition-all self-center md:self-end" />
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="w-full max-w-4xl flex items-center justify-between z-20 pt-4 pb-2">
                        <button onClick={handlePrev} disabled={step === 0} className={`flex items-center gap-1.5 md:gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-medium transition-all ${step === 0 ? 'opacity-0 pointer-events-none' : 'bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 shadow-sm'}`}>
                            <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" /> Prev
                        </button>
                        
                        <div className="flex gap-2">
                            {[0, 1, 2].map((dot) => (
                                <div key={dot} className={`h-1.5 rounded-full transition-all duration-500 ${step === dot ? 'bg-zinc-800 w-6 md:w-8' : 'bg-zinc-200 w-1.5 md:w-2'}`} />
                            ))}
                        </div>
                        
                        <button onClick={handleNext} disabled={step === 0 || step === 2} className={`flex items-center gap-1.5 md:gap-2 px-4 py-2 md:px-6 md:py-3 rounded-full text-xs md:text-sm font-medium transition-all ${step === 0 || step === 2 ? 'opacity-0 pointer-events-none' : 'bg-zinc-900 text-white hover:bg-black shadow-md'}`}>
                            Next <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IntroModal;