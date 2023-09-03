import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { View, Text, TouchableOpacity, ScrollView, Image, SafeAreaView, StyleSheet } from 'react-native';

const TeamList = () => {
  return (
    <>
      <LinearGradient colors={['#FFB8D0', '#FEE5E1']} 
        style={styles.linearGradient}
      >
        <View style={styles.textContainer}>
          <Text style={styles.teamName}>
            팀 이름
          </Text>
        </View>
        <Text style={styles.teamDescription}>
          팀 소개
        </Text>
      </LinearGradient>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.greyBox}>
          <Text style={styles.plusText}>+</Text>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  linearGradient: {
    width: '90%',
    height: '25%',
    top: '10%',
    left: '5%',
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
  greyBox: {
    width: '90%',
    height: '45%',
    top: '40%',
    left: '5%',
    backgroundColor: '#BDBDBD',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: {
    fontSize: 100,
    bottom: '20%',
    color: 'black',
  },
});

export default TeamList;
