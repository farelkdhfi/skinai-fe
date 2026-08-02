export const Skeleton = () => (
    <div className="w-full animate-pulse">
        {/* Bento Grid Stats Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-8">
            {/* Highlight Card Skeleton */}
            <div className="h-[140px] sm:h-[200px] md:h-[240px] p-4 sm:p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-[#1A1A1A]/80 border border-[#333] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-xl md:rounded-2xl" />
                    <div className="w-4 h-4 md:w-5 md:h-5 bg-white/10 rounded" />
                </div>
                <div>
                    <div className="h-8 md:h-12 w-16 md:w-24 bg-white/10 rounded-lg mb-2" />
                    <div className="h-2.5 md:h-3 w-12 md:w-16 bg-white/10 rounded mb-1.5" />
                    <div className="h-2 md:h-2.5 w-10 md:w-12 bg-white/10 rounded" />
                </div>
            </div>

            {/* Normal Card Skeletons */}
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-[140px] sm:h-[200px] md:h-[240px] p-4 sm:p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white/60 border border-white/40 flex flex-col justify-between">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-200/60 rounded-xl md:rounded-2xl" />
                    <div>
                        <div className="h-8 md:h-12 w-16 md:w-24 bg-zinc-200/60 rounded-lg mb-2" />
                        <div className="h-2.5 md:h-3 w-12 md:w-16 bg-zinc-200/60 rounded mb-1.5" />
                        <div className="h-2 md:h-2.5 w-10 md:w-12 bg-zinc-200/60 rounded" />
                    </div>
                </div>
            ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* Timeline Chart Skeleton */}
            <div className="lg:col-span-2 bg-white/60 border border-white/40 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 h-[260px] sm:h-[300px] md:h-[400px] flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="h-5 md:h-6 w-32 bg-zinc-200/60 rounded mb-2" />
                        <div className="h-3 md:h-4 w-48 bg-zinc-200/60 rounded" />
                    </div>
                    <div className="w-5 h-5 md:w-6 md:h-6 bg-zinc-200/60 rounded-full" />
                </div>
                <div className="flex-1 w-full bg-zinc-200/40 rounded-xl" />
            </div>

            {/* Distribution Chart Skeleton */}
            <div className="lg:col-span-1 bg-white/60 border border-white/40 rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-8 h-[320px] sm:h-[300px] md:h-[400px] flex flex-col">
                <div className="h-5 md:h-6 w-32 bg-zinc-200/60 rounded mb-2" />
                <div className="h-3 md:h-4 w-24 bg-zinc-200/60 rounded mb-6" />
                <div className="flex-1 relative flex items-center justify-center mb-6">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-zinc-200/60 rounded-full" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="h-6 md:h-8 w-12 bg-white/60 rounded mb-1" />
                        <div className="h-2 w-8 bg-white/60 rounded" />
                    </div>
                </div>
                <div className="space-y-2 md:space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-zinc-200/60" />
                                <div className="h-3 w-16 bg-zinc-200/60 rounded" />
                            </div>
                            <div className="h-3 w-8 bg-zinc-200/60 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* History List Skeleton */}
        <div className="w-full bg-white/80 border border-white/60 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden">
            <div className="p-5 md:p-8 border-b border-zinc-100 flex items-center justify-between">
                <div className="h-5 md:h-6 w-40 bg-zinc-200/60 rounded" />
                <div className="h-4 w-24 md:w-32 bg-zinc-200/60 rounded" />
            </div>
            <div className="divide-y divide-zinc-100">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-3 sm:p-4 md:p-6 lg:p-8 flex items-center justify-between">
                        <div className="flex items-center gap-3 md:gap-6">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-zinc-200/60 shrink-0" />
                            <div>
                                <div className="h-4 md:h-5 w-24 md:w-32 bg-zinc-200/60 rounded mb-1.5 md:mb-2" />
                                <div className="h-2 md:h-3 w-32 md:w-40 bg-zinc-200/60 rounded" />
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="h-5 md:h-7 w-12 md:w-16 bg-zinc-200/60 rounded mb-1.5 ml-auto" />
                            <div className="h-2 md:h-2.5 w-16 md:w-20 bg-zinc-200/60 rounded ml-auto hidden sm:block" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);