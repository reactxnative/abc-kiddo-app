import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface ProgressBarProps {
  current: number;
  total: number;
  color?: string;
  trackColor?: string;
  emoji?: string; // e.g. '🚗', '🌟', '🐾'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  total,
  color = '#4ade80', // green-400
  trackColor = '#e2e8f0', // slate-200
  emoji = '🌟',
}) => {
  const percentage = Math.min(Math.max(current / total, 0), 1);
  const animProgress = useSharedValue(0);

  useEffect(() => {
    animProgress.value = withSpring(percentage, { damping: 15, stiffness: 120 });
  }, [percentage, animProgress]);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${animProgress.value * 100}%`,
    };
  });

  const emojiStyle = useAnimatedStyle(() => {
    return {
      left: `${animProgress.value * 100}%`,
      transform: [
        { translateX: -18 },
        { translateY: -16 },
        { scale: animProgress.value > 0 ? 1 : 0 },
      ],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progressText}>
          Progress: {current} / {total}
        </Text>
      </View>
      <View style={[styles.track, { backgroundColor: trackColor }]}>
        <Animated.View style={[styles.fill, { backgroundColor: color }, progressStyle]} />
        <Animated.Text style={[styles.emoji, emojiStyle]}>{emoji}</Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b', // slate-500
    fontFamily: 'System',
  },
  track: {
    height: 18,
    borderRadius: 9,
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    marginTop: 10,
  },
  fill: {
    height: '100%',
    borderRadius: 9,
  },
  emoji: {
    position: 'absolute',
    fontSize: 22,
    zIndex: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
});
