import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const NumberPad = ({ onSelect }) => {
  return (
    <View style={styles.container}>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
  },
  button: {
    width: 50,
    height: 50,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#fff',

    backgroundColor: 'rgba(255,255,255,0.2)',

    borderRadius: 10,

    margin: 4,
  },
  text: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default NumberPad;
