import {StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import MemberMapBubble from '../components/MemberMapBubble';
import ProgressBar from '../components/ProgressBar';

const MemberMap = ({teamId, memberId, memberObj}) => {
  const [todos, setTodos] = useState();
  const [nowTodo, setNowTodo] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [memObj, setMemObj] = useState(memberObj);
  const [errorMsg, setErrorMsg] = useState('');

  /* 멤버 이름 가져오기 */
  const getMember = async () => {
    await axios
      .post('/api/teamData/member', {teamId})
      .then(res => {
        if (res.data) {
          var memberName = res.data.find(data => data.uid == memberId).userName;
          var memberRole = res.data.find(data => data.uid == memberId).role;
          setName(memberName);
          setRole(memberRole);
        }
      })
      .catch(err => console.log(err));
  };

  /* 프로젝트 계획 받아오기 */
  const getTodos = async () => {
    await axios
      .post('/api/teamData/todos', {teamId})
      .then(res => {
        if (res.data) {
          setTodos(res.data[memberId]);
          setErrorMsg('');
        } else {
          setErrorMsg('계획을 불러오지 못했습니다.');
        }
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Error', err);
      });
  };

  useEffect(() => {
    getTodos();
    getMember();
  }, [memberId]);

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
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.top}>
        <View>
          <Text style={styles.name}>{name}</Text>
        </View>
        <View style={styles.progress}>
          <View style={styles.info}>
            <Text style={{color: 'black'}}>
              {role ? role.replace('\n', ' ') : null}
            </Text>
            <Text style={{color: 'black'}}>
              {memObj ? (memObj.percent * 100).toFixed(1) : null}%
            </Text>
          </View>
          <View style={styles.bar}>
            <ProgressBar
              percent={memObj ? (memObj.percent * 100).toFixed(1) : null}
            />
          </View>
        </View>
      </View>
      <View style={styles.mapContainer}>
        <View style={styles.maps}>
          {todos && memObj && memObj.percent != 0 ? (
            Object.keys(todos).map(key => {
              return (
                <MemberMapBubble
                  key={key}
                  teamId={teamId}
                  memberId={memberId}
                  memberName={name}
                  todoData={todos[key]}
                  nowTodo={nowTodo}
                />
              );
            })
          ) : (
            <Text style={styles.empty}>
              {errorMsg != '' ? errorMsg : '등록한 계획이 없습니다.'}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default MemberMap;

const styles = StyleSheet.create({
  top: {
    width: '100%',
    alignItems: 'center',
    padding: 10,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    color: 'black',
  },
  progress: {
    width: '100%',
    margin: 15,
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
    margin: 30,
    padding: 10,
  },
  empty: {
    fontSize: 16,
    alignSelf: 'center',
  },
});
