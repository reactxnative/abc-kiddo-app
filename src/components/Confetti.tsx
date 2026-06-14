import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface ConfettiProps {
  visible?: boolean;
  onComplete?: () => void;
}

export const Confetti: React.FC<ConfettiProps> = ({ visible = false, onComplete }) => {
  const opacity = useSharedValue(visible ? 1 : 0);
  const scale = useSharedValue(visible ? 0.1 : 1);
  const translateY = useSharedValue(visible ? 100 : 0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [
        { scale: scale.value },
        { translateY: translateY.value },
      ],
    };
  });

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 100, easing: Easing.in(Easing.ease) });
      scale.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) });

      // Fade out after 2 seconds
      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 500, easing: Easing.in(Easing.ease) }, () => {
          if (onComplete) runOnJS(onComplete)();
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none">
      <View style={styles.starsGrid}>
        <Text style={styles.star}>⭐</Text>
        <Text style={styles.star}>✨</Text>
        <Text style={styles.star}>⭐</Text>
      </View>
      <View style={styles.starsGrid}>
        <Text style={styles.star}>✨</Text>
        <Text style={styles.star}>🌟</Text>
        <Text style={styles.star}>✨</Text>
      </View>
      <View style={styles.starsGrid}>
        <Text style={styles.star}>⭐</Text>
        <Text style={styles.star}>✨</Text>
        <Text style={styles.star}>⭐</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  starsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 8,
  },
  star: {
    fontSize: 36,
  },
});
