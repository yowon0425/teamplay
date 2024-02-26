import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import PinkButton from './PinkButton';
import DatePicker from 'react-native-date-picker';
import auth from '@react-native-firebase/auth';
import axios from 'axios';

const TodoModal = ({teamId, name, isVisible, newTodo}) => {
  const {uid} = auth().currentUser;
  const now = new Date();
  const [content, setContent] = useState('');
  const [date, setDate] = useState(now);
  const [time, setTime] = useState(now);
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);

  /* 프로젝트 계획 추가하기 */
  const addTodo = async () => {
    const selectedDue =
      date.toLocaleDateString('ko-KR', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      }) +
      ' ' +
      time.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        hour12: false,
        minute: '2-digit',
      });
    console.log('addtodo 안');
    try {
      await axios
        .post('/api/todo', {
          teamId,
          memberId: uid,
          todoData: {
            number: 2,
            content,
            deadline: selectedDue,
            isCompleted: false,
          },
        })
        .then(res => {
          if (res.data) {
            console.log('계획 등록');
            console.log({
              teamId,
              memberId: uid,
            });
          } else {
            console.log('등록 실패');
          }
        })
        .catch(err => console.log(err));
    } catch (err) {
      console.log('catch: ' + err);
    }
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      statusBarTranslucent={false}
      transparent={true}>
      <TouchableOpacity style={styles.modalOverlay}>
        <View style={styles.modalScreen}>
          <View style={styles.header}>
            <Text style={styles.title}> </Text>
            <Text style={styles.title}>계획 추가</Text>
            <Text style={styles.x}>X</Text>
          </View>
          <View style={styles.contentContainer}>
            <View style={styles.inputName}>
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
                      {date.toLocaleDateString('ko-KR', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                      })}
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
                  minimumDate={now}
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
                  date={time}
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
      </TouchableOpacity>
    </Modal>
  );
};

export default TodoModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
  inputName: {},
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
