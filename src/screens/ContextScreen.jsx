import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import TeacherNote from '../components/TeacherNote';

// Sentence A: "The bank approved the loan."
// bankIdx in sentenceA = 1
// highlight context: approved (2), loan (4)

// Sentence B: "We walked along the river bank."
// bankIdx in sentenceB = 5
// highlight context: river (4), walked (1)

function TokenWord({ word, isBank, isHighlighted, onClick, isBankClicked }) {
  const isBankWord = isBank;
  return (
    <motion.span
      onClick={isBank && !isBankClicked ? onClick : undefined}
      whileHover={isBank && !isBankClicked ? { scale: 1.05 } : {}}
      whileTap={isBank && !isBankClicked ? { scale: 0.95 } : {}}
      animate={{
        backgroundColor: isHighlighted ? '#FEF9C3' : isBank ? '#EFF6FF' : 'transparent',
        color: isBank ? '#2563EB' : '#1A1A1A',
        borderBottomColor: isBank ? '#2563EB' : 'transparent',
      }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'inline-block',
        padding: '2px 4px',
        borderRadius: '4px',
        cursor: isBank && !isBankClicked ? 'pointer' : 'default',
        fontWeight: isBank ? 600 : 400,
        textDecoration: isBank ? 'underline' : 'none',
        textDecorationColor: '#2563EB',
        textUnderlineOffset: '3px',
        fontSize: '18px',
        fontFamily: 'Inter, sans-serif',
        marginRight: '4px',
      }}
    >
      {word}
    </motion.span>
  );
}

function SentenceRow({ tokens, bankIndex, highlightIndices, onBankClick, clicked, meaning, note, lang }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ lineHeight: 2.2 }}>
        {tokens.map((word, i) => (
          <TokenWord
            key={i}
            word={word}
            isBank={i === bankIndex}
            isHighlighted={clicked && highlightIndices.includes(i)}
            onClick={onBankClick}
            isBankClicked={clicked}
          />
        ))}
      </div>

      <AnimatePresence>
        {clicked && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <div
              style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #DBEAFE',
                borderRadius: '8px',
                padding: '10px 14px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1E40AF',
              }}
            >
              {meaning}
            </div>
            <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>
              {note}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ContextScreen({ onAdvance }) {
  const { tr, lang } = useLang();
  const s = tr.context;

  const [clickedA, setClickedA] = useState(false);
  const [clickedB, setClickedB] = useState(false);

  const bothClicked = clickedA && clickedB;

  const sentenceA = s.sentenceA;
  const highlightA = s.highlightA;

  const sentenceB = s.sentenceB;
  const highlightB = s.highlightB;

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

        <p style={{ fontSize: '14px', color: '#9CA3AF', fontWeight: 500 }}>
          {s.instruction}
        </p>

        {/* Two sentences */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', marginBottom: '12px', textTransform: 'uppercase' }}>
              {s.sentenceALabel}
            </div>
            <SentenceRow
              tokens={sentenceA}
              bankIndex={s.targetIndexA}
              highlightIndices={highlightA}
              onBankClick={() => setClickedA(true)}
              clicked={clickedA}
              meaning={s.meaningA}
              note={s.noteA}
              lang={lang}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#9CA3AF', letterSpacing: '0.08em', marginBottom: '12px', textTransform: 'uppercase' }}>
              {s.sentenceBLabel}
            </div>
            <SentenceRow
              tokens={sentenceB}
              bankIndex={s.targetIndexB}
              highlightIndices={highlightB}
              onBankClick={() => setClickedB(true)}
              clicked={clickedB}
              meaning={s.meaningB}
              note={s.noteB}
              lang={lang}
            />
          </motion.div>
        </div>

        {/* After both */}
        <AnimatePresence>
          {bothClicked && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
                {s.afterBoth}
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

        {/* Progress hint if not both clicked */}
        {!bothClicked && (
          <p style={{ fontSize: '13px', color: '#D1D5DB' }}>
            {clickedA && !clickedB
              ? s.hintClickB
              : !clickedA && clickedB
              ? s.hintClickA
              : ''}
          </p>
        )}
      </motion.div>
    </div>
  );
}
