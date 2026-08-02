export const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md p-3 md:p-4 border border-zinc-200/50 shadow-2xl rounded-xl md:rounded-2xl">
                <p className="text-xs md:text-sm font-semibold text-zinc-900 mb-1">{payload[0].payload.name || payload[0].payload.date}</p>
                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-indigo-500" />
                    <p className="text-[10px] md:text-xs text-zinc-500 font-mono">
                        Value: <span className="text-zinc-900 font-bold">{payload[0].value}</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};