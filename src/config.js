// API Configuration
export const API_URL = import.meta.env.VITE_API_URL;

// Face Mesh Configuration
export const FACE_MESH_CONFIG = {
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
};

// ROI Points for Face Analysis
export const ROI_POINTS = {
    forehead: { 
        indices: [10, 338, 109, 151], 
        label: 'Forehead' 
    },
    nose: { 
        indices: [197, 195, 2, 102, 331], 
        label: 'Nose' 
    },
    leftCheek: { 
        // User's Left = Image Right (MediaPipe Indices: 425, 280, 266, 361)
        indices: [425, 280, 266, 361], 
        label: 'Left Cheek' 
    },
    rightCheek: { 
        // User's Right = Image Left (MediaPipe Indices: 205, 50, 36, 132)
        indices: [205, 50, 36, 132], 
        label: 'Right Cheek' 
    },
};

// Camera Configuration
export const CAMERA_CONFIG = {
    width: 1280,
    height: 720,
    facingMode: 'user',
};

// Validation Thresholds
export const VALIDATION_THRESHOLDS = {
    brightness: { min: 100, max: 200 }, 
    roiMinArea: 0.3,                    
    landmarkConfidence: 0.9,            
    maxYaw: 15,                     
    maxPitch: 20,
    maxRoll: 15,
};

// Image Processing
export const CROP_SIZE = 224;

// UI Colors
export const DIAGNOSIS_COLORS = {
    Acne: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200', hex: '#f43f5e' },
    Oily: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200', hex: '#f59e0b' },
    Normal: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200', hex: '#10b981' },
};

// Route Paths
export const ROUTES = {
    HOME: '/',
    ABOUT:'/about',
    PAPER: '/paper',
    CONTACT: '/contact',

    ANALYZE: '/analyze',
    RESULTS: '/results',
    DASHBOARD: '/dashboard',

    LOGIN: '/login',
    REGISTER: '/register',

    LIVECAM: '/analyze/live',
    UPLOAD: '/analyze/upload',

    HISTORY_LIST: '/history-list',

    INTRO_WEB: '/skinai-introduction',

    GUIDANCE: '/guidance',

    SUCCESS: '/success'
};
