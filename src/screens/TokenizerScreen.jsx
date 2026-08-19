import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import TeacherNote from '../components/TeacherNote';

const TOKENS_BY_LANG = {
  en: [
    { text: 'Chat', label: 'T1' },
    { text: 'GPT', label: 'T2' },
    { text: 'can', label: 'T3' },
    { text: 'help', label: 'T4' },
    { text: 'you', label: 'T5' },
    { text: 'write', label: 'T6' },
  ],
  el: [
    { text: 'Η', label: 'T1' },
    { text: 'τεχνητή', label: 'T2' },
    { text: 'νοημο', label: 'T3' },
    { text: 'σύνη', label: 'T4' },
    { text: 'γράφει', label: 'T5' },
    { text: 'κείμενα', label: 'T6' },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

const tokenVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 28,
      delay: i * 0.08,
    },
  }),
};

function CountUp({ target }) {
  const [count, setCount] = useState(0);

  useState(() => {
    let current = 0;
    const step = () => {
      if (current < target) {
        current++;
        setCount(current);
        setTimeout(step, 80);
      }
    };
    setTimeout(step, 200);
  }, []);

  return <span>{count}</span>;
}

export default function TokenizerScreen({ onAdvance }) {
  const { tr, lang } = useLang();
  const s = tr.tokenizer;
  const [tokenized, setTokenized] = useState(false);
  const TOKENS = TOKENS_BY_LANG[lang];

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
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          maxWidth: '800px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        <motion.h2
          variants={itemVariants}
          style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            color: '#1A1A1A',
            letterSpacing: '-0.02em',
          }}
        >
          {s.title}
        </motion.h2>

        <motion.p
          variants={itemVariants}
          style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.7 }}
        >
          {s.instruction}
        </motion.p>

        {/* Sentence card */}
        <motion.div
          variants={itemVariants}
          style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            padding: '20px 24px',
            fontSize: '20px',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#1A1A1A',
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
        >
          {s.sentence}
        </motion.div>

        {/* Tokenize button */}
        <motion.div variants={itemVariants}>
          <motion.button
            onClick={() => !tokenized && setTokenized(true)}
            disabled={tokenized}
            whileHover={!tokenized ? { scale: 1.02 } : {}}
            whileTap={!tokenized ? { scale: 0.98 } : {}}
            style={{
              backgroundColor: tokenized ? '#E5E7EB' : '#2563EB',
              color: tokenized ? '#9CA3AF' : '#ffffff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: tokenized ? 'default' : 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'background-color 0.2s',
            }}
          >
            {s.button}
          </motion.button>
        </motion.div>

        {/* Token display */}
        <AnimatePresence>
          {tokenized && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {/* Token counter */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  fontSize: '13px',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#2563EB',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                }}
              >
                <CountUp target={6} /> {s.tokensDetectedLabel}
              </motion.div>

              {/* Token blocks */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  alignItems: 'flex-start',
                }}
              >
                {TOKENS.map((token, i) => (
                  <motion.div
                    key={token.label}
                    custom={i}
                    variants={tokenVariants}
                    initial="hidden"
                    animate="visible"
                    style={{
                      position: 'relative',
                      backgroundColor: '#F3F4F6',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      padding: '10px 16px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '15px',
                      fontWeight: 500,
                      color: '#1A1A1A',
                    }}
                  >
                    {token.text}
                    <sup
                      style={{
                        fontSize: '9px',
                        color: '#9CA3AF',
                        marginLeft: '2px',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      {token.label}
                    </sup>
                  </motion.div>
                ))}
              </div>

              {/* After-tokenize message */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
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
                {s.afterTokenize}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <TeacherNote text={s.teacherNote} />
              </motion.div>

              {/* Advance button */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
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
                  }}
                >
                  {s.advance}
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
