import React, {useEffect, useState} from 'react';
import {AppState, Linking} from 'react-native';
import StackNavigator from './src/components/StackNavigator';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import pushNoti from './src/uitls/pushNoti';
import {auth} from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const [fcmToken, setFcmToken] = useState(null);
  const [isLogIn, setIsLogIn] = useState(false);
  const [pendingDeepLink, setPendingDeepLink] = useState(null);

  /* 알림 수신 허가 받기 */
  useEffect(() => {
    requestUserPermission();
    checkDeepLink();
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

  /* 디바이스 토큰 얻기 */
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('디바이스 토큰값:', token);
    setFcmToken(token);
  };

  /* foreground 상태에서 알림 받기 */
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage); // {data: {body title...}}
      pushNoti.displayNoti(remoteMessage); // 알림을 표시하는 함수
    });

    return () => {
      unsubscribe();
    };
  }, []);

  /* forground 알림 열기 */
  const checkDeepLink = async () => {
    const url = await AsyncStorage.getItem('deepLinkURL');
    if (url) {
      setPendingDeepLink(url);
      await AsyncStorage.removeItem('deepLinkURL'); // URL을 사용 후 제거
    }
  };

  /* deeplink 설정 */
  const buildDeepLinkFromNotificationData = data => {
    console.log('======buildDeepLinkFromNotificationData=======');
    console.log(JSON.stringify(data));
    if (data) {
      return `teamplay://MenuBar/Notice/${data.id}`;
    }
    return null;
  };

  const handlePendingDeepLink = () => {
    if (pendingDeepLink && isLogIn) {
      Linking.openURL(pendingDeepLink);
      setPendingDeepLink(null);
    }
  };

  useEffect(() => {
    handlePendingDeepLink();
  }, [isLogIn]);

  const linking = {
    prefixes: ['teamplay://'],
    config: {
      initialRouteName: 'Main',
      screens: {
        Main: 'main',
        LogIn: 'logIn',
        TeamList: 'teamList',
        MenuBar: {
          initialRouteName: 'Home',
          path: 'MenuBar/:screen/:teamId',
          screens: {
            Home: 'home',
            Maps: {
              screens: {
                MemberMapStack: 'memberMapStack',
                MyMapStack: 'myMapStack',
              },
            },
            Notice: {
              path: 'notice',
            },
            Calendar: 'calender',
            Message: 'message',
          },
        },
      },
    },
    async getInitialURL() {
      console.log('=======getInitialURL=======');
      const url = await Linking.getInitialURL();
      if (typeof url === 'string') {
        return url;
      }
      // getInitialNotification (quit state)
      const message = await messaging().getInitialNotification();
      console.log(JSON.stringify(message));
      const deeplinkURL = buildDeepLinkFromNotificationData(message?.data);
      if (typeof deeplinkURL === 'string') {
        setPendingDeepLink(deeplinkURL);
        return null;
      }
    },
    subscribe(listener) {
      const onReceiveURL = event => {
        const {url} = event;
        return listener(url);
      };
      const linkingSubscription = Linking.addEventListener('url', onReceiveURL);
      // onNotificationOpenedApp (background)
      const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('=======백그라운드 알림 보내기========');
        console.log(JSON.stringify(remoteMessage));
        const url = buildDeepLinkFromNotificationData(remoteMessage.data);
        if (typeof url === 'string') {
          Linking.openURL(url);
        }
      });

      return () => {
        linkingSubscription.remove();
        unsubscribe();
      };
    },
  };

  return (
    <StackNavigator
      fcmToken={fcmToken}
      linking={linking}
      setIsLogIn={setIsLogIn}
    />
  );
};

export default App;
