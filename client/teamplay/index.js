/**
 * @format
 */

import {AppRegistry, AppState, Platform} from 'react-native';
import PushNotification from 'react-native-push-notification'; // 모듈 이름 수정
import App from './App';
import {name as appName} from './app.json';
import notifee from '@notifee/react-native';
import {Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

AppRegistry.registerComponent(appName, () => App);

notifee.onBackgroundEvent(async ({detail}) => {
  if (AppState.currentState === 'background') {
    const {notification} = detail;
    console.log('onBackground');
    console.log(JSON.stringify(notification));
    console.log('Action_press');
    if (notification?.data) {
      const url = `teamplay://MenuBar/Notice/${notification.data.id}`;
      await AsyncStorage.setItem('deepLinkURL', url);
      Linking.openURL('teamplay://');
    }
  }
});

/*messaging().setBackgroundMessageHandler(async message => {
  console.log('BackgroundMessageHandler');
  console.log(JSON.stringify(message));
  pushNoti.displayNoti(message);
});*/

// PushNotification.configure는 AppRegistry.registerComponent 아래에 위치해야 함
PushNotification.configure({
  onNotification: function (notification) {
    console.log('Notification', notification); // Notification {data: {body: ...}}
  },
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});
