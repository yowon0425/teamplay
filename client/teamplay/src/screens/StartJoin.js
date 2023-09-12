import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput} from 'react-native';
import Button from '../components/Button';

const StartJoin = () => {
  const [teamId, setTeamId] = useState(''); // 팀플 ID를 저장할 상태 변수

  const handleJoinButtonPress = () => {
    // 팀플 참가 버튼을 눌렀을 때 처리할 로직을 여기에 추가할 수 있습니다.
    // 예를 들어, 팀플 ID를 사용하여 서버에 요청을 보내거나 다른 작업을 수행할 수 있습니다.
    console.log('팀플 ID:', teamId);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>새로운 팀플 참가하기</Text>
      <Text>참가할 팀플의 ID를 입력하세요.</Text>
      <TextInput
        style={styles.input}
        placeholder="팀플 ID 입력"
        value={teamId}
        onChangeText={(text) => setTeamId(text)}
        
      />
      <Button 
      style={styles.input}
      text="참가하기" light={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    top: '70%',
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
