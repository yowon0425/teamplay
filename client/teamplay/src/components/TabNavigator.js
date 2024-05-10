import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Notice from '../screens/Notice';
import Home from '../screens/Home';
import Calender from '../screens/Calender';
import Ionic from 'react-native-vector-icons/Ionicons';
import MyMapStackScreen from './MyMapStackScreen';
import MemberMapStackScreen from './MemberMapStackScreen';
import Profile from '../screens/Profile';

const MenuBar = ({route}) => {
  const Tab = createBottomTabNavigator();
  const params = JSON.stringify(route);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        initialRouteName: 'home',
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {},
        unmountOnBlur: true,
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
          } else if (route.name === 'Profile') {
            iconName = 'person';
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
          route.params.memberId ? (
            <MemberMapStackScreen
              teamId={route.params.teamId}
              memberId={route.params.memberId}
              memberName={route.params.memberName}
              todoData={route.params.todoData}
              memberObj={route.params.memberObj}
            />
          ) : (
            <MyMapStackScreen
              teamId={route.params.teamId}
              todoData={route.params.todoData}
            />
          )
        }
      </Tab.Screen>
      <Tab.Screen name="Notice">
        {() => <Notice teamId={route.params.teamId} />}
      </Tab.Screen>
      <Tab.Screen name="Calender">
        {() => <Calender teamId={route.params.teamId} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
        {() => <Profile teamId={route.params.teamId} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default MenuBar;
