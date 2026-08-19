import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import ConfidenceMeter from '../components/ConfidenceMeter';
import TeacherNote from '../components/TeacherNote';

const CONFIDENCE_LEVELS = [0, 15, 30, 45, 55, 65];
const TOTAL_EXAMPLES = 5;

// Node layout: 3 columns [3, 5, 4] = 12 nodes
const COLS = [
  [0, 1, 2],
  [3, 4, 5, 6, 7],
  [8, 9, 10, 11],
];

function generateNodes(width, height) {
  const nodes = [];
  const colCount = COLS.length;
  COLS.forEach((col, c) => {
    const x = (width / (colCount + 1)) * (c + 1);
    col.forEach((id, r) => {
      const y = (height / (col.length + 1)) * (r + 1);
      nodes.push({ id, x, y });
    });
  });
  return nodes;
}

function generateConnections(nodes) {
  const conns = [];
  for (let c = 0; c < COLS.length - 1; c++) {
    COLS[c].forEach((fromId) => {
      COLS[c + 1].forEach((toId) => {
        conns.push({ id: `${fromId}-${toId}`, fromId, toId });
      });
    });
  }
  return conns;
}

// Which nodes activate per example (indices into COLS flat list)
const ACTIVATIONS_PER_EXAMPLE = [
  [3, 8],
  [1, 5, 9],
  [0, 4, 10],
  [2, 6, 11],
  [1, 7, 8],
];

export default function TrainingScreen({ onAdvance }) {
  const { tr } = useLang();
  const s = tr.training;
  const [exampleIndex, setExampleIndex] = useState(0); // 0 = none fed yet
  const [flyingExample, setFlyingExample] = useState(null);

  const width = 280;
  const height = 200;
  const nodes = useMemo(() => generateNodes(width, height), []);
  const connections = useMemo(() => generateConnections(nodes), [nodes]);

  const activeNodeIds = useMemo(() => {
    const active = new Set();
    for (let i = 0; i < exampleIndex; i++) {
      ACTIVATIONS_PER_EXAMPLE[i].forEach((id) => active.add(id));
    }
    return active;
  }, [exampleIndex]);

  const confidence = CONFIDENCE_LEVELS[exampleIndex];
  const allFed = exampleIndex >= TOTAL_EXAMPLES;

  const handleFeed = () => {
    if (allFed) return;
    setFlyingExample(exampleIndex);
    setTimeout(() => {
      setExampleIndex((prev) => prev + 1);
      setFlyingExample(null);
    }, 600);
  };

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
      <div style={{ maxWidth: '800px', width: '100%' }}>
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            fontSize: 'clamp(24px, 4vw, 36px)',
            fontWeight: 700,
            color: '#1A1A1A',
            letterSpacing: '-0.02em',
            marginBottom: '16px',
          }}
        >
          {s.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 30 }}
          style={{
            fontSize: '16px',
            color: '#6B7280',
            lineHeight: 1.7,
            marginBottom: '36px',
          }}
        >
          {s.intro}
        </motion.p>

        {/* Two-column layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '32px',
            alignItems: 'start',
          }}
        >
          {/* Left: Neural network */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <div style={{ position: 'relative' }}>
              <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {connections.map((conn) => {
                  const from = nodes.find((n) => n.id === conn.fromId);
                  const to = nodes.find((n) => n.id === conn.toId);
                  return (
                    <motion.line
                      key={conn.id}
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke="#9CA3AF"
                      animate={{
                        opacity: activeNodeIds.has(conn.fromId) && activeNodeIds.has(conn.toId)
                          ? 0.6 : 0.15,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  );
                })}
                {nodes.map((node) => (
                  <motion.circle
                    key={node.id}
                    cx={node.x}
                    cy={node.y}
                    r={9}
                    animate={{
                      fill: activeNodeIds.has(node.id) ? '#2563EB' : '#E5E7EB',
                      stroke: activeNodeIds.has(node.id) ? '#1D4ED8' : '#D1D5DB',
                    }}
                    strokeWidth={1.5}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                ))}
              </svg>

              {/* Flying example card */}
              <AnimatePresence>
                {flyingExample !== null && (
                  <motion.div
                    key={`fly-${flyingExample}`}
                    initial={{ opacity: 1, x: 200, y: -20, scale: 1 }}
                    animate={{ opacity: 0, x: 40, y: 60, scale: 0.3 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeIn' }}
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: -210,
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #DBEAFE',
                      borderRadius: '8px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      color: '#1E40AF',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      pointerEvents: 'none',
                    }}
                  >
                    {s.examples[flyingExample]}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status label */}
            <motion.div
              animate={{
                backgroundColor: allFed ? '#D1FAE5' : '#F3F4F6',
                color: allFed ? '#059669' : '#6B7280',
                borderColor: allFed ? '#A7F3D0' : '#E5E7EB',
              }}
              transition={{ duration: 0.5 }}
              style={{
                border: '1px solid',
                borderRadius: '20px',
                padding: '4px 14px',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              {allFed ? s.statusTrained : s.statusUntrained}
            </motion.div>
          </motion.div>

          {/* Right: Training controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 300, damping: 30 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <ConfidenceMeter value={confidence} label={s.confidenceLabel} />

            {/* Example list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {s.examples.map((example, i) => (
                <motion.div
                  key={i}
                  animate={{
                    opacity: i < exampleIndex ? 1 : 0.35,
                    backgroundColor: i < exampleIndex ? '#F0FDF4' : '#F9FAFB',
                    borderColor: i < exampleIndex ? '#BBF7D0' : '#E5E7EB',
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    border: '1px solid',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '14px',
                    color: i < exampleIndex ? '#15803D' : '#9CA3AF',
                    fontFamily: 'Inter, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {i < exampleIndex ? '✓' : `${i + 1}.`}
                  </span>
                  {example}
                </motion.div>
              ))}
            </div>

            {/* Feed button */}
            {!allFed && (
              <motion.button
                onClick={handleFeed}
                disabled={flyingExample !== null}
                whileHover={flyingExample === null ? { scale: 1.02 } : {}}
                whileTap={flyingExample === null ? { scale: 0.98 } : {}}
                style={{
                  backgroundColor: flyingExample !== null ? '#93C5FD' : '#2563EB',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 20px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: flyingExample !== null ? 'wait' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'background-color 0.2s',
                }}
              >
                {s.feedButton(exampleIndex + 1, TOTAL_EXAMPLES)}
              </motion.button>
            )}

            {/* After-all message */}
            <AnimatePresence>
              {allFed && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <p
                    style={{
                      fontSize: '14px',
                      color: '#6B7280',
                      lineHeight: 1.7,
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #DBEAFE',
                      borderRadius: '10px',
                      padding: '14px 18px',
                    }}
                  >
                    {s.afterAll}
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
                      padding: '12px 20px',
                      fontSize: '15px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {s.advance}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
