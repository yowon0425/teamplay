import { View, Text } from 'react-native'
import React from 'react'
import Home from './src/screens/Home';
import Work from './src/screens/Work';
import Notice from './src/screens/Notice';
import Calender from './src/screens/Calender';
import Message from './src/screens/Message';

const App = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  const NavigationBar = () => {
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
      <Text>App</Text>
    </View>
  )
}

export default App;
