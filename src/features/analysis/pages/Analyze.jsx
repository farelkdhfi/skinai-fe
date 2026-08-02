import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import {
    Upload,
    AlertCircle, Loader2,
    ImageIcon, ArrowLeft, Aperture
} from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';

// ====== PERUBAHAN 1: useAnalysis (Context) -> useAnalyzeSkin (TanStack Query mutation) ======
// SEBELUM: import { useAnalysis } from '../../../context/AnalysisContext';
import { useAnalyzeSkin } from '../useAnalyzeSkin';
import { useAuth } from '../../../context/AuthContext';
import {
    ROI_POINTS,
    CROP_SIZE, ROUTES
} from '../../../config';
import ScanOverlay from '../../../components/ScanOverlay';
import GuidanceOverlay from '../../../components/GuidanceOverlay';
import StatusGrid from '../../../components/StatusGrid';
import { AnimatedSparkles } from '../components/AnimatedSparkles';
import { useFaceLandmarker } from '../hooks/useFaceLandmarker';

export default function Analyze({ initialMode = 'camera' }) {
    const navigate = useNavigate();

    // ====== PERUBAHAN 2: pemanggilan hook ======
    // SEBELUM: const { analyze, isAnalyzing, reset } = useAnalysis();
    const analyzeMutation = useAnalyzeSkin();
    const isAnalyzing = analyzeMutation.isPending; // nama berubah: isAnalyzing -> isPending

    const { isAuthenticated } = useAuth();

    // -- Refs --
    const webcamRef = useRef(null);
    const imgRef = useRef(null);
    const canvasRef = useRef(null);
    // Canvas terpisah khusus untuk proses capture (crop patch),
    const captureCanvasRef = useRef(document.createElement('canvas'));

    // -- State --
    const [mode, setMode] = useState(initialMode);
    const [analysisType, setAnalysisType] = useState('full');
    const [aggregationMethod, setAggregationMethod] = useState('racwv');
    const [selectedImage, setSelectedImage] = useState(null);
    const [capturedFrame, setCapturedFrame] = useState(null);
    const [showError, setShowError] = useState(false);
    const [countdown, setCountdown] = useState(null);

    // modal
    const [showSizeError, setShowSizeError] = useState(false);

    // DYNAMIC LOADING TEXT STATE
    const [loadingTextIdx, setLoadingTextIdx] = useState(0);
    const loadingPhrases = [
        "Extracting facial features...",
        "Running texture analysis...",
        "Generating condition maps...",
        "Finalizing results..."
    ];

    // -- MediaPipe logic (di-extract ke custom hook) --
    const {
        validations,
        isReady,
        uploadFaceDetected,
        currentLandmarks,
        modelLoaded,
        predictWebcam,
        cancelPrediction,
    } = useFaceLandmarker({ mode, analysisType, selectedImage, webcamRef, imgRef, canvasRef });

    useEffect(() => {
        let interval;
        if (isAnalyzing) {
            interval = setInterval(() => {
                setLoadingTextIdx((prev) => (prev + 1) % loadingPhrases.length);
            }, 1200);
        } else {
            setLoadingTextIdx(0);
        }
        return () => clearInterval(interval);
    }, [isAnalyzing]);

    const handleBack = useCallback(() => {
        console.log('handleBack triggered!', new Error().stack)
        cancelPrediction();
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        if (isAuthenticated) {
            navigate(ROUTES.ANALYZE);
        } else {
            navigate('/');
        }
    }, [navigate, isAuthenticated, cancelPrediction]);

    // Reset state non-MediaPipe tiap mode berubah
    // ====== PERUBAHAN 3: reset() dari Context -> analyzeMutation.reset() bawaan TanStack Query ======
    useEffect(() => {
        // SEBELUM: reset(); setSelectedImage(null); setCountdown(null);
        analyzeMutation.reset(); setSelectedImage(null); setCountdown(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    const handleImageUpload = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
            // Validasi ukuran file (1MB = 1048576 bytes)
            if (file.size > 1024 * 1024) {
                setShowSizeError(true); // Panggil modal
                e.target.value = ''; // Reset input
                return;
            }

            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const handleCapture = useCallback(async () => {
        setCountdown(null);

        const source = mode === 'camera' ? webcamRef.current?.video : imgRef.current;
        if (!source) return;

        if (mode === 'camera' && webcamRef.current) {
            const screenshot = webcamRef.current.getScreenshot();
            setCapturedFrame(screenshot);
        }

        cancelPrediction();

        const width = mode === 'camera' ? source.videoWidth : source.naturalWidth;
        const height = mode === 'camera' ? source.videoHeight : source.naturalHeight;
        const canvas = captureCanvasRef.current;
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        if (mode === 'camera') {
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
        }
        ctx.drawImage(source, 0, 0);

        try {
            let patches = {};
            let bboxes = {};
            const landmarks = currentLandmarks;

            if (analysisType === 'full') {
                if (!landmarks || landmarks.length < 468) throw new Error("No face");

                Object.keys(ROI_POINTS).forEach((region) => {
                    const { indices } = ROI_POINTS[region];
                    const points = indices.map(idx => {
                        let normalizedX = landmarks[idx].x;

                        if (mode === 'camera') {
                            normalizedX = 1 - normalizedX;
                        }

                        return {
                            x: normalizedX * width,
                            y: landmarks[idx].y * height
                        };
                    });

                    const minX = Math.min(...points.map(p => p.x));
                    const maxX = Math.max(...points.map(p => p.x));
                    const minY = Math.min(...points.map(p => p.y));
                    const maxY = Math.max(...points.map(p => p.y));

                    const roiW = maxX - minX;
                    const roiH = maxY - minY;
                    const padding = 15;
                    const sideLength = Math.max(roiW, roiH) + (padding * 2);
                    const centerX = minX + roiW / 2;
                    const centerY = minY + roiH / 2;
                    const startX = centerX - (sideLength / 2);
                    const startY = centerY - (sideLength / 2);

                    bboxes[region] = {
                        x: Math.round(startX),
                        y: Math.round(startY),
                        w: Math.round(sideLength),
                        h: Math.round(sideLength)
                    };

                    const patchCanvas = document.createElement('canvas');
                    patchCanvas.width = CROP_SIZE;
                    patchCanvas.height = CROP_SIZE;
                    const pCtx = patchCanvas.getContext('2d');

                    pCtx.drawImage(
                        canvas,
                        startX, startY, sideLength, sideLength,
                        0, 0, CROP_SIZE, CROP_SIZE
                    );

                    patches[region] = patchCanvas.toDataURL('image/jpeg', 0.95);
                });
            } else {
                const patchCanvas = document.createElement('canvas');
                patchCanvas.width = CROP_SIZE;
                patchCanvas.height = CROP_SIZE;
                const pCtx = patchCanvas.getContext('2d');

                const minDim = Math.min(width, height);
                const startX = (width - minDim) / 2;
                const startY = (height - minDim) / 2;

                pCtx.drawImage(
                    canvas,
                    startX, startY, minDim, minDim,
                    0, 0, CROP_SIZE, CROP_SIZE
                );

                patches['single_patch'] = patchCanvas.toDataURL('image/jpeg', 0.95);
            }

            // ====== PERUBAHAN 4: analyze(...) -> analyzeMutation.mutateAsync({...}) ======
            // SEBELUM: await analyze(patches, canvas.toDataURL('image/jpeg', 0.95), bboxes, aggregationMethod);
            await analyzeMutation.mutateAsync({
                images: patches,
                fullImage: canvas.toDataURL('image/jpeg', 0.95),
                bboxes,
                aggregationMethod,
            });
            navigate(ROUTES.RESULTS);
        } catch (err) {
            console.error('Analysis error:', err);
            setShowError(true);
            setCapturedFrame(null);
            if (mode === 'camera') predictWebcam();
        }
        // ====== PERUBAHAN 5: dependency array, "analyze" -> "analyzeMutation" ======
    }, [mode, currentLandmarks, analysisType, analyzeMutation, navigate, predictWebcam, aggregationMethod, cancelPrediction]);

    const allValid = validations.faceDetected && validations.brightness.valid && validations.roi.valid && validations.orientation.valid;

    const canCapture = modelLoaded && !isAnalyzing && (
        (mode === 'camera' && allValid) ||
        (mode === 'upload' && selectedImage && (analysisType === 'patch' || uploadFaceDetected))
    );

    const captureRef = useRef(handleCapture);
    useEffect(() => { captureRef.current = handleCapture; }, [handleCapture]);

    useEffect(() => {
        let timer;
        if (mode === 'camera' && canCapture && !isAnalyzing && !capturedFrame) {
            if (countdown === null) {
                setCountdown(3);
            } else if (countdown > 0) {
                timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
            } else if (countdown === 0) {
                captureRef.current();
            }
        } else {
            setCountdown(null);
        }
        return () => clearTimeout(timer);
    }, [mode, canCapture, countdown, isAnalyzing, capturedFrame]);

    // --- RENDER UI ---
    return (
        <div className="flex flex-col lg:flex-row h-[100dvh] lg:h-screen w-full bg-zinc-50 overflow-hidden font-sans text-zinc-900 selection:bg-zinc-900 selection:text-white">

            {/* --- LEFT: IMMERSIVE VIEWFINDER --- */}
            <div className="relative w-full lg:w-6/12 h-[45vh] lg:h-full bg-black flex items-center justify-center p-0 lg:p-4 overflow-hidden shadow-2xl z-10">
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-zinc-900/40 blur-3xl pointer-events-none" />

                <div className="relative w-full aspect-square max-w-[min(100vw,45vh)] lg:max-w-[75vh] lg:rounded-[2.5rem] overflow-hidden bg-zinc-950 ring-0 lg:ring-1 lg:ring-white/10 mx-auto shadow-2xl flex-shrink-0">
                    <div className="absolute inset-0 w-full h-full group">

                        {/* Feed */}
                        {mode === 'camera' ? (
                            capturedFrame ? (
                                <img
                                    src={capturedFrame}
                                    alt="Captured"
                                    className="w-full h-full object-cover scale-x-[-1] opacity-100"
                                />
                            ) : (
                                <Webcam
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="w-full h-full object-cover scale-x-[-1] brightness-105 contrast-105"
                                    videoConstraints={{ width: 720, height: 720, facingMode: "user", aspectRatio: 1 }}
                                />
                            )
                        ) : selectedImage ? (
                            <img ref={imgRef} src={selectedImage} alt="Selected" className="w-full h-full object-cover bg-zinc-900" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-4 md:gap-6 bg-zinc-900">
                                <div className="p-6 md:p-8 rounded-full bg-zinc-800/80 border border-zinc-700/80 border-dashed shadow-inner">
                                    <ImageIcon className="w-8 h-8 md:w-10 md:h-10 text-zinc-500 opacity-80" />
                                </div>
                                <p className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-zinc-500 opacity-80 whitespace-nowrap">
                                    No Image Source
                                </p>
                            </div>
                        )}

                        {/* Overlays */}
                        <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none object-cover z-10 ${mode === 'camera' ? 'scale-x-[-1]' : ''}`} />

                        {mode === 'camera' && !isAnalyzing && !capturedFrame && modelLoaded && analysisType === 'full' && (
                            <ScanOverlay isActive={true} validations={validations} />
                        )}

                        <GuidanceOverlay
                            validations={validations}
                            mode={mode}
                            isAnalyzing={isAnalyzing}
                            capturedFrame={capturedFrame}
                        />
                    </div>
                </div>
            </div>

            {/* --- RIGHT: CONTROL CENTER --- */}
            <div className="relative w-full lg:w-6/12 flex-1 lg:h-full bg-white flex flex-col z-20 rounded-t-[2rem] lg:rounded-none -mt-6 lg:mt-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] lg:shadow-none overflow-hidden">

                {/* Top Nav */}
                <div className="p-4 md:p-8 flex justify-between items-start">
                    <button onClick={handleBack} className="group flex items-center gap-2 md:gap-3 text-zinc-400 hover:text-zinc-900 transition-colors">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-zinc-200 flex items-center justify-center group-hover:bg-zinc-100 transition-all">
                            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" strokeWidth={1.5} />
                        </div>
                        <span className="text-[10px] md:text-xs font-bold tracking-widest uppercase hidden md:block mt-0.5">Exit</span>
                    </button>

                    <div className="flex gap-1 md:gap-2 p-1 bg-zinc-100/80 backdrop-blur-sm rounded-full z-10">
                            {['racwv', 'caaa'].map((method) => (
                                <button
                                    key={method}
                                    onClick={() => setAggregationMethod(method)}
                                    className={`
                                        px-4 py-1.5 md:px-5 md:py-2 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest uppercase transition-all duration-300
                                        ${aggregationMethod === method ? 'bg-white text-black shadow-md' : 'text-zinc-500 hover:text-zinc-700'}
                                    `}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>

                    <div className="flex gap-2">
                        <AnimatePresence>
                            {mode === 'upload' && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95, width: 0 }}
                                    className="flex gap-1 md:gap-2 p-1 bg-zinc-100/80 backdrop-blur-sm rounded-full overflow-hidden"
                                >
                                    {['full', 'patch'].map((t) => (
                                        <button
                                            key={t}
                                            onClick={() => setAnalysisType(t)}
                                            className={`
                                                px-4 py-1.5 md:px-5 md:py-2 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest uppercase transition-all duration-300
                                                ${analysisType === t ? 'bg-zinc-900 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-700'}
                                            `}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex gap-1 md:gap-2 p-1 bg-zinc-100/80 backdrop-blur-sm rounded-full z-10">
                            {['camera', 'upload'].map((m) => (
                                <button
                                    key={m}
                                    onClick={() => {
                                        setMode(m);
                                        if (m === 'camera' && analysisType === 'patch') {
                                            setAnalysisType('full');
                                        }
                                    }}
                                    className={`
                                        px-4 py-1.5 md:px-5 md:py-2 rounded-full text-[9px] md:text-[10px] font-bold tracking-widest uppercase transition-all duration-300
                                        ${mode === m ? 'bg-white text-zinc-900 shadow-md' : 'text-zinc-500 hover:text-zinc-700'}
                                    `}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content Scrollable */}
                <div className="flex-1 overflow-y-auto px-6 md:px-8 lg:px-24 pb-8 flex flex-col items-center justify-start lg:justify-center">

                    {/* Headers */}
                    <div className="text-center mb-6 md:mb-8 pt-2 lg:pt-0">
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium tracking-tight text-zinc-900 mb-2 md:mb-3">
                            {mode === 'camera' ? 'Face Analysis' : 'Upload Source'}
                        </h1>
                        <p className="text-zinc-400 font-light text-xs md:text-sm tracking-wide max-w-xs mx-auto md:max-w-none">
                            {mode === 'camera'
                                ? (analysisType === 'full' ? 'Align your face within the frame.' : 'Center the specific skin area.')
                                : 'Select a high-resolution portrait.'}
                        </p>
                    </div>

                    {/* Dynamic Controls */}
                    <div className={`flex flex-col items-center w-full max-w-sm md:max-w-md ${mode === 'camera' ? 'gap-6 md:gap-8' : 'gap-5 md:gap-6'}`}>

                        {/* 1. Validation Grid */}
                        <AnimatePresence mode="wait">
                            {mode === 'camera' && analysisType === 'full' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full"
                                >
                                    <StatusGrid validations={validations} />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* 2. Upload Area */}
                        {mode === 'upload' && (
                            <motion.label
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="block w-full h-32 md:h-40 rounded-3xl border border-dashed border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-3 md:gap-4 group"
                            >
                                <div className="p-3 md:p-4 rounded-full bg-zinc-100 group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <Upload className="w-5 h-5 md:w-6 md:h-6 text-zinc-500 group-hover:text-zinc-900 transition-colors" strokeWidth={1.5} />
                                </div>
                                <span className="text-[9px] md:text-[10px] font-bold tracking-[0.15em] text-zinc-400 group-hover:text-zinc-900 uppercase">Choose File</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </motion.label>
                        )}

                        {/* 3. The Premium Shutter Button */}
                        <div className="flex flex-col items-center pb-safe mt-2 md:mt-4">
                            <button
                                onClick={handleCapture}
                                disabled={!canCapture}
                                className="relative group outline-none"
                            >
                                {canCapture && (
                                    <span className="absolute inset-[-10px] rounded-full bg-teal-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                )}

                                <div className={`
                                    w-20 h-20 md:w-24 md:h-24 rounded-full p-1.5 flex items-center justify-center transition-all duration-500
                                    ${canCapture
                                        ? 'bg-gradient-to-b from-zinc-200 to-zinc-400 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] scale-100 hover:scale-105 active:scale-95 cursor-pointer'
                                        : 'bg-zinc-100 border border-zinc-200 cursor-not-allowed opacity-60'}
                                `}>
                                    <div className={`w-full h-full rounded-full flex items-center justify-center transition-colors duration-500 ${canCapture ? 'bg-gradient-to-br from-zinc-50 to-zinc-100 shadow-inner border border-white' : 'bg-transparent'}`}>
                                        {canCapture ? (
                                            countdown !== null && countdown > 0 ? (
                                                <span className="text-3xl md:text-4xl font-light text-zinc-800 animate-pulse">
                                                    {countdown}
                                                </span>
                                            ) : (
                                                <Aperture className="w-7 h-7 md:w-8 md:h-8 text-zinc-700" strokeWidth={1} />
                                            )
                                        ) : (
                                            <div className="w-3 h-3 rounded-full bg-zinc-300" />
                                        )}
                                    </div>
                                </div>
                            </button>

                            <span className={`mt-5 md:mt-6 text-[8px] md:text-[9px] font-bold tracking-[0.3em] uppercase transition-colors duration-500 ${canCapture ? 'text-teal-700' : 'text-zinc-300'}`}>
                                {isAnalyzing ? 'ANALYZING...' : canCapture ? (countdown !== null && countdown > 0 ? 'HOLD STILL' : 'READY TO SCAN') : 'WAITING FOR SIGNAL'}
                            </span>
                        </div>

                    </div>
                </div>
            </div>

            {/* FULL SCREEN LOADING UI WITH 3D ELEMENT */}
            <AnimatePresence>
                {(!modelLoaded || isAnalyzing) && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[150] flex flex-col items-center justify-center bg-white"
                    >
                        {/* WRAPPER UNTUK OPTICAL CENTERING */}
                        <div className="flex flex-col items-center justify-center -translate-y-12 md:-translate-y-16">
                            {/* New Elegant Sparkles Element dengan Bounding Box yang lebih rapat */}
                            <div className="w-48 h-48 md:w-64 md:h-64 mb-4 cursor-pointer flex items-center justify-center">
                                <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                                    <ambientLight intensity={1.5} />
                                    <directionalLight position={[5, 5, 5]} intensity={2} />
                                    <directionalLight position={[-5, -5, -5]} intensity={1} color="#ffffff" />
                                    <AnimatedSparkles />
                                </Canvas>
                            </div>

                            {/* Dynamic Text Container */}
                            <div className="h-8 overflow-hidden relative w-full flex justify-center">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={isAnalyzing ? loadingTextIdx : 'init'}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute text-[10px] md:text-xs font-bold tracking-[0.3em] text-zinc-900 uppercase text-center"
                                    >
                                        {isAnalyzing ? loadingPhrases[loadingTextIdx] : 'Initializing AI Model'}
                                    </motion.span>
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Modal (Polished) */}
            <AnimatePresence>
                {showError && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 backdrop-blur-lg p-6"
                        onClick={() => setShowError(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] p-8 md:p-10 max-w-sm w-full text-center shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-amber-100">
                                <AlertCircle className="w-6 h-6 md:w-7 md:h-7 text-amber-500" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-medium tracking-tight text-zinc-900 mb-3">Detection Failed</h3>
                            <p className="text-zinc-500 text-sm font-light leading-relaxed mb-8">
                                Unable to identify a clear facial structure. Please ensure proper lighting and remove any obstructions like glasses or hair.
                            </p>
                            <button
                                onClick={() => setShowError(false)}
                                className="w-full py-3.5 bg-zinc-900 text-white text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase rounded-2xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* File Size Error Modal */}
            <AnimatePresence>
                {showSizeError && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/60 backdrop-blur-lg p-6"
                        onClick={() => setShowSizeError(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            className="bg-white rounded-[2rem] p-8 md:p-10 max-w-sm w-full text-center shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-amber-100">
                                <AlertCircle className="w-6 h-6 md:w-7 md:h-7 text-amber-500" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-medium tracking-tight text-zinc-900 mb-3">
                                File Too Large
                            </h3>
                            <p className="text-zinc-500 text-sm font-light leading-relaxed mb-8">
                                Please select an image smaller than 1MB to ensure optimal processing speed and stability.
                            </p>
                            <button
                                onClick={() => setShowSizeError(false)}
                                className="w-full py-3.5 bg-zinc-900 text-white text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase rounded-2xl hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20"
                            >
                                Got It
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}