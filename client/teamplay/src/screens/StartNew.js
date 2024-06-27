import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Share,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import PinkButton from '../components/PinkButton';
import {firebase, messaging} from '@react-native-firebase/messaging';
import {ReactNativeFirebase} from '@react-native-firebase/app';

const StartNew = ({fcmToken}) => {
  const [name, setName] = useState('');
  const [lecture, setLecture] = useState('');
  const [description, setDescription] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [teamId, setTeamId] = useState('');
  var truncId;
  const {uid, displayName} = auth().currentUser;
  const navigation = useNavigation();

  const handleButtonPress = async () => {
    try {
      console.log('cur user info: ' + displayName);

      if (!name || !lecture || !description) {
        setDisplayText('모두 입력해주세요.');
        return;
      }

      const getRandomAlphaNumericId = length => {
        const characters =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomId = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          randomId += characters.charAt(randomIndex);
        }
        return randomId;
      };

      const newTeamId = getRandomAlphaNumericId(10);
      console.log('newid: ' + newTeamId);
      truncId = newTeamId;

      setTeamId(newTeamId);
      setSubmitted(true);
      createTeam();
    } catch {}
  };

  /* 팀 아이디 공유하기 */
  const onShareId = async () => {
    try {
      await Share.share({
        message: `[Teamplay]\n팀플 ID로 팀플에 참여하세요!\n팀플 ID : ${teamId}`,
      });
    } catch {
      if (Platform.OS === 'android') {
        ToastAndroid.showWithGravity(
          '공유에 실패했습니다.',
          ToastAndroid.SHORT,
          ToastAndroid.BOTTOM,
        );
      } else {
        Alert.alert('Teamplay', '공유에 실패했습니다.', [{text: '확인'}]);
      }
    }
  };
  // API 호출
  /* ------------- 팀플 생성 API -------------
  // req로 받아야하는 데이터 형식
  {
    uid: user id
    userName: user name
    teamId: 팀플 id (랜덤 생성)
    name: 팀플 이름
    leture: 수업 이름
    description: 팀플 설명
  }

  // 응답 형식 -> res.data.isCompleted
  성공 -> isCompleted: true
  실패 -> isCompleted: false
*/
  const createTeam = async () => {
    console.log('api 호출됨');
    console.log('보내는 정보: ' + uid, teamId, name, lecture, description);

    let eName = name.replace(/(?:\n\r|\n|\r)/g, ' ');
    let eLecture = lecture.replace(/(?:\n\r|\n|\r)/g, ' ');
    let eDescription = description.trim();
    console.log(eName, eLecture, eDescription);

    await axios
      .post('/api/createTeam', {
        uid: uid,
        userName: displayName,
        teamId: truncId,
        name: eName,
        lecture: eLecture,
        description: eDescription,
        fcmToken: fcmToken,
      })
      .then(res => {
        if (res.data.isCompleted) {
          console.log('Team created successfully.');
        } else {
          console.log('Team creation failed.');
          if (Platform.OS === 'android') {
            ToastAndroid.showWithGravity(
              '팀플 생성에 실패했습니다.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          } else {
            Alert.alert('Teamplay', '팀플 생성에 실패했습니다.', [
              {text: '확인'},
            ]);
          }
        }
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Error', err);
      });
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={-150}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={{fontSize: 20}}>X</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          {submitted ? null : (
            <>
              <Text style={styles.headerText}>새로운 팀플 시작하기</Text>
              <Text style={{marginBottom: 30}}>
                팀플에 대한 정보를 입력하세요.
              </Text>
            </>
          )}

          {submitted ? (
            <>
              <Text style={styles.headerText}>
                새로운 팀플 개설이{'\n'}완료되었습니다!
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 16,
                  color: 'black',
                  marginTop: 60,
                }}>
                팀원들에게 팀플 ID를 공유하고{'\n'}팀플을 시작하세요!
              </Text>
              <Text style={styles.teamId}>{teamId}</Text>
              <PinkButton text="공유하기" light={true} onPress={onShareId} />
            </>
          ) : (
            <View style={styles.container}>
              <TextInput
                style={styles.input}
                placeholder="팀플명 입력"
                value={name}
                numberOfLines={1}
                maxLength={14}
                onChangeText={text => setName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="수업명 입력"
                value={lecture}
                numberOfLines={1}
                maxLength={14}
                onChangeText={text => setLecture(text)}
              />
              <TextInput
                style={[styles.input, {height: 80}]}
                placeholder="팀플 설명 입력"
                multiline={true}
                numberOfLines={3}
                maxLength={20}
                value={description}
                onChangeText={text => setDescription(text)}
              />
              <View style={styles.button}>
                {name && lecture && description ? (
                  <PinkButton
                    text="시작하기"
                    light={true}
                    onPress={handleButtonPress}
                  />
                ) : (
                  <PinkButton text="시작하기" light={false} />
                )}
              </View>
              <Text style={{marginTop: 10}}>{displayText}</Text>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '90%',
    paddingHorizontal: 5,
    margin: 10,
    alignItems: 'flex-end',
    marginBottom: 50,
  },
  contentContainer: {
    alignItems: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
    marginBottom: 5,
  },
  teamId: {
    fontSize: 20,
    backgroundColor: '#D2D2D2',
    color: 'black',
    borderRadius: 10,
    width: 200,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    margin: 60,
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
  button: {
    margin: 50,
  },
});

export default StartNew;
