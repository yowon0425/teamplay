import { View, Text } from 'react-native'
import React from 'react'
import Home from './src/screens/Home';
import Work from './src/screens/Work';
import Notice from './src/screens/Notice';
import Calender from './src/screens/Calender';
import Message from './src/screens/Message';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import StartJoin from './src/screens/StartJoin';
import LogIn from './src/screens/LogIn';
import Main from './src/screens/Main';
import TeamList from './src/screens/TeamList';

const App = () => {
  const stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const Navigator = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Work" component={Work} />
        <Tab.Screen name="Notice" component={Notice} />
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Calender" component={Calender} />
        <Tab.Screen name="Message" component={Message} />
      </Tab.Navigator>
    )
  }
  return (
    <View>
      <StartJoin />
    </View>
  )
}

export default App;
