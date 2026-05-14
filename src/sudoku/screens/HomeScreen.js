import React, { useEffect, useState } from 'react';

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { getLeaderboard } from '../services/sudokuApi';

import GameLoader from '../components/GameLoader';

import SudokuGame from './SudokuGame';

const difficulties = ['easy', 'medium', 'hard', 'expert'];

const getDifficultyColor = level => {
  switch (level) {
    case 'easy':
      return '#34c759';

    case 'medium':
      return '#007aff';

    case 'hard':
      return '#ff9500';

    case 'expert':
      return '#ff3b30';

    default:
      return '#4f7cff';
  }
};

const HomeScreen = ({ username }) => {
  const [showWelcome, setShowWelcome] = useState(true);

  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');

  const [startGame, setStartGame] = useState(false);

  const [savedGame, setSavedGame] = useState(null);

  const [resumeMode, setResumeMode] = useState(false);

  const [loading, setLoading] = useState(true);

  const [leaderboard, setLeaderboard] = useState([]);

  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    checkSavedGame();

    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await getLeaderboard();

      setLeaderboard(response.leaderboard);

      const rank = response.leaderboard.findIndex(
        item => item.username === username,
      );

      if (rank !== -1) {
        setUserRank(rank + 1);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkSavedGame = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedSudokuGame');

      if (saved) {
        setSavedGame(JSON.parse(saved));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <GameLoader text="Loading profile..." />;
  }

  // Start Sudoku Game
  if (startGame) {
    return (
      <SudokuGame
        username={username}
        difficulty={selectedDifficulty}
        savedGame={resumeMode ? savedGame : null}
        onGoHome={async () => {
          setStartGame(false);

          await checkSavedGame();

          await loadLeaderboard();
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.rpBadge}>
        <Text style={styles.rpBadgeText}>Powered By RP</Text>
      </View>
      {/* Welcome Message */}
      <View style={styles.topInfoContainer}>
        {showWelcome && (
          <View style={styles.welcomeBox}>
            <Text style={styles.welcomeText}>Welcome back, {username}!</Text>
          </View>
        )}

        <View style={styles.rankContainer}>
          <Text style={styles.rankText}>🏆 Rank #{userRank || '--'}</Text>

          <Text style={styles.pointsText}>
            ⭐{' '}
            {leaderboard.find(item => item.username === username)
              ?.total_points || 0}{' '}
            Points
          </Text>
        </View>
      </View>

      {/* Game Logo */}
      <Text style={styles.logo}># Sudoku</Text>

      {/* Difficulty Selector */}
      <View style={styles.difficultyContainer}>
        {difficulties.map(level => (
          <TouchableOpacity
            key={level}
            style={[
              styles.difficultyButton,

              // selectedDifficulty === level && styles.selectedDifficulty,
              selectedDifficulty === level && {
                backgroundColor: getDifficultyColor(level),
              },
            ]}
            onPress={() => setSelectedDifficulty(level)}
          >
            <Text style={styles.difficultyText}>{level.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* New Game Button */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={async () => {
          await AsyncStorage.removeItem('savedSudokuGame');

          setSavedGame(null);

          setResumeMode(false);

          setStartGame(true);
        }}
      >
        <Text style={styles.mainButtonText}>New Game</Text>
      </TouchableOpacity>

      {/* Resume Button */}
      <TouchableOpacity
        style={[styles.secondaryButton, !savedGame && { opacity: 0.5 }]}
        disabled={!savedGame}
        onPress={() => {
          setResumeMode(true);
          setStartGame(true);
        }}
      >
        <Text style={styles.secondaryButtonText}>Resume Game</Text>
      </TouchableOpacity>

      {/* Leaderboard */}
      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.secondaryButtonText}>Leaderboard</Text>
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

    backgroundColor: 'rgba(255,255,255,0.1)',

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

    backgroundColor: 'rgba(255,255,255,0.1)',

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
    borderColor: 'rgba(255,255,255,0.2)',

    paddingVertical: 16,

    borderRadius: 16,

    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  rpBadge: {
    position: 'absolute',

    bottom: 30,
    right: 20,

    backgroundColor: 'rgba(255,255,255,0.12)',

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 20,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  rpBadgeText: {
    color: '#fff',

    fontSize: 12,
    fontWeight: '700',

    letterSpacing: 1,
  },

  rankText: {
    color: '#fff',

    fontSize: 16,
    fontWeight: '700',
  },

  topInfoContainer: {
    position: 'absolute',

    top: 50,

    alignItems: 'center',
  },

  rankContainer: {
    marginTop: 14,

    backgroundColor: 'rgba(255,255,255,0.08)',

    paddingHorizontal: 20,
    paddingVertical: 12,

    borderRadius: 16,

    alignItems: 'center',
  },

  pointsText: {
    color: 'rgba(255,255,255,0.8)',

    fontSize: 14,

    marginTop: 4,
  },
});

export default HomeScreen;
