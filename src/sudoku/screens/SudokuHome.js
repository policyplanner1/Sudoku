import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import SudokuGame from './SudokuGame';

const SudokuHome = ({ username }) => {
  const [showWelcome, setShowWelcome] =
    useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {showWelcome && (
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeText}>
            Welcome back, {username}!
          </Text>
        </View>
      )}

      <SudokuGame />
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeBox: {
    position: 'absolute',

    top: 50,
    alignSelf: 'center',

    zIndex: 999,

    backgroundColor:
      'rgba(0,0,0,0.7)',

    paddingHorizontal: 20,
    paddingVertical: 12,

    borderRadius: 12,
  },

  welcomeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SudokuHome;