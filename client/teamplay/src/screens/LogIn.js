import {StyleSheet, Text, View, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import Button from '../components/Button';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

axios.defaults.baseURL = 'http://10.0.2.2:4000';

const LogIn = () => {
  const navigator = useNavigation();
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [studentId, setStudentId] = useState('');
  const [major, setMajor] = useState('');
  const [signedUp, setSignedUp] = useState(false);

  /* ---------- 회원 가입 이후 redirect ---------- */
  useEffect(() => {
    if (signedUp) {
      navigator.navigate('TeamList');
    }
  }, [signedUp]);

  /* ---------- 회원 가입 함수 ---------- */
  const onClickSignUp = async () => {
    const {uid, email} = auth().currentUser;

    // 회원 가입 api 요청
    await axios
      .post('/api/signup', {
        uid,
        email,
        name,
        studentId,
        organization,
        major,
      })
      .then(res => {
        if (res.data.isSaved) {
          setSignedUp(res.data.isSaved);
        } else {
          console.log('save failed.');
        }
      })
      .catch(err => console.log('[error]: ', err));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원정보</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputLine}>
          <Text style={styles.text}>이름</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={text => setName(text)}
          />
        </View>
        <View style={styles.inputLine}>
          <Text style={styles.text}>학교</Text>
          <TextInput
            style={styles.input}
            value={organization}
            onChangeText={text => setOrganization(text)}
          />
        </View>
        <View style={styles.inputLine}>
          <Text style={styles.text}>학번</Text>
          <TextInput
            style={styles.input}
            value={studentId}
            onChangeText={text => setStudentId(text)}
          />
        </View>
        <View style={styles.inputLine}>
          <Text style={styles.text}>전공</Text>
          <TextInput
            style={styles.input}
            value={major}
            onChangeText={text => setMajor(text)}
          />
        </View>
      </View>
      <Button text="시작하기" light={true} onPress={onClickSignUp} />
    </View>
  );
};

// 키보드에 인풋박스 가리는거 해결하기

export default LogIn;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
    margin: 50,
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputLine: {
    flexDirection: 'row',
    margin: 18,
  },
  text: {
    fontSize: 20,
    color: 'black',
    fontWeight: '100',
    marginRight: 15,
  },
  input: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    width: '60%',
    height: 30,
    fontSize: 16,
    padding: 5,
  },
});
