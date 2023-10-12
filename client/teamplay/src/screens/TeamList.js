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
      <View style={styles.header}>
        <Text style={styles.headerText}>나의 팀</Text>
      </View>
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
      <LinearGradient colors={['#FFB8D0', '#FEE5E1']} style={styles.white}></LinearGradient>
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
      <LinearGradient colors={['#FFB8D0', '#FEE5E1']} style={styles.white}></LinearGradient>
      <TouchableOpacity onPress={toggleOptions} style={{ width: '100%', alignItems: 'center' }}>
        <LinearGradient colors={['#EAEAEA', '#EAEAEA']} style={styles.button}>
          <View style={styles.textContainer}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </LinearGradient>
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
  header: {
    width: '100%',
    height: 80, // 높이를 조절하여 여백을 생성
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  linearGradient: {
    width: '90%',
    height: '15%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  white: {
    height: 10,
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
  button: {
    width: '90%',
    height: '25%',
    borderRadius: 10,
  },
  plusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default TeamList;
