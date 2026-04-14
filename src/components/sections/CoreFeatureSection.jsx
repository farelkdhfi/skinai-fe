import { ScanFace, Lightbulb, Grid } from 'lucide-react';

import patchImg from '../../assets/patch.jpg';
import heatmapImg from '../../assets/heatmap.jpg';

import VideoDemo from '../../assets/video/demo.mp4';
import { TECH_STACK } from '../../data/data';
import CardStackItem from '../ui/CardStackItem';

const CoreFeatureSection = () => {
    return (
        <section className="relative py-12 md:py-20 px-4 sm:px-6 md:px-16 bg-neutral-950 text-white">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 md:gap-20">
                {/* Left Column (Text & Tech Stack):
                   - Mobile: Width full, relative position (scrolls naturally).
                   - Desktop: Width 1/3, sticky position (sticks while cards scroll).
                */}
                <div className="w-full md:w-1/3 h-fit relative md:sticky md:top-32">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-tight mb-4 md:mb-8">
                        Integrated<br />
                        <span className="text-neutral-400 italic font-serif">Systems.</span>
                    </h2>
                    <p className="text-neutral-500 text-sm md:text-base mb-6 md:mb-8 leading-relaxed">
                        The system integrates four main components to address input variability and AI model transparency.
                    </p>
                    
                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        {TECH_STACK.map((tech, i) => (
                            <div key={i} className="px-2.5 py-1.5 md:px-3 md:py-1.5 rounded-md bg-neutral-800 text-[10px] md:text-xs font-medium text-neutral-100 border border-neutral-900 flex items-center gap-1.5 md:gap-2 hover:bg-neutral-900 transition-colors cursor-default">
                                <img src={tech.image} className="w-3.5 h-3.5 md:w-4 md:h-4 object-contain grayscale" alt="" />
                                {tech.value}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column (Cards):
                   - Mobile: Width full, space-y-12 (standard vertical list spacing).
                   - Desktop: Width 2/3, space-y-0 (assuming CardStackItem handles stacking logic via stickiness/absolute).
                */}
                <div className="w-full md:w-2/3 space-y-12 md:space-y-0 relative">
                    {[
                        {
                            title: "Smart Camera Guidance",
                            desc: "Real-time input quality standardization using MediaPipe for lighting and facial position validation.",
                            icon: <ScanFace size={24} />,
                            color: "bg-[#F2F2F0]",
                            img: VideoDemo,
                            num: '01',
                            isVideo: true
                        },
                        {
                            title: "Patch-Based Learning",
                            desc: "The model focuses on micro-textures (pores & lesions) by extracting specific areas (Forehead, Cheeks, Nose) to avoid bias from non-skin features.",
                            icon: <Grid size={24} />,
                            color: "bg-[#EAE8E4]",
                            img: patchImg,
                            num: '02',
                            isVideo: false
                        },
                        {
                            title: "Explainable AI (XAI)",
                            desc: "Grad-CAM implementation to generate heatmaps visualizing the facial areas determining the prediction decision.",
                            icon: <Lightbulb size={24} />,
                            color: "bg-[#DFDCD7]",
                            img: heatmapImg,
                            num: '03',
                            isVideo: false
                        }
                    ].map((card, index) => (
                        <CardStackItem key={index} data={card} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
export default CoreFeatureSection;