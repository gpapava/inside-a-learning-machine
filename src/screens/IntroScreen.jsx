import { motion } from 'framer-motion';
import { useLang } from '../context/LanguageContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

// SVG Neural network with pulsing opacity
function IntroNetwork() {
  const nodes = [
    { x: 60, y: 80 },
    { x: 60, y: 160 },
    { x: 150, y: 50 },
    { x: 150, y: 120 },
    { x: 150, y: 190 },
    { x: 240, y: 80 },
    { x: 240, y: 160 },
  ];

  const connections = [
    [0, 2], [0, 3], [0, 4],
    [1, 2], [1, 3], [1, 4],
    [2, 5], [2, 6],
    [3, 5], [3, 6],
    [4, 5], [4, 6],
  ];

  return (
    <svg width="300" height="240" viewBox="0 0 300 240" style={{ overflow: 'visible' }}>
      {connections.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="#2563EB"
          strokeWidth={1.5}
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.12,
            ease: 'easeInOut',
          }}
        />
      ))}
      {nodes.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={12}
          fill="#EFF6FF"
          stroke="#2563EB"
          strokeWidth={1.5}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.18,
            ease: 'easeInOut',
          }}
        />
      ))}
    </svg>
  );
}

export default function IntroScreen({ onAdvance }) {
  const { tr } = useLang();
  const s = tr.intro;

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
          alignItems: 'center',
          textAlign: 'center',
          gap: '32px',
        }}
      >
        <motion.div variants={itemVariants}>
          <IntroNetwork />
        </motion.div>

        <motion.h1
          variants={itemVariants}
          style={{
            fontSize: 'clamp(28px, 5vw, 48px)',
            fontWeight: 700,
            color: '#1A1A1A',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
          }}
        >
          {s.heading}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          style={{
            fontSize: '18px',
            color: '#6B7280',
            lineHeight: 1.7,
            maxWidth: '580px',
          }}
        >
          {s.subtext}
        </motion.p>

        <motion.button
          variants={itemVariants}
          onClick={onAdvance}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            backgroundColor: '#2563EB',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '14px 32px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.01em',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
          }}
        >
          {s.cta}
        </motion.button>
      </motion.div>
    </div>
  );
}
