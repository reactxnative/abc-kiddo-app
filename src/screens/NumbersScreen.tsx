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
import { numbersData } from '../data/numbersData';
import { useAppSettings } from '../utils/settingsStore';
import { speakText, stopSpeech } from '../utils/speech';

export default function NumbersScreen() {
  const router = useRouter();
  const { speechSettings, soundEnabled } = useAppSettings();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { height, width } = Dimensions.get('window');
  const cardHeight = Math.round(height * 0.56);
  const cardWidth = Math.round(width * 0.92);

  const currentItem = numbersData[currentIndex];

  // Animation values
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

  // Perform speech pronunciation and count
  const playSound = () => {
    if (!soundEnabled) return;
    
    // Create counting string: e.g. "Three! Let's count... one... two... three!"
    let countSeq = '';
    for (let i = 1; i <= currentItem.value; i++) {
      countSeq += `... ${i}`;
    }
    
    speakText(`${currentItem.value}... ${currentItem.word}! Let's count${countSeq}`, speechSettings);
  };

  // Auto speak on changes
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
    if (currentIndex < numbersData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(numbersData.length - 1);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <AppHeader title={"Hi Kiddo 👋"} subtitle={"Numbers Time"} stars={12} />
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
        <Text style={styles.headerTitle}>Counting 1 to 10</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Progress Track */}
      <View style={styles.progressContainer}>
        <View style={styles.progressRow}>
          <View style={styles.progressBarWrap}>
            <ProgressBar current={currentIndex + 1} total={numbersData.length} emoji="🔢" color="#3b82f6" />
          </View>
          <Text style={styles.progressMascot}>🔢</Text>
        </View>
      </View>

      {/* Number Card */}
      <View style={styles.cardContainer}>
        <Animated.View style={[styles.animatedCardWrapper, { width: cardWidth, height: cardHeight }, cardAnimatedStyle]}>
          <Card
            gradientColors={currentItem.gradient}
            borderRadius={32}
            style={[styles.numberCard, { paddingVertical: 16 }]}
          >
            <View style={styles.cardTop}>
              <Text style={styles.digitText}>{currentItem.value}</Text>
            </View>

            <View style={styles.cardMiddle}>
              <Text style={styles.wordText}>{currentItem.word}</Text>
              <View style={styles.emojiDisplayContainer}>
                <Text style={styles.emojiCountText}>{currentItem.countString}</Text>
              </View>
            </View>

            <View style={styles.cardBottom} />

            {/* Sound button inside card */}
            <View style={styles.cardSoundWrap}>
              <Card
                onPress={playSound}
                borderRadius={28}
                width={'65%'}
                height={60}
                gradientColors={['#3b82f6', '#2563eb']}
                style={styles.soundCardInline}
              >
                <View style={styles.soundContentInline}>
                  <Ionicons name="volume-medium" size={28} color="#ffffff" />
                  <Text style={styles.soundBtnText}>Hear Counting</Text>
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
    backgroundColor: '#f5fafc',
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
    color: '#2563eb',
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
  numberCard: {
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
  digitText: {
    fontSize: 100,
    fontWeight: '900',
    color: '#111827',
    fontFamily: Platform.OS === 'ios' ? 'Cooper Black' : 'System',
  },
  wordText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#111827',
    marginTop: 6,
    marginBottom: 8,
  },
  emojiDisplayContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    width: '95%',
    minHeight: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    marginTop: 6,
  },
  emojiCountText: {
    fontSize: 30,
    textAlign: 'center',
    lineHeight: 40,
    letterSpacing: 4,
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