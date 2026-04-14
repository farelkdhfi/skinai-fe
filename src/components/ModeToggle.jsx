/**
 * ModeToggle Component
 * Toggle between Camera and Upload modes
 */

import { motion } from 'framer-motion';
import { Video, Upload } from 'lucide-react';

export function ModeToggle({ mode, onModeChange }) {
    return (
        <div className="flex justify-center mb-8">
            <div className="bg-white p-1.5 rounded-full border border-slate-200 shadow-sm inline-flex">
                <ModeButton
                    active={mode === 'camera'}
                    onClick={() => onModeChange('camera')}
                    icon={<Video className="w-4 h-4" />}
                    label="Live Camera"
                />
                <ModeButton
                    active={mode === 'upload'}
                    onClick={() => onModeChange('upload')}
                    icon={<Upload className="w-4 h-4" />}
                    label="Upload Image"
                />
            </div>
        </div>
    );
}

function ModeButton({ active, onClick, icon, label }) {
    return (
        <button
            onClick={onClick}
            className={`
        relative flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all
        ${active ? 'text-white' : 'text-slate-500 hover:bg-slate-50'}
      `}
        >
            {active && (
                <motion.div
                    layoutId="modeIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full shadow-md"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
            )}
            <span className="relative z-10 flex items-center gap-2">
                {icon}
                {label}
            </span>
        </button>
    );
}
