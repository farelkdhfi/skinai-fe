import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, ChevronRight, Trash2 } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { DIAGNOSIS_COLORS } from "../../../config";

// 1. Tilt Card (Kartu 3D)
export const TiltCard = ({ children, className, noHover = false }) => {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
    const rotateX = useTransform(ySpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e) => {
        if (noHover || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX: noHover ? 0 : rotateX,
                rotateY: noHover ? 0 : rotateY,
                transformStyle: "preserve-3d"
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className={`relative ${className}`}
        >
            {children}
        </motion.div>
    );
};

// 2. Stat Card (Glass Style)
export const StatCard = ({ icon: Icon, label, value, trend, highlight }) => (
    <div className={`
        h-full p-4 sm:p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] border relative overflow-hidden group transition-all duration-300
        ${highlight
            ? 'bg-[#1A1A1A] border-[#333] text-white shadow-2xl'
            : 'bg-white/60 backdrop-blur-xl border-white/40 hover:border-indigo-200/50 hover:bg-white/80'
        }
    `}>
        {/* Decorative Glow */}
        {highlight && (
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-[50px] -mr-10 -mt-10" />
        )}

        <div className="relative z-10 flex flex-col h-full justify-between gap-4 md:gap-0">
            <div className="flex justify-between items-start mb-2 md:mb-4">
                <div className={`p-1.5 sm:p-2 md:p-2.5 rounded-xl md:rounded-2xl ${highlight ? 'bg-white/10' : 'bg-[#F4F4F5]'}`}>
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${highlight ? 'text-white' : 'text-zinc-700'}`} strokeWidth={1.5} />
                </div>
                {highlight && <ArrowUpRight className="text-zinc-500 w-4 h-4 md:w-5 md:h-5" />}
            </div>

            <div>
                {/* Responsive Text Size for Stats */}
                <h3 className={`text-2xl sm:text-4xl lg:text-5xl font-light tracking-tight mb-1 md:mb-2 ${highlight ? 'text-white' : 'text-zinc-900'}`}>
                    {value}
                </h3>
                <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest mb-1 ${highlight ? 'text-zinc-400' : 'text-zinc-400'}`}>
                    {label}
                </p>
                <p className={`text-[9px] md:text-xs ${highlight ? 'text-indigo-400' : 'text-indigo-600'} flex items-center gap-1`}>
                    {trend}
                </p>
            </div>
        </div>
    </div>
);

export const HistoryRow = ({ analysis, onDelete }) => {
    const colors = DIAGNOSIS_COLORS[analysis.skin_condition] || DIAGNOSIS_COLORS.Normal;
    const dateObj = new Date(analysis.created_at);
    const date = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    const time = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

    const handleDeleteClick = (e) => {
        e.preventDefault();
        onDelete(analysis.id);
    };

    return (
        <Link to={`/history/${analysis.id}`} className="group relative flex items-center justify-between p-3 sm:p-4 md:p-6 lg:p-8 hover:bg-white transition-colors duration-300">
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="flex items-center gap-3 md:gap-6 relative z-10">
                {/* Image UI */}
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl border border-zinc-200 bg-zinc-50 group-hover:scale-105 transition-transform duration-300 shrink-0 relative shadow-sm">
                    {analysis.image_url ? (
                        <img
                            src={analysis.image_url}
                            alt={`Scan ${analysis.skin_condition}`}
                            className="w-full h-full object-cover rounded-xl md:rounded-2xl"
                        />
                    ) : (
                        <div className="w-full h-full rounded-xl md:rounded-2xl flex items-center justify-center bg-zinc-100 text-zinc-400 text-[10px]">
                            No Img
                        </div>
                    )}

                    {/* Status Dot */}
                    <div className="absolute -bottom-1 -right-1 md:-bottom-1.5 md:-right-1.5">
                        <div
                            className="w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white"
                            style={{ backgroundColor: colors.hex || '#e4e4e7' }}
                        />
                    </div>
                </div>

                <div>
                    <p className="font-medium text-zinc-900 text-sm md:text-lg mb-0.5 md:mb-1">{analysis.skin_condition}</p>
                    <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-zinc-400 font-mono tracking-wide uppercase">
                        <span>{date}</span>
                        <span className="w-0.5 h-0.5 md:w-1 md:h-1 rounded-full bg-zinc-300" />
                        <span>{time}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 md:gap-8 relative z-10">
                {/* Menampilkan Persentase Confidence di Mobile, tidak disembunyikan lagi */}
                <div className="text-right block">
                    <span className="block text-base sm:text-xl md:text-2xl font-light text-zinc-900">
                        {(analysis.confidence_score * 100).toFixed(0)}%
                    </span>
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold text-zinc-300 uppercase tracking-widest hidden sm:block">Confidence</span>
                </div>

                <div className="flex items-center gap-1 md:gap-2">
                    <button
                        onClick={handleDeleteClick}
                        className="p-2 md:p-3 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg md:rounded-xl transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100 md:translate-x-4 md:group-hover:translate-x-0 duration-300 z-20 relative"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="p-2 md:p-3 text-zinc-300 group-hover:text-indigo-600 transition-colors">
                        <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                </div>
            </div>
        </Link>
    );
}