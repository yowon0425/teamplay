import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import MenuBar from '../components/TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import axios from 'axios';
import MemberMapBubble from '../components/MemberMapBubble';

const MemberMap = ({teamId, memberId}) => {
  const [todos, setTodos] = useState();
  const [nowTodo, setNowTodo] = useState(0);
  console.log('멤버맵: ' + teamId);
  console.log('member map: ' + memberId);

  /* 프로젝트 계획 받아오기 */
  const getTodos = async () => {
    await axios
      .post('/api/teamData/todos', {teamId})
      .then(res => {
        if (res.data) {
          setTodos(res.data[memberId]);
        } else {
          // 실패 시 할 작업
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getTodos();
    console.log('투두 불러오는 함수 실행');
  }, []);

  useEffect(() => {
    countTodo();
  }, [todos]);

  // 데이터 개수 처리 함수
  var numCompleted = 0;
  const countTodo = () => {
    for (let key in todos) {
      if (todos[key].isCompleted == true) {
        numCompleted += 1;
      }
    }
    setNowTodo(numCompleted + 1);
    console.log('지금 투두 : ' + nowTodo);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.top}>
        <View>
          <Text style={styles.name}>이름</Text>
        </View>
        <View style={styles.progress}>
          <View style={styles.info}>
            <Text>이름(역할)</Text>
            <Text>퍼센트</Text>
          </View>
          <Progress.Bar style={styles.bar} />
        </View>
      </View>
      <View style={styles.mapContainer}>
        <View style={styles.maps}>
          {todos &&
            Object.keys(todos).map(key => {
              return (
                <MemberMapBubble
                  key={key}
                  teamId={teamId}
                  memberId={memberId}
                  todoData={todos[key]}
                  nowTodo={nowTodo}
                />
              );
            })}
        </View>
      </View>
    </ScrollView>
  );
};

export default MemberMap;

const styles = StyleSheet.create({
  container: {},
  top: {
    width: '100%',
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    color: 'black',
    margin: 10,
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
    height: '70%',
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
  },
});
