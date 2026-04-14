// Ingredients Assets
import ingredients1 from '../assets/ingredients/1.jpg'
import ingredients2 from '../assets/ingredients/2.jpg'
import ingredients3 from '../assets/ingredients/3.jpg'
import ingredients4 from '../assets/ingredients/4.jpg'

// Patch Assets
import patch1 from '../assets/patch/1.jpg';
import patch2 from '../assets/patch/2.jpg';
import patch3 from '../assets/patch/3.jpg';

// Logo Assets
import LogoJs from '../assets/logo/logo_js.png';
import LogoExpress from '../assets/logo/logo_expressjs.png';
import LogoMediapipe from '../assets/logo/logo_mediapipe.png';
import LogoNodejs from '../assets/logo/logo_nodejs.png';
import LogoReactjs from '../assets/logo/logo_reactjs.png';
import LogoSupabase from '../assets/logo/logo_supabase.png';
import LogoMobilenetv2 from '../assets/logo/logo_mobilenetv2.png';

export const TECH_STACK = [
    { label: 'Model', value: 'MobileNetV2', image: LogoMobilenetv2 },
    { label: 'Vision', value: 'MediaPipe', image: LogoMediapipe },
    { label: 'Frontend', value: 'React.js', image: LogoReactjs },
    { label: 'Backend', value: 'Express.js', image: LogoExpress },
    { label: 'Backend', value: 'Node.js', image: LogoNodejs },
    { label: 'Database', value: 'Supabase', image: LogoSupabase },
    { label: 'Lang', value: 'JavaScript', image: LogoJs },
];


export const ACTIVE_INGREDIENTS = [
    {
        title: "Salicylic Acid",
        role: "Beta Hydroxy Acid",
        desc: "Oil-soluble exfoliant that penetrates deep into pores to dissolve sebum.",
        color: "bg-teal-900",
        img: ingredients1 // Mapping ke image 1
    },
    {
        title: "Niacinamide",
        role: "Vitamin B3",
        desc: "Strengthens barrier function and regulates oil production while soothing.",
        color: "bg-indigo-900",
        img: ingredients2 // Mapping ke image 2
    },
    {
        title: "Ceramides",
        role: "Lipids",
        desc: "Essential fats that hold skin cells together, forming a protective layer.",
        color: "bg-rose-900",
        img: ingredients3 // Mapping ke image 3
    },
    {
        title: "Retinol",
        role: "Vitamin A",
        desc: "Accelerates cell turnover and boosts collagen production.",
        color: "bg-amber-900",
        img: ingredients4 // Mapping ke image 4
    }
];