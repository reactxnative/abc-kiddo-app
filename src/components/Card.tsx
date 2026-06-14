import React from 'react';
import { StyleSheet, Pressable, ViewStyle, DimensionValue, StyleProp } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  gradientColors?: [string, string];
  style?: StyleProp<ViewStyle>;
  hapticFeedback?: boolean;
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  backgroundColor?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  gradientColors,
  style,
  hapticFeedback = true,
  width = '100%',
  height,
  borderRadius = 28,
  backgroundColor = '#ffffff',
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 300 });
    if (hapticFeedback && onPress) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 300 });
  };

  const containerStyle = [
    styles.card,
    { width, height, borderRadius, backgroundColor },
    style,
  ];

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.pressable}
      >
        <Animated.View style={[animatedStyle, { width, height }]}>
          {gradientColors ? (
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.gradient, { borderRadius }]}
            >
              {children}
            </LinearGradient>
          ) : (
            <Animated.View style={containerStyle}>{children}</Animated.View>
          )}
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Animated.View style={containerStyle}>
      {gradientColors ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius }]}
        >
          {children}
        </LinearGradient>
      ) : (
        children
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  gradient: {
    width: '100%',
    height: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
});
