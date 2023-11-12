import {View, Text} from 'react-native';
import React from 'react';

import Main from './src/screens/Main';
import StartNew from './src/screens/StartNew';
import StartJoin from './src/screens/StartJoin';
import Home from './src/screens/Home';
import MemberMap from './src/screens/MemberMap';
import Calender from './src/screens/Calender';
import MyUpload from './src/screens/MyUpload';
import SendNotice from './src/screens/SendNotice';
import StackNavigator from './src/components/StackNavigator';
import {NavigationContainer} from '@react-navigation/native';
import MenuBar from './src/components/MenuBar';

const App = () => {
  return <Calender />;
};

export default App;
