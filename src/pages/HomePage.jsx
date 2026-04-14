import React, { useRef } from 'react';

import HeroSection from '../components/sections/HeroSection';
import CoreFeatureSection from '../components/sections/CoreFeatureSection';
import HorizontalProcessSection from '../components/sections/HorizontalProcessSection';
import DailyRoutineSection from '../components/sections/DailyRoutineSection';
import IngredientsSection from '../components/sections/IngredientsSection';
import DisclaimerSection from '../components/sections/DisclaimerSection';
import EmpowermentSection from '../components/sections/EmpowermentSection';
import Footer from '../components/Footer';
import HeaderLandingPage from '../components/HeaderLandingPage';

const HomePage = () => {
    const containerRef = useRef(null);

    return (
        // Ditambahkan: overflow-x-hidden w-full max-w-[100vw]
        <div ref={containerRef} className="bg-[#F8F8F7] text-[#111] font-sans selection:bg-black selection:text-white overflow-x-clip w-full max-w-[100vw] relative">
            
            <HeaderLandingPage />
            <HeroSection />
            <CoreFeatureSection />
            <HorizontalProcessSection />
            <DailyRoutineSection />
            <IngredientsSection />
            <DisclaimerSection />
            <EmpowermentSection />
            <Footer />
            
        </div>
    );
}

export default HomePage;