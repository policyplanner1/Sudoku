import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const NumberPad = ({ onSelect, onUndo, onErase }) => {
  return (
    <View style={styles.wrapper}>
      {/* Numbers Grid */}
      <View style={styles.grid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <TouchableOpacity
            key={num}
            style={styles.button}
            onPress={() => onSelect(num)}
          >
            <Text style={styles.text}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Side Actions */}
      <View style={styles.sideActions}>
        <TouchableOpacity style={styles.actionButton} onPress={onUndo}>
          <Icon name="undo" size={28} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onErase}>
          <Icon name="eraser" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '92%',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.12)',

    borderRadius: 28,

    padding: 16,

    marginTop: 20,
    marginBottom: 20,
  },

  grid: {
    width: '78%',

    flexDirection: 'row',
    flexWrap: 'wrap',

    justifyContent: 'space-between',
  },

  button: {
    width: '30%',
    aspectRatio: 1,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',

    backgroundColor: 'rgba(255,255,255,0.14)',

    borderRadius: 18,

    marginBottom: 8,
  },

  text: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
  },

  sideActions: {
    width: '20%',

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: -30,
  },

  actionButton: {
    width: 60,
    height: 70,

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 25,

    backgroundColor: 'rgba(255,255,255,0.16)',

    marginVertical: 8,
  },
});

export default NumberPad;
