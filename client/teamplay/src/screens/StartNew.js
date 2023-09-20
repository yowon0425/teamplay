import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Button from '../components/Button';

const StartNew = () => {
  const [teamName, setTeamName] = useState(''); // 팀플 이름을 저장
  const [className, setClassName] = useState(''); // 수업 이름을 저장
  const [member, setMember] = useState(''); // 인원수를 저장
  const [teamExplain, setTeamExplain] = useState(''); // 팀플 설명을 저장
  const [displayText, setDisplayText] = useState('');
  const [submitted, setSubmitted] = useState(false); // 제출 여부를 저장할 상태 변수

  const handleButtonPress = () => {
    // 여기에서 팀플 ID를 서버에 제출하거나 처리할 작업을 수행합니다.
    // 이 예제에서는 단순히 submitted 상태를 변경합니다.
    setSubmitted(true);
  };

  return (
    <View style={styles.container}>
      {submitted ? (
        <Text style={styles.headerText}>
          새로운 팀플 개설이 {"\n"}
          완료되었습니다! {"\n"}
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
        value={member}
        onChangeText={(text) => setMember(text)}
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
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
   input: {
    width: '100%', // 넓이를 100%로 설정하여 화면 전체 너비를 차지하도록 합니다.
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingLeft: 10,
    marginVertical: 10,
  },
});

export default StartNew;