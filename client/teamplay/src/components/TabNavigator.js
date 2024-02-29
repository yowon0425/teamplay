import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Work from '../screens/Work';
import Notice from '../screens/Notice';
import Home from '../screens/Home';
import Calender from '../screens/Calender';
import Message from '../screens/Message';
import Ionic from 'react-native-vector-icons/Ionicons';
import MyMap from '../screens/MyMap';
import MemberMap from '../screens/MemberMap';
import MyUpload from '../screens/MyUpload';
import StackNavigator from './StackNavigator';

const MenuBar = ({route}) => {
  const Tab = createBottomTabNavigator();
  const params = JSON.stringify(route);
  console.log('route: ' + params);
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        initialRouteName: 'home',
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {},
        tabBarIcon: ({focused, size}) => {
          let iconName;
          let color;
          if (route.name === 'Home') {
            iconName = 'home';
            color = focused ? '#484848' : '#CCCCCC';
          } else if (route.name === 'Maps') {
            iconName = 'color-palette-outline';
            color = focused ? '#484848' : '#CCCCCC';
          } else if (route.name === 'Notice') {
            iconName = 'notifications-outline';
            color = focused ? '#484848' : '#CCCCCC';
          } else if (route.name === 'Calender') {
            iconName = 'today-outline';
            color = focused ? '#484848' : '#CCCCCC';
          } else if (route.name === 'Message') {
            iconName = 'chatbubbles-outline';
            color = focused ? '#484848' : '#CCCCCC';
          }

          return <Ionic name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home">
        {() => <Home teamId={route.params.teamId} />}
      </Tab.Screen>
      <Tab.Screen name="Maps">
        {() =>
          route.params.member ? (
            <MemberMap uid={route.params.uid} />
          ) : route.params.upload ? (
            <MyUpload
              teamId={route.params.teamId}
              todoData={route.params.todoData}
            />
          ) : (
            <MyMap teamId={route.params.teamId} />
          )
        }
      </Tab.Screen>
      <Tab.Screen name="Notice" component={Notice} />
      <Tab.Screen name="Calender" component={Calender} />
      <Tab.Screen name="Message" component={Message} />
    </Tab.Navigator>
  );
};

export default MenuBar;
