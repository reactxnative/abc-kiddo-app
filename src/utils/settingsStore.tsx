import React, { createContext, useContext, useState } from 'react';
import { SpeechSettings, defaultSpeechSettings } from './speech';

interface AppSettingsContextType {
  speechSettings: SpeechSettings;
  updateSpeechSettings: (settings: Partial<SpeechSettings>) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export const AppSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [speechSettings, setSpeechSettings] = useState<SpeechSettings>(defaultSpeechSettings);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const updateSpeechSettings = (newSettings: Partial<SpeechSettings>) => {
    setSpeechSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  return (
    <AppSettingsContext.Provider
      value={{
        speechSettings,
        updateSpeechSettings,
        soundEnabled,
        setSoundEnabled,
      }}
    >
      {children}
    </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within an AppSettingsProvider');
  }
  return context;
};
