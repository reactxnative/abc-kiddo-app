import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '../components/AppHeader';
import { BottomDecor } from '../components/BottomDecor';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAppSettings } from '../utils/settingsStore';
import { speakText } from '../utils/speech';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { speechSettings, soundEnabled } = useAppSettings();

  // Retrieve params and set defaults
  const score = parseInt(params.score as string) || 0;
  const total = parseInt(params.total as string) || 5;

  // Calculate stars and messages
  let starCount = 1;
  let title = 'Great Try!';
  let description = "You are doing great! Let's practice and learn more together!";
  let voiceMessage = "Nice try! Let's play again and learn more!";

  if (score === total) {
    starCount = 3;
    title = 'Superstar!';
    description = 'Wow! A perfect score! You got every single question correct!';
    voiceMessage = 'Congratulations! You are a superstar! Perfect score!';
  } else if (score >= total - 2) {
    starCount = 2;
    title = 'Great Job!';
    description = 'Almost perfect! You did an amazing job matching the letters and animals!';
    voiceMessage = 'Great job! You did awesome!';
  }

  // Trigger celebration haptics and speak congrats when the screen loads
  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    // Triple tap for celebration!
    const t1 = setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light), 300);
    const t2 = setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium), 600);
    const t3 = setTimeout(() => {
      if (soundEnabled) {
        speakText(voiceMessage, speechSettings);
      }
    }, 150);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      if (i < starCount) {
        stars.push(<Text key={i} style={styles.starActive}>⭐</Text>);
      } else {
        stars.push(<Text key={i} style={styles.starInactive}>⭐</Text>);
      }
    }
    return stars;
  };

  return (
    <LinearGradient
      colors={['#f3e8ff', '#e0f2fe']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <AppHeader title={title} subtitle={"Great Work!"} stars={starCount} />
        <ScrollViewWrapper style={styles.content}>
          
          {/* Header */}
          <Text style={styles.titleText}>{title}</Text>

          {/* Reward Stars */}
          <View style={styles.starsRow}>
            {renderStars()}
          </View>

          {/* Large Trophy Card */}
          <View style={styles.trophyWrapper}>
            <Card borderRadius={36} style={styles.trophyCard}>
              <Image
                source={require('../../assets/images/trophy.png')}
                style={styles.trophyImage as any}
                contentFit="contain"
              />
            </Card>
          </View>

          {/* Score details */}
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>YOUR SCORE</Text>
            <Text style={styles.scoreValue}>
              {score} <Text style={styles.scoreSlash}>/</Text> {total}
            </Text>
            <Text style={styles.scoreSub}>{description}</Text>
          </View>

          {/* Action buttons */}
          <View style={styles.actionContainer}>
            <Button
              title="Play Again"
              onPress={() => router.replace('/quiz')}
              variant="success"
            />
            <Button
              title="Back to Home"
              onPress={() => router.replace('/')}
              variant="primary"
            />
          </View>
          <BottomDecor />
        </ScrollViewWrapper>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Simple layout scroll wrapper for small devices
const ScrollViewWrapper: React.FC<{ children: React.ReactNode; style?: any }> = ({ children, style }) => {
  return (
    <View style={style}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 25,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  titleText: {
    fontSize: 42,
    fontWeight: '900',
    color: '#6b21a8', // purple-800
    textAlign: 'center',
    marginTop: 20,
    fontFamily: Platform.OS === 'ios' ? 'Cooper Black' : 'System',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 10,
  },
  starActive: {
    fontSize: 54,
    textShadowColor: 'rgba(251, 191, 36, 0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  starInactive: {
    fontSize: 54,
    opacity: 0.25,
    filter: 'grayscale(100%)',
  },
  trophyWrapper: {
    width: '100%',
    maxHeight: 220,
    aspectRatio: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trophyCard: {
    width: '75%',
    height: '100%',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#a855f7',
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  trophyImage: {
    width: '90%',
    height: '90%',
  },
  scoreBox: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7c3aed',
    letterSpacing: 2,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#1e293b',
    marginVertical: 4,
    fontFamily: Platform.OS === 'ios' ? 'Cooper Black' : 'System',
  },
  scoreSlash: {
    color: '#cbd5e1',
  },
  scoreSub: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 8,
    lineHeight: 22,
  },
  actionContainer: {
    width: '100%',
    paddingBottom: Platform.OS === 'ios' ? 10 : 20,
  },
});
