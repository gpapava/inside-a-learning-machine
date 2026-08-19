import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

function TermCard({ term, definition, expanded, onToggle }) {
  return (
    <motion.div
      layout
      onClick={onToggle}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      style={{
        backgroundColor: expanded ? '#EFF6FF' : '#F9FAFB',
        border: `1px solid ${expanded ? '#DBEAFE' : '#E5E7EB'}`,
        borderRadius: '10px',
        padding: '16px 18px',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '15px', fontWeight: 600, color: '#1A1A1A', fontFamily: 'JetBrains Mono, monospace' }}>
          {term}
        </span>
        <span style={{ fontSize: '14px', color: '#9CA3AF' }}>{expanded ? '−' : '+'}</span>
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.p
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 10 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            style={{ fontSize: '14px', color: '#374151', lineHeight: 1.7, overflow: 'hidden' }}
          >
            {definition}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function GlossaryScreen({ onAdvance }) {
  const { tr } = useLang();
  const s = tr.glossary;
  const [expandedIndex, setExpandedIndex] = useState(null);

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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {s.terms.map((termItem, i) => (
            <TermCard
              key={termItem.term}
              term={termItem.term}
              definition={termItem.definition}
              expanded={expandedIndex === i}
              onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
            />
          ))}
        </div>

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
    </div>
  );
}
