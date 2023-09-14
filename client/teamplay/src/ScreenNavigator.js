import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Home from '../src/screens/Home';
import Work from '../src/screens/Work';
import Notice from '../src/screens/Notice';
import Calender from '../src/screens/Calender';
import Message from '../src/screens/Message';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LogIn from '../src/screens/LogIn';
import TeamList from '../src/screens/TeamList';
import {NavigationContainer} from '@react-navigation/native';
import Main from './screens/Main';

const HomeTabs = () => {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Work" component={Work} />
      <Tab.Screen name="Notice" component={Notice} />
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Calender" component={Calender} />
      <Tab.Screen name="Message" component={Message} />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ScreenNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen
          name="Main"
          component={Main}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LogIn"
          component={LogIn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TeamList"
          component={TeamList}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default ScreenNavigator;

const styles = StyleSheet.create({});
