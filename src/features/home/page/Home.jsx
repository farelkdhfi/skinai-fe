import React, { useRef, useState } from 'react';

import HeroSection from '../sections/HeroSection';
import CoreFeatureSection from '../sections/CoreFeatureSection';
import HorizontalProcessSection from '../sections/HorizontalProcessSection';
import DailyRoutineSection from '../sections/DailyRoutineSection';
import IngredientsSection from '../sections/IngredientsSection';
import DisclaimerSection from '../sections/DisclaimerSection';
import EmpowermentSection from '../sections/EmpowermentSection';
import Footer from '../../../components/Footer';
import HeaderHome from '../components/HeaderHome';
import IntroModal from '../components/IntroModal';

const Home = () => {
    const containerRef = useRef(null);
    const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);

    return (
        <div ref={containerRef} className="bg-[#F8F8F7] text-[#111] font-sans selection:bg-black selection:text-white overflow-x-clip w-full max-w-[100vw] relative">

            <HeaderHome />
            <HeroSection onStartClick={() => setIsIntroModalOpen(true)} />
            <CoreFeatureSection />
            <HorizontalProcessSection onStartClick={() => setIsIntroModalOpen(true)} />
            <DailyRoutineSection />
            <IngredientsSection />
            <DisclaimerSection />
            <EmpowermentSection onStartClick={() => setIsIntroModalOpen(true)} />
            <Footer />

            <IntroModal
                isOpen={isIntroModalOpen}
                onClose={() => setIsIntroModalOpen(false)}
            />
        </div>
    );
}

export default Home;