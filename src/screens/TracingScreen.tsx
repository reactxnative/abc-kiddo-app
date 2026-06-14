import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '../components/AppHeader';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Confetti } from '../components/Confetti';
import { ProgressBar } from '../components/ProgressBar';
import TracingCanvasSkia from '../components/TracingCanvasSkia';
import { alphabetData } from '../data/alphabetData';
import { useAppSettings } from '../utils/settingsStore';
import { speakText } from '../utils/speech';

export default function TracingScreen() {
  const router = useRouter();
  const { soundEnabled, speechSettings } = useAppSettings();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [canvasKey, setCanvasKey] = useState(0);

  const { width } = useWindowDimensions();
  const canvasWidth = Math.round(Math.min(width - 32, 420));
  const canvasHeight = Math.round(Math.min(Math.max(width * 0.68, 260), 340));

  const currentItem = alphabetData[currentIndex];

  // Play pronunciation on mount or when index changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (soundEnabled) {
        speakText(`${currentItem.letter}... ${currentItem.letter} is for ${currentItem.word}`, speechSettings);
      }
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const handleStrokeComplete = () => {
    if (isCompleted) return;

    setIsCompleted(true);
    setShowConfetti(true);
    if (Platform.OS === 'ios') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    if (soundEnabled) {
      speakText(`Ta-da! Excellent tracing. ${currentItem.letter} for ${currentItem.word}!`, speechSettings);
    }
  };

  const handleReset = () => {
    setIsCompleted(false);
    setShowConfetti(false);
    setCanvasKey((prev) => prev + 1);
  };

  const handleNext = () => {
    if (currentIndex < alphabetData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      handleReset();
    } else {
      router.push('/');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      handleReset();
    }
  };

  return (
    <LinearGradient
      colors={[currentItem.gradient[0], currentItem.gradient[1], '#ffffff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <AppHeader title={"Hi Kiddo 👋"} subtitle={"Tracing Time"} stars={24} />

        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.progressContainer}>
            <ProgressBar
              current={currentIndex + 1}
              total={alphabetData.length}
              emoji="✏️"
              color="#22c55e"
              trackColor="rgba(255, 255, 255, 0.7)"
            />
          </View>

          <View style={styles.heroRow}>
            <View style={styles.letterBadge}>
              <Text style={styles.letterDisplay}>{currentItem.letter}</Text>
            </View>
            <View style={styles.wordPanel}>
              <AppleIllustration emoji={currentItem.emoji} isApple={currentItem.letter === 'A'} />
              <View style={styles.wordTextColumn}>
                <Text style={styles.wordDisplay}>{currentItem.word}</Text>
                <Text style={styles.exampleText}>
                  {currentItem.letter} for {currentItem.word}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.canvasWrapper}>
            <View style={styles.canvasHeader}>
              <Text style={styles.instructionText}>Trace the dotted {currentItem.letter}</Text>
              <RewardStars completed={isCompleted} />
            </View>
            {/* <DrawingCanvas
              key={canvasKey}
              width={canvasWidth}
              height={canvasHeight}
              letter={currentItem.letter}
              completed={isCompleted}
              onStrokeComplete={handleStrokeComplete}
            /> */}
            <TracingCanvasSkia
              width={canvasWidth}
              height={canvasHeight}
              letter={currentItem.letter}
              resetKey={canvasKey}
              onCompleted={handleStrokeComplete}
            />
            <Confetti visible={showConfetti} onComplete={() => setShowConfetti(false)} />
          </View>

          <View style={styles.phonicsCard}>
            <Text style={styles.phonicsTitle}>{currentItem.sentence}</Text>
            <View style={styles.rewardChip}>
              <Ionicons name={isCompleted ? 'star' : 'sparkles'} size={20} color="#f59e0b" />
              <Text style={styles.rewardChipText}>
                {isCompleted ? '3 stars earned!' : 'Finish tracing to win stars'}
              </Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <Button title="Reset" onPress={handleReset} variant="purple" />
            </View>
            <View style={styles.buttonWrapper}>
              <Button title="Next Letter" onPress={handleNext} variant="primary" />
            </View>
          </View>

          <View style={styles.navContainer}>
            <Card
              onPress={handlePrev}
              style={styles.navBtn}
              borderRadius={20}
              width={48}
              height={48}
              backgroundColor="#ffffff"
            >
              <Ionicons name="chevron-back" size={24} color="#7c3aed" />
            </Card>
            <Text style={styles.letterCounter}>
              {currentIndex + 1} / {alphabetData.length}
            </Text>
            <Card
              onPress={handleNext}
              style={styles.navBtn}
              borderRadius={20}
              width={48}
              height={48}
              backgroundColor="#ffffff"
            >
              <Ionicons name="chevron-forward" size={24} color="#7c3aed" />
            </Card>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const RewardStars = ({ completed }: { completed: boolean }) => (
  <View style={styles.rewardStars}>
    {[0, 1, 2].map((item) => (
      <Ionicons
        key={item}
        name="star"
        size={24}
        color={completed ? '#facc15' : 'rgba(255, 255, 255, 0.55)'}
      />
    ))}
  </View>
);

const AppleIllustration = ({ emoji, isApple }: { emoji: string; isApple: boolean }) => {
  if (!isApple) {
    return (
      <View style={styles.emojiCircle}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
    );
  }

  return (
    <View style={styles.appleWrap}>
      <View style={styles.appleLeaf} />
      <View style={styles.appleStem} />
      <View style={styles.appleBody}>
        <View style={styles.appleShine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 18,
  },
  progressContainer: {
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
  },
  heroRow: {
    width: '100%',
    maxWidth: 440,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  letterBadge: {
    width: 96,
    height: 104,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 20px rgba(69, 42, 124, 0.18)',
  },
  letterDisplay: {
    fontSize: 70,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 4,
  },
  wordPanel: {
    flex: 1,
    minHeight: 104,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.72)',
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
  },
  wordTextColumn: {
    flex: 1,
    gap: 4,
  },
  wordDisplay: {
    fontSize: 24,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  canvasWrapper: {
    alignItems: 'center',
    width: '100%',
  },
  canvasHeader: {
    width: '100%',
    maxWidth: 420,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 4,
    marginBottom: 8,
  },
  instructionText: {
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  rewardStars: {
    flexDirection: 'row',
    gap: 3,
  },
  emojiCircle: {
    width: 66,
    height: 66,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 38,
  },
  exampleText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#ffffff',
    lineHeight: 22,
  },
  phonicsCard: {
    width: '100%',
    maxWidth: 440,
    gap: 10,
    borderRadius: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.34)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.68)',
    padding: 14,
  },
  phonicsTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  rewardChip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  rewardChipText: {
    color: '#7c2d12',
    fontSize: 14,
    fontWeight: '900',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 440,
    flexDirection: 'row',
    gap: 10,
  },
  buttonWrapper: {
    flex: 1,
  },
  navContainer: {
    width: '100%',
    maxWidth: 440,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Platform.OS === 'ios' ? 4 : 2,
  },
  navBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 12px rgba(69, 42, 124, 0.14)',
  },
  letterCounter: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  appleWrap: {
    width: 68,
    height: 72,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  appleBody: {
    width: 58,
    height: 56,
    borderRadius: 22,
    backgroundColor: '#ef4444',
    borderWidth: 4,
    borderColor: '#ffffff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 10,
    boxShadow: '0 6px 0 rgba(185, 28, 28, 0.45)',
  },
  appleShine: {
    width: 14,
    height: 18,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
  },
  appleStem: {
    position: 'absolute',
    top: 2,
    width: 9,
    height: 22,
    borderRadius: 6,
    backgroundColor: '#854d0e',
    zIndex: 2,
  },
  appleLeaf: {
    position: 'absolute',
    top: 6,
    right: 12,
    width: 25,
    height: 15,
    borderTopLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#22c55e',
    zIndex: 3,
    transform: [{ rotate: '-22deg' }],
  },
});
