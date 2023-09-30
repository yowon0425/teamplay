import React, { useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../components/Button';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity } from 'react-native';

const TeamList = () => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#FFB8D0', '#FEE5E1']} style={styles.linearGradient}>
        <View style={styles.textContainer}>
          <Text style={styles.teamName}>
            팀 이름
          </Text>
        </View>
        <Text style={styles.teamDescription}>
          팀 소개
        </Text>
      </LinearGradient>
      <TouchableOpacity onPress={toggleOptions} style={styles.buttonContainer}>
        <Button style={[styles.input, { width: '90%' }]} text="+" light={false} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linearGradient: {
    width: '90%',
    height: '15%',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  teamName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  teamDescription: {
    marginTop: 10,
    color: 'black',
  },
  buttonContainer: {
    marginTop: 20,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionText: {
    fontSize: 16,
    color: 'black',
  },
});

export default TeamList;
