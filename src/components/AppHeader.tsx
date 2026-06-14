import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  stars?: number;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ title = 'Hi Kiddo 👋', subtitle = "Let's Learn & Play", stars = 0 }) => {
  return (
    <LinearGradient colors={['#ffffff00', '#F8FAFC']} style={styles.header}>
      <View style={styles.left}>
        <View style={styles.logoWrap}>
          <Text style={styles.logoEmoji}>🌈</Text>
        </View>
      </View>

      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>

      <View style={styles.right}>
        <View style={styles.starBox}>
          <Text style={styles.starText}>⭐</Text>
          <Text style={styles.starCount}>{stars}</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'ios' ? 8 : 12,
    paddingBottom: 8,
  },
  left: {
    width: 56,
    alignItems: 'flex-start',
  },
  logoWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  logoEmoji: {
    fontSize: 26,
  },
  center: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#7C3AED',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '700',
  },
  right: {
    width: 56,
    alignItems: 'flex-end',
  },
  starBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  starText: {
    fontSize: 18,
    marginRight: 6,
  },
  starCount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
});
