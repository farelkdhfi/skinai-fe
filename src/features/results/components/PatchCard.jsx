import { Eye } from "lucide-react";
import { DIAGNOSIS_COLORS } from "../../../config";

export function PatchCard({ item, patch, heatmap, showHeatmap, onClick }) {
    const colors = DIAGNOSIS_COLORS[item.predicted_class] || DIAGNOSIS_COLORS.Normal;
    return (
        <div
            onClick={() => onClick({ patch, heatmap, region: item.region })}
            className="group relative bg-zinc-50 rounded-[1rem] sm:rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-100 hover:border-zinc-300 cursor-pointer transition-all duration-300">
            <div className="aspect-square relative bg-zinc-200">
                {patch && (
                    <img src={patch} alt={item.region} className="w-full h-full object-cover absolute inset-0" />
                )}
                {heatmap && (
                    <div className={`absolute inset-0 transition-opacity duration-500 z-10 ${showHeatmap ? 'opacity-100' : 'opacity-0'}`}>
                        <img src={heatmap} alt="Heatmap" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    </div>
                )}
                <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white">
                        <Eye className="w-5 h-5" />
                    </div>
                </div>
                <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 md:top-3.5 md:left-3.5 z-20">
                    <span className={`text-[8px] sm:text-[9px] md:text-[10px] font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 rounded-full bg-white/90 backdrop-blur shadow-sm ${colors.text}`}>
                        {item.predicted_class}
                    </span>
                </div>
            </div>
            <div className="p-2.5 sm:p-3 md:p-4 bg-white relative z-10">
                <div className="flex justify-between items-center gap-1 sm:gap-2">
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-bold uppercase text-zinc-400 tracking-wider truncate">
                        {item.region}
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] md:text-xs font-bold text-zinc-900 shrink-0">
                        {(item.confidence * 100).toFixed(0)}%
                    </span>
                </div>
            </div>
        </div>
    );
}