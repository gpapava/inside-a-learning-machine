import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

// ─── Challenge 1: Tokenization ───────────────────────────────────────────────

function TokenGroup({ tokens, label, selected, correct, onClick, revealed }) {
  const isCorrect = label === 'A' ? correct === 0 : correct === 1;
  const isSelected = label === 'A' ? selected === 0 : selected === 1;

  let bg = '#F9FAFB';
  let border = '#E5E7EB';
  let textColor = '#1A1A1A';

  if (revealed) {
    if (isCorrect) { bg = '#F0FDF4'; border = '#86EFAC'; textColor = '#15803D'; }
    else if (isSelected && !isCorrect) { bg = '#FFF1F2'; border = '#FCA5A5'; textColor = '#991B1B'; }
  } else if (isSelected) {
    bg = '#EFF6FF'; border = '#2563EB';
  }

  return (
    <motion.button
      onClick={selected === null ? onClick : undefined}
      whileHover={selected === null ? { scale: 1.02 } : {}}
      whileTap={selected === null ? { scale: 0.98 } : {}}
      animate={{ backgroundColor: bg, borderColor: border }}
      transition={{ duration: 0.3 }}
      style={{
        border: `2px solid`,
        borderColor: border,
        borderRadius: '10px',
        padding: '16px',
        cursor: selected === null ? 'pointer' : 'default',
        backgroundColor: bg,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'flex-start',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {tokens.map((tok, i) => (
          <span
            key={i}
            style={{
              backgroundColor: '#F3F4F6',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              padding: '4px 10px',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '13px',
              fontWeight: 500,
              color: textColor,
            }}
          >
            {tok}
          </span>
        ))}
      </div>
      <span style={{ fontSize: '12px', color: '#9CA3AF', fontFamily: 'JetBrains Mono, monospace' }}>
        {tokens.length} token{tokens.length !== 1 ? 's' : ''}
      </span>
    </motion.button>
  );
}

function Challenge1({ onComplete, lang, s }) {
  const [selected, setSelected] = useState(null);
  const isCorrect = selected === s.q1correct;

  const handleSelect = (i) => {
    if (selected !== null) return;
    setSelected(i);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ fontSize: '18px', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.5 }}>
        {s.q1}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <TokenGroup
          tokens={s.q1optA}
          label="A"
          selected={selected}
          correct={s.q1correct}
          onClick={() => handleSelect(0)}
          revealed={selected !== null}
        />
        <TokenGroup
          tokens={s.q1optB}
          label="B"
          selected={selected}
          correct={s.q1correct}
          onClick={() => handleSelect(1)}
          revealed={selected !== null}
        />
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <p
              style={{
                fontSize: '14px',
                color: isCorrect ? '#15803D' : '#9A3412',
                backgroundColor: isCorrect ? '#F0FDF4' : '#FFF1F2',
                border: `1px solid ${isCorrect ? '#BBF7D0' : '#FCA5A5'}`,
                borderRadius: '8px',
                padding: '12px 16px',
                lineHeight: 1.6,
              }}
            >
              {isCorrect ? s.q1feedback : s.q1feedbackWrong}
            </p>
            <motion.button
              onClick={() => onComplete(isCorrect ? 1 : 0)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: '#2563EB',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '11px 22px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                alignSelf: 'flex-start',
              }}
            >
              {lang === 'el' ? 'Επόμενη Πρόκληση →' : 'Next Challenge →'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Challenge 2: Prediction ──────────────────────────────────────────────────

function Challenge2({ onComplete, lang, s }) {
  const [selected, setSelected] = useState(null);
  const isCorrect = selected === s.q2correct;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div
        style={{
          backgroundColor: '#F9FAFB',
          border: '1px solid #E5E7EB',
          borderRadius: '10px',
          padding: '16px 20px',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '18px',
          fontWeight: 500,
          color: '#1A1A1A',
        }}
      >
        {s.q2} <span style={{ color: '#2563EB' }}>___</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {s.q2options.map((opt, i) => {
          const isSel = selected === i;
          const isOther = selected !== null && !isSel;
          const correct = selected !== null && i === s.q2correct;
          const wrongSelected = selected !== null && isSel && !correct;

          return (
            <motion.button
              key={opt}
              onClick={selected === null ? () => setSelected(i) : undefined}
              whileHover={selected === null ? { scale: 1.02 } : {}}
              whileTap={selected === null ? { scale: 0.98 } : {}}
              animate={{
                opacity: isOther ? 0.45 : 1,
                backgroundColor: correct ? '#F0FDF4' : wrongSelected ? '#FFF1F2' : isSel ? '#EFF6FF' : '#F9FAFB',
                borderColor: correct ? '#86EFAC' : wrongSelected ? '#FCA5A5' : isSel ? '#2563EB' : '#E5E7EB',
              }}
              transition={{ duration: 0.3 }}
              style={{
                border: '2px solid',
                borderRadius: '8px',
                padding: '10px 18px',
                fontSize: '16px',
                fontFamily: 'JetBrains Mono, monospace',
                fontWeight: 600,
                cursor: selected === null ? 'pointer' : 'default',
                minWidth: '90px',
                color: correct ? '#15803D' : wrongSelected ? '#991B1B' : '#1A1A1A',
              }}
            >
              {opt}
            </motion.button>
          );
        })}
      </div>

      {/* Probability bars */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {s.q2options.map((opt, i) => (
              <div key={opt} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', minWidth: '80px', color: i === s.q2correct ? '#2563EB' : '#9CA3AF' }}>
                  {opt}
                </span>
                <div style={{ flex: 1, height: '7px', backgroundColor: '#E5E7EB', borderRadius: '9999px', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.q2probs[i]}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30, delay: i * 0.08 }}
                    style={{ height: '100%', backgroundColor: i === s.q2correct ? '#2563EB' : '#D1D5DB', borderRadius: '9999px' }}
                  />
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#9CA3AF', minWidth: '32px' }}>
                  {s.q2probs[i]}%
                </span>
              </div>
            ))}

            <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6, backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: '8px', padding: '12px 16px', marginTop: '4px' }}>
              {s.q2feedback}
            </p>

            <motion.button
              onClick={() => onComplete(isCorrect ? 1 : 0)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: '#2563EB',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '11px 22px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                alignSelf: 'flex-start',
              }}
            >
              {lang === 'el' ? 'Τελευταία Πρόκληση →' : 'Final Challenge →'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Challenge 3: Multiple choice ────────────────────────────────────────────

function Challenge3({ onComplete, lang, s }) {
  const [selected, setSelected] = useState(null);
  const isCorrect = selected === s.q3correct;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <p style={{ fontSize: '18px', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.5 }}>
        {s.q3}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {s.q3options.map((opt, i) => {
          const isSel = selected === i;
          const correct = selected !== null && i === s.q3correct;
          const wrongSelected = selected !== null && isSel && !correct;
          const dimmed = selected !== null && !isSel && !correct;

          return (
            <motion.button
              key={i}
              onClick={selected === null ? () => setSelected(i) : undefined}
              whileHover={selected === null ? { scale: 1.01 } : {}}
              whileTap={selected === null ? { scale: 0.99 } : {}}
              animate={{
                opacity: dimmed ? 0.45 : 1,
                backgroundColor: correct ? '#F0FDF4' : wrongSelected ? '#FFF1F2' : isSel ? '#EFF6FF' : '#F9FAFB',
                borderColor: correct ? '#86EFAC' : wrongSelected ? '#FCA5A5' : isSel ? '#2563EB' : '#E5E7EB',
              }}
              transition={{ duration: 0.3 }}
              style={{
                border: '2px solid',
                borderRadius: '10px',
                padding: '14px 18px',
                fontSize: '15px',
                textAlign: 'left',
                cursor: selected === null ? 'pointer' : 'default',
                color: correct ? '#15803D' : wrongSelected ? '#991B1B' : '#1A1A1A',
                lineHeight: 1.5,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <span style={{ fontWeight: 600, marginRight: '8px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: '#9CA3AF' }}>
                {String.fromCharCode(65 + i)}.
              </span>
              {opt}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <p style={{
              fontSize: '14px',
              color: '#6B7280',
              lineHeight: 1.7,
              backgroundColor: '#EFF6FF',
              border: '1px solid #DBEAFE',
              borderRadius: '8px',
              padding: '12px 16px',
            }}>
              {s.q3feedback}
            </p>
            <motion.button
              onClick={() => onComplete(isCorrect ? 1 : 0)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: '#2563EB',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '11px 22px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                alignSelf: 'flex-start',
              }}
            >
              {lang === 'el' ? 'Δες τα Αποτελέσματα →' : 'See Results →'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Badge SVG ────────────────────────────────────────────────────────────────

function BadgeSVG({ score }) {
  const color = score === 3 ? '#2563EB' : score === 2 ? '#7C3AED' : '#10B981';
  const innerColor = score === 3 ? '#DBEAFE' : score === 2 ? '#EDE9FE' : '#D1FAE5';

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {/* Outer ring */}
      <motion.circle
        cx="60" cy="60" r="55"
        fill={innerColor}
        stroke={color}
        strokeWidth="3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
        style={{ transformOrigin: '60px 60px' }}
      />
      {/* Geometric shape — hexagon */}
      <motion.polygon
        points="60,18 90,35 90,70 60,87 30,70 30,35"
        fill={color}
        opacity={0.15}
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22, delay: 0.3 }}
        style={{ transformOrigin: '60px 52px' }}
      />
      {/* Network nodes */}
      {[
        { cx: 60, cy: 38 },
        { cx: 42, cy: 58 },
        { cx: 78, cy: 58 },
        { cx: 51, cy: 74 },
        { cx: 69, cy: 74 },
      ].map((node, i) => (
        <motion.circle
          key={i}
          cx={node.cx}
          cy={node.cy}
          r={5}
          fill={color}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.4 + i * 0.06 }}
          style={{ transformOrigin: `${node.cx}px ${node.cy}px` }}
        />
      ))}
      {/* Connections */}
      {[
        [60, 38, 42, 58], [60, 38, 78, 58],
        [42, 58, 51, 74], [78, 58, 69, 74],
        [42, 58, 69, 74], [78, 58, 51, 74],
      ].map((line, i) => (
        <motion.line
          key={i}
          x1={line[0]} y1={line[1]} x2={line[2]} y2={line[3]}
          stroke={color}
          strokeWidth={1.5}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.6 + i * 0.05 }}
        />
      ))}
    </svg>
  );
}

// ─── Result Screen ────────────────────────────────────────────────────────────

function ResultScreen({ score, onRestart }) {
  const { tr, lang } = useLang();
  const s = tr.challenge;
  const [displayScore, setDisplayScore] = useState(0);

  // Particle dots
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    angle: (i / 12) * 360,
    distance: 80 + Math.random() * 40,
  }));

  useEffect(() => {
    let current = 0;
    const timer = setInterval(() => {
      if (current < score) {
        current++;
        setDisplayScore(current);
      } else {
        clearInterval(timer);
      }
    }, 300);
    return () => clearInterval(timer);
  }, [score]);

  const badgeKey = score >= 3 ? 3 : score >= 2 ? 2 : score >= 1 ? 1 : 0;
  const badgeName = s.badges[badgeKey];
  const badgeColor = score === 3 ? '#2563EB' : score === 2 ? '#7C3AED' : '#10B981';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '24px',
        padding: '20px',
      }}
    >
      {/* Particle burst + badge */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '200px', height: '200px' }}>
        {particles.map((p) => {
          const rad = (p.angle * Math.PI) / 180;
          const x = Math.cos(rad) * p.distance;
          const y = Math.sin(rad) * p.distance;
          return (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x, y, opacity: 0, scale: 0 }}
              transition={{ duration: 0.8, delay: 0.3 + p.id * 0.03, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: badgeColor,
                left: '50%',
                top: '50%',
                marginLeft: '-3px',
                marginTop: '-3px',
              }}
            />
          );
        })}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
        >
          <BadgeSVG score={score} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
      >
        <span
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: badgeColor,
            letterSpacing: '-0.02em',
          }}
        >
          {badgeName}
        </span>
        <span
          style={{
            fontSize: '14px',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#9CA3AF',
          }}
        >
          {s.scoreLabel(displayScore)}
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        style={{
          fontSize: '15px',
          color: '#6B7280',
          lineHeight: 1.7,
          maxWidth: '520px',
        }}
      >
        {s.finalText}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6 }}
      >
        {s.sub}
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        onClick={onRestart}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          backgroundColor: '#F3F4F6',
          color: '#6B7280',
          border: '1px solid #E5E7EB',
          borderRadius: '8px',
          padding: '11px 24px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {s.restart}
      </motion.button>
    </motion.div>
  );
}

// ─── Main Challenge Screen ────────────────────────────────────────────────────

export default function ChallengeScreen({ onAdvance, onRestart }) {
  const { tr, lang } = useLang();
  const s = tr.challenge;
  const [challengeIndex, setChallengeIndex] = useState(0); // 0,1,2 = challenges; 3 = results
  const [score, setScore] = useState(0);

  const handleComplete = (points) => {
    setScore((prev) => prev + points);
    setChallengeIndex((prev) => prev + 1);
  };

  const challenges = [
    <Challenge1 key="c1" onComplete={handleComplete} lang={lang} s={s} />,
    <Challenge2 key="c2" onComplete={handleComplete} lang={lang} s={s} />,
    <Challenge3 key="c3" onComplete={handleComplete} lang={lang} s={s} />,
  ];

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
        {challengeIndex < 3 ? (
          <motion.div
            key={challengeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#9CA3AF',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontFamily: 'JetBrains Mono, monospace',
                }}
              >
                {s.challengeLabel(challengeIndex + 1)}
              </span>
              <div style={{ flex: 1, height: '2px', backgroundColor: '#E5E7EB', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div
                  animate={{ width: `${((challengeIndex + 1) / 3) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  style={{ height: '100%', backgroundColor: '#2563EB', borderRadius: '2px' }}
                />
              </div>
            </div>

            <h2
              style={{
                fontSize: 'clamp(22px, 4vw, 32px)',
                fontWeight: 700,
                color: '#1A1A1A',
                letterSpacing: '-0.02em',
              }}
            >
              {lang === 'el' ? 'Πρόκληση' : 'Challenge'} {challengeIndex + 1}
            </h2>

            <AnimatePresence mode="wait">
              <motion.div
                key={challengeIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                {challenges[challengeIndex]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <ResultScreen score={score} onRestart={onRestart} />
        )}
      </div>
    </div>
  );
}
