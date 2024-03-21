/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification'; // 모듈 이름 수정
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

// PushNotification.configure는 AppRegistry.registerComponent 아래에 위치해야 함
PushNotification.configure({
    onNotification: function (notification) {
        console.log("Notification", notification);
    },
    popInitialNotification: true,
    requestPermissions: Platform.OS === 'ios'
});
