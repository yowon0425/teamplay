import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput} from 'react-native';
import Button from '../components/Button';

const StartNew = () => {
  const [teamName, setTeamName] = useState(''); // 팀플 이름을 저장
  const [className, setClassName] = useState(''); // 수업 이름을 저장
  const [member, setMember] = useState(''); // 인원수를 저장
  const [teamExplain, setTeamExplain] = useState(''); // 팀플 설명을 저장

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>새로운 팀플 시작하기</Text>
      <Text>팀플에 대한 정보를 입력하세요.</Text>
      <TextInput
        style={styles.input}
        placeholder="팀플명 입력"
        value={teamName}
        onChangeText={(text) => setTeamName(text)}
        
      />
      <TextInput
        style={styles.input}
        placeholder="수업명 입력"
        value={className}
        onChangeText={(text) => setClassName(text)}
        
      />
      <TextInput
        style={styles.input}
        placeholder="팀원수 입력"
        value={member}
        onChangeText={(text) => setMember(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="팀플 설명 입력"
        value={teamExplain}
        onChangeText={(text) => setTeamExplain(text)}
        
      />
      <Button 
      style={styles.input}
      text="시작하기" light={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    top: '10%',
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

export default StartNew;
