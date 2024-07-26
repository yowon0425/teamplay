import {AppState, Linking} from 'react-native';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';

const displayNotification = async message => {
  const channelAnoucement = await notifee.createChannel({
    id: 'important',
    name: 'teamplay',
    importance: AndroidImportance.HIGH,
  });

  await notifee.displayNotification({
    title: message.notification.title,
    body: message.notification.body,
    data: {
      id: message.data.id,
    },
    android: {
      channelId: channelAnoucement,
      smallIcon: 'ic_notification',
      importance: AndroidImportance.HIGH,
      color: '#123690',
      showTimestamp: true,
    },
  });

  notifee.onForegroundEvent(async ({type}) => {
    if (type === EventType.PRESS) {
      Linking.openURL(`teamplay://MenuBar/Notice/${message.data.id}`);
    }
  });

  notifee.onBackgroundEvent(async ({type}) => {
    if (type === EventType.PRESS) {
      console.log('Action_press');
      Linking.openURL(`teamplay://MenuBar/Notice/${message.data.id}`);
    }
  });
};

export default {
  displayNoti: remoteMessage => displayNotification(remoteMessage),
};
