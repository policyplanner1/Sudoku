import React from 'react';

import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const SudokuCell = ({ value, fixed, onPress, selected }) => {
  return (
    <TouchableOpacity
      style={[
        styles.cell,
        fixed && styles.fixedCell,
        selected && styles.selectedCell,
      ]}
      onPress={onPress}
    >
      <Text style={styles.text}>{value !== 0 ? value : ''}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  fixedCell: {
    backgroundColor: '#ddd',
  },

  selectedCell: {
    backgroundColor: '#bde0fe',
  },

  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default SudokuCell;
