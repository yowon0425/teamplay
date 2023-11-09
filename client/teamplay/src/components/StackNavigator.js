import {BackHandler, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LogIn from '../screens/LogIn';
import TeamList from '../screens/TeamList';
import {NavigationContainer} from '@react-navigation/native';
import Main from '../screens/Main';
import MenuBar from './MenuBar';

/* 메인화면-로그인-팀리스트까지의 stackNavigator */

const Stack = createNativeStackNavigator();

// 하드웨어 뒤로가기 제어
const StackNavigator = () => {
  useEffect(() => {
    const backAction = () => {
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={Main}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="LogIn"
          component={LogIn}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="TeamList"
          component={TeamList}
          options={{headerShown: false, gestureEnabled: false}}
        />
        <Stack.Screen
          name="MenuBar"
          component={MenuBar}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});