import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

export default function TeacherNote({ text }) {
  const { tr } = useLang();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        backgroundColor: '#FAF5FF',
        border: '1px solid #E9D5FF',
        borderRadius: '10px',
        padding: '14px 18px',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#7C3AED',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: '6px',
        }}
      >
        {tr.nav.teacherNoteLabel}
      </div>
      <p style={{ fontSize: '14px', color: '#6B21A8', lineHeight: 1.6, margin: 0 }}>
        {text}
      </p>
    </motion.div>
  );
}
