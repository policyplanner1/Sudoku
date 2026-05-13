import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import SudokuGame from './SudokuGame';

const difficulties = [
  'easy',
  'medium',
  'hard',
];

const HomeScreen = ({ username }) => {
  const [showWelcome, setShowWelcome] =
    useState(true);

  const [selectedDifficulty, setSelectedDifficulty] =
    useState('medium');

  const [startGame, setStartGame] =
    useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Start Sudoku Game
  if (startGame) {
    return (
      <SudokuGame
        difficulty={selectedDifficulty}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Welcome Message */}
      {showWelcome && (
        <View style={styles.welcomeBox}>
          <Text style={styles.welcomeText}>
            Welcome back, {username}!
          </Text>
        </View>
      )}

      {/* Game Logo */}
      <Text style={styles.logo}>
        # Sudoku
      </Text>

      {/* Difficulty Selector */}
      <View style={styles.difficultyContainer}>
        {difficulties.map(level => (
          <TouchableOpacity
            key={level}
            style={[
              styles.difficultyButton,

              selectedDifficulty === level &&
                styles.selectedDifficulty,
            ]}
            onPress={() =>
              setSelectedDifficulty(level)
            }
          >
            <Text
              style={styles.difficultyText}
            >
              {level.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* New Game Button */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => setStartGame(true)}
      >
        <Text style={styles.mainButtonText}>
          New Game
        </Text>
      </TouchableOpacity>

      {/* Resume Button */}
      <TouchableOpacity
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>
          Resume
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#0b1020',

    paddingHorizontal: 20,
  },

  welcomeBox: {
    position: 'absolute',

    top: 50,

    backgroundColor:
      'rgba(255,255,255,0.1)',

    paddingHorizontal: 20,
    paddingVertical: 12,

    borderRadius: 12,
  },

  welcomeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',

    marginBottom: 50,
  },

  difficultyContainer: {
    flexDirection: 'row',

    marginBottom: 40,
  },

  difficultyButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,

    borderRadius: 12,

    backgroundColor:
      'rgba(255,255,255,0.1)',

    marginHorizontal: 8,
  },

  selectedDifficulty: {
    backgroundColor: '#4f7cff',
  },

  difficultyText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  mainButton: {
    width: '80%',

    backgroundColor: '#4f7cff',

    paddingVertical: 16,

    borderRadius: 16,

    alignItems: 'center',

    marginBottom: 20,
  },

  mainButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  secondaryButton: {
    width: '80%',

    borderWidth: 1,
    borderColor:
      'rgba(255,255,255,0.2)',

    paddingVertical: 16,

    borderRadius: 16,

    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;