import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import Button from '../components/Button';

const LogIn = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원정보</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputLine}>
          <Text style={styles.text}>이름</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.inputLine}>
          <Text style={styles.text}>학교</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.inputLine}>
          <Text style={styles.text}>학번</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.inputLine}>
          <Text style={styles.text}>전공</Text>
          <TextInput style={styles.input} />
        </View>
      </View>
      <Button text="시작하기" light={true} />
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
