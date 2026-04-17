import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, ThumbsUp, AlertTriangle, ExternalLink, 
    Beaker, Send, Sparkles, Loader2, Activity,
    MessageSquare
} from 'lucide-react';
import Groq from 'groq-sdk';
import ReactMarkdown from 'react-markdown';

// Helper untuk mem-parsing string array dari JSON
const parseList = (str) => {
    if (!str) return [];
    if (Array.isArray(str)) return str.filter(s => s.trim());
    try {
        const arr = JSON.parse(str.replace(/'/g, '"'));
        return arr.filter(s => s.trim() !== '');
    } catch {
        return [str];
    }
};

const groq = new Groq({ 
    apiKey: import.meta.env.VITE_GROQ_API_KEY, 
    dangerouslyAllowBrowser: true 
});

export default function IngredientDetailModal({ ingredient, onClose }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // State untuk Mobile Chat Modal
    const [showMobileChat, setShowMobileChat] = useState(false);
    
    // Gunakan 2 ref berbeda karena elemen chat desktop & mobile dirender terpisah
    const desktopMessagesEndRef = useRef(null);
    const mobileMessagesEndRef = useRef(null);

    // Set initial greeting dari SkinAI
    useEffect(() => {
        if (ingredient) {
            setMessages([
                {
                    role: 'assistant',
                    content: `Hello! I am **SkinAI**, your virtual AI assistant. I'm here to help you explore the ingredient **${ingredient.name}**.\n\n*Disclaimer: I am an AI and can make mistakes. My responses are strictly for educational purposes and do not constitute professional medical advice.*`
                }
            ]);
        }
    }, [ingredient]);

    // Auto-scroll ke pesan terbaru
    useEffect(() => {
        desktopMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        mobileMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, showMobileChat]);

    // Mencegah scroll pada body halaman di belakang modal mobile chat
    useEffect(() => {
        if (showMobileChat) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [showMobileChat]);

    if (!ingredient) return null;

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', content: input };
        const chatHistoryForUI = [...messages, userMsg];
        setMessages(chatHistoryForUI);
        setInput('');
        setIsLoading(true);

        try {
            const systemPrompt = {
                role: 'system',
                content: `Your name is SkinAI. You are a virtual AI assistant providing general skincare information. You are NOT a dermatologist, doctor, or medical expert. The user is asking about the skincare ingredient: "${ingredient.name}". Keep answers concise, helpful, and avoid overly complex medical jargon. If asked for medical diagnosis or treatment, remind the user that your advice is strictly for educational purposes only and they should consult a professional. Use markdown formatting (bullet points, bold text) to make your answers easy to read.`
            };

            const apiMessages = [
                systemPrompt,
                ...chatHistoryForUI.map(msg => ({ role: msg.role, content: msg.content }))
            ];

            const chatCompletion = await groq.chat.completions.create({
                messages: apiMessages,
                model: 'llama-3.1-8b-instant', 
                temperature: 0.7,
                max_tokens: 500,
            });

            const replyContent = chatCompletion.choices[0]?.message?.content || "Sorry, I couldn't process that.";

            setMessages((prev) => [...prev, { role: 'assistant', content: replyContent }]);

        } catch (error) {
            console.error("Chat error:", error);
            setMessages((prev) => [...prev, { role: 'assistant', content: 'Oops, failed to connect to my servers. Please check your connection or try again later.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Fungsi Render Chat Interface (Bisa dipanggil untuk Desktop & Mobile) ---
    const renderChatInterface = (isMobile = false) => (
        <div className={`w-full h-full flex flex-col relative ${!isMobile ? 'bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] shadow-xl shadow-zinc-200/50 overflow-hidden' : ''}`}>
            
            {/* Chat Header */}
            <div className={`p-4 md:p-6 border-b flex items-center justify-between ${isMobile ? 'border-zinc-200/60 bg-white/80 backdrop-blur-md' : 'border-white bg-white/40'}`}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl sm:rounded-2xl bg-zinc-900 flex items-center justify-center text-white shadow-lg shadow-zinc-900/20 shrink-0">
                        <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm md:text-lg font-medium text-zinc-900 tracking-tight">Ask SkinAI</h3>
                        <p className="text-[10px] md:text-xs text-zinc-500 font-light">AI formulation analysis</p>
                    </div>
                </div>
                {/* Tombol Close khusus Mobile Modal */}
                {isMobile && (
                    <button onClick={() => setShowMobileChat(false)} className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-full text-zinc-500 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6 custom-scrollbar">
                {messages.map((msg, idx) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={idx} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] rounded-[1.25rem] sm:rounded-[1.5rem] px-4 py-3 md:px-5 md:py-3.5 text-[13px] sm:text-sm md:text-base leading-relaxed font-light ${
                            msg.role === 'user' 
                                ? 'bg-zinc-900 text-white rounded-br-sm shadow-md' 
                                : 'bg-white border border-white/60 shadow-sm rounded-bl-sm text-zinc-800'
                        }`}>
                            {msg.role === 'user' ? (
                                msg.content
                            ) : (
                                <ReactMarkdown 
                                    components={{
                                        ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 my-1.5 sm:my-2" {...props} />,
                                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1 my-1.5 sm:my-2" {...props} />,
                                        li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                                        p: ({node, ...props}) => <p className="mb-1.5 sm:mb-2 last:mb-0" {...props} />,
                                        strong: ({node, ...props}) => <strong className="font-medium text-zinc-900" {...props} />
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            )}
                        </div>
                    </motion.div>
                ))}
                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="max-w-[85%] rounded-[1.25rem] sm:rounded-[1.5rem] px-4 py-3 md:px-5 md:py-4 bg-white border border-white/60 shadow-sm rounded-bl-sm flex items-center gap-2 sm:gap-3">
                            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin text-zinc-400" />
                            <span className="text-[11px] sm:text-xs md:text-sm text-zinc-400 font-medium">SkinAI is thinking...</span>
                        </div>
                    </motion.div>
                )}
                <div ref={isMobile ? mobileMessagesEndRef : desktopMessagesEndRef} className="h-2" />
            </div>

            {/* Chat Input */}
            <div className={`p-4 md:p-6 shrink-0 ${isMobile ? 'bg-white/80 backdrop-blur-md border-t border-zinc-200/60 pb-8' : 'bg-white/40 border-t border-white backdrop-blur-md'}`}>
                <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask a question..."
                        disabled={isLoading}
                        className={`w-full border focus:ring-4 rounded-full py-3.5 sm:py-4 pl-5 pr-14 text-[13px] sm:text-sm transition-all outline-none disabled:opacity-50 shadow-sm placeholder:text-zinc-400 font-light
                            ${isMobile ? 'bg-white border-zinc-200 focus:border-indigo-100 focus:ring-indigo-50/50' : 'bg-white/60 border-white focus:bg-white focus:border-indigo-100 focus:ring-indigo-50/50'}`}
                    />
                    <button 
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-1.5 sm:right-2 p-2.5 bg-zinc-900 text-white rounded-full hover:bg-zinc-800 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:bg-zinc-900 disabled:hover:scale-100 transition-all shadow-md"
                    >
                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                </form>
                <p className="text-center text-[9px] md:text-[10px] text-zinc-400 mt-3 uppercase tracking-widest font-semibold">
                    Powered by Groq • AI may produce inaccurate information
                </p>
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: "100%" }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: "100%" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[100] h-[100dvh] w-full bg-[#F8F8F7] text-zinc-950 flex flex-col overflow-hidden font-sans selection:bg-zinc-200 selection:text-zinc-900 will-change-transform"
            >
                {/* Cinematic Background Blur */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute -top-[10%] left-[20%] w-[600px] md:w-[1000px] h-[600px] md:h-[1000px] bg-gradient-to-b from-indigo-100/40 to-transparent rounded-full blur-[80px] md:blur-[120px] opacity-60" />
                </div>

                {/* --- TOP HEADER NAVIGATION --- */}
                <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 shrink-0">
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full border border-neutral-200 bg-white/50 backdrop-blur-sm">
                        <Activity size={10} className="text-indigo-600 animate-pulse sm:w-3 sm:h-3" />
                        <span className="text-[10px] md:text-xs font-semibold tracking-wide text-neutral-500 uppercase">Ingredient Profile</span>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {ingredient.reference_url && (
                            <a 
                                href={ingredient.reference_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hidden lg:flex items-center gap-1.5 px-4 py-2.5 bg-white/60 hover:bg-white backdrop-blur-md border border-white/60 rounded-full text-xs font-medium text-zinc-700 transition-all shadow-sm"
                            >
                                <ExternalLink className="w-3.5 h-3.5" /> Scientific Ref
                            </a>
                        )}
                        <button 
                            onClick={onClose}
                            className="p-2.5 md:p-3 bg-white/60 hover:bg-white backdrop-blur-md border border-white/60 rounded-full text-zinc-500 hover:text-zinc-900 transition-all shadow-sm"
                        >
                            <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                {/* --- MAIN CONTENT AREA --- */}
                <div className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 overflow-hidden flex flex-row gap-6">
                    
                    {/* LEFT COLUMN: INFO (Full width on Mobile, Flex-1 on Desktop) */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-0 lg:pr-4 pb-28 lg:pb-0">
                        {/* Title Header */}
                        <div className="mb-8 sm:mb-10 md:mb-14 pt-2">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter text-zinc-900 leading-[1.1] sm:leading-[0.95] mb-2 md:mb-4">
                                {ingredient.name}
                            </h1>
                            {ingredient.scientific_name && (
                                <p className="font-serif italic text-base sm:text-lg md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-300">
                                    {ingredient.scientific_name}
                                </p>
                            )}
                        </div>

                        <div className="space-y-4 md:space-y-6">
                            {/* Overview Card */}
                            {ingredient.description && (
                                <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-sm">
                                    <h4 className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 md:mb-4">Overview</h4>
                                    <p className="text-[13px] sm:text-sm md:text-base text-zinc-700 leading-relaxed font-light">
                                        {ingredient.description}
                                    </p>
                                </div>
                            )}

                            {/* Mechanism Card */}
                            <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-sm">
                                <h4 className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3 md:mb-4">Mechanism of Action</h4>
                                <p className="text-[13px] sm:text-sm md:text-base text-zinc-700 leading-relaxed font-light whitespace-pre-wrap break-words">
                                    {ingredient.what_it_does}
                                </p>
                            </div>

                            {/* Pros & Cons Cards - Elegant Premium Redesign */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                {/* Good For - Elegant Emerald */}
                                <div className="group relative overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-sm transition-all duration-500 hover:shadow-md hover:border-emerald-100/50">
                                    {/* Ambient Soft Glow */}
                                    <div className="absolute -right-12 -top-12 w-40 h-40 bg-emerald-400/15 rounded-full blur-3xl transition-all duration-700 group-hover:bg-emerald-400/25 group-hover:scale-110 pointer-events-none" />
                                    
                                    <div className="relative z-10">
                                        <h4 className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-emerald-700 uppercase tracking-widest mb-5">
                                            <div className="p-1.5 md:p-2 rounded-lg bg-emerald-50/80 border border-emerald-100 shadow-sm backdrop-blur-sm">
                                                <ThumbsUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600" />
                                            </div>
                                            Good For
                                        </h4>
                                        <div className="flex flex-wrap gap-2 md:gap-2.5">
                                            {parseList(ingredient.who_is_it_good_for).map((item, idx) => (
                                                <span key={idx} className="px-3.5 py-1.5 bg-white/80 border border-emerald-50 text-emerald-800 rounded-full text-xs md:text-sm font-medium shadow-[0_2px_10px_-3px_rgba(16,185,129,0.08)] backdrop-blur-sm">
                                                    {item}
                                                </span>
                                            ))}
                                            {parseList(ingredient.who_is_it_good_for).length === 0 && (
                                                <span className="text-xs md:text-sm text-emerald-600/70 italic font-light">Universal / All Skin Types</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Avoid If - Elegant Rose */}
                                <div className="group relative overflow-hidden bg-white/40 backdrop-blur-xl border border-white/60 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-sm transition-all duration-500 hover:shadow-md hover:border-rose-100/50">
                                    {/* Ambient Soft Glow */}
                                    <div className="absolute -right-12 -top-12 w-40 h-40 bg-rose-400/15 rounded-full blur-3xl transition-all duration-700 group-hover:bg-rose-400/25 group-hover:scale-110 pointer-events-none" />
                                    
                                    <div className="relative z-10">
                                        <h4 className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-rose-700 uppercase tracking-widest mb-5">
                                            <div className="p-1.5 md:p-2 rounded-lg bg-rose-50/80 border border-rose-100 shadow-sm backdrop-blur-sm">
                                                <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4 text-rose-600" />
                                            </div>
                                            Avoid If
                                        </h4>
                                        <div className="flex flex-wrap gap-2 md:gap-2.5">
                                            {parseList(ingredient.who_should_avoid).map((item, idx) => (
                                                <span key={idx} className="px-3.5 py-1.5 bg-white/80 border border-rose-50 text-rose-800 rounded-full text-xs md:text-sm font-medium shadow-[0_2px_10px_-3px_rgba(244,63,94,0.08)] backdrop-blur-sm">
                                                    {item}
                                                </span>
                                            ))}
                                            {parseList(ingredient.who_should_avoid).length === 0 && (
                                                <span className="text-xs md:text-sm text-rose-600/70 italic font-light">No specific warnings</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Mobile Link Ref */}
                            {ingredient.reference_url && (
                                <a 
                                    href={ingredient.reference_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="lg:hidden flex items-center justify-center gap-1.5 w-full py-4 text-xs font-medium text-zinc-700 bg-white/60 backdrop-blur-md border border-white/60 rounded-[1.5rem] transition-all shadow-sm"
                                >
                                    <ExternalLink className="w-4 h-4" /> View Scientific Reference
                                </a>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: SKINAI CHAT (Hanya terlihat di Desktop) */}
                    <div className="hidden lg:block w-[450px] xl:w-[500px] shrink-0 h-full pb-0">
                        {renderChatInterface(false)}
                    </div>
                </div>

                {/* --- MOBILE FLOATING ACTION BUTTON (Hanya Desktop yang Hide) --- */}
                <div className="lg:hidden absolute bottom-6 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-sm">
                    <button 
                        onClick={() => setShowMobileChat(true)}
                        className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-zinc-900 text-white rounded-[1.5rem] shadow-2xl shadow-zinc-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        <Sparkles className="w-5 h-5 text-indigo-300" />
                        <span className="font-medium text-sm tracking-wide">Ask SkinAI About This</span>
                    </button>
                </div>

                {/* --- MOBILE CHAT MODAL (Bottom Sheet) --- */}
                <AnimatePresence>
                    {showMobileChat && (
                        <>
                            {/* Backdrop Modal */}
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                onClick={() => setShowMobileChat(false)}
                                className="lg:hidden fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm"
                            />
                            {/* Bottom Sheet Chat */}
                            <motion.div 
                                initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="lg:hidden fixed bottom-0 left-0 right-0 z-[120] h-[88dvh] bg-white rounded-t-[2rem] shadow-2xl flex flex-col overflow-hidden"
                            >
                                {/* Grabber Line (Visual Cues) */}
                                <div className="w-full flex justify-center pt-3 pb-1 absolute top-0 left-0 bg-transparent z-50 pointer-events-none">
                                    <div className="w-12 h-1.5 bg-zinc-300 rounded-full" />
                                </div>
                                {renderChatInterface(true)}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
                
            </motion.div>
        </AnimatePresence>
    );
}