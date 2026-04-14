/**
 * ErrorModal Component
 * Reusable modal for displaying errors with animations
 */

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export function ErrorModal({ isOpen, onClose, title, message }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: 'spring', bounce: 0.3 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-slate-400" />
                        </button>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.1, type: 'spring', bounce: 0.5 }}
                            className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4"
                        >
                            <AlertTriangle className="w-8 h-8 text-amber-500" />
                        </motion.div>

                        <h3 className="text-xl font-bold text-slate-800 mb-2">
                            {title || 'Error'}
                        </h3>

                        <p className="text-slate-500 mb-6 leading-relaxed">
                            {message || 'Something went wrong. Please try again.'}
                        </p>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                        >
                            Try Again
                        </motion.button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
