import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import MenuBar from '../components/TabNavigator';
import {NavigationContainer} from '@react-navigation/native';

const MemberMap = ({uid}) => {
  console.log('member map: ' + uid);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.top}>
        <View>
          <Text style={styles.name}>이름</Text>
        </View>
        <View style={styles.progress}>
          <View style={styles.info}>
            <Text>이름(역할)</Text>
            <Text>퍼센트</Text>
          </View>
          <Progress.Bar style={styles.bar} />
        </View>
      </View>
      <View style={styles.mapContainer}>
        <View style={styles.maps}>
          <View style={styles.map}>
            <LinearGradient
              style={styles.coloredCircle}
              colors={['#033495', '#AEE4FF']}>
              <Text style={styles.mapNum}>1</Text>
            </LinearGradient>
            <View style={styles.plan}>
              <Text style={styles.planTitle}>자료 조사</Text>
              <Text style={styles.planDue}>8/20 20:00</Text>
            </View>
          </View>
          <LinearGradient style={styles.line} colors={['#033495', '#AEE4FF']} />
          <View style={styles.map}>
            <MaskedView
              maskElement={
                <View style={styles.strokedCircle}>
                  <Text style={styles.mapNumB}>2</Text>
                </View>
              }>
              <LinearGradient
                style={styles.coloredCircle}
                colors={['#033495', '#AEE4FF']}
              />
            </MaskedView>
            <View style={styles.plan}>
              <Text style={styles.planTitle}>자료 조사</Text>
              <Text style={styles.planDue}>8/20 20:00</Text>
            </View>
          </View>
          <View style={[styles.line, {backgroundColor: '#7D7D7D'}]} />
          <View style={styles.map}>
            <View style={styles.circle}>
              <Text style={styles.mapNumB}>3</Text>
            </View>
            <View style={styles.plan}>
              <Text style={styles.planTitle}>자료 조사</Text>
              <Text style={styles.planDue}>8/20 20:00</Text>
            </View>
          </View>
          <View style={[styles.line, {backgroundColor: '#7D7D7D'}]} />
          <View style={styles.map}>
            <View style={styles.circle}>
              <Text style={styles.mapNumB}>4</Text>
            </View>
            <View style={styles.plan}>
              <Text style={styles.planTitle}>자료 조사</Text>
              <Text style={styles.planDue}>8/20 20:00</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default MemberMap;

const styles = StyleSheet.create({
  container: {},
  top: {
    width: '100%',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    color: 'black',
    margin: 10,
  },
  progress: {
    width: '100%',
    margin: 20,
    alignItems: 'center',
  },
  info: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bar: {
    width: '80%',
    height: 10,
    borderRadius: 20,
    borderColor: 'black',
    unfilledColor: 'gray',
  },
  mapContainer: {
    alignItems: 'center',
  },
  maps: {
    width: '75%',
    height: '70%',
    margin: 50,
  },
  map: {
    flexDirection: 'row',
  },
  coloredCircle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strokedCircle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderCurve: 100,
    backgroundColor: '#D9D9D9',
    borderColor: '#7D7D7D',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapNum: {
    fontSize: 20,
    color: 'white',
  },
  mapNumB: {
    color: 'black',
    fontSize: 20,
  },
  plan: {
    marginLeft: 15,
  },
  planTitle: {
    fontSize: 16,
    color: 'black',
  },
  planDue: {
    fontSize: 12,
    color: 'black',
  },
  line: {
    height: 90,
    width: 2,
    left: 20,
  },
  button: {
    alignItems: 'center',
  },
});
