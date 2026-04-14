import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, Mail, Send, Github, 
    Linkedin, MapPin, Sparkles, MessageSquare 
} from 'lucide-react';
import { ROUTES } from '../config';
import HeaderLandingPage from '../components/HeaderLandingPage';

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 50, damping: 20 }
    }
};

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulasi proses pengiriman pesan (Bisa diganti pakai integrasi Supabase / Formspree)
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSent(true);
            
            // Reset state setelah 3 detik
            setTimeout(() => setIsSent(false), 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white text-zinc-950 pb-16 sm:pb-24 font-sans selection:bg-zinc-200 selection:text-zinc-900">
            <HeaderLandingPage />

            <motion.main
                // Penyelarasan padding dan max-width agar konsisten dengan halaman lain
                className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 md:pt-40"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* --- Top Nav --- */}
                <motion.div variants={itemVariants} className="flex items-center justify-between mb-8 sm:mb-12 md:mb-16">
                    <Link to={ROUTES.HOME || '/'} className="group inline-flex items-center text-zinc-400 hover:text-zinc-900 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1.5 transition-transform" />
                        <span className="text-xs sm:text-sm font-medium">Back to Home</span>
                    </Link>
                    <div className="text-[10px] md:text-xs font-medium text-zinc-300 uppercase tracking-widest">
                        Get In Touch
                    </div>
                </motion.div>

                {/* --- Headline --- */}
                <motion.div variants={itemVariants} className="mb-12 sm:mb-16 md:mb-20 text-center max-w-2xl mx-auto px-2 sm:px-0">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-50 border border-zinc-200 text-[10px] sm:text-xs font-medium text-zinc-500 mb-6 md:mb-8">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                        Contact Developer
                    </div>
                    {/* Skala tipografi yang lebih fluid */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tighter text-zinc-900 mb-6 leading-[1.2] sm:leading-[1.1] md:leading-[1]">
                        Let's Talk About <br className="hidden sm:block" />
                        <span className="text-zinc-400">The Research.</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-zinc-500 font-light leading-relaxed">
                        Punya pertanyaan seputar arsitektur SkinAI, metodologi <i>explainable AI</i>, atau tertarik untuk kolaborasi pengembangan lebih lanjut? Silakan kirim pesan.
                    </p>
                </motion.div>

                {/* --- Content Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12">
                    
                    {/* Left Column: Contact Info & Socials */}
                    <motion.div variants={itemVariants} className="lg:col-span-5 space-y-4 sm:space-y-6 md:space-y-8">
                        <div className="bg-zinc-50 border border-zinc-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10">
                            <h3 className="text-lg md:text-xl font-medium text-zinc-900 mb-6">Informasi Kontak</h3>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm text-zinc-600">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] md:text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">Email</p>
                                        {/* Break-all ditambahkan agar email panjang tidak merusak layout di layar sangat kecil */}
                                        <a href="mailto:farelkadhafi34@gmail.com" className="text-sm md:text-base font-medium text-zinc-900 hover:text-indigo-600 transition-colors break-all sm:break-normal">
                                            farelkadhafi34@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm text-zinc-600">
                                        <MapPin className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] md:text-xs font-bold uppercase text-zinc-400 tracking-wider mb-1">Lokasi</p>
                                        <p className="text-sm md:text-base font-medium text-zinc-900">
                                            Tasikmalaya<br/>
                                            <span className="text-xs font-light text-zinc-500">Jawa Barat, Indonesia</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="grid grid-cols-2 gap-4">
                            <a href="https://github.com/yourusername" target="_blank" rel="noreferrer" className="group flex flex-col items-center justify-center gap-3 p-5 sm:p-6 bg-zinc-50 border border-zinc-100 rounded-2xl sm:rounded-3xl hover:bg-zinc-900 hover:border-zinc-800 transition-all duration-300">
                                <Github className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 group-hover:text-white transition-colors" />
                                <span className="text-xs font-medium text-zinc-600 group-hover:text-zinc-300">GitHub</span>
                            </a>
                            <a href="https://linkedin.com/in/yourusername" target="_blank" rel="noreferrer" className="group flex flex-col items-center justify-center gap-3 p-5 sm:p-6 bg-zinc-50 border border-zinc-100 rounded-2xl sm:rounded-3xl hover:bg-[#0A66C2] hover:border-[#0A66C2] transition-all duration-300">
                                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-400 group-hover:text-white transition-colors" />
                                <span className="text-xs font-medium text-zinc-600 group-hover:text-white/90">LinkedIn</span>
                            </a>
                        </div>
                    </motion.div>

                    {/* Right Column: Contact Form */}
                    <motion.div variants={itemVariants} className="lg:col-span-7">
                        <div className="bg-white border border-zinc-200 rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 lg:p-12 shadow-sm">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-zinc-900 mb-2">Kirim Pesan</h2>
                            <p className="text-xs sm:text-sm text-zinc-500 font-light mb-6 sm:mb-8 md:mb-10">Gunakan form di bawah ini untuk mengirim pesan langsung ke inbox gua.</p>

                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                                {/* Grid diubah menjadi sm:grid-cols-2 agar lebih responsif di tablet */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label htmlFor="name" className="text-[10px] sm:text-xs font-medium text-zinc-700 ml-1">Nama Lengkap</label>
                                        <input 
                                            type="text" 
                                            id="name" 
                                            required
                                            className="w-full px-4 py-3 sm:py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-1.5 sm:space-y-2">
                                        <label htmlFor="email" className="text-[10px] sm:text-xs font-medium text-zinc-700 ml-1">Alamat Email</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            required
                                            className="w-full px-4 py-3 sm:py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all"
                                            placeholder="elonmusk@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5 sm:space-y-2">
                                    <label htmlFor="subject" className="text-[10px] sm:text-xs font-medium text-zinc-700 ml-1">Subjek Pertanyaan</label>
                                    <select 
                                        id="subject" 
                                        className="w-full px-4 py-3 sm:py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="research">Diskusi Penelitian / Skripsi</option>
                                        <option value="collaboration">Kolaborasi / Project</option>
                                        <option value="bug">Report Bug pada SkinAI</option>
                                        <option value="other">Lainnya</option>
                                    </select>
                                </div>

                                <div className="space-y-1.5 sm:space-y-2">
                                    <label htmlFor="message" className="text-[10px] sm:text-xs font-medium text-zinc-700 ml-1">Pesan</label>
                                    <textarea 
                                        id="message" 
                                        rows="5" 
                                        required
                                        className="w-full px-4 py-3 sm:py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white transition-all resize-none"
                                        placeholder="Tuliskan detail pesan lu di sini..."
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isSubmitting || isSent}
                                    className={`w-full py-3.5 sm:py-4 mt-2 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                                        isSent 
                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                                        : 'bg-zinc-900 text-white hover:bg-black hover:shadow-lg hover:-translate-y-0.5'
                                    }`}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Mengirim Pesan...
                                        </span>
                                    ) : isSent ? (
                                        <span className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4" /> Pesan Terkirim!
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Send className="w-4 h-4" /> Kirim Pesan
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </motion.main>
        </div>
    );
}