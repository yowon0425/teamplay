import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Button from '../components/Button';
import { v4 as uuidv4 } from 'uuid';
import { getRandomBase64 } from 'react-native-get-random-values';

const StartNew = () => {
  const [teamName, setTeamName] = useState(''); // 팀플 이름을 저장
  const [className, setClassName] = useState(''); // 수업 이름을 저장
  const [nunOfMember, setNunOfMember] = useState(''); // 인원수를 저장
  const [teamExplain, setTeamExplain] = useState(''); // 팀플 설명을 저장
  const [displayText, setDisplayText] = useState('');
  const [submitted, setSubmitted] = useState(false); // 제출 여부를 저장할 상태 변수
  const [teamId, setTeamId] = useState('');

  const handleButtonPress = () => {
    const newTeamId = uuidv4({ random: getRandomBase64 });
    const truncatedTeamId = newTeamId.slice(0, 10);
    setTeamId(truncatedTeamId);
    setSubmitted(true);
  };

  return (
    <View style={styles.container}>
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
      <Text style={styles.headerText}>새로운 팀플 시작하기</Text>
      <Text>팀플에 대한 정보를 입력하세요.</Text>
      <TextInput
        style={styles.input}
        placeholder="            팀플명 입력            "
        value={teamName}
        onChangeText={(text) => setTeamName(text)}
        
      />
      <TextInput
        style={styles.input}
        placeholder="            수업명 입력            "
        value={className}
        onChangeText={(text) => setClassName(text)}
        
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
        value={teamExplain}
        onChangeText={(text) => setTeamExplain(text)}
        
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
    top: '10%',
  },
  headerText: {
    top: '50%',
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