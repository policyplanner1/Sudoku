import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';

import SudokuBoard from '../components/SudokuBoard';
import NumberPad from '../components/NumberPad';

import {
  startSudokuGame,
  completeSudokuGame,
} from '../services/sudokuApi';

const SudokuGame = () => {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState([]);
  const [fixedBoard, setFixedBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [gameId, setGameId] = useState(null);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    loadGame();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadGame = async () => {
    try {
      const response = await startSudokuGame('easy');

      setBoard(
        response.board.map(row => [...row]),
      );

      setFixedBoard(
        response.board.map(row => [...row]),
      );

      setSolution(response.solution);

      setGameId(response.game_id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCellPress = (row, col) => {
    if (fixedBoard[row][col] !== 0) return;

    setSelectedCell({ row, col });
  };

  const handleNumberSelect = async number => {
    if (!selectedCell) return;

    const correctValue =
      solution[selectedCell.row][selectedCell.col];

    if (number !== correctValue) {
      Alert.alert('Wrong Number');
      return;
    }

    const newBoard = board.map(row => [...row]);

    newBoard[selectedCell.row][selectedCell.col] =
      number;

    setBoard(newBoard);

    checkCompletion(newBoard);
  };

  const checkCompletion = async currentBoard => {
    const solved =
      JSON.stringify(currentBoard) ===
      JSON.stringify(solution);

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
    <View style={styles.container}>
      <Text style={styles.timer}>
        Time: {timer}s
      </Text>

      <SudokuBoard
        board={board}
        fixedBoard={fixedBoard}
        selectedCell={selectedCell}
        onCellPress={handleCellPress}
      />

      <NumberPad onSelect={handleNumberSelect} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  timer: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default SudokuGame;