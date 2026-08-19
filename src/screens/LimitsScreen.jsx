import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import TeacherNote from '../components/TeacherNote';

export default function LimitsScreen({ onAdvance }) {
  const { tr } = useLang();
  const s = tr.limits;
  const [answered, setAnswered] = useState(false);
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ maxWidth: '800px', width: '100%', display: 'flex', flexDirection: 'column', gap: '28px' }}
      >
        <h2
          style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            color: '#1A1A1A',
            letterSpacing: '-0.02em',
          }}
        >
          {s.title}
        </h2>

        <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.7 }}>
          {s.intro}
        </p>

        <div
          style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {s.questionLabel}
          </div>
          <div style={{ fontSize: '17px', color: '#1A1A1A', fontWeight: 500, lineHeight: 1.6 }}>
            {s.question}
          </div>
        </div>

        {!answered && (
          <motion.button
            onClick={() => setAnswered(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              backgroundColor: '#2563EB',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              alignSelf: 'flex-start',
            }}
          >
            {s.button}
          </motion.button>
        )}

        <AnimatePresence>
          {answered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #DBEAFE',
                  borderRadius: '10px',
                  padding: '16px 20px',
                  fontSize: '15px',
                  color: '#1E40AF',
                  lineHeight: 1.7,
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {s.answer}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {s.confidenceLabel}
                </span>
                <div style={{ flex: 1, height: '8px', backgroundColor: '#E5E7EB', borderRadius: '9999px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.confidence}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    style={{ height: '100%', backgroundColor: '#2563EB', borderRadius: '9999px' }}
                  />
                </div>
                <span style={{ fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', color: '#2563EB', fontWeight: 600 }}>
                  {s.confidence}%
                </span>
              </div>

              {!revealed && (
                <motion.button
                  onClick={() => setRevealed(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    backgroundColor: '#F3F4F6',
                    color: '#1A1A1A',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    padding: '11px 22px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: 'Inter, sans-serif',
                    alignSelf: 'flex-start',
                  }}
                >
                  {s.revealButton}
                </motion.button>
              )}

              <AnimatePresence>
                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                  >
                    <div
                      style={{
                        backgroundColor: '#FFF7ED',
                        border: '1px solid #FED7AA',
                        borderRadius: '10px',
                        padding: '16px 20px',
                      }}
                    >
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#9A3412', marginBottom: '6px' }}>
                        {s.revealTitle}
                      </div>
                      <p style={{ fontSize: '14px', color: '#9A3412', lineHeight: 1.7, margin: 0 }}>
                        {s.revealText}
                      </p>
                    </div>

                    <TeacherNote text={s.teacherNote} />

                    <motion.button
                      onClick={onAdvance}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        backgroundColor: '#2563EB',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        fontSize: '15px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'Inter, sans-serif',
                        alignSelf: 'flex-start',
                      }}
                    >
                      {s.advance}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
