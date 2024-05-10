import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import PinkButton from '../components/PinkButton';
import Entypo from 'react-native-vector-icons/Entypo';
import auth from '@react-native-firebase/auth';
import NewTodoModal from '../components/NewTodoModal';
import {Shadow} from 'react-native-shadow-2';
import axios from 'axios';
import EditTodoModal from '../components/EditTodoModal';
import MyMapBubble from '../components/MyMapBubble';

const MyMap = ({teamId}) => {
  const {uid} = auth().currentUser;
  const [todos, setTodos] = useState();
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [showEditTodo, setShowEditTodo] = useState(false);
  const [showMiniModal, setShowMiniModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editNum, setEditNum] = useState();
  const [numTodo, setNumTodo] = useState(0);
  const [nowTodo, setNowTodo] = useState(0);
  const [numNewTodo, setNumNewTodo] = useState(0);
  const [clickButton, setClickButton] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  /* 프로젝트 계획 받아오기 */
  const getTodos = async () => {
    await axios
      .post('/api/teamData/todos', {teamId})
      .then(res => {
        if (res.data) {
          setTodos(res.data[uid]);
          setErrorMsg('');
        } else {
          setErrorMsg('계획을 불러오지 못했습니다.');
        }
      })
      .catch(err => Alert.alert('Error', err));
  };

  useEffect(() => {
    getTodos();
    setClickButton(false);
  }, [editMode, clickButton]);

  useEffect(() => {
    countTodo();
  }, [todos]);

  // 데이터 개수 처리 함수
  var todo = 0;
  var numCompleted = 0;
  const countTodo = () => {
    for (let key in todos) {
      todo += 1;
      if (todos[key].isCompleted == true) {
        numCompleted += 1;
      }
    }
    setNumTodo(todo);
    setNowTodo(numCompleted + 1);
    setNumNewTodo(todo + 1);
  };

  /* 계획 완료하기 */
  const completeTodo = async () => {
    await axios
      .post('/api/changeTodo', {
        teamId,
        memberId: uid,
        newContent: {
          number: nowTodo,
          content: todos[nowTodo].content,
          deadline: todos[nowTodo].deadline,
          isCompleted: true,
        },
      })
      .then(res => {
        if (res.data) {
          console.log('계획 완료');
          setClickButton(true);
        } else {
          Alert.alert(
            'Teamplay',
            '작업 완료 처리에 실패했습니다.\n다시 시도해주세요.',
            [{text: '확인'}],
          );
        }
      })
      .catch(err => Alert.alert('Error', err));
  };

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.top}>
          <View style={{width: 22}} />
          <Text style={styles.title}>프로젝트 계획</Text>
          <TouchableOpacity onPress={() => setShowMiniModal(!showMiniModal)}>
            <Entypo name="dots-three-vertical" style={styles.dot} />
          </TouchableOpacity>
        </View>
        {editMode ? (
          <View style={styles.notice}>
            <Text style={styles.noticeText}>수정할 계획을 선택하세요</Text>
            <TouchableOpacity onPress={() => setEditMode(false)}>
              <Text style={styles.noticeCancel}>취소</Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={styles.mapContainer}>
          <View style={styles.maps}>
            {todos && numTodo > 0 ? (
              Object.keys(todos).map(key => {
                return (
                  <MyMapBubble
                    key={key}
                    teamId={teamId}
                    todoData={todos[key]}
                    nowTodo={nowTodo}
                    editMode={editMode}
                    setEditNum={setEditNum}
                    showEditTodo={setShowEditTodo}
                  />
                );
              })
            ) : (
              <Text style={styles.empty}>
                {errorMsg != ''
                  ? errorMsg
                  : '등록한 계획이 없습니다.\n메뉴를 눌러 계획을 등록해보세요.'}
              </Text>
            )}
          </View>
        </View>
        {numTodo > 0 && numTodo >= nowTodo ? (
          <View style={styles.button}>
            <PinkButton
              text="작업 완료"
              light={true}
              onPress={() =>
                Alert.alert('TeamPlay', '작업을 완료하시겠습니까?', [
                  {
                    text: '취소',
                    style: 'cancel',
                  },
                  {
                    text: '확인',
                    onPress: completeTodo,
                  },
                ])
              }
            />
          </View>
        ) : numTodo == 0 ? null : (
          <View style={styles.button}>
            <PinkButton text="작업 완료" light={false} />
          </View>
        )}
      </ScrollView>
      <View style={styles.modalBoxContainer}>
        <Modal
          animationType="fade"
          visible={showMiniModal}
          transparent={true}
          onRequestClose={() => setShowMiniModal(!showMiniModal)}
          onPress={() => setShowMiniModal(!showMiniModal)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowMiniModal(!showMiniModal)}>
            <Shadow>
              <View
                style={[
                  styles.modalView,
                  {height: todos && numTodo > 0 ? 80 : 40},
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    setShowMiniModal(!showMiniModal);
                    setShowNewTodo(!showNewTodo);
                  }}
                  style={styles.modalTextContainer}>
                  <Text style={styles.modalText}>계획 등록</Text>
                </TouchableOpacity>
                {todos && numTodo > 0 ? (
                  <>
                    <View style={styles.modalLine} />
                    <TouchableOpacity
                      onPress={() => {
                        setShowMiniModal(!showMiniModal);
                        setEditMode(true);
                      }}
                      style={styles.modalTextContainer}>
                      <Text style={styles.modalText}>계획 수정</Text>
                    </TouchableOpacity>
                  </>
                ) : null}
              </View>
            </Shadow>
          </TouchableOpacity>
        </Modal>
      </View>
      <NewTodoModal
        teamId={teamId}
        showTodo={setShowNewTodo}
        isVisible={showNewTodo}
        num={numNewTodo}
        editMode={editMode}
        setEditMode={setEditMode}
        setClickButton={setClickButton}
      />
      {editMode && todos[editNum] ? (
        <EditTodoModal
          teamId={teamId}
          showTodo={setShowEditTodo}
          isVisible={showEditTodo}
          todoData={editNum ? todos[editNum] : null}
          num={editNum}
          editMode={editMode}
          setEditMode={setEditMode}
          setClickButton={setClickButton}
        />
      ) : null}
    </View>
  );
};

export default MyMap;

const styles = StyleSheet.create({
  // 화면 스타일
  top: {
    alignSelf: 'center',
    width: '90%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    margin: 10,
  },
  notice: {
    padding: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  noticeText: {
    fontSize: 14,
  },
  noticeCancel: {
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  title: {
    fontSize: 20,
    color: 'black',
  },
  dot: {
    fontSize: 20,
    color: 'black',
    alignContent: 'flex-end',
  },
  progress: {
    width: '100%',
    margin: 20,
    alignItems: 'center',
  },
  info: {
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  bar: {
    width: '80%',
    height: 10,
    borderRadius: 20,
    borderColor: 'black',
    unfilledColor: 'gray',
  },
  mapContainer: {
    alignItems: 'center',
  },
  maps: {
    width: '75%',
    margin: 40,
  },
  map: {
    flexDirection: 'row',
  },
  coloredCircle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strokedCircle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderCurve: 100,
    backgroundColor: '#D9D9D9',
    borderColor: '#7D7D7D',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapNum: {
    fontSize: 20,
    color: 'white',
  },
  mapNumB: {
    color: 'black',
    fontSize: 20,
  },
  plan: {
    marginLeft: 15,
  },
  planTitle: {
    fontSize: 16,
    color: 'black',
  },
  planDue: {
    fontSize: 12,
    color: 'black',
  },
  line: {
    height: 90,
    width: 2,
    left: 20,
  },
  empty: {
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 100,
  },
  button: {
    alignItems: 'center',
    margin: 40,
  },

  // 미니모달 스타일
  modalBoxContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'flex-end',
    right: 10,
    top: 45,
  },
  modalView: {
    backgroundColor: 'white',
    width: 130,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  modalTextContainer: {
    alignItems: 'center',
    height: '50%',
    width: '100%',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  modalLine: {
    height: 1,
    width: '95%',
    backgroundColor: '#E8E8E8',
  },
});
