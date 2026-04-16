import { Sun, Move, Maximize
} from 'lucide-react';

const StatusGrid = ({ validations }) => {
    const items = [
        { label: 'LIGHTING', valid: validations.brightness.valid, value: validations.brightness.value, icon: Sun },
        { label: 'PROXIMITY', valid: validations.roi.valid, value: `${validations.roi.value}%`, icon: Maximize },
        { label: 'ANGLE', valid: validations.orientation.valid, value: '0°', icon: Move },
    ];

    return (
        <div className="grid grid-cols-3 gap-2 md:gap-4 w-full">
            {items.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center py-2">
                    <div className={`
                        p-2.5 md:p-3 rounded-full mb-2 md:mb-3 border transition-all duration-500
                        ${item.valid
                            ? 'bg-teal-50 border-teal-100 shadow-[0_0_15px_rgba(20,184,166,0.15)]'
                            : 'bg-zinc-50 border-zinc-200'
                        }
                    `}>
                        <item.icon className={`w-4 h-4 md:w-5 md:h-5 transition-colors duration-500 ${item.valid ? 'text-teal-600' : 'text-zinc-400'}`} strokeWidth={1.5} />
                    </div>
                    <span className="text-[8px] md:text-[9px] font-bold tracking-[0.15em] text-zinc-400 uppercase mb-0.5">
                        {item.label}
                    </span>
                    <span className={`text-xs md:text-sm font-mono tracking-tight transition-colors duration-500 ${item.valid ? 'text-teal-700 font-semibold' : 'text-zinc-400'}`}>
                        {item.valid ? 'OK' : item.value || '--'}
                    </span>
                </div>
            ))}
        </div>
    );
};
export default StatusGrid