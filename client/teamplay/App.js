import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import StackNavigator from './src/components/StackNavigator';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  const [fcmToken, setFcmToken] = useState(null);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    requestUserPermission();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getToken();
    }
  };

  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('디바이스 토큰값:', token);
    setFcmToken(token);
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);
      pushNoti.displayNoti(remoteMessage);  // 위에서 작성한 함수로 넘겨준다
    });

    return unsubscribe;
  }, []);

  return (
    <StackNavigator fcmToken={fcmToken} />
  );
};

export default App;