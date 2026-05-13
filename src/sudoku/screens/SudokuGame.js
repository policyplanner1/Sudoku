import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { THEMES } from '../themes/backgrounds/themeConfig';
import SudokuBoard from '../components/SudokuBoard';
import NumberPad from '../components/NumberPad';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { startSudokuGame, completeSudokuGame } from '../services/sudokuApi';

const SudokuGame = () => {
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
  const [mistakes, setMistakes] = useState([]);
  const [wrongCells, setWrongCells] = useState([]);

  useEffect(() => {
    loadGame();
  }, []);

  useEffect(() => {
    let interval;

    if (!isPaused) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isPaused]);

  const loadGame = async () => {
    try {
      const response = await startSudokuGame('easy');

      setBoard(response.board.map(row => [...row]));

      setFixedBoard(response.board.map(row => [...row]));

      setSolution(response.solution);

      setGameId(response.game_id);
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
    }
  };

  if (board.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Loading Sudoku...</Text>
      </View>
    );
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
        <Text style={styles.timer}>Time: {timer}s</Text>

        <View style={styles.actionContainer}>
          {/* Pause / Resume */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setIsPaused(prev => !prev)}
          >
            <Icon name={isPaused ? 'play' : 'pause'} size={24} color="#fff" />
          </TouchableOpacity>

          {/* Reset */}
          <TouchableOpacity style={styles.iconButton} onPress={resetGame}>
            <Icon name="restart" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Undo */}
          <TouchableOpacity style={styles.iconButton} onPress={undoMove}>
            <Icon name="undo" size={24} color="#fff" />
          </TouchableOpacity>

          {/* Erase */}
          <TouchableOpacity style={styles.iconButton} onPress={eraseCell}>
            <Icon name="eraser" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.themeContainer}>
          <Text
            style={styles.themeButton}
            onPress={() => setSelectedTheme('classic')}
          >
            Classic
          </Text>

          <Text
            style={styles.themeButton}
            onPress={() => setSelectedTheme('dark')}
          >
            Dark
          </Text>

          <Text
            style={styles.themeButton}
            onPress={() => setSelectedTheme('ocean')}
          >
            Ocean
          </Text>
        </View>

        <SudokuBoard
          board={board}
          fixedBoard={fixedBoard}
          selectedCell={selectedCell}
          wrongCells={wrongCells}
          onCellPress={handleCellPress}
        />

        <NumberPad onSelect={handleNumberSelect} />
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
});

export default SudokuGame;
