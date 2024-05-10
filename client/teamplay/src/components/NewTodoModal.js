import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import PinkButton from './PinkButton';
import DatePicker from 'react-native-date-picker';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import Modal from 'react-native-modal';

const NewTodoModal = ({teamId, isVisible, showTodo, num, setClickButton}) => {
  const {uid} = auth().currentUser;
  const initialDate = new Date();
  const [content, setContent] = useState('');
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialDate);
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState();

  /* 프로젝트 계획 추가하기 */
  const addTodo = async () => {
    const selectedDue =
      date.toISOString().slice(0, 10) +
      ' ' +
      time.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
      });
    try {
      await axios
        .post('/api/todo', {
          uid,
          teamId,
          memberId: uid,
          todoData: {
            number: num,
            content,
            deadline: selectedDue,
            isCompleted: false,
          },
        })
        .then(res => {
          if (res.data) {
            console.log('계획 등록');
          } else {
            console.log('등록 실패');
            Alert.alert('Teamplay', '계획 등록에 실패했습니다.');
          }
          setIsCompleted(res.data);
        })
        .catch(err => console.log(err));
    } catch (err) {
      console.log('catch: ' + err);
      Alert.alert('Error', err);
    }
    setClickButton(true);
  };

  useEffect(() => {
    showTodo(false);
  }, [isCompleted]);

  return (
    <Modal
      isVisible={isVisible}
      swipeDirection={['down']}
      useNativeDriverForBackdrop
      onSwipeComplete={() => showTodo(false)}
      onBackdropPress={() => showTodo(false)}
      onBackButtonPress={() => showTodo(false)}
      style={styles.modal}>
      <View style={styles.modalScreen}>
        <View style={styles.header}>
          <Text style={styles.title}> </Text>
          <Text style={styles.title}>계획 등록</Text>
          <TouchableOpacity
            onPress={() => {
              showTodo(false);
            }}>
            <Text style={styles.x}>X</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <View>
            <Text style={styles.text}>계획 이름</Text>
            <Text style={styles.text}>기한</Text>
          </View>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              onChangeText={text => setContent(text)}
            />
            <View style={styles.boxLine}>
              <View style={styles.pickerLine}>
                <TouchableOpacity
                  style={styles.picker}
                  onPressIn={() => setDateOpen(true)}>
                  <Text style={styles.inputText}>
                    {date.toISOString().slice(0, 10)}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.picker}
                  onPressIn={() => setTimeOpen(true)}>
                  <Text style={styles.inputText}>
                    {time.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      hour12: true,
                      minute: '2-digit',
                    })}
                  </Text>
                </TouchableOpacity>
              </View>
              <DatePicker
                modal
                mode="date"
                title="날짜 선택"
                open={dateOpen}
                date={date}
                locale="ko"
                cancelText="취소"
                confirmText="확인"
                minimumDate={initialDate}
                onConfirm={date => {
                  setDateOpen(false);
                  setDate(date);
                  console.log(date);
                }}
                onCancel={() => {
                  setDateOpen(false);
                }}
              />
              <DatePicker
                modal
                mode="time"
                title="시간 선택"
                open={timeOpen}
                date={date}
                locale="ko"
                cancelText="취소"
                confirmText="확인"
                onConfirm={time => {
                  setTimeOpen(false);
                  setTime(time);
                  console.log(time);
                }}
                onCancel={() => {
                  setTimeOpen(false);
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          {content && date && time ? (
            <PinkButton text="완료" light={true} onPress={addTodo} />
          ) : (
            <PinkButton text="완료" light={false} />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default NewTodoModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalScreen: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingTop: 15,
  },
  header: {
    alignItems: 'center',
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 20,
    color: 'black',
  },
  x: {
    fontSize: 20,
  },
  contentContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  inputBox: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: 230,
  },
  boxLine: {
    flexDirection: 'row',
  },
  text: {
    fontSize: 14,
    height: 30,
    color: 'black',
    fontWeight: '100',
    marginVertical: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  input: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    width: 220,
    height: 30,
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  inputText: {
    fontSize: 14,
    color: 'black',
  },
  pickerLine: {
    flexDirection: 'row',
    width: 220,
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  picker: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    width: '47%',
    height: 30,
    fontSize: 16,
    padding: 5,
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 80,
  },
});
