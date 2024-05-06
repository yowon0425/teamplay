import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MemberMap from '../screens/MemberMap';
import MemberUpload from '../screens/MemberUpload';

const MemberMapStackScreen = ({
  teamId,
  memberId,
  memberName,
  todoData,
  memberObj,
}) => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator initialRouteName="MemberMap">
      <Stack.Screen name="MemberMap" options={{headerShown: false}}>
        {() => (
          <MemberMap
            teamId={teamId}
            memberId={memberId}
            memberObj={memberObj}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="MemberUpload" options={{headerShown: false}}>
        {() => (
          <MemberUpload
            teamId={teamId}
            memberId={memberId}
            memberName={memberName}
            todoData={todoData}
            memberObj={memberObj}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default MemberMapStackScreen;
