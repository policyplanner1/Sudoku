import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = ({ onComplete }) => {
  const [name, setName] = useState('');

  const saveName = async () => {
    if (!name.trim()) return;

    await AsyncStorage.setItem(
      'username',
      name,
    );

    onComplete(name);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome
      </Text>

      <TextInput
        placeholder="Enter your name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveName}
      >
        <Text style={styles.buttonText}>
          Continue
        </Text>
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
  },

  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },

  input: {
    width: '80%',

    borderWidth: 1,
    borderColor: '#444',

    borderRadius: 12,

    padding: 15,

    color: '#fff',

    marginBottom: 20,
  },

  button: {
    backgroundColor: '#4f7cff',

    paddingHorizontal: 40,
    paddingVertical: 14,

    borderRadius: 12,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;