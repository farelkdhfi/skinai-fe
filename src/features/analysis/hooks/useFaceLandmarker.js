import { useRef, useState, useCallback, useEffect } from 'react';
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import { VALIDATION_THRESHOLDS } from '../../../config';
// ^ sesuaikan path import config ini kalau lokasi hook file-nya beda level

/**
 * Hook yang membungkus semua logic MediaPipe FaceLandmarker:
 * - init model
 * - loop deteksi di webcam (VIDEO mode)
 * - deteksi di image upload (IMAGE mode)
 * - kalkulasi brightness / ROI / orientation
 * - gambar overlay tesselation ke canvas
 *
 * @param {Object} params
 * @param {'camera'|'upload'} params.mode
 * @param {'full'|'patch'} params.analysisType
 * @param {string|null} params.selectedImage
 * @param {React.RefObject} params.webcamRef
 * @param {React.RefObject} params.imgRef
 * @param {React.RefObject} params.canvasRef - canvas overlay (dipakai buat gambar tesselation)
 */
export function useFaceLandmarker({ mode, analysisType, selectedImage, webcamRef, imgRef, canvasRef }) {
    const faceLandmarkerRef = useRef(null);
    const requestRef = useRef(null);
    const processingCanvasRef = useRef(document.createElement('canvas'));

    const [validations, setValidations] = useState({
        faceDetected: false,
        brightness: { valid: false, value: 0 },
        roi: { valid: false, value: 0 },
        orientation: { valid: false, yaw: 0, pitch: 0, roll: 0 }
    });
    const [isReady, setIsReady] = useState(false);
    const [uploadFaceDetected, setUploadFaceDetected] = useState(false);
    const [currentLandmarks, setCurrentLandmarks] = useState(null);
    const [modelLoaded, setModelLoaded] = useState(false);

    const calculateBrightness = useCallback((source) => {
        const canvas = processingCanvasRef.current;
        canvas.width = 50; canvas.height = 50;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(source, 0, 0, 50, 50);
        const data = ctx.getImageData(0, 0, 50, 50).data;
        let sum = 0;
        for (let i = 0; i < data.length; i += 4) {
            sum += (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
        }
        return sum / (data.length / 4);
    }, []);

    const calculateROI = useCallback((landmarks, width, height) => {
        if (!landmarks || landmarks.length === 0) return 0;
        const xs = landmarks.map(l => l.x * width);
        const ys = landmarks.map(l => l.y * height);
        return ((Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys))) / (width * height);
    }, []);

    const calculateOrientation = useCallback((landmarks) => {
        if (!landmarks || landmarks.length < 468) return { yaw: 0, pitch: 0, roll: 0 };
        const noseTip = landmarks[4];
        const leftEye = landmarks[33];
        const rightEye = landmarks[263];
        const eyeMidX = (leftEye.x + rightEye.x) / 2;
        const eyeMidY = (leftEye.y + rightEye.y) / 2;
        return {
            yaw: Math.abs((noseTip.x - eyeMidX) * 100),
            pitch: Math.abs((noseTip.y - eyeMidY) * 100),
            roll: Math.abs(Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI))
        };
    }, []);

    const handleResults = useCallback((results, inputWidth, inputHeight) => {
        const hasFace = results.faceLandmarks && results.faceLandmarks.length > 0;

        if (!hasFace) {
            setValidations({
                faceDetected: false,
                brightness: { valid: false, value: 0 },
                roi: { valid: false, value: 0 },
                orientation: { valid: false, yaw: 0, pitch: 0, roll: 0 }
            });
            setIsReady(false);
            if (mode === 'upload') setUploadFaceDetected(false);
            if (canvasRef.current) {
                canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }
            return;
        }

        const landmarks = results.faceLandmarks[0];
        let brightness = 0;
        if (mode === 'camera' && webcamRef.current?.video) brightness = calculateBrightness(webcamRef.current.video);
        else if (mode === 'upload' && imgRef.current) brightness = calculateBrightness(imgRef.current);

        const brightnessValid = brightness >= VALIDATION_THRESHOLDS.brightness.min && brightness <= VALIDATION_THRESHOLDS.brightness.max;
        const roiValue = calculateROI(landmarks, inputWidth, inputHeight);
        const roiValid = roiValue >= VALIDATION_THRESHOLDS.roiMinArea;
        const orientation = calculateOrientation(landmarks);
        const orientationValid = orientation.yaw <= VALIDATION_THRESHOLDS.maxYaw &&
            orientation.pitch <= VALIDATION_THRESHOLDS.maxPitch &&
            orientation.roll <= VALIDATION_THRESHOLDS.maxRoll;

        setValidations({
            faceDetected: true,
            brightness: { valid: brightnessValid, value: Math.round(brightness) },
            roi: { valid: roiValid, value: Math.round(roiValue * 100) },
            orientation: { valid: orientationValid, ...orientation }
        });

        setCurrentLandmarks(landmarks);

        if (mode === 'upload') {
            setUploadFaceDetected(true);
            setIsReady(true);
        } else {
            setIsReady(brightnessValid && roiValid && orientationValid);
        }

        if (canvasRef.current && mode !== 'upload' && analysisType === 'full') {
            const overlayCtx = canvasRef.current.getContext('2d');
            canvasRef.current.width = inputWidth;
            canvasRef.current.height = inputHeight;
            overlayCtx.clearRect(0, 0, inputWidth, inputHeight);

            overlayCtx.lineWidth = 0.4;
            overlayCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)';

            if (FaceLandmarker.FACE_LANDMARKS_TESSELATION) {
                for (const connection of FaceLandmarker.FACE_LANDMARKS_TESSELATION) {
                    const point1 = landmarks[connection.start];
                    const point2 = landmarks[connection.end];
                    if (point1 && point2) {
                        overlayCtx.beginPath();
                        overlayCtx.moveTo(point1.x * inputWidth, point1.y * inputHeight);
                        overlayCtx.lineTo(point2.x * inputWidth, point2.y * inputHeight);
                        overlayCtx.stroke();
                    }
                }
            }
        } else if (canvasRef.current) {
            const overlayCtx = canvasRef.current.getContext('2d');
            overlayCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    }, [calculateBrightness, calculateROI, calculateOrientation, mode, analysisType, canvasRef, webcamRef, imgRef]);

    // Init FaceLandmarker sekali di awal
    useEffect(() => {
        const initLandmarker = async () => {
            const filesetResolver = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
            faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(filesetResolver, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                    delegate: "GPU"
                },
                outputFaceBlendshapes: true,
                runningMode: mode === 'camera' ? "VIDEO" : "IMAGE",
                numFaces: 1
            });
            setModelLoaded(true);
        };
        initLandmarker();
        return () => {
            if (faceLandmarkerRef.current) faceLandmarkerRef.current.close();
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update running mode + reset state deteksi tiap mode berubah
    useEffect(() => {
        if (faceLandmarkerRef.current) {
            try { faceLandmarkerRef.current.setOptions({ runningMode: mode === 'camera' ? "VIDEO" : "IMAGE" }); }
            catch (e) { console.log(e); }
        }
        setIsReady(false);
        setUploadFaceDetected(false);
        if (canvasRef.current) canvasRef.current.getContext('2d').clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode]);

    const predictWebcam = useCallback(() => {
        if (mode !== 'camera' || !webcamRef.current?.video) return;
        const video = webcamRef.current.video;
        if (video.readyState !== 4) {
            requestRef.current = requestAnimationFrame(predictWebcam);
            return;
        }
        if (faceLandmarkerRef.current) {
            const results = faceLandmarkerRef.current.detectForVideo(video, performance.now());
            handleResults(results, video.videoWidth, video.videoHeight);
        }
        if (mode === 'camera') requestRef.current = requestAnimationFrame(predictWebcam);
    }, [mode, handleResults, webcamRef]);

    useEffect(() => {
        if (mode === 'camera' && modelLoaded) requestRef.current = requestAnimationFrame(predictWebcam);
        else if (requestRef.current) cancelAnimationFrame(requestRef.current);
        return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); }
    }, [mode, modelLoaded, predictWebcam]);

    useEffect(() => {
        if (mode !== 'upload' || !selectedImage || !imgRef.current || !modelLoaded) return;
        const detectFace = async () => {
            if (faceLandmarkerRef.current && imgRef.current.complete) {
                await faceLandmarkerRef.current.setOptions({ runningMode: "IMAGE" });
                const rect = imgRef.current.getBoundingClientRect();
                const results = faceLandmarkerRef.current.detect(imgRef.current);
                handleResults(results, rect.width, rect.height);
            }
        };
        if (imgRef.current.complete) detectFace(); else imgRef.current.onload = detectFace;
    }, [mode, selectedImage, modelLoaded, handleResults, imgRef]);

    const cancelPrediction = useCallback(() => {
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }
    }, []);

    return {
        validations,
        isReady, setIsReady,
        uploadFaceDetected, setUploadFaceDetected,
        currentLandmarks,
        modelLoaded,
        faceLandmarkerRef,
        requestRef,
        predictWebcam,
        cancelPrediction,
    };
}