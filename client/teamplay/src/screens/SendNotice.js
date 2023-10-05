import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import {Picker} from '@react-native-picker/picker';
import Button from '../components/Button';

const SendNotice = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>회원정보</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputLine}>
          <Text style={styles.text}>알림 제목</Text>
          <TextInput style={styles.input} />
        </View>
        <View style={styles.pickerLine}>
          <Text style={styles.text}>알림 종류</Text>
          <Picker style={styles.typePicker}>
            <Picker.Item label="공지" value="notice" />
            <Picker.Item label="확인요청" value="check" />
            <Picker.Item label="독려" value="encouragement" />
          </Picker>
        </View>
        <View style={styles.pickerLine}>
          <Text style={styles.text}>보낼 사람</Text>
          <Picker style={styles.peoplePicker}>
            <Picker.Item label="모두" value="all" />
            <Picker.Item label="자료조사" value="research" />
            <Picker.Item label="PPT" value="ppt" />
            <Picker.Item label="발표" value="presentation" />
            <Picker.Item label="직접 선택하기" value="pick" />
          </Picker>
        </View>
        <View style={styles.inputLine}>
          <Text style={styles.text}>알림 내용</Text>
          <TextInput style={styles.commentInput} />
        </View>
      </View>
      <Button text="알림 보내기" light={true} />
    </View>
  );
};

export default SendNotice;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    margin: 10,
  },
  inputContainer: {
    width: '80%',
    backgroundColor: 'yellow',
    marginBottom: 30,
  },
  inputLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    backgroundColor: 'red',
    margin: 10,
  },
  text: {
    fontSize: 14,
    color: 'black',
    fontWeight: '100',
    marginRight: 15,
  },
  input: {
    borderRadius: 10,
    borderColor: '#6C6C6C',
    borderWidth: 1,
    width: '60%',
    height: 30,
    fontSize: 14,
    padding: 5,
  },
  pickerLine: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    backgroundColor: 'blue',
    margin: 10,
  },
  typePicker: {
    borderRadius: 10,
    borderColor: '#6C6C6C',
    borderWidth: 1,
    width: '55%',
    height: 30,
    fontSize: 12,
  },
  peoplePicker: {
    borderRadius: 10,
    borderColor: '#6C6C6C',
    borderWidth: 1,
    width: '55%',
    height: 30,
    fontSize: 12,
  },
  commentInput: {
    borderRadius: 10,
    borderColor: '#6C6C6C',
    borderWidth: 1,
    width: '60%',
    height: 150,
    fontSize: 14,
    padding: 5,
  },
});
