import {View, Text, ProgressBarAndroidBase, StyleSheet} from 'react-native';
import React from 'react';
import MenuBar from '../components/TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../components/Button';
import MaskedView from '@react-native-masked-view/masked-view';

const Home = ({teamName, goal}) => {
  // 텍스트 테두리 필요
  const percent = 100;
  return (
    <View>
      <View style={styles.top}>
        <Text style={styles.teamName}>{teamName}팀이름</Text>
        <Text style={styles.goal}>{goal}목표는 세계정복</Text>
      </View>
      <View style={styles.teamProgress}>
        <MaskedView
          maskElement={
            <View
              style={{
                height: '100%',
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.percentText1}>{percent}%</Text>
            </View>
          }>
          <LinearGradient
            style={styles.mainPercent}
            colors={['#6A9CFD', '#FEE5E1']}
          />
        </MaskedView>
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
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  top: {
    alignItems: 'center',
    justifyContent: 'center',
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
    color: 'black',
    height: 110,
    width: 300,
  },
  percentText1: {
    fontSize: 96,
    fontWeight: '900',
    color: 'black',
    textShadowColor: 'black',
    textShadowRadius: 1,
    textShadowOffset: {width: -1, height: -1},
  },
  percentText2: {
    fontSize: 96,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'black',
    textShadowRadius: 5,
    textShadowOffset: {width: -1, height: -1},
    position: 'absolute',
    top: 0,
  },
  percentText3: {
    fontSize: 96,
    fontWeight: '900',
    color: 'black',
  },
  percentText4: {
    fontSize: 96,
    fontWeight: '900',
    color: 'black',
  },
  mainBar: {
    width: '80%',
    height: 30,
    borderRadius: 30,
    borderColor: 'black',
    unfilledColor: 'gray',
    marginTop: 20,
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
