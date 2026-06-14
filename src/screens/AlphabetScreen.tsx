import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '../components/AppHeader';
import { BottomDecor } from '../components/BottomDecor';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { alphabetData } from '../data/alphabetData';
import { useAppSettings } from '../utils/settingsStore';
import { speakText, stopSpeech } from '../utils/speech';

export default function AlphabetScreen() {
  const router = useRouter();
  const { speechSettings, soundEnabled } = useAppSettings();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { height, width } = Dimensions.get('window');
  const cardHeight = Math.round(height * 0.56); // 50-60% of screen
  const cardWidth = Math.round(width * 0.92); // 90% of width

  const currentItem = alphabetData[currentIndex];

  // Animation values for the card transition
  const cardOpacity = useSharedValue(1);
  const cardScale = useSharedValue(1);

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: cardOpacity.value,
      transform: [{ scale: cardScale.value }],
    };
  });

  const triggerAnimation = () => {
    cardOpacity.value = 0.3;
    cardScale.value = 0.9;
    cardOpacity.value = withTiming(1, { duration: 300 });
    cardScale.value = withSpring(1, { damping: 10, stiffness: 200 });
  };

  // Play sound for the current letter
  const playSound = () => {
    if (soundEnabled) {
      speakText(`${currentItem.letter}... ${currentItem.letter} is for ${currentItem.word}`, speechSettings);
    }
  };

  // Autoplay sound when index changes
  useEffect(() => {
    triggerAnimation();
    const timer = setTimeout(() => {
      playSound();
    }, 150);
    return () => {
      clearTimeout(timer);
      stopSpeech();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  const handleNext = () => {
    if (currentIndex < alphabetData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Loop back to A
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      // Loop to Z
      setCurrentIndex(alphabetData.length - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <AppHeader title={"Hi Kiddo 👋"} subtitle={"Alphabet Time"} stars={5} />
      {/* Header */}
      <View style={styles.header}>
        <Card
          onPress={() => router.back()}
          style={styles.backBtn}
          borderRadius={16}
          width={48}
          height={48}
        >
          <Ionicons name="arrow-back" size={24} color="#64748b" />
        </Card>
        <Text style={styles.headerTitle}>Learn A to Z</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Track */}
      <View style={styles.progressContainer}>
        <View style={styles.progressRow}>
          <View style={styles.progressBarWrap}>
            <ProgressBar current={currentIndex + 1} total={26} emoji="🍎" color="#ff7675" />
          </View>
          <Text style={styles.progressMascot}>🦊</Text>
        </View>
      </View>

      
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.animatedCardWrapper, { width: cardWidth, height: cardHeight }, cardAnimatedStyle]}>
          <Card
            gradientColors={currentItem.gradient}
            borderRadius={32}
            style={[styles.letterCard, { paddingVertical: 18 }]}
          >
            <View style={styles.cardTop}>
              <Text style={styles.letterText}>{currentItem.letter}</Text>
            </View>

            <View style={styles.cardMiddle}>
              <Text style={styles.emojiText}>{currentItem.emoji}</Text>
              <Text style={styles.wordText}>{currentItem.word}</Text>
            </View>

            <View style={styles.cardBottom}>
              <Text style={styles.sentenceText}>{currentItem.sentence}</Text>
            </View>

            {/* Sound button inside card */}
            <View style={styles.cardSoundWrap}>
              <Card
                onPress={playSound}
                borderRadius={28}
                width={'60%'}
                height={62}
                gradientColors={['#a78bfa', '#8b5cf6']}
                style={styles.soundCardInline}
              >
                <View style={styles.soundContentInline}>
                  <Ionicons name="volume-medium" size={28} color="#ffffff" />
                  <Text style={styles.soundBtnText}>Hear Sound</Text>
                </View>
              </Card>
            </View>
          </Card>
        </Animated.View>
      </View>

      {/* Navigation Footer */}
      <View style={styles.footerNav}>
        <View style={styles.navButtonWrapper}>
          <Button
            title="Previous"
            onPress={handlePrev}
            variant="purple"
          />
        </View>
        <View style={styles.navButtonWrapper}>
          <Button
            title="Next"
            onPress={handleNext}
            variant="primary"
          />
        </View>
      </View>
      <BottomDecor />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffdf9', // Warm background
    justifyContent: 'flex-start',
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  backBtn: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#6d28d9',
    fontFamily: Platform.OS === 'ios' ? 'Cooper Black' : 'System',
  },
  headerSpacer: {
    width: 48,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 4,
  },
  progressRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarWrap: {
    flex: 1,
    maxWidth: 420,
  },
  progressMascot: {
    fontSize: 28,
    marginLeft: 10,
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 6,
  },
  animatedCardWrapper: {
    alignSelf: 'center',
  },
  letterCard: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    borderRadius: 32,
  },
  cardTop: {
    width: '100%',
    alignItems: 'center',
    marginTop: 6,
  },
  cardMiddle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBottom: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 16,
  },
  letterText: {
    fontSize: 92,
    fontWeight: '900',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'Cooper Black' : 'System',
  },
  emojiText: {
    fontSize: 120,
    marginVertical: 6,
    textAlign: 'center',
  },
  wordText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#111827',
    marginTop: 4,
  },
  sentenceText: {
    fontSize: 16,
    color: '#475569',
    textAlign: 'center',
    paddingHorizontal: 8,
    fontWeight: '700',
    lineHeight: 20,
  },
  // inline sound inside card
  cardSoundWrap: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  soundCardInline: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundContentInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  soundBtnText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ffffff',
  },
  footerNav: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: Platform.OS === 'ios' ? 18 : 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  navButtonWrapper: {
    flex: 1,
  },
});
