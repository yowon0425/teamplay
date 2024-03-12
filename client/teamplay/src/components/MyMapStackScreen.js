import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import MyMap from '../screens/MyMap';
import MyUpload from '../screens/MyUpload';

const MyMapStackScreen = ({teamId, todoData}) => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="MyMap">
      <Stack.Screen name="MyMap" options={{headerShown: false}}>
        {() => <MyMap teamId={teamId} />}
      </Stack.Screen>
      <Stack.Screen name="MyUpload" options={{headerShown: false}}>
        {() => <MyUpload teamId={teamId} todoData={todoData} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default MyMapStackScreen;
