import React, { useEffect, useState } from 'react';
import GameLoader from '../components/GameLoader';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import { THEMES } from '../themes/themeConfig';
import SudokuBoard from '../components/SudokuBoard';
import NumberPad from '../components/NumberPad';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { startSudokuGame, completeSudokuGame } from '../services/sudokuApi';

const SudokuGame = ({ difficulty = 'easy', savedGame, onGoHome }) => {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [fixedBoard, setFixedBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [timer, setTimer] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState('ocean');
  const currentTheme = THEMES[selectedTheme];
  const [isPaused, setIsPaused] = useState(false);
  const [history, setHistory] = useState([]);
  const [wrongCells, setWrongCells] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const activeDifficulty = savedGame?.difficulty || difficulty;
  const [gameLoaded, setGameLoaded] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  useEffect(() => {
    if (savedGame) {
      setGameId(savedGame.gameId);

      setGameLoaded(true);

      setBoard(savedGame.board);

      setSolution(savedGame.solution);

      setFixedBoard(savedGame.fixedBoard);

      setTimer(savedGame.timer);

      setSelectedTheme(savedGame.selectedTheme || 'ocean');

      setWrongCells(savedGame.wrongCells);
    } else {
      loadGame();
    }
  }, []);

  useEffect(() => {
    let interval;

    if (!isPaused && gameLoaded) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPaused, gameLoaded]);

  useEffect(() => {
    // const backAction = () => {
    //   Alert.alert('Leave Game?', 'Your progress is saved automatically.', [
    //     {
    //       text: 'Cancel',
    //       style: 'cancel',
    //     },
    //     {
    //       text: 'Go Home',
    //       onPress: () => {
    //         if (onGoHome) {
    //           onGoHome();
    //         }
    //       },
    //     },
    //   ]);

    //   return true;
    // };

    const backAction = () => {
      setShowExitModal(true);

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const getDifficultyColor = () => {
    switch (activeDifficulty) {
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

  const saveCurrentGame = async () => {
    try {
      const gameData = {
        board,
        solution,
        fixedBoard,
        timer,
        difficulty,
        selectedTheme,
        wrongCells,
        gameId,
      };

      await AsyncStorage.setItem('savedSudokuGame', JSON.stringify(gameData));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (board.length > 0) {
      saveCurrentGame();
    }
  }, [board, timer, wrongCells, selectedTheme]);

  const loadGame = async () => {
    try {
      const response = await startSudokuGame(activeDifficulty);

      setBoard(response.board.map(row => [...row]));

      setFixedBoard(response.board.map(row => [...row]));

      setSolution(response.solution);

      setGameId(response.game_id);

      setGameLoaded(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCellPress = (row, col) => {
    if (isPaused) return;
    if (fixedBoard[row][col] !== 0) return;

    setSelectedCell({ row, col });
  };

  const undoMove = () => {
    if (history.length === 0) return;

    const previousBoard = history[history.length - 1];

    setBoard(previousBoard);

    setHistory(prev => prev.slice(0, -1));
  };

  const handleNumberSelect = async number => {
    if (!selectedCell) return;
    if (isPaused) return;

    const { row, col } = selectedCell;

    const newBoard = board.map(r => [...r]);

    setHistory(prev => [...prev, board.map(r => [...r])]);

    newBoard[row][col] = number;

    setBoard(newBoard);

    const correctValue = solution[row][col];

    const cellKey = `${row}-${col}`;

    if (number !== correctValue) {
      setWrongCells(prev => [...prev.filter(c => c !== cellKey), cellKey]);
    } else {
      setWrongCells(prev => prev.filter(c => c !== cellKey));
    }

    checkCompletion(newBoard);
  };

  const resetGame = () => {
    setBoard(fixedBoard.map(row => [...row]));

    setSelectedCell(null);

    setTimer(0);

    setHistory([]);

    setIsPaused(false);
  };

  const eraseCell = () => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    // Prevent erasing fixed cells
    if (fixedBoard[row][col] !== 0) return;

    // Save history for undo
    setHistory(prev => [...prev, board.map(r => [...r])]);

    const newBoard = board.map(r => [...r]);

    newBoard[row][col] = 0;

    setWrongCells(prev => prev.filter(c => c !== `${row}-${col}`));

    setBoard(newBoard);
  };

  const checkCompletion = async currentBoard => {
    const solved = JSON.stringify(currentBoard) === JSON.stringify(solution);

    if (solved) {
      Alert.alert('Success', 'Sudoku Completed');

      await completeSudokuGame({
        game_id: gameId,
        completion_time: timer,
      });

      await AsyncStorage.removeItem('savedSudokuGame');
    }
  };

  if (board.length === 0) {
    return <GameLoader text="Preparing puzzle..." />;
  }

  return (
    <ImageBackground
      source={currentTheme.background}
      style={styles.background}
      resizeMode="cover"
    >
      {isPaused && (
        <TouchableOpacity
          style={styles.pauseOverlay}
          activeOpacity={1}
          onPress={() => setIsPaused(false)}
        >
          <Text style={styles.pauseText}>PAUSED</Text>

          <Text style={styles.resumeText}>Tap anywhere to resume</Text>
        </TouchableOpacity>
      )}

      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <View style={styles.leftSection}>
            <View
              style={[
                styles.difficultyBadge,
                {
                  backgroundColor: getDifficultyColor(),
                },
              ]}
            >
              <Text style={styles.difficultyText}>
                {activeDifficulty.toUpperCase()}
              </Text>
            </View>

            <View style={styles.timerContainer}>
              <Icon name="clock-outline" size={22} color="#fff" />

              <Text style={styles.timer}>
                {`${String(Math.floor(timer / 60)).padStart(2, '0')}:${String(
                  timer % 60,
                ).padStart(2, '0')}`}
              </Text>
            </View>
          </View>

          <View style={styles.topRightActions}>
            {/* Pause */}
            <TouchableOpacity
              style={styles.smallIconButton}
              onPress={() => setIsPaused(prev => !prev)}
            >
              <Icon name={isPaused ? 'play' : 'pause'} size={22} color="#fff" />
            </TouchableOpacity>

            {/* Menu */}
            <TouchableOpacity
              style={styles.smallIconButton}
              onPress={() => setShowMenu(true)}
            >
              <Icon name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {showMenu && (
          <>
            <TouchableOpacity
              style={styles.menuOverlay}
              activeOpacity={1}
              onPress={() => setShowMenu(false)}
            />

            <View style={styles.sidebar}>
              <Text style={styles.sidebarTitle}>Menu</Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);

                  if (onGoHome) {
                    onGoHome();
                  }
                }}
              >
                <Icon name="home-outline" size={22} color="#fff" />

                <Text style={styles.menuText}>Home</Text>
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  loadGame();
                }}
              >
                <Icon name="plus-circle-outline" size={22} color="#fff" />
                <Text style={styles.menuText}>New Game</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  setShowMenu(false);
                  resetGame();
                }}
              >
                <Icon name="restart" size={22} color="#fff" />
                <Text style={styles.menuText}>Clear Puzzle</Text>
              </TouchableOpacity>

              <View style={styles.themeSection}>
                <View style={styles.themeHeader}>
                  <Icon name="palette-outline" size={22} color="#fff" />
                  <Text style={styles.menuText}>Theme</Text>
                </View>

                <View style={styles.themeOptions}>
                  <TouchableOpacity
                    style={[
                      styles.themeChip,
                      selectedTheme === 'classic' && styles.activeThemeChip,
                    ]}
                    onPress={() => setSelectedTheme('classic')}
                  >
                    <Text style={styles.themeChipText}>Classic</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.themeChip,
                      selectedTheme === 'dark' && styles.activeThemeChip,
                    ]}
                    onPress={() => setSelectedTheme('dark')}
                  >
                    <Text style={styles.themeChipText}>Dark</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.themeChip,
                      selectedTheme === 'ocean' && styles.activeThemeChip,
                    ]}
                    onPress={() => setSelectedTheme('ocean')}
                  >
                    <Text style={styles.themeChipText}>Ocean</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </>
        )}

        {showExitModal && (
          <View style={styles.modalOverlay}>
            <View style={styles.exitModal}>
              <View style={styles.modalIconContainer}>
                <Icon name="exit-to-app" size={34} color="#fff" />
              </View>

              <Text style={styles.exitTitle}>Leave Game?</Text>

              <Text style={styles.exitDescription}>
                Your progress is automatically saved.
              </Text>

              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowExitModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.homeButton}
                  onPress={() => {
                    setShowExitModal(false);

                    if (onGoHome) {
                      onGoHome();
                    }
                  }}
                >
                  <Text style={styles.homeButtonText}>Go Home</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        <SudokuBoard
          board={board}
          fixedBoard={fixedBoard}
          selectedCell={selectedCell}
          wrongCells={wrongCells}
          onCellPress={handleCellPress}
        />

        <NumberPad
          onSelect={handleNumberSelect}
          onUndo={undoMove}
          onErase={eraseCell}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#fff',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.3)',
  },

  timer: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },

  themeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  themeButton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',

    marginHorizontal: 10,

    backgroundColor: 'rgba(255,255,255,0.2)',

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 10,
  },

  actionContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  actionButton: {
    color: '#fff',

    fontSize: 16,
    fontWeight: 'bold',

    backgroundColor: 'rgba(255,255,255,0.2)',

    paddingHorizontal: 20,
    paddingVertical: 10,

    borderRadius: 12,

    marginHorizontal: 10,
  },

  pauseOverlay: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0,0,0,0.6)',

    zIndex: 999,
  },

  pauseText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  resumeText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },

  iconButton: {
    width: 50,
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.2)',

    borderRadius: 14,

    marginHorizontal: 8,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 100,
  },

  sidebar: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,

    width: 260,

    backgroundColor: 'rgba(20,20,20,0.96)',

    paddingTop: 70,
    paddingHorizontal: 20,

    zIndex: 101,
  },

  sidebarTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: 16,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },

  menuText: {
    color: '#fff',
    fontSize: 17,
    marginLeft: 14,
  },

  topBar: {
    width: '92%',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginTop: 40,
    marginBottom: 20,
  },

  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  timer: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',

    marginLeft: 10,
  },

  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  smallIconButton: {
    width: 48,
    height: 48,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.18)',

    borderRadius: 14,

    marginLeft: 10,
  },

  bottomControls: {
    width: '92%',

    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.12)',

    borderRadius: 24,

    paddingVertical: 18,

    marginTop: 25,
    marginBottom: 20,
  },

  bottomAction: {
    alignItems: 'center',
  },

  bottomActionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',

    marginTop: 8,
  },

  themeSection: {
    paddingVertical: 20,

    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },

  themeHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    marginBottom: 16,
  },

  themeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  themeChip: {
    backgroundColor: 'rgba(255,255,255,0.12)',

    paddingHorizontal: 16,
    paddingVertical: 10,

    borderRadius: 20,

    marginRight: 10,
    marginBottom: 10,
  },

  activeThemeChip: {
    backgroundColor: 'rgba(255,255,255,0.28)',
  },

  themeChipText: {
    color: '#fff',
    fontWeight: '600',
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  difficultyBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 14,

    marginRight: 14,
  },

  difficultyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,

    letterSpacing: 1,
  },

  modalOverlay: {
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(0,0,0,0.55)',

    zIndex: 9999,
  },

  exitModal: {
    width: '82%',

    backgroundColor: 'rgba(18,18,18,0.96)',

    borderRadius: 30,

    paddingVertical: 30,
    paddingHorizontal: 24,

    alignItems: 'center',
  },

  modalIconContainer: {
    width: 74,
    height: 74,

    borderRadius: 37,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.12)',

    marginBottom: 22,
  },

  exitTitle: {
    color: '#fff',

    fontSize: 26,
    fontWeight: 'bold',

    marginBottom: 12,
  },

  exitDescription: {
    color: 'rgba(255,255,255,0.7)',

    fontSize: 16,

    textAlign: 'center',

    lineHeight: 24,

    marginBottom: 28,
  },

  modalActions: {
    width: '100%',

    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cancelButton: {
    width: '47%',

    paddingVertical: 16,

    borderRadius: 18,

    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.08)',
  },

  homeButton: {
    width: '47%',

    paddingVertical: 16,

    borderRadius: 18,

    alignItems: 'center',

    backgroundColor: '#4f7cff',
  },

  cancelButtonText: {
    color: '#fff',

    fontSize: 16,
    fontWeight: '700',
  },

  homeButtonText: {
    color: '#fff',

    fontSize: 16,
    fontWeight: '700',
  },
});

export default SudokuGame;
