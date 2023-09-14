import {View, Text, ProgressBarAndroidBase, StyleSheet} from 'react-native';
import React from 'react';
import MenuBar from '../components/MenuBar';
import {NavigationContainer} from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../components/Button';

const Home = ({teamName, goal}) => {
  const textGradientStyle = {
    fontSize: 20,
    color: 'white',
    background: '-webkit-linear-gradient(#6A9CFD, #FEE5E1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const percent = 100;
  return (
    <View>
      <View style={styles.top}>
        <Text style={styles.teamName}>{teamName}팀이름</Text>
        <Text style={styles.goal}>{goal}목표는 세계정복</Text>
      </View>
      <View style={styles.teamProgress}>
        <LinearGradient
          style={styles.mainPercent}
          colors={['#6A9CFD', '#FEE5E1']}>
          <Text style={styles.percentText}>{percent}%</Text>
        </LinearGradient>
        <Progress.Bar style={styles.mainBar} />
        <Text style={styles.progressText}>Project Progress...</Text>
      </View>
      <View style={styles.members}>
        <View style={styles.member}>
          <View style={styles.memberInfo}>
            <Text>이름(역할)</Text>
            <Text>퍼센트</Text>
          </View>
          <Progress.Bar style={styles.memberBar} />
        </View>
        <View style={styles.member}>
          <View style={styles.memberInfo}>
            <Text>이름(역할)</Text>
            <Text>퍼센트</Text>
          </View>
          <Progress.Bar style={styles.memberBar} />
        </View>
      </View>
      <View style={{alignItems: 'center', margin: 20}}>
        <Button text="내 작업 페이지로" light={true} />
      </View>
      <NavigationContainer style={{alignItems: 'flex-end'}}>
        <MenuBar />
      </NavigationContainer>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  top: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    margin: 10,
  },
  goal: {
    fontSize: 16,
    color: 'black',
  },
  teamProgress: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPercent: {
    fontSize: 96,
    fontWeight: '900',
    color: 'white',
    background: '-webkit-linear-gradient(#6A9CFD, #FEE5E1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  percentText: {
    fontSize: 96,
    fontWeight: '900',
    color: 'rgba(0,0,0,0.05)',
  },
  mainBar: {
    width: '80%',
    height: 30,
    borderRadius: 30,
    borderColor: 'black',
    unfilledColor: 'gray',
  },
  progressText: {
    margin: 10,
    fontSize: 20,
    color: 'black',
  },
  members: {
    alignItems: 'center',
    margin: 40,
    width: '100%',
  },
  member: {
    width: '100%',
    margin: 10,
  },
  memberInfo: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
  },
  memberBar: {
    width: '80%',
    height: 10,
    borderRadius: 20,
    borderColor: 'black',
    unfilledColor: 'gray',
  },
});
