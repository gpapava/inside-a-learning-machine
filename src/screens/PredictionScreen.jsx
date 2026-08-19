import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import TeacherNote from '../components/TeacherNote';

function TypewriterText({ text, onDone }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        if (onDone) onDone();
      }
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return <>{displayed}</>;
}

function BlinkingCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      style={{ color: '#2563EB', fontWeight: 700 }}
    >
      |
    </motion.span>
  );
}

export default function PredictionScreen({ onAdvance }) {
  const { tr } = useLang();
  const s = tr.prediction;
  const [typingDone, setTypingDone] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showProbs, setShowProbs] = useState(false);

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
    setTimeout(() => setShowProbs(true), 300);
  };

  const isCorrect = selected === s.correctIndex;
  const feedbackText = selected !== null
    ? (isCorrect ? s.feedbackCorrect : s.feedbackOther)
    : null;

  const colors = ['#2563EB', '#6B7280', '#9CA3AF'];

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
          {s.instruction}
        </p>

        {/* Sentence with typewriter */}
        <div
          style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '20px 24px',
            fontSize: '22px',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#1A1A1A',
            fontWeight: 500,
          }}
        >
          <TypewriterText text={s.sentence} onDone={() => setTypingDone(true)} />
          {' '}
          {typingDone && <BlinkingCursor />}
          <span style={{ color: '#2563EB' }}> ...</span>
        </div>

        {/* Options */}
        <AnimatePresence>
          {typingDone && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <p style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: 500 }}>
                {s.selectNext}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {s.options.map((option, i) => {
                  const isSelected = selected === i;
                  const isOther = selected !== null && selected !== i;
                  return (
                    <motion.button
                      key={option}
                      custom={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{
                        opacity: isOther ? 0.4 : 1,
                        y: 0,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30,
                        delay: i * 0.08,
                        opacity: { duration: 0.3 },
                      }}
                      onClick={() => handleSelect(i)}
                      whileHover={selected === null ? { scale: 1.02 } : {}}
                      whileTap={selected === null ? { scale: 0.98 } : {}}
                      style={{
                        backgroundColor: isSelected ? '#EFF6FF' : '#F9FAFB',
                        border: `2px solid ${isSelected ? '#2563EB' : '#E5E7EB'}`,
                        borderRadius: '10px',
                        padding: '12px 20px',
                        fontSize: '16px',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: 600,
                        color: isSelected ? '#2563EB' : '#1A1A1A',
                        cursor: selected === null ? 'pointer' : 'default',
                        minWidth: '100px',
                        textAlign: 'center',
                      }}
                    >
                      {option}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Probability bars */}
        <AnimatePresence>
          {showProbs && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <p style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {s.modelProbabilities}
              </p>
              {s.options.map((option, i) => (
                <div key={option} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={{
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: i === s.correctIndex ? '#2563EB' : '#6B7280',
                      minWidth: '70px',
                    }}
                  >
                    {option}
                  </span>
                  <div
                    style={{
                      flex: 1,
                      height: '8px',
                      backgroundColor: '#E5E7EB',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                    }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${s.probabilities[i]}%` }}
                      transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.08 }}
                      style={{
                        height: '100%',
                        backgroundColor: i === s.correctIndex ? '#2563EB' : '#D1D5DB',
                        borderRadius: '9999px',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '13px',
                      fontFamily: 'JetBrains Mono, monospace',
                      color: i === s.correctIndex ? '#2563EB' : '#9CA3AF',
                      minWidth: '36px',
                      textAlign: 'right',
                    }}
                  >
                    {s.probabilities[i]}%
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback */}
        <AnimatePresence>
          {feedbackText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30, delay: 0.3 }}
              style={{
                backgroundColor: isCorrect ? '#F0FDF4' : '#FFF7ED',
                border: `1px solid ${isCorrect ? '#BBF7D0' : '#FED7AA'}`,
                borderRadius: '10px',
                padding: '16px 20px',
                fontSize: '15px',
                color: isCorrect ? '#15803D' : '#9A3412',
                lineHeight: 1.7,
              }}
            >
              {feedbackText}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Teacher note + advance button */}
        <AnimatePresence>
          {selected !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 30 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
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
