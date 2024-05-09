import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import PinkButton from '../components/PinkButton';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import PushNotification from 'react-native-push-notification';
import {useNavigation, useRoute} from '@react-navigation/native';

const SendNotice = ({fcmToken}) => {
  const [title, setTitle] = useState('');
  const [notificationText, setNotificationText] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);

  const route = useRoute();
  const {teamId} = route.params;
  console.log(fcmToken);

  const navigation = useNavigation();

  const createChannel = () => {
    PushNotification.createChannel({
      channelId: 'team-channel',
      channelName: 'Team Channel',
    });
  };

  useEffect(() => {
    createChannel();
    addTeamMember();
  }, []);

  // 팀 멤버 추가
  const addTeamMember = async memberData => {
    try {
      const response = await axios.post('/api/teamData/member', {teamId});
      if (response.data) {
        setTeamMembers(response.data);
      } else {
        // 실패 시의 작업
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleButtonPress = async () => {
    const {displayName} = auth().currentUser;

    const addNotice = async () => {
      console.log('api 호출됨');

      const memberUid = teamMembers.map(member => member.uid);

      console.log(
        '보내는 정보: ' + fcmToken,
        displayName,
        teamId,
        memberUid,
        title,
        notificationText,
      );

      await axios
        .post('/api/sendNotice', {
          tokens: fcmToken,
          writer: displayName,
          teamId,
          teamMember: memberUid,
          title: title,
          content: notificationText,
        })
        .catch(err => console.log(err));
    };

    PushNotification.getChannels(function (channel_ids) {
      console.log(channel_ids);
    });

    PushNotification.localNotification({
      channelId: 'team-channel',
      title: title,
      message: notificationText,
    });

    addNotice();
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{width: 22}} />
          <Text style={styles.title}>알림 보내기</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={{fontSize: 20}}>X</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.inputLine}>
            <Text style={styles.text}>알림 제목</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View style={styles.inputLine}>
            <Text style={styles.text}>알림 내용</Text>
            <TextInput
              style={styles.commentInput}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={notificationText}
              onChangeText={setNotificationText}
            />
          </View>
        </View>
        {title && notificationText ? (
          <PinkButton
            style={styles.input}
            text="알림 보내기"
            light={true}
            onPress={handleButtonPress}
          />
        ) : (
          <PinkButton text="알림 보내기" light={false} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SendNotice;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '90%',
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    margin: 10,
  },
  inputContainer: {
    width: '90%',
    marginBottom: 30,
  },
  inputLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    margin: 10,
  },
  text: {
    fontSize: 14,
    color: 'black',
    fontWeight: '100',
    marginRight: 15,
  },
  input: {
    borderRadius: 10,
    borderColor: '#6C6C6C',
    borderWidth: 1,
    width: '60%',
    height: 30,
    fontSize: 14,
    padding: 5,
  },
  pickerLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    margin: 10,
  },
  typePicker: {
    borderRadius: 10,
    borderColor: '#6C6C6C',
    borderWidth: 1,
    width: '55%',
    height: 30,
    fontSize: 12,
  },
  peoplePicker: {
    borderRadius: 10,
    borderColor: '#6C6C6C',
    borderWidth: 1,
    width: '55%',
    height: 30,
    fontSize: 12,
  },
  commentInput: {
    borderRadius: 10,
    borderColor: '#6C6C6C',
    borderWidth: 1,
    width: '60%',
    height: 150,
    fontSize: 14,
    padding: 5,
  },
});
