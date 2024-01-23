import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Button from '../components/Button';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

const StartJoin = () => {
  const [teamId, setTeamId] = useState(''); 
  const [submitted, setSubmitted] = useState(false);

  /* ------------- 팀플 참가 API -------------
  // req로 받아야하는 데이터 형식
  {
    uid: 유저 id
    userName: 유저 이름
    teamId: 팀플 id
  }

  // 응답 형식
  성공 -> isJoined: true
  실패 -> isJoined: false
*/

/* ------- API 요청법 --------
await axios.post('/api/API이름', {
        전달할 데이터를 이곳에 객체 형식으로
      })
      .then(res => {
        if (res.data.응답값) {
          // 성공 시 할 작업
        } else {
          // 실패 시 할 작업
        }
      })
      .catch(err => 에러 시 할 작업);

*/

const handleButtonPress = async () => {
  const { uid, displayName } = auth().currentUser;
  try {
    console.log('현재 사용자 정보: ' + displayName);

    const isJoined = async () => {
      console.log('API 호출됨');
      console.log(
        '보내는 정보: ' + uid,
        displayName,
        teamId,
      );
      try {
        const response = await axios.post('/api/isJoined', {
          uid: uid,
          userName: displayName,
          teamId: teamId,
        });

        if (response.data.isJoined) {
          console.log('팀 참가 성공.');
        } else {
          console.log('팀 참가 실패.');
        }
      } catch (error) {
        console.log('API 요청에서 에러 발생:', error);
      }
    };

    await isJoined();

  } catch (error) {
    console.log('에러:', error);
  }
};


  return (
    <View style={styles.container}>
      {submitted ? (
        <Text style={styles.headerText}>
          팀플 참가 요청이 {"\n"}
          완료되었습니다! {"\n"}
          {"\n"}
        <Text>팀플 ID : {teamId}</Text>
        </Text>
      ) : (
        <Text style={styles.headerText}>새로운 팀플 참가하기</Text>
      )}
      {!submitted && <Text>참가할 팀플의 ID를 입력하세요.</Text>}
      {!submitted && (
        <TextInput
          style={styles.input}
          placeholder="팀플 ID 입력"
          value={teamId}
          onChangeText={(text) => setTeamId(text)}
        />
      )}
      {!submitted && (
        <Button
          style={styles.input}
          text="시작하기"
          light={true}
          onPress={handleButtonPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    top: '30%',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingLeft: 10,
    marginVertical: 10,
  },
});

export default StartJoin;
