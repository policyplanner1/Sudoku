import React from 'react';

import { StatusBar } from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import SudokuHome from './src/sudoku/screens/SudokuHome';

function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" />

        <SudokuHome />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default App;