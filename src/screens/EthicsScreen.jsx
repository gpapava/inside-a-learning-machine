import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import TeacherNote from '../components/TeacherNote';

function CompletionRow({ sentence, completion, prob, label, revealed }) {
  const parts = sentence.split('___');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div
        style={{
          fontSize: '16px',
          color: '#1A1A1A',
          fontFamily: 'JetBrains Mono, monospace',
          backgroundColor: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: '10px',
          padding: '14px 18px',
        }}
      >
        {parts[0]}
        <span
          style={{
            display: 'inline-block',
            minWidth: '48px',
            textAlign: 'center',
            color: revealed ? '#2563EB' : '#D1D5DB',
            fontWeight: 700,
            borderBottom: '2px solid #2563EB',
          }}
        >
          {revealed ? completion : '___'}
        </span>
        {parts[1]}
      </div>
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 500, minWidth: '140px' }}>
              {label}
            </span>
            <div style={{ flex: 1, height: '7px', backgroundColor: '#E5E7EB', borderRadius: '9999px', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${prob}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ height: '100%', backgroundColor: '#7C3AED', borderRadius: '9999px' }}
              />
            </div>
            <span style={{ fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', color: '#7C3AED' }}>
              {prob}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EthicsScreen({ onAdvance }) {
  const { tr } = useLang();
  const s = tr.ethics;
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <CompletionRow sentence={s.sentenceA} completion={s.completionA} prob={s.probA} label={s.probLabel} revealed={revealed} />
          <CompletionRow sentence={s.sentenceB} completion={s.completionB} prob={s.probB} label={s.probLabel} revealed={revealed} />
        </div>

        {!revealed && (
          <motion.button
            onClick={() => setRevealed(true)}
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
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <p
                style={{
                  fontSize: '15px',
                  color: '#6B7280',
                  lineHeight: 1.7,
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #DBEAFE',
                  borderRadius: '10px',
                  padding: '16px 20px',
                }}
              >
                {s.resultText}
              </p>
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
    </div>
  );
}
