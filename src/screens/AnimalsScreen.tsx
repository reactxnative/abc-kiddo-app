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
import { animalsData } from '../data/animalsData';
import { useAppSettings } from '../utils/settingsStore';
import { speakText, stopSpeech } from '../utils/speech';

export default function AnimalsScreen() {
  const router = useRouter();
  const { speechSettings, soundEnabled } = useAppSettings();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { height, width } = Dimensions.get('window');
  const cardHeight = Math.round(height * 0.56);
  const cardWidth = Math.round(width * 0.92);

  const currentItem = animalsData[currentIndex];

  // Animation shared values
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

  // Pronounce animal and make its sound
  const playSound = () => {
    if (soundEnabled) {
      speakText(`${currentItem.name}! The ${currentItem.name} says ${currentItem.sound}`, speechSettings);
    }
  };

  // Trigger speech on change
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
    if (currentIndex < animalsData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(animalsData.length - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <AppHeader title={"Hi Kiddo 👋"} subtitle={"Animals Time"} stars={8} />
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
        <Text style={styles.headerTitle}>Jungle Animals</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Track */}
      <View style={styles.progressContainer}>
        <View style={styles.progressRow}>
          <View style={styles.progressBarWrap}>
            <ProgressBar current={currentIndex + 1} total={animalsData.length} emoji="🦁" color="#4ade80" />
          </View>
          <Text style={styles.progressMascot}>🦁</Text>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.animatedCardWrapper, { width: cardWidth, height: cardHeight }, cardAnimatedStyle]}>
          <Card
            gradientColors={currentItem.gradient}
            borderRadius={32}
            style={[styles.animalCard, { paddingVertical: 16 }]}
          >
            <View style={styles.cardTop}>
              <Text style={styles.emojiText}>{currentItem.emoji}</Text>
            </View>

            <View style={styles.cardMiddle}>
              <Text style={styles.nameText}>{currentItem.name}</Text>
              <View style={styles.soundBubble}>
                <Text style={styles.soundBubbleText}>{"\"" + currentItem.sound + "\""}</Text>
              </View>
              <View style={styles.funFactBox}>
                <Text style={styles.funFactLabel}>💡 Fun Fact</Text>
                <Text style={styles.funFactText}>{currentItem.funFact}</Text>
              </View>
            </View>

            <View style={styles.cardBottom} />

            {/* Sound button inside card */}
            <View style={styles.cardSoundWrap}>
              <Card
                onPress={playSound}
                borderRadius={28}
                width={'60%'}
                height={60}
                gradientColors={['#22c55e', '#16a34a']}
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

      {/* Nav footer */}
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
    backgroundColor: '#f6fdf7',
    justifyContent: 'flex-start',
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  backBtn: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#16a34a',
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
  animalCard: {
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
  },
  emojiText: {
    fontSize: 120,
    textAlign: 'center',
    marginVertical: 4,
  },
  nameText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    marginTop: 6,
    marginBottom: 8,
  },
  soundBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    marginVertical: 6,
  },
  soundBubbleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16a34a',
    fontStyle: 'italic',
  },
  funFactBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 18,
    padding: 10,
    width: '92%',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  funFactLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 4,
  },
  funFactText: {
    fontSize: 13,
    color: '#1f2937',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 16,
  },
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
