import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const BottomDecor: React.FC = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.row}>
        <Text style={styles.cloud}>☁️</Text>
        <Text style={styles.star}>✨</Text>
        <Text style={styles.animal}>🐶</Text>
        <Text style={styles.animal}>🐵</Text>
        <Text style={styles.star}>⭐</Text>
        <Text style={styles.cloud}>☁️</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    opacity: 0.9,
  },
  cloud: {
    fontSize: 28,
    opacity: 0.9,
  },
  star: {
    fontSize: 22,
    color: '#FACC15',
  },
  animal: {
    fontSize: 34,
  },
});
