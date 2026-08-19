import { motion } from 'framer-motion';

export default function ProgressBar({ current, total }) {
  const progress = (current / total) * 100;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50"
      style={{ height: '3px', backgroundColor: '#E5E7EB' }}
    >
      <motion.div
        style={{
          height: '100%',
          backgroundColor: '#2563EB',
          originX: 0,
        }}
        initial={false}
        animate={{ width: `${progress}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
    </div>
  );
}
