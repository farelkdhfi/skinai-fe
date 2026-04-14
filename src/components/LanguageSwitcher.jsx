import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'en' ? 'id' : 'en');
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className={`
        px-3 py-1.5 rounded-lg text-sm font-bold text-neutral-600 transition-all flex justify-center items-center gap-1`}
            aria-label="Toggle Language"
        >
            <Globe className='w-5 h-5' />
            {language.toUpperCase()}
        </motion.button>
    );
}
