import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen'; // Official Import
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppSettingsProvider } from '../src/utils/settingsStore';

// OFFICIAL: Must be invoked in the global scope without awaiting
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Hide the native splash window only after your components mount cleanly
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppSettingsProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="alphabet" />
            <Stack.Screen name="tracing" />
            <Stack.Screen name="quiz" />
            <Stack.Screen name="result" />
            <Stack.Screen name="animals" />
            <Stack.Screen name="numbers" />
            <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AppSettingsProvider>
    </GestureHandlerRootView>
  );
}