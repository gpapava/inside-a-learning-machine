import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';
import ConfidenceMeter from '../components/ConfidenceMeter';
import TeacherNote from '../components/TeacherNote';

// 4 columns, ~5 nodes each = 20 nodes
const COLS_DEF = [4, 5, 6, 5];

function buildNetwork(width, height, colsDef) {
  const nodes = [];
  const connections = [];
  let id = 0;
  const colArrays = [];

  colsDef.forEach((count, c) => {
    const colNodes = [];
    const x = (width / (colsDef.length + 1)) * (c + 1);
    for (let r = 0; r < count; r++) {
      const y = (height / (count + 1)) * (r + 1);
      const node = { id: id++, x, y, col: c };
      nodes.push(node);
      colNodes.push(node);
    }
    colArrays.push(colNodes);
  });

  for (let c = 0; c < colsDef.length - 1; c++) {
    colArrays[c].forEach((from) => {
      colArrays[c + 1].forEach((to) => {
        connections.push({
          id: `${from.id}-${to.id}`,
          x1: from.x, y1: from.y,
          x2: to.x, y2: to.y,
          fromId: from.id,
          toId: to.id,
        });
      });
    });
  }
  return { nodes, connections, colArrays };
}

// Round states: which connections are strong (blue), which are error (briefly red)
const ROUND_STATES = [
  // Round 1
  {
    activeNodes: [0, 1, 5, 6, 7, 11, 15, 16, 17, 19],
    strongConns: ['0-4', '0-5', '1-6', '1-7', '5-11', '6-12', '11-15', '12-16'],
    errorConns: ['2-8', '3-9', '8-13', '9-14'],
  },
  // Round 2
  {
    activeNodes: [0, 1, 2, 4, 5, 6, 7, 10, 11, 12, 14, 15, 16, 17, 18, 19],
    strongConns: ['0-4', '0-5', '1-6', '1-7', '2-7', '5-10', '5-11', '6-11', '6-12', '10-15', '11-16', '12-17', '15-19', '16-19'],
    errorConns: ['3-9', '9-14'],
  },
  // Round 3
  {
    activeNodes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
    strongConns: ['0-4', '0-5', '1-5', '1-6', '2-6', '2-7', '3-7', '4-9', '4-10', '5-10', '5-11', '6-11', '6-12', '7-12', '7-13', '9-14', '10-15', '11-15', '11-16', '12-16', '12-17', '13-17', '14-18', '15-18', '15-19', '16-19', '17-19'],
    errorConns: [],
  },
];

export default function WeightsScreen({ onAdvance }) {
  const { tr } = useLang();
  const s = tr.weights;
  const [round, setRound] = useState(0); // 0 = not started, 1/2/3 = completed rounds
  const [animatingError, setAnimatingError] = useState(false);

  const width = 340;
  const height = 220;
  const { nodes, connections } = useMemo(
    () => buildNetwork(width, height, COLS_DEF),
    []
  );

  const handleRound = () => {
    if (round >= 3) return;
    const nextRound = round + 1;
    // Briefly show error connections
    setAnimatingError(true);
    setTimeout(() => {
      setAnimatingError(false);
      setRound(nextRound);
    }, 800);
  };

  const currentState = round > 0 ? ROUND_STATES[round - 1] : null;
  const prevState = round > 1 ? ROUND_STATES[round - 2] : null;
  const showErrors = animatingError && round < 3;

  const getNodeFill = (nodeId) => {
    if (!currentState) return '#E5E7EB';
    if (currentState.activeNodes.includes(nodeId)) return '#2563EB';
    return '#E5E7EB';
  };

  const getConnStyle = (conn) => {
    if (!currentState) return { opacity: 0.12, stroke: '#D1D5DB', strokeWidth: 1 };

    const key = conn.id;
    if (showErrors && currentState.errorConns.includes(key)) {
      return { opacity: 0.7, stroke: '#EF4444', strokeWidth: 2 };
    }
    if (currentState.strongConns.includes(key)) {
      return { opacity: 0.75, stroke: '#2563EB', strokeWidth: 2.5 };
    }
    return { opacity: 0.12, stroke: '#D1D5DB', strokeWidth: 1 };
  };

  const confidence = round === 0 ? 0 : s.rounds[round - 1].confidence;
  const allDone = round === 3;

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

        {/* Network + controls */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            alignItems: 'start',
          }}
        >
          {/* Network SVG */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <svg
              width={width}
              height={height}
              viewBox={`0 0 ${width} ${height}`}
              style={{ overflow: 'visible' }}
            >
              {connections.map((conn) => {
                const style = getConnStyle(conn);
                return (
                  <motion.line
                    key={conn.id}
                    x1={conn.x1}
                    y1={conn.y1}
                    x2={conn.x2}
                    y2={conn.y2}
                    initial={false}
                    animate={{
                      opacity: style.opacity,
                      stroke: style.stroke,
                      strokeWidth: style.strokeWidth,
                    }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                );
              })}
              {nodes.map((node) => (
                <motion.circle
                  key={node.id}
                  cx={node.x}
                  cy={node.y}
                  r={8}
                  strokeWidth={1.5}
                  initial={false}
                  animate={{
                    fill: getNodeFill(node.id),
                    stroke: getNodeFill(node.id) === '#2563EB' ? '#1D4ED8' : '#D1D5DB',
                  }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              ))}
            </svg>
          </div>

          {/* Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ConfidenceMeter value={confidence} label={s.accuracyLabel} />

            {/* Round buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {s.rounds.map((r, i) => {
                const roundNum = i + 1;
                const isDone = round >= roundNum;
                const isNext = round === i;
                return (
                  <motion.button
                    key={i}
                    onClick={isNext ? handleRound : undefined}
                    whileHover={isNext ? { scale: 1.02 } : {}}
                    whileTap={isNext ? { scale: 0.98 } : {}}
                    animate={{
                      backgroundColor: isDone ? '#D1FAE5' : isNext ? '#2563EB' : '#F3F4F6',
                      color: isDone ? '#059669' : isNext ? '#ffffff' : '#9CA3AF',
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 18px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: isNext ? 'pointer' : 'default',
                      fontFamily: 'Inter, sans-serif',
                      textAlign: 'left',
                    }}
                  >
                    {isDone ? `✓ ${r.button.replace(' →', '')}` : r.button}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedback */}
            <AnimatePresence mode="wait">
              {round > 0 && !animatingError && (
                <motion.p
                  key={round}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{
                    fontSize: '14px',
                    color: '#6B7280',
                    lineHeight: 1.7,
                    backgroundColor: '#EFF6FF',
                    border: '1px solid #DBEAFE',
                    borderRadius: '10px',
                    padding: '14px 16px',
                  }}
                >
                  {s.rounds[round - 1].feedback}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Teacher note + advance button */}
            <AnimatePresence>
              {allDone && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
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
                      padding: '12px 20px',
                      fontSize: '15px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      width: '100%',
                    }}
                  >
                    {s.advance}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
