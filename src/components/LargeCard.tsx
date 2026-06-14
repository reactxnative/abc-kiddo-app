import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';

interface LargeCardProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  gradient?: [string, string];
  onPress?: (e: GestureResponderEvent) => void;
}

export const LargeCard: React.FC<LargeCardProps> = ({ title, subtitle, emoji = '🔤', gradient = ['#7C3AED', '#FB7185'], onPress }) => {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.95 : 1 }] }>
      <LinearGradient colors={gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
        <View style={styles.emojiWrap}><Text style={styles.emoji}>{emoji}</Text></View>
        <View style={styles.textWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <View style={styles.ctaWrap}>
          <Text style={styles.cta}>Start ▶️</Text>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 140,
    borderRadius: 24,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 6,
  },
  emojiWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 40,
  },
  textWrap: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
  },
  subtitle: {
    fontSize: 12,
    color: '#fff',
    marginTop: 6,
    opacity: 0.95,
    fontWeight: '700',
  },
  ctaWrap: {
    width: 76,
    alignItems: 'flex-end',
  },
  cta: {
    fontSize: 14,
    fontWeight: '900',
    color: '#fff',
  },
});
