import React from 'react';
import { View } from 'react-native';
import SudokuCell from './SudokuCell';

const SudokuBoard = ({ board, fixedBoard, selectedCell, onCellPress }) => {
  return (
    <View>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: 'row' }}>
          {row.map((cell, colIndex) => (
            <SudokuCell
              key={`${rowIndex}-${colIndex}`}
              value={cell}
              fixed={fixedBoard[rowIndex][colIndex] !== 0}
              selected={
                selectedCell?.row === rowIndex && selectedCell?.col === colIndex
              }
              onPress={() => onCellPress(rowIndex, colIndex)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

export default SudokuBoard;
