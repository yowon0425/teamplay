import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import Button from '../components/Button';
import {v4 as uuidv4} from 'uuid';
import {getRandomBase64} from 'react-native-get-random-values';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

const StartNew = () => {
  const [name, setName] = useState('');
  const [lecture, setLecture] = useState('');
  const [numOfMember, setNumOfMember] = useState('');
  const [description, setDescription] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [teamId, setTeamId] = useState('');
  var truncId;
  const {uid} = auth().currentUser;
  //const userName = auth().currentUserInfo;
  //console.log('cur user info: ' + userName); // 유저이름 어떻게 가져오는지 모르겠음
  // 팀원 수 받지 않기

  const handleButtonPress = async () => {
    try {
      const newTeamId = uuidv4({random: getRandomBase64}); // 이 자체로 쓰면 띄어쓰기때문에 문서 이름으로 등록이 안돼서 가공 필요할듯
      console.log('newid: ' + newTeamId);
      truncId = newTeamId.slice(0, 10);

      setTeamId(newTeamId);
      setSubmitted(true);
      createTeam();
    } catch {}
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
    numOfMember: 팀원 수
    description: 팀플 설명
  }

  // 응답 형식 -> res.data.isCompleted
  성공 -> isCompleted: true
  실패 -> isCompleted: false
*/
  const createTeam = async () => {
    console.log('api 호출됨');
    console.log(
      '보내는 정보: ' + uid,
      teamId,
      name,
      lecture,
      numOfMember,
      description,
    );
    //console.log(userName);
    await axios
      .post('/api/createTeam', {
        uid: uid,
        userName: uid,
        teamId: truncId,
        name,
        lecture,
        numOfMember,
        description,
      })
      .then(res => {
        if (res.data.isCompleted) {
          console.log('Team created successfully.');
        } else {
          console.log('Team creation failed.');
        }
      })
      .catch(err => console.log(err));
  };

  /*const response = await axios.post('/api/createTeam', {
    uid: userObj.uid,
        userName: userObj.userName,
        name,
        lecture,
        teamId: truncatedTeamId,
        numOfMember,
        description,
        member: [userObj],
      });

      if (response.data.isCompleted) {
        console.log('Team created successfully.');
      } else {
        console.log('Team creation failed.');
      }
    } catch (err) {
      console.log('[error]: ', err);
    }
  };*/

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, color: 'black'}}>새로운 팀플 시작하기</Text>

      {submitted ? (
        <Text style={styles.headerText}>
          새로운 팀플 개설이 {'\n'}
          완료되었습니다! {'\n'}
          {'\n'}팀 ID: {truncId} {'\n'}
          {'\n'}
        </Text>
      ) : (
        <View style={styles.container}>
          <Text>팀플에 대한 정보를 입력하세요.</Text>
          <TextInput
            style={styles.input}
            placeholder="            팀플명 입력            "
            value={name}
            onChangeText={text => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="            수업명 입력            "
            value={lecture}
            onChangeText={text => setLecture(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="            팀원수 입력            "
            value={numOfMember}
            onChangeText={text => setNumOfMember(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="            팀플 설명 입력            "
            value={description}
            onChangeText={text => setDescription(text)}
          />
          <Button
            style={styles.input}
            text="시작하기"
            light={true}
            onPress={handleButtonPress}
          />
          <Text style={{marginTop: 10}}>{displayText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingLeft: 10,
    marginVertical: 10,
  },
});

export default StartNew;
