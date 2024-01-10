import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Button from '../components/Button';
import { v4 as uuidv4 } from 'uuid';
import { getRandomBase64 } from 'react-native-get-random-values';
import axios from 'axios';

const StartNew = () => {
  const [name, setName] = useState('');
  const [lecture, setLecture] = useState('');
  const [nunOfMember, setNunOfMember] = useState('');
  const [description, setDescription] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [teamId, setTeamId] = useState('');

  const handleButtonPress = async () => {
    try {
      const newTeamId = uuidv4({ random: getRandomBase64 });
      const truncatedTeamId = newTeamId.slice(0, 10);

      setTeamId(truncatedTeamId);
      setSubmitted(true);

      const userObj = {
        uid: 'D0zT5KbB36MttJMA18DinFR4NTC3',
        userName: '채요원',
      };

      // API 호출
      const response = await axios.post('/api/createTeam', {
        uid: userObj.uid,
        userName: userObj.userName,
        name,
        lecture,
        teamId: truncatedTeamId,
        nunOfMember,
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
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, color: 'black' }}>새로운 팀플 시작하기</Text>

      {submitted ? (
        <Text style={styles.headerText}>
          새로운 팀플 개설이 {"\n"}
          완료되었습니다! {"\n"}
          {"\n"}
          팀 ID: {teamId} {"\n"}
          {"\n"}
        </Text>
      ) : (
        <View style={styles.container}>
          <Text>팀플에 대한 정보를 입력하세요.</Text>
          <TextInput
            style={styles.input}
            placeholder="            팀플명 입력            "
            value={name}
            onChangeText={(text) => setName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="            수업명 입력            "
            value={lecture}
            onChangeText={(text) => setLecture(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="            팀원수 입력            "
            value={nunOfMember}
            onChangeText={(text) => setNunOfMember(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="            팀플 설명 입력            "
            value={description}
            onChangeText={(text) => setDescription(text)}
          />
          <Button
            style={styles.input}
            text="시작하기"
            light={true}
            onPress={handleButtonPress}
          />
          <Text style={{ marginTop: 10 }}>{displayText}</Text>
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
