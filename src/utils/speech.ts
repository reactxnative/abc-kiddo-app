import * as Speech from 'expo-speech';

export interface SpeechSettings {
  pitch: number; // default: 1.2
  rate: number;  // default: 0.85
}

export const defaultSpeechSettings: SpeechSettings = {
  pitch: 1.2,  // Slightly higher pitch sounds more cartoonish/friendly
  rate: 0.85,  // Slightly slower rate is easier for toddlers to follow
};

/**
 * Speaks the given text using expo-speech with child-friendly defaults.
 */
export const speakText = async (
  text: string,
  settings: SpeechSettings = defaultSpeechSettings
) => {
  try {
    // Stop any ongoing speech first so they don't overlap
    const isSpeaking = await Speech.isSpeakingAsync();
    if (isSpeaking) {
      await Speech.stop();
    }
    
    Speech.speak(text, {
      language: 'en',
      pitch: settings.pitch,
      rate: settings.rate,
    });
  } catch (error) {
    console.warn('Speech synthesis failed:', error);
  }
};

/**
 * Stops any ongoing speech.
 */
export const stopSpeech = async () => {
  try {
    await Speech.stop();
  } catch (error) {
    console.warn('Failed to stop speech:', error);
  }
};
