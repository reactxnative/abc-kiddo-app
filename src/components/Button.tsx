import React from 'react';
import { StyleSheet, Text, Pressable, ViewStyle, TextStyle, StyleProp } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'purple';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.9, { damping: 8, stiffness: 400 });
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1, { damping: 8, stiffness: 400 });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          container: styles.secondaryContainer,
          shadow: styles.secondaryShadow,
          text: styles.secondaryText,
        };
      case 'success':
        return {
          container: styles.successContainer,
          shadow: styles.successShadow,
          text: styles.successText,
        };
      case 'danger':
        return {
          container: styles.dangerContainer,
          shadow: styles.dangerShadow,
          text: styles.dangerText,
        };
      case 'purple':
        return {
          container: styles.purpleContainer,
          shadow: styles.purpleShadow,
          text: styles.purpleText,
        };
      case 'primary':
      default:
        return {
          container: styles.primaryContainer,
          shadow: styles.primaryShadow,
          text: styles.primaryText,
        };
    }
  };

  const { container, shadow, text } = getVariantStyles();

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[styles.buttonWrapper, style]}
    >
      <Animated.View style={[styles.shadowLayer, shadow]} />
      <Animated.View
        style={[
          styles.buttonContainer,
          container,
          animatedStyle,
          disabled && styles.disabledContainer,
        ]}
      >
        <Text style={[styles.buttonText, text, textStyle, disabled && styles.disabledText]}>
          {title}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    position: 'relative',
    height: 64,
    marginVertical: 8,
    width: '100%',
  },
  shadowLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 6,
    bottom: -6,
    borderRadius: 30,
  },
  buttonContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  buttonText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'System', // Will fall back to system, but look rounded on iOS
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 2,
  },
  // Primary (Blue)
  primaryContainer: {
    backgroundColor: '#38bdf8', // sky-400
  },
  primaryShadow: {
    backgroundColor: '#0369a1', // sky-700
  },
  primaryText: {
    color: '#ffffff',
  },
  // Secondary (Orange)
  secondaryContainer: {
    backgroundColor: '#f97316', // orange-500
  },
  secondaryShadow: {
    backgroundColor: '#c2410c', // orange-700
  },
  secondaryText: {
    color: '#ffffff',
  },
  // Success (Green)
  successContainer: {
    backgroundColor: '#4ade80', // green-400
  },
  successShadow: {
    backgroundColor: '#15803d', // green-700
  },
  successText: {
    color: '#ffffff',
  },
  // Danger (Red/Pink)
  dangerContainer: {
    backgroundColor: '#f43f5e', // rose-500
  },
  dangerShadow: {
    backgroundColor: '#be123c', // rose-700
  },
  dangerText: {
    color: '#ffffff',
  },
  // Purple
  purpleContainer: {
    backgroundColor: '#a78bfa', // violet-400
  },
  purpleShadow: {
    backgroundColor: '#6d28d9', // violet-700
  },
  purpleText: {
    color: '#ffffff',
  },
  // Disabled
  disabledContainer: {
    backgroundColor: '#cbd5e1',
    borderColor: '#e2e8f0',
  },
  disabledText: {
    color: '#94a3b8',
  },
});
