import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TextInput} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import PinkButton from '../components/PinkButton';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

const SendNotice = ({route}) => {
  const {teamId} = route.params;
  const [title, setTitle] = useState('');
  const [noticeType, setNoticeType] = useState('');
  const [notificationText, setNotificationText] = useState('');
  const [member, setMember] = useState();
  console.log(teamId);

  // 팀 멤버 목록 불러오기
  const getTeamMember = async () => {
    await axios
      .post('/api/teamData/member', {teamId})
      .then(res => {
        if (res.data) {
          /* 응답 형식
          {
            member: [{userName: oo, uid: oo}, {...}]
          }
          */
          setMember(
            res.data.map(data => {
              return data.uid;
            }),
          ); // 멤버 uid 배열 불러오기
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getTeamMember();
  }, []);

  const [recipient, setRecipient] = useState('all');


  const handleButtonPress = async () => {
    const {uid} = auth().currentUser;

    const sendNotice = async () => {
      console.log('api 호출됨');
      console.log('보내는 정보: ' + uid, title, noticeType, notificationText);

      await axios
        .post('/api/joinTeam', {
          uid,
          title,
          label: noticeType,
          text: notificationText,
          recipient

        })
        .catch(err => console.log(err));
    };

    sendNotice();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알림 보내기</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputLine}>
          <Text style={styles.text}>알림 제목</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />
        </View>
        <View style={styles.pickerLine}>
          <Text style={styles.text}>알림 종류</Text>
          <Picker
            style={styles.typePicker}
            selectedValue={noticeType}
            onValueChange={(itemValue, itemIndex) => setNoticeType(itemValue)}>
            <Picker.Item label="공지" value="notice" />
            <Picker.Item label="확인요청" value="check" />
            <Picker.Item label="독려" value="encouragement" />
          </Picker>
        </View>
        <View style={styles.pickerLine}>
          <Text style={styles.text}>보낼 사람</Text>
          <Picker
            style={styles.peoplePicker}
            selectedValue={recipient}
            onValueChange={(itemValue, itemIndex) => setRecipient(itemValue)}
          >
            <Picker.Item label="모두" value="all" />
            <Picker.Item label="자료조사" value="research" />
            <Picker.Item label="PPT" value="ppt" />
            <Picker.Item label="발표" value="presentation" />
            <Picker.Item label="직접 선택하기" value="pick" />
          </Picker>
        </View>
        <View style={styles.inputLine}>
          <Text style={styles.text}>알림 내용</Text>
          <TextInput
            style={styles.commentInput}
            multiline
            numberOfLines={4}
            value={notificationText}
            onChangeText={setNotificationText}
          />
        </View>
      </View>
      <PinkButton
        style={styles.input}
        text="알림 보내기"
        light={true}
        onPress={handleButtonPress}
      />
    </View>
  );
};

export default SendNotice;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    margin: 10,
  },
  inputContainer: {
    width: '80%',
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