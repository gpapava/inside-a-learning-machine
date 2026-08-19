import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function ConfidenceMeter({ value, label }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.8,
      ease: 'easeOut',
    });

    const unsubscribe = rounded.on('change', (v) => {
      setDisplayValue(v);
    });

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [value]);

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '6px',
        }}
      >
        <span
          style={{
            fontSize: '12px',
            fontWeight: 500,
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {label || 'Confidence'}
        </span>
        <span
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#2563EB',
            fontFamily: 'JetBrains Mono, monospace',
          }}
        >
          {displayValue}%
        </span>
      </div>
      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#E5E7EB',
          borderRadius: '9999px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            height: '100%',
            backgroundColor: value >= 80 ? '#10B981' : '#2563EB',
            borderRadius: '9999px',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      </div>
    </div>
  );
}
