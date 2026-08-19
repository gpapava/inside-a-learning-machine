import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import TeacherNote from '../components/TeacherNote';

function PromptCard({ label, prompt, outputLabel, output, runLabel, revealed, onReveal, accent }) {
  return (
    <div
      style={{
        backgroundColor: '#F9FAFB',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </div>
      <div style={{ fontSize: '15px', color: '#1A1A1A', fontWeight: 500, lineHeight: 1.6, fontFamily: 'JetBrains Mono, monospace' }}>
        {prompt}
      </div>

      {!revealed && (
        <motion.button
          onClick={onReveal}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            backgroundColor: accent,
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            alignSelf: 'flex-start',
          }}
        >
          {runLabel}
        </motion.button>
      )}

      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {outputLabel}
            </div>
            <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, margin: 0 }}>
              {output}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PromptingScreen({ onAdvance }) {
  const { tr } = useLang();
  const s = tr.prompting;
  const [revealedA, setRevealedA] = useState(false);
  const [revealedB, setRevealedB] = useState(false);

  const bothRevealed = revealedA && revealedB;

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
        style={{ maxWidth: '840px', width: '100%', display: 'flex', flexDirection: 'column', gap: '28px' }}
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <PromptCard
            label={s.promptALabel}
            prompt={s.promptA}
            outputLabel={s.outputALabel}
            output={s.outputA}
            runLabel={s.runButton}
            revealed={revealedA}
            onReveal={() => setRevealedA(true)}
            accent="#9CA3AF"
          />
          <PromptCard
            label={s.promptBLabel}
            prompt={s.promptB}
            outputLabel={s.outputBLabel}
            output={s.outputB}
            runLabel={s.runButton}
            revealed={revealedB}
            onReveal={() => setRevealedB(true)}
            accent="#2563EB"
          />
        </div>

        <AnimatePresence>
          {bothRevealed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
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
                {s.insight}
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
