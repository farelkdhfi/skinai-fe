import { ArrowRight, Check, Sparkles } from "lucide-react";

export function IngredientRow({ ingredient, type = 'primary', onViewDetails }) {
    const isPrimary = type === 'primary';
    return (
        <div className={`
            group flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 md:gap-5 p-3.5 sm:p-4 md:p-5 rounded-[1.25rem] sm:rounded-2xl border transition-all duration-300
            ${isPrimary
                ? 'bg-white border-zinc-200 hover:border-indigo-300 hover:shadow-lg'
                : 'bg-zinc-50/50 border-transparent hover:bg-white hover:border-zinc-200 hover:shadow-sm'
            }
        `}>
            <div className="flex items-start gap-3 w-full">
                <div className={`mt-0.5 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shrink-0 ${isPrimary ? 'bg-indigo-50 text-indigo-600' : 'bg-zinc-200 text-zinc-500'}`}>
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                        <h4 className="font-medium text-sm md:text-base text-zinc-900 truncate">{ingredient.name}</h4>
                    </div>
                    <p className="text-[11px] sm:text-xs md:text-sm text-zinc-500 font-light leading-relaxed line-clamp-2 mb-3 sm:mb-4">
                        {ingredient.what_it_does}
                    </p>

                    {/* Tombol View Details dengan AI Prompt */}
                    <button
                        onClick={() => onViewDetails(ingredient)}
                        className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] md:text-xs font-semibold px-3.5 py-2 sm:px-4 sm:py-2 rounded-full transition-all w-max
                            ${isPrimary
                                ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:shadow-sm'
                                : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:shadow-sm'
                            }`}
                    >
                        <Sparkles className={`w-3 h-3 md:w-3.5 md:h-3.5 ${isPrimary ? 'text-indigo-500' : 'text-zinc-500'}`} />
                        Detail & Ask SkinAI <ArrowRight className="w-3 h-3 md:w-3.5 md:h-3.5 ml-0.5" />
                    </button>
                </div>
            </div>
        </div>
    );
}