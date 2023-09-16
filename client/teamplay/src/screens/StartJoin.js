import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Button from '../components/Button';

const StartJoin = () => {
  const [teamId, setTeamId] = useState(''); // 팀플 ID를 저장할 상태 변수
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