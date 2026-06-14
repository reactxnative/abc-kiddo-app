import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Switch, TextInput, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useAppSettings } from '../utils/settingsStore';
import { defaultSpeechSettings } from '../utils/speech';

export default function SettingsScreen() {
  const router = useRouter();
  const { speechSettings, updateSpeechSettings, soundEnabled, setSoundEnabled } = useAppSettings();

  // Parental Gate State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [numA, setNumA] = useState(0);
  const [numB, setNumB] = useState(0);
  const [parentAnswer, setParentAnswer] = useState('');
  const [gateError, setGateError] = useState(false);

  // Generate random addition gate
  useEffect(() => {
    setNumA(Math.floor(Math.random() * 8) + 3); // 3 to 10
    setNumB(Math.floor(Math.random() * 8) + 2); // 2 to 9
  }, []);

  const verifyGate = () => {
    const correctSum = numA + numB;
    if (parseInt(parentAnswer) === correctSum) {
      setIsUnlocked(true);
      setGateError(false);
    } else {
      setGateError(true);
      setParentAnswer('');
    }
  };

  const handlePitchSelect = (pitch: number) => {
    updateSpeechSettings({ pitch });
  };

  const handleRateSelect = (rate: number) => {
    updateSpeechSettings({ rate });
  };

  const handleReset = () => {
    updateSpeechSettings(defaultSpeechSettings);
    setSoundEnabled(true);
  };

  // Parental Gate View
  if (!isUnlocked) {
    return (
      <SafeAreaView style={styles.gateContainer}>
        <Card style={styles.gateCard} borderRadius={36} gradientColors={['#fffbeb', '#fef3c7']}>
          <Ionicons name="lock-closed" size={54} color="#d97706" />
          <Text style={styles.gateTitle}>Parents Only Zone</Text>
          <Text style={styles.gateInstruction}>
            To unlock settings, please solve this math problem:
          </Text>
          
          <Text style={styles.gateMathText}>
            {numA} + {numB} = ?
          </Text>

          <TextInput
            style={[styles.gateInput, gateError && styles.gateInputError]}
            keyboardType="number-pad"
            value={parentAnswer}
            onChangeText={setParentAnswer}
            placeholder="Enter answer"
            maxLength={3}
            placeholderTextColor="#a1a1aa"
          />

          {gateError && <Text style={styles.errorText}>Incorrect answer, try again! 🔒</Text>}

          <View style={styles.gateBtnWrapper}>
            <Button title="Unlock Settings" onPress={verifyGate} variant="success" />
            <Button title="Close" onPress={() => router.back()} variant="primary" />
          </View>
        </Card>
      </SafeAreaView>
    );
  }

  // Settings Panel View
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Settings</Text>
        <Card
          onPress={() => router.back()}
          style={styles.closeBtn}
          borderRadius={16}
          width={48}
          height={48}
        >
          <Ionicons name="close" size={24} color="#64748b" />
        </Card>
      </View>

      <View style={styles.settingsList}>
        {/* Toggle Sound */}
        <Card style={styles.settingItem} borderRadius={24}>
          <View style={styles.settingRow}>
            <View style={styles.settingMeta}>
              <Ionicons name="volume-high" size={28} color="#4f46e5" />
              <View style={styles.settingTexts}>
                <Text style={styles.settingLabel}>Pronunciation Voice</Text>
                <Text style={styles.settingSub}>Speak letters and animals</Text>
              </View>
            </View>
            <Switch
              value={soundEnabled}
              onValueChange={setSoundEnabled}
              trackColor={{ false: '#cbd5e1', true: '#a78bfa' }}
              thumbColor={soundEnabled ? '#6d28d9' : '#f1f5f9'}
            />
          </View>
        </Card>

        {/* Pitch Controls */}
        <Card style={styles.settingItem} borderRadius={24}>
          <Text style={styles.sectionTitle}>Voice Pitch</Text>
          <Text style={styles.sectionSub}>Make the voice sound lower or higher</Text>
          
          <View style={styles.buttonGroup}>
            <PressableOption
              label="Deep 🦁"
              selected={speechSettings.pitch === 0.8}
              onPress={() => handlePitchSelect(0.8)}
            />
            <PressableOption
              label="Normal 🚶"
              selected={speechSettings.pitch === 1.0}
              onPress={() => handlePitchSelect(1.0)}
            />
            <PressableOption
              label="High/Cute 🐥"
              selected={speechSettings.pitch === 1.25}
              onPress={() => handlePitchSelect(1.25)}
            />
          </View>
        </Card>

        {/* Rate Controls */}
        <Card style={styles.settingItem} borderRadius={24}>
          <Text style={styles.sectionTitle}>Speech Speed</Text>
          <Text style={styles.sectionSub}>How fast the guide speaks</Text>
          
          <View style={styles.buttonGroup}>
            <PressableOption
              label="Slow 🐢"
              selected={speechSettings.rate === 0.7}
              onPress={() => handleRateSelect(0.7)}
            />
            <PressableOption
              label="Normal 🚶"
              selected={speechSettings.rate === 0.9}
              onPress={() => handleRateSelect(0.9)}
            />
            <PressableOption
              label="Fast 🚀"
              selected={speechSettings.rate === 1.15}
              onPress={() => handleRateSelect(1.15)}
            />
          </View>
        </Card>

        {/* Reset settings button */}
        <View style={styles.resetWrapper}>
          <Button
            title="Reset to Default"
            onPress={handleReset}
            variant="danger"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

// Option selector sub-component
interface PressableOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const PressableOption: React.FC<PressableOptionProps> = ({ label, selected, onPress }) => {
  return (
    <Card
      onPress={onPress}
      borderRadius={16}
      backgroundColor={selected ? '#e0e7ff' : '#f8fafc'}
      style={[styles.optionCard, selected && styles.optionCardSelected]}
    >
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {label}
      </Text>
    </Card>
  );
};

const styles = StyleSheet.create({
  gateContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  gateCard: {
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gateTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#92400e',
    marginVertical: 10,
    fontFamily: Platform.OS === 'ios' ? 'Cooper Black' : 'System',
  },
  gateInstruction: {
    fontSize: 15,
    color: '#78350f',
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: '600',
  },
  gateMathText: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#d97706',
    marginVertical: 10,
  },
  gateInput: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#d97706',
    borderRadius: 20,
    width: '60%',
    height: 54,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 15,
  },
  gateInputError: {
    borderColor: '#f43f5e',
    backgroundColor: '#fff1f2',
  },
  errorText: {
    color: '#f43f5e',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  gateBtnWrapper: {
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  headerSpacer: {
    width: 48,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1e293b',
    fontFamily: Platform.OS === 'ios' ? 'Cooper Black' : 'System',
  },
  closeBtn: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsList: {
    flex: 1,
    marginTop: 15,
    gap: 15,
  },
  settingItem: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingTexts: {
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  settingSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  optionCard: {
    flex: 1,
    height: 48,
    borderWidth: 2,
    borderColor: '#f1f5f9',
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: '#6366f1',
  },
  optionText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
  },
  optionTextSelected: {
    color: '#4338ca',
  },
  resetWrapper: {
    marginTop: 'auto',
    marginBottom: Platform.OS === 'ios' ? 10 : 20,
  },
});
