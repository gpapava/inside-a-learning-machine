import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import ProgressBar from './components/ProgressBar';
import LanguageToggle from './components/LanguageToggle';
import ScreenCounter from './components/ScreenCounter';
import IntroScreen from './screens/IntroScreen';
import TokenizerScreen from './screens/TokenizerScreen';
import TrainingScreen from './screens/TrainingScreen';
import PredictionScreen from './screens/PredictionScreen';
import WeightsScreen from './screens/WeightsScreen';
import ContextScreen from './screens/ContextScreen';
import LimitsScreen from './screens/LimitsScreen';
import PromptingScreen from './screens/PromptingScreen';
import EthicsScreen from './screens/EthicsScreen';
import GlossaryScreen from './screens/GlossaryScreen';
import ChallengeScreen from './screens/ChallengeScreen';

const TOTAL_SCREENS = 11;

const screenVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.2 },
  },
};

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState(0);

  const advance = () => {
    setCurrentScreen((prev) => Math.min(prev + 1, TOTAL_SCREENS - 1));
  };

  const restart = () => {
    setCurrentScreen(0);
  };

  const screens = [
    <IntroScreen key="intro" onAdvance={advance} />,
    <TokenizerScreen key="tokenizer" onAdvance={advance} />,
    <TrainingScreen key="training" onAdvance={advance} />,
    <PredictionScreen key="prediction" onAdvance={advance} />,
    <WeightsScreen key="weights" onAdvance={advance} />,
    <ContextScreen key="context" onAdvance={advance} />,
    <LimitsScreen key="limits" onAdvance={advance} />,
    <PromptingScreen key="prompting" onAdvance={advance} />,
    <EthicsScreen key="ethics" onAdvance={advance} />,
    <GlossaryScreen key="glossary" onAdvance={advance} />,
    <ChallengeScreen key="challenge" onAdvance={advance} onRestart={restart} />,
  ];

  // Screen counter: 1-indexed, 7 total
  const screenNumber = currentScreen + 1;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAFAF9',
        position: 'relative',
      }}
    >
      <ProgressBar current={screenNumber} total={TOTAL_SCREENS} />
      <LanguageToggle />
      <ScreenCounter current={screenNumber} total={TOTAL_SCREENS} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          variants={screenVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ width: '100%' }}
        >
          {screens[currentScreen]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
