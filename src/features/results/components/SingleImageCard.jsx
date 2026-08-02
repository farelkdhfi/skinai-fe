import { DIAGNOSIS_COLORS } from "../../../config";

export function SingleImageCard({ item, patch, heatmap, showHeatmap }) {
    const colors = DIAGNOSIS_COLORS[item.predicted_class] || DIAGNOSIS_COLORS.Normal;
    return (
        <div className="group relative bg-zinc-50 rounded-[1.5rem] sm:rounded-3xl md:rounded-[2.5rem] overflow-hidden border border-zinc-200 shadow-sm aspect-4/3 flex items-center justify-center">
            {patch && (
                <img src={patch} alt="Analyzed skin" className="w-full h-full object-cover p-2.5 sm:p-3 md:p-4 absolute inset-0" />
            )}
            {heatmap && (
                <div className={`absolute inset-0 transition-opacity duration-500 z-10 ${showHeatmap ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={heatmap} alt="Heatmap" className="w-full h-full object-cover p-2.5 sm:p-3 md:p-4" />
                    <div className="absolute inset-0 bg-zinc-900/5 mix-blend-multiply pointer-events-none" />
                </div>
            )}
            <div className="absolute bottom-4 sm:bottom-5 left-1/2 -translate-x-1/2 px-3 py-2 sm:px-4 sm:py-2.5 md:px-5 md:py-3 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white/50 flex items-center gap-1.5 sm:gap-2.5 whitespace-nowrap z-20">
                <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-zinc-500">Prediction:</span>
                <span className={`text-[10px] sm:text-xs md:text-sm font-bold ${colors.text}`}>
                    {item.predicted_class}
                </span>
            </div>
        </div>
    );
}