import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from 'react-native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import PinkButton from '../components/PinkButton';

const StartJoin = ({fcmToken}) => {
  const [teamId, setTeamId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigation = useNavigation();

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
    const {uid, displayName} = auth().currentUser;

    const joinTeam = async () => {
      await axios
        .post('/api/joinTeam', {
          uid,
          userName: displayName,
          teamId,
          fcmToken: fcmToken,
        })
        .then(res => {
          if (res.data.isJoined) {
            setIsJoined(true);
          } else if (res.data.errorMsg) {
            setIsJoined(false);
            setErrorMsg(res.data.errorMsg);
          } else {
            setIsJoined(false);
            setErrorMsg('팀 참가에 실패했습니다.');
          }
        })
        .catch(err => {
          console.log(err);
          Alert.alert('Error', err);
        });
    };

    setSubmitted(true);
    joinTeam();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={{fontSize: 20}}>X</Text>
          </TouchableOpacity>
        </View>
        {submitted ? (
          isJoined ? (
            <View style={styles.submittedContainer}>
              <View>
                <Text style={styles.headerText}>
                  팀플 참가 요청이{'\n'}
                  완료되었습니다!
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    color: 'black',
                    margin: 10,
                  }}>
                  팀플 ID : {teamId}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.submittedContainer}>
              <View style={{alignItems: 'center', marginVertical: 50}}>
                <Text style={styles.headerText}>{errorMsg}</Text>
                <Text style={{fontSize: 18, color: 'black', margin: 10}}>
                  팀플 ID : {teamId}
                </Text>
              </View>
              <PinkButton
                light={true}
                text="다시 참가하기"
                onPress={() => {
                  setSubmitted(false);
                  setTeamId('');
                }}
              />
            </View>
          )
        ) : (
          <View style={styles.contentContainer}>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.headerText}>새로운 팀플 참가하기</Text>
              <Text>참가할 팀플의 ID를 입력하세요.</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="팀플 ID 입력"
              value={teamId}
              onChangeText={text => setTeamId(text)}
            />
            <View style={styles.button}>
              {teamId ? (
                <PinkButton
                  text="참가하기"
                  light={true}
                  onPress={handleButtonPress}
                />
              ) : (
                <PinkButton text="참가하기" light={false} />
              )}
            </View>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  submittedContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  header: {
    width: '90%',
    paddingHorizontal: 5,
    margin: 10,
    alignItems: 'flex-end',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 5,
  },
  contentContainer: {
    height: '80%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  input: {
    borderRadius: 10,
    borderColor: '#6C6C6C',
    borderWidth: 1,
    width: 200,
    height: 40,
    fontSize: 14,
    padding: 5,
    margin: 10,
    textAlign: 'center',
  },
});

export default StartJoin;
