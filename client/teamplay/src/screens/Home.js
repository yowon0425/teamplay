import {
  View,
  Text,
  ProgressBarAndroidBase,
  StyleSheet,
  ScrollView,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import PinkButton from '../components/PinkButton';

const Home = ({teamId}) => {
  // 텍스트 테두리 필요
  // 팀 목표 입력 페이지 만들기
  const [teamInfo, setTeamInfo] = useState([]);
  const [todos, setTodos] = useState();
  const [completionRate, setCompletionRate] = useState([]);
  const {uid} = auth().currentUser;

  /*내 작업 페이지로 이동하는 이벤트*/
  const navigation = useNavigation();
  const goMyPage = () => {
    console.log('내 작업 페이지로, ' + teamId);
    navigation.navigate('MenuBar', {
      screen: 'Maps',
      member: false,
      teamId,
    });
  };

  /*팀원 작업 페이지로 이동하는 이벤트*/
  const goMemberPage = uid => {
    console.log('팀원 작업 페이지로: ');
    navigation.navigate('MenuBar', {
      screen: 'Maps',
      member: true,
      teamId,
      memberId: uid,
    });
  };

  /* 팀 정보 받아오기 */
  const getTeamInfo = async () => {
    await axios
      .post('/api/teamData', {teamId})
      .then(res => {
        if (res.data) {
          /* 응답 형식
          {
            teamId: 팀플 id
            name: 팀플 이름
            leture: 수업 이름
            numOfMember: 팀원 수
            description: 팀플 설명
            member: [{userName: oo, uid: oo}, {...}]
          }
          */
          /* 멤버 역할 입력받는 페이지 필요 */
          const data = JSON.stringify(res.data);
          setTeamInfo(res.data);
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getTeamInfo();
  }, []);

  /* 프로젝트 계획 받아오기 */
  const getTodos = async () => {
    await axios
      .post('/api/teamData/todos', {teamId})
      .then(res => {
        if (res.data) {
          setTodos(res.data);
          console.log(res.data);
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
  var numTotalTodo = 0;
  var numTotalCompleted = 0;
  var totalPercent = 0;
  const countTodo = () => {
    for (let key in todos) {
      var numTodo = 0;
      var numCompleted = 0;
      var percent = 0;
      console.log(JSON.stringify(key) + '\n');
      {
        for (let nkey in todos[key]) {
          numTodo += 1;
          numTotalTodo += 1;
          if (todos[key][nkey].isCompleted == true) {
            numCompleted += 1;
            numTotalCompleted += 1;
          }
        }
      }
      percent = (numCompleted / numTodo).toFixed(3);
      let newData = {
        key,
        percent,
        numTodo,
        numCompleted,
      }; // 데이터 구조 생각해보기
      console.log(newData);
      completionRate.push(newData);
      console.log('전체 투두 : ' + numTodo);
      console.log('완료 투두 : ' + numCompleted);
    }
    console.log('comRate: ' + JSON.stringify(completionRate));
    totalPercent = numTotalCompleted / numTotalTodo;
    console.log(totalPercent);
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.teamName}>{teamInfo.name}</Text>
        <Text style={styles.goal}>{teamInfo.description}</Text>
      </View>
      <View style={styles.teamProgress}>
        <MaskedView
          maskElement={
            <View
              style={{
                height: '100%',
                backgroundColor: 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={styles.percentText1}>
                {(totalPercent * 100).toFixed(0)}%
              </Text>
            </View>
          }>
          <LinearGradient
            style={styles.mainPercent}
            colors={['#6A9CFD', '#FEE5E1']}
          />
        </MaskedView>
        <Progress.Bar style={styles.mainBar} progress={totalPercent} />
        <Text style={styles.progressText}>Project Progress...</Text>
      </View>
      <ScrollView style={styles.members}>
        {teamInfo.member &&
          teamInfo.member.map(data => {
            return (
              <TouchableOpacity
                key={data.uid}
                style={styles.member}
                onPress={() => goMemberPage(data.uid)}>
                <View style={styles.memberInfo}>
                  <Text>{data.userName}</Text>
                  <Text key={data.uid}>{}%</Text>
                </View>
                <Progress.Bar
                  style={styles.memberBar}
                  progress={0.7}
                  unfilledColor="gray"
                  color="#FFFFFF"
                  height={10}
                />
              </TouchableOpacity>
            );
          })}
      </ScrollView>
      <View style={{alignItems: 'center', margin: 30}}>
        <PinkButton text="내 작업 페이지로" light={true} onPress={goMyPage} />
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {},
  top: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    margin: 10,
  },
  goal: {
    fontSize: 16,
    color: 'black',
  },
  teamProgress: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPercent: {
    fontSize: 96,
    fontWeight: '900',
    color: 'black',
    height: 110,
    width: 300,
  },
  percentText1: {
    fontSize: 96,
    fontWeight: '900',
    color: 'black',
    textShadowColor: 'black',
    textShadowRadius: 1,
    textShadowOffset: {width: -1, height: -1},
  },
  percentText2: {
    fontSize: 96,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'black',
    textShadowRadius: 5,
    textShadowOffset: {width: -1, height: -1},
    position: 'absolute',
    top: 0,
  },
  percentText3: {
    fontSize: 96,
    fontWeight: '900',
    color: 'black',
  },
  percentText4: {
    fontSize: 96,
    fontWeight: '900',
    color: 'black',
  },
  mainBar: {
    width: '80%',
    height: 30,
    borderRadius: 30,
    borderColor: 'black',
    unfilledColor: 'gray',
    marginTop: 20,
  },
  progressText: {
    margin: 10,
    fontSize: 20,
    color: 'black',
  },
  members: {
    paddingVertical: 5,
    paddingHorizontal: 30,
    height: '30%',
  },
  member: {
    margin: 10,
  },
  memberInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  memberBar: {
    width: '100%',
    height: 10,
    borderRadius: 20,
    borderColor: 'black',
    unfilledColor: 'gray',
  },
});
