import React from 'react';

import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const GameLoader = ({ text = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Icon name="grid" size={56} color="#fff" />
      </View>

      <Text style={styles.title}>Sudoku</Text>

      <ActivityIndicator
        size="large"
        color="#4f7cff"
        style={styles.loader}
      />

      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#0b1020',
  },

  logoContainer: {
    width: 110,
    height: 110,

    borderRadius: 32,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: 'rgba(255,255,255,0.08)',

    marginBottom: 24,
  },

  title: {
    color: '#fff',

    fontSize: 34,
    fontWeight: 'bold',

    letterSpacing: 1,

    marginBottom: 30,
  },

  loader: {
    marginBottom: 20,
  },

  text: {
    color: 'rgba(255,255,255,0.7)',

    fontSize: 16,
  },
});

export default GameLoader;