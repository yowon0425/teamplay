import {View, Text} from 'react-native';
import React from 'react';

import Main from './src/screens/Main';
import ScreenNavigator from './src/ScreenNavigator';
import StartNew from './src/screens/StartNew';
import StartJoin from './src/screens/StartJoin';
import Home from './src/screens/Home';
import MemberMap from './src/screens/MemberMap';

const App = () => {
  return <ScreenNavigator />;
};

export default App;
