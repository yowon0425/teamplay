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
import MapBubble from '../components/MapBubble';
import EditTodoModal from '../components/EditTodoModal';

const MyMap = ({teamId}) => {
  const {uid} = auth().currentUser;
  const [todos, setTodos] = useState();
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [showEditTodo, setShowEditTodo] = useState(false);
  const [showMiniModal, setShowMiniModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editNum, setEditNum] = useState();
  const [nowTodo, setNowTodo] = useState(0);
  const [numNewTodo, setNumNewTodo] = useState(0);

  // 계획 없을 때 수정할 수 없게 오류처리 필요

  /* 프로젝트 계획 받아오기 */
  const getTodos = async () => {
    await axios
      .post('/api/teamData/todos', {teamId})
      .then(res => {
        if (res.data) {
          setTodos(res.data[uid]);
        } else {
          // 실패 시 할 작업
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getTodos();
    console.log('투두 불러오는 함수 실행');
  }, [showNewTodo, showEditTodo]);

  useEffect(() => {
    countTodo();
  }, [todos]);

  // 데이터 개수 처리 함수
  var numTodo = 0;
  var numCompleted = 0;
  const countTodo = () => {
    for (let key in todos) {
      numTodo += 1;
      if (todos[key].isCompleted == true) {
        numCompleted += 1;
      }
    }
    setNowTodo(numCompleted + 1);
    setNumNewTodo(numTodo + 1);
    console.log('전체 투두 : ' + numTodo);
    console.log('완료 투두 : ' + numCompleted);
    console.log('지금 투두 : ' + nowTodo);
  };

  return (
    <View>
      <ScrollView style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.title}> </Text>
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
            {todos &&
              Object.keys(todos).map(key => {
                return (
                  <MapBubble
                    key={key}
                    todoData={todos[key]}
                    nowTodo={nowTodo}
                    editMode={editMode}
                    setEditNum={setEditNum}
                    showEditTodo={setShowEditTodo}
                  />
                );
              })}
          </View>
        </View>
        <View style={styles.button}>
          <PinkButton text="작업 완료" light={false} />
        </View>
      </ScrollView>
      <View style={styles.modalBoxContainer}>
        <Modal
          style={styles.modal}
          animationType="fade"
          visible={showMiniModal}
          transparent={true}
          onRequestClose={() => setShowMiniModal(!showMiniModal)}
          onPress={() => setShowMiniModal(!showMiniModal)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setShowMiniModal(!showMiniModal)}>
            <Shadow>
              <View style={[styles.modalView, {height: 80}]}>
                <TouchableOpacity
                  onPress={() => {
                    setShowMiniModal(!showMiniModal);
                    setShowNewTodo(!showNewTodo);
                  }}
                  style={styles.modalTextContainer}>
                  <Text style={styles.modalText}>계획 등록</Text>
                </TouchableOpacity>
                <View style={styles.modalLine} />
                <TouchableOpacity
                  onPress={() => {
                    setShowMiniModal(!showMiniModal);
                    setEditMode(true);
                  }}
                  style={styles.modalTextContainer}>
                  <Text style={styles.modalText}>계획 수정</Text>
                </TouchableOpacity>
              </View>
            </Shadow>
          </TouchableOpacity>
        </Modal>
      </View>
      <View style={styles.modalContainer}>
        <NewTodoModal
          teamId={teamId}
          showTodo={setShowNewTodo}
          isVisible={showNewTodo}
          num={numNewTodo}
          editMode={editMode}
          setEditMode={setEditMode}
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
          />
        ) : null}
      </View>
    </View>
  );
};

export default MyMap;

const styles = StyleSheet.create({
  // 화면 스타일
  container: {},
  top: {
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
    margin: 10,
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

  // 모달 위치 설정
  modalContainer: {
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    flex: 1,
  },
});
