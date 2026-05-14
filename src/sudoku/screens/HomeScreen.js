import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import LinearGradient from 'react-native-linear-gradient';

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

const HomeScreen = ({ username, userId }) => {
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
    }, 4000);

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
        item => item.user_id === userId,
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

  const totalPoints =
    leaderboard.find(item => item.username === username)?.total_points || 0;

  if (loading) {
    return <GameLoader text="Loading profile..." />;
  }

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
    <>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#081120', '#111b35', '#1a2340']}
        style={styles.container}
      >
        {/* Glow Effects */}
        <View style={styles.glow1} />
        <View style={styles.glow2} />

        {/* Welcome */}
        <View style={styles.topSection}>
          {showWelcome && (
            <View style={styles.welcomeBox}>
              <Text style={styles.welcomeText}>
                🔥 Welcome back, {username}
              </Text>
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>RANK</Text>

              <Text style={styles.statValue}>#{userRank || '--'}</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statLabel}>POINTS</Text>

              <Text style={styles.statValue}>{totalPoints}</Text>
            </View>
          </View>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.logo}>SUDOKU</Text>

          <Text style={styles.subtitle}>
            Train your brain daily
          </Text>
        </View>

        {/* Difficulty */}
        <View style={styles.difficultyWrapper}>
          <Text style={styles.sectionTitle}>
            SELECT DIFFICULTY
          </Text>

          <View style={styles.difficultyContainer}>
            {difficulties.map(level => {
              const selected = selectedDifficulty === level;

              return (
                <TouchableOpacity
                  key={level}
                  activeOpacity={0.85}
                  style={[
                    styles.difficultyButton,

                    selected && {
                      backgroundColor: getDifficultyColor(level),

                      borderColor: getDifficultyColor(level),

                      transform: [{ scale: 1.05 }],
                    },
                  ]}
                  onPress={() => setSelectedDifficulty(level)}
                >
                  <Text style={styles.difficultyText}>
                    {level.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.mainButton}
            onPress={async () => {
              await AsyncStorage.removeItem('savedSudokuGame');

              setSavedGame(null);

              setResumeMode(false);

              setStartGame(true);
            }}
          >
            <Text style={styles.mainButtonText}>
              ▶ NEW GAME
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={[
              styles.secondaryButton,

              !savedGame && {
                opacity: 0.4,
              },
            ]}
            disabled={!savedGame}
            onPress={() => {
              setResumeMode(true);

              setStartGame(true);
            }}
          >
            <Text style={styles.secondaryButtonText}>
              ⏸ RESUME GAME
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>
              🏆 LEADERBOARD
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.rpBadge}>
          <Text style={styles.rpBadgeText}>
            Powered By RP
          </Text>
        </View>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'space-between',

    paddingTop: 70,

    paddingBottom: 35,

    paddingHorizontal: 20,
  },

  glow1: {
    position: 'absolute',

    width: 240,
    height: 240,

    borderRadius: 120,

    backgroundColor: 'rgba(79,124,255,0.18)',

    top: -50,
    right: -60,
  },

  glow2: {
    position: 'absolute',

    width: 200,
    height: 200,

    borderRadius: 100,

    backgroundColor: 'rgba(255,59,48,0.10)',

    bottom: 100,
    left: -50,
  },

  topSection: {
    width: '100%',

    alignItems: 'center',
  },

  welcomeBox: {
    backgroundColor: 'rgba(91,127,255,0.16)',

    borderWidth: 1,

    borderColor: 'rgba(91,127,255,0.30)',

    paddingHorizontal: 20,

    paddingVertical: 12,

    borderRadius: 18,

    marginBottom: 22,
  },

  welcomeText: {
    color: '#fff',

    fontSize: 16,

    fontWeight: '700',
  },

  statsRow: {
    flexDirection: 'row',
  },

  statCard: {
    width: 145,

    backgroundColor: 'rgba(255,255,255,0.08)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.08)',

    borderRadius: 24,

    paddingVertical: 20,

    marginHorizontal: 8,

    alignItems: 'center',
  },

  statLabel: {
    color: 'rgba(255,255,255,0.55)',

    fontSize: 12,

    letterSpacing: 2,

    fontWeight: '700',
  },

  statValue: {
    color: '#fff',

    fontSize: 30,

    fontWeight: '900',

    marginTop: 10,
  },

  heroSection: {
    alignItems: 'center',
  },

  logo: {
    color: '#fff',

    fontSize: 54,

    fontWeight: '900',

    letterSpacing: 6,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.7)',

    fontSize: 16,

    marginTop: 10,
  },

  difficultyWrapper: {
    alignItems: 'center',
  },

  sectionTitle: {
    color: 'rgba(255,255,255,0.55)',

    fontSize: 13,

    fontWeight: '700',

    letterSpacing: 2,

    marginBottom: 18,
  },

  difficultyContainer: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'center',
  },

  difficultyButton: {
    paddingHorizontal: 18,

    paddingVertical: 12,

    borderRadius: 30,

    marginHorizontal: 6,

    marginBottom: 12,

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.1)',

    backgroundColor: 'rgba(255,255,255,0.05)',
  },

  difficultyText: {
    color: '#fff',

    fontSize: 13,

    fontWeight: '800',

    letterSpacing: 1,
  },

  buttonSection: {
    width: '100%',

    alignItems: 'center',
  },

  mainButton: {
    width: '85%',

    backgroundColor: '#5b7fff',

    paddingVertical: 18,

    borderRadius: 24,

    alignItems: 'center',

    marginBottom: 18,

    shadowColor: '#5b7fff',

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.35,

    shadowRadius: 12,

    elevation: 10,
  },

  mainButtonText: {
    color: '#fff',

    fontSize: 18,

    fontWeight: '900',

    letterSpacing: 1,
  },

  secondaryButton: {
    width: '85%',

    backgroundColor: 'rgba(255,255,255,0.06)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.08)',

    paddingVertical: 18,

    borderRadius: 24,

    alignItems: 'center',

    marginBottom: 14,
  },

  secondaryButtonText: {
    color: '#fff',

    fontSize: 16,

    fontWeight: '800',

    letterSpacing: 1,
  },

  rpBadge: {
    backgroundColor: 'rgba(255,255,255,0.10)',

    borderWidth: 1,

    borderColor: 'rgba(255,255,255,0.08)',

    paddingHorizontal: 16,

    paddingVertical: 10,

    borderRadius: 30,
  },

  rpBadgeText: {
    color: '#fff',

    fontSize: 12,

    fontWeight: '800',

    letterSpacing: 1,
  },
});

export default HomeScreen;