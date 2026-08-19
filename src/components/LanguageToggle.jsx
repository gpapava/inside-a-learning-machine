import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-1 text-sm font-medium select-none">
      <motion.button
        onClick={() => setLang('en')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          color: lang === 'en' ? '#2563EB' : '#9CA3AF',
          fontWeight: lang === 'en' ? 600 : 400,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 6px',
          borderRadius: '4px',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        EN
      </motion.button>
      <span style={{ color: '#D1D5DB', fontSize: '13px' }}>|</span>
      <motion.button
        onClick={() => setLang('el')}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          color: lang === 'el' ? '#2563EB' : '#9CA3AF',
          fontWeight: lang === 'el' ? 600 : 400,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 6px',
          borderRadius: '4px',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        EL
      </motion.button>
    </div>
  );
}
