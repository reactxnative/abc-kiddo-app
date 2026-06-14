import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '../components/AppHeader';
import { BottomDecor } from '../components/BottomDecor';
import { Card } from '../components/Card';
import { ProgressBar } from '../components/ProgressBar';
import { alphabetData } from '../data/alphabetData';
import { animalsData } from '../data/animalsData';
import { useAppSettings } from '../utils/settingsStore';
import { speakText } from '../utils/speech';

interface Question {
  type: 'word-to-emoji' | 'letter-to-emoji' | 'emoji-to-word';
  prompt: string;
  displayValue: string; // The primary thing shown (e.g. "A", "Apple", "🦁")
  correctAnswer: string; // The correct option
  options: string[]; // 4 options
}

export default function QuizScreen() {
  const router = useRouter();
  const { speechSettings, soundEnabled } = useAppSettings();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasAnsweredCurrent, setHasAnsweredCurrent] = useState(false);
  const [stars, setStars] = useState<string[]>([]); // Visual stars list e.g., ['⭐']

  // Shake animation for incorrect answer
  const shakeOffset = useSharedValue(0);

  const shakeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeOffset.value }],
    };
  });

  const triggerShake = () => {
    shakeOffset.value = withSequence(
      withTiming(-15, { duration: 60 }),
      withTiming(15, { duration: 60 }),
      withTiming(-15, { duration: 60 }),
      withTiming(15, { duration: 60 }),
      withTiming(-10, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };

  // Generate 5 random questions
  useEffect(() => {
    const generateQuestions = (): Question[] => {
      const generated: Question[] = [];
      const pool = [...alphabetData];
      const animalPool = [...animalsData];

      // We will make 3 alphabet-based and 2 animal-based questions
      for (let i = 0; i < 5; i++) {
        const isAnimalQ = i >= 3;
        
        if (isAnimalQ) {
          // Animal question
          const target = animalPool[Math.floor(Math.random() * animalPool.length)];
          const type = Math.random() > 0.5 ? 'emoji-to-word' : 'word-to-emoji';
          
          // Generate distractors
          const distractors = animalPool
            .filter((a) => a.id !== target.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

          if (type === 'emoji-to-word') {
            const options = [target.name, ...distractors.map((d) => d.name)].sort(() => 0.5 - Math.random());
            generated.push({
              type,
              prompt: 'What animal is this?',
              displayValue: target.emoji,
              correctAnswer: target.name,
              options,
            });
          } else {
            const options = [target.emoji, ...distractors.map((d) => d.emoji)].sort(() => 0.5 - Math.random());
            generated.push({
              type,
              prompt: `Find the ${target.name}!`,
              displayValue: target.name,
              correctAnswer: target.emoji,
              options,
            });
          }
        } else {
          // Alphabet question
          const target = pool[Math.floor(Math.random() * pool.length)];
          const types: Question['type'][] = ['word-to-emoji', 'letter-to-emoji'];
          const type = types[Math.floor(Math.random() * types.length)];

          const distractors = pool
            .filter((p) => p.letter !== target.letter)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

          if (type === 'word-to-emoji') {
            const options = [target.emoji, ...distractors.map((d) => d.emoji)].sort(() => 0.5 - Math.random());
            generated.push({
              type,
              prompt: `Which one is the ${target.word}?`,
              displayValue: target.word,
              correctAnswer: target.emoji,
              options,
            });
          } else {
            // letter-to-emoji
            const options = [target.emoji, ...distractors.map((d) => d.emoji)].sort(() => 0.5 - Math.random());
            generated.push({
              type,
              prompt: `Which one starts with "${target.letter}"?`,
              displayValue: target.letter,
              correctAnswer: target.emoji,
              options,
            });
          }
        }
      }
      return generated;
    };

    setQuestions(generateQuestions());
  }, []);

  const currentQuestion = questions[currentQIndex];

  // Play question speech when question changes
  useEffect(() => {
    if (currentQuestion && soundEnabled) {
      const qText = currentQuestion.prompt === 'What animal is this?' 
        ? 'What animal is this?' 
        : currentQuestion.prompt;
      
      const valText = currentQuestion.type === 'emoji-to-word' ? '' : currentQuestion.displayValue;
      speakText(`${qText} ${valText}`, speechSettings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQIndex, questions]);

  const handleOptionPress = (option: string) => {
    if (hasAnsweredCurrent) return;

    setSelectedOption(option);
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setHasAnsweredCurrent(true);

    if (correct) {
      setScore((prev) => prev + 1);
      setStars((prev) => [...prev, '⭐']);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (soundEnabled) {
        speakText('Yay! Correct job!', speechSettings);
      }
      
      // Move to next question after delay
      setTimeout(() => {
        advanceQuestion();
      }, 1800);
    } else {
      triggerShake();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      if (soundEnabled) {
        speakText(`Oops! That's not it. Let's try again!`, speechSettings);
      }
      
      // Reset after delay to let them try again
      setTimeout(() => {
        setSelectedOption(null);
        setIsCorrect(null);
        setHasAnsweredCurrent(false);
      }, 1500);
    }
  };

  const advanceQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setHasAnsweredCurrent(false);
    
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex((prev) => prev + 1);
    } else {
      // Completed, route to result
      const finalScore = score + 1; // Add 1 because state hasn't updated yet in this tick
      router.replace({
        pathname: '/result',
        params: { score: finalScore, total: questions.length },
      });
    }
  };

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Quiz...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <AppHeader title={"Hi Kiddo 👋"} subtitle={"Quiz Time"} stars={0} />
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
        <Text style={styles.headerTitle}>Quiz Time</Text>
        <View style={styles.starsContainer}>
          {stars.map((star, i) => (
            <Text key={i} style={styles.starText}>{star}</Text>
          ))}
        </View>
      </View>

      {/* Progress Track */}
      <ProgressBar current={currentQIndex + 1} total={questions.length} emoji="🏆" color="#fbbf24" />

      {/* Question Card */}
      <View style={styles.questionCardContainer}>
        <Card borderRadius={32} style={styles.questionCard} gradientColors={['#fffbeb', '#fef3c7']}>
          <Text style={styles.promptText}>{currentQuestion.prompt}</Text>
          
          <Text style={[
            styles.displayText, 
            currentQuestion.type === 'emoji-to-word' ? styles.largeEmoji : styles.largeText
          ]}>
            {currentQuestion.displayValue}
          </Text>
        </Card>
      </View>

      {/* Multiple Choice Options */}
      <Animated.View style={[styles.optionsGrid, isCorrect === false && shakeStyle]}>
        {currentQuestion.options.map((option, idx) => {
          const isSelected = selectedOption === option;
          let cardBg = '#ffffff';
          let borderCol = '#cbd5e1';

          if (isSelected) {
            if (isCorrect) {
              cardBg = '#dcfce7'; // green-100
              borderCol = '#4ade80';
            } else if (isCorrect === false) {
              cardBg = '#ffe4e6'; // red-100
              borderCol = '#f43f5e';
            }
          }

          return (
            <View key={idx} style={styles.gridItem}>
              <Card
                onPress={() => handleOptionPress(option)}
                borderRadius={24}
                backgroundColor={cardBg}
                style={[styles.optionCard, { borderColor: borderCol, borderWidth: 3 }]}
              >
                <Text style={[
                  styles.optionText, 
                  option.length <= 2 ? styles.emojiOptionText : styles.wordOptionText
                ]}>
                  {option}
                </Text>
              </Card>
            </View>
          );
        })}
      </Animated.View>
      <BottomDecor />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#64748b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  backBtn: {
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#f59e0b',
    fontFamily: Platform.OS === 'ios' ? 'Cooper Black' : 'System',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 48,
    justifyContent: 'flex-end',
    gap: 4,
  },
  starText: {
    fontSize: 20,
  },
  questionCardContainer: {
    flex: 1.1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  questionCard: {
    height: '100%',
    width: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 2,
    borderColor: '#fde68a',
  },
  promptText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#78350f',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Cooper Black' : 'System',
  },
  displayText: {
    fontWeight: '900',
    color: '#1e293b',
    textAlign: 'center',
  },
  largeText: {
    fontSize: 54,
    fontFamily: Platform.OS === 'ios' ? 'Cooper Black' : 'System',
  },
  largeEmoji: {
    fontSize: 100,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: Platform.OS === 'ios' ? 15 : 25,
    marginTop: 10,
  },
  gridItem: {
    width: '50%',
    padding: 8,
  },
  optionCard: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOpacity: 0.05,
    elevation: 3,
  },
  optionText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emojiOptionText: {
    fontSize: 48,
  },
  wordOptionText: {
    fontSize: 24,
    color: '#1e293b',
    fontFamily: Platform.OS === 'ios' ? 'Cooper Black' : 'System',
  },
});
