import React, {
  useEffect,
  useState,
} from 'react';

import { StatusBar } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import WelcomeScreen from './src/sudoku/screens/WelcomeScreen';

import HomeScreen from './src/sudoku/screens/HomeScreen';

function App() {
  const [username, setUsername] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const storedUser =
        await AsyncStorage.getItem(
          'username',
        );

      if (storedUser) {
        setUsername(storedUser);
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  if (loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />

        {!username ? (
          <WelcomeScreen
            onComplete={setUsername}
          />
        ) : (
          <HomeScreen username={username} />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;