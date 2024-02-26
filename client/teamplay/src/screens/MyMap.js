import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import MenuBar from '../components/TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import PinkButton from '../components/PinkButton';
import Entypo from 'react-native-vector-icons/Entypo';
import auth from '@react-native-firebase/auth';
import TodoModal from '../components/TodoModal';
import {Shadow} from 'react-native-shadow-2';

const MyMap = ({teamId}) => {
  const {uid} = auth().currentUser;
  const [todos, setTodos] = useState();
  const [showNewTodo, setShowNewTodo] = useState(false);
  const [showEditTodo, setShowEditTodo] = useState(false);
  const [showMiniModal, setShowMiniModal] = useState(false);
  console.log('map user: ' + uid + '/teamId: ' + teamId);

  /* 프로젝트 계획 받아오기 */
  /*const getTodos = async () => {
    await axios
      .post('/api/teamData/todos', teamId)
      .then(res => {
        if (res.data) {
          const data = JSON.stringify(res.data);
          console.log('todos : ' + data);
          setTodos(res.data);
        } else {
          // 실패 시 할 작업
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getTodos();
    console.log('투두 불러오는 함수 실행');
  }, []);*/

  // 데이터 개수 처리 함수
  let numCompleted;
  let numTodo;
  let nowTodo;
  const countTodo = todoData => {
    // 필터 써서 개수 구하는 함수
  };

  /* 모달 관리 */
  const modalOpen = () => {
    console.log(showModal);
    setShowModal(true);
  };

  const modalClose = e => {
    setShowModal(false);
    if (e.target == outside.current) {
      console.log(showModal);
      setShowModal(false);
    }
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
        <View style={styles.mapContainer}>
          <View style={styles.maps}>
            <View style={styles.map}>
              <LinearGradient
                style={styles.coloredCircle}
                colors={['#033495', '#AEE4FF']}>
                <Text style={styles.mapNum}>1</Text>
              </LinearGradient>
              <View style={styles.plan}>
                <Text style={styles.planTitle}>자료 조사</Text>
                <Text style={styles.planDue}>8/20 20:00</Text>
              </View>
            </View>
            <LinearGradient
              style={styles.line}
              colors={['#033495', '#AEE4FF']}
            />
            <View style={styles.map}>
              <MaskedView
                maskElement={
                  <View style={styles.strokedCircle}>
                    <Text style={styles.mapNumB}>2</Text>
                  </View>
                }>
                <LinearGradient
                  style={styles.coloredCircle}
                  colors={['#033495', '#AEE4FF']}
                />
              </MaskedView>
              <View style={styles.plan}>
                <Text style={styles.planTitle}>자료 조사</Text>
                <Text style={styles.planDue}>8/20 20:00</Text>
              </View>
            </View>
            <View style={[styles.line, {backgroundColor: '#7D7D7D'}]} />
            <View style={styles.map}>
              <View style={styles.circle}>
                <Text style={styles.mapNumB}>3</Text>
              </View>
              <View style={styles.plan}>
                <Text style={styles.planTitle}>자료 조사</Text>
                <Text style={styles.planDue}>8/20 20:00</Text>
              </View>
            </View>
            <View style={[styles.line, {backgroundColor: '#7D7D7D'}]} />
            <View style={styles.map}>
              <View style={styles.circle}>
                <Text style={styles.mapNumB}>4</Text>
              </View>
              <View style={styles.plan}>
                <Text style={styles.planTitle}>자료 조사</Text>
                <Text style={styles.planDue}>8/20 20:00</Text>
              </View>
            </View>
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
              <View style={styles.modalView}>
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
                    setShowEditTodo(!showEditTodo);
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
        <TodoModal teamId={teamId} />
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
    height: '75%',
  },
  maps: {
    width: '75%',
    height: '80%',
    margin: 50,
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
    height: 80,
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
