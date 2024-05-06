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
//import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import PinkButton from '../components/PinkButton';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import HomeProgressBar from '../components/HomeProgressBar';
import ProgressBar from '../components/ProgressBar';

const Home = ({teamId}) => {
  // 텍스트 테두리 필요
  // 팀 목표 입력 페이지 만들기
  const [teamInfo, setTeamInfo] = useState([]);
  const [todos, setTodos] = useState();
  const [completionRate, setCompletionRate] = useState([]);
  const [totalPercent, setTotalPercent] = useState(0);
  const [numTotalTodo, setNumTotalTodo] = useState(0);
  const [numTotalCompleted, setNumTotalCompleted] = useState(0);
  const {uid} = auth().currentUser;

  /*내 작업 페이지로 이동하는 이벤트*/
  const navigation = useNavigation();
  const goMyPage = () => {
    console.log('내 작업 페이지로, ' + teamId);
    navigation.navigate('MenuBar', {
      screen: 'Maps',
      teamId,
    });
  };

  /*팀원 작업 페이지로 이동하는 이벤트*/
  const goMemberPage = uid => {
    const memberObj = completionRate.find(element => element.key == uid);
    console.log('팀원 작업 페이지로: ');
    navigation.navigate('MenuBar', {
      screen: 'Maps',
      teamId,
      memberId: uid,
      memberObj,
      params: {
        screen: 'MemberMap',
      },
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
          setTeamInfo(res.data);
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
          setTodos(res.data);
        } else {
          // 실패 시 할 작업
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getTeamInfo();
    getTodos();
    console.log('투두 불러오는 함수 실행');
  }, []);

  useEffect(() => {
    countTodo();
  }, [todos]);

  // 데이터 개수 처리 함수
  //var totalPercent = 0;
  const countTodo = () => {
    let total = 0;
    let completed = 0;
    for (let key in todos) {
      var numTodo = 0;
      var numCompleted = 0;
      var percent = 0;
      {
        for (let nkey in todos[key]) {
          numTodo += 1;
          total++;
          if (todos[key][nkey].isCompleted == true) {
            numCompleted += 1;
            completed++;
          }
        }
      }
      if (numTodo != 0) percent = (numCompleted / numTodo).toFixed(3);
      else percent = 0;
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
    setNumTotalTodo(total);
    setNumTotalCompleted(completed);
  };

  useEffect(() => {
    if (numTotalTodo !== 0) {
      console.log('계산결과 : ' + numTotalCompleted / numTotalTodo);
      const percent = numTotalCompleted / numTotalTodo;
      setTotalPercent((percent * 100).toFixed(0));
    }
  }, [numTotalCompleted, numTotalTodo]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.teamName}>{teamInfo.name}</Text>
        <Text style={styles.goal}>{teamInfo.description}</Text>
      </View>
      <View style={styles.teamProgress}>
        <View style={styles.percentContainer}>
          <Svg>
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="0%" y2="100%">
                {['#6A9CFD', '#FEE5E1'].map((color, index) => (
                  <Stop
                    key={index}
                    offset={
                      (index * 100) / (['#6A9CFD', '#FEE5E1'].length - 1) + '%'
                    }
                    stopColor={color}
                  />
                ))}
              </LinearGradient>
            </Defs>
            {totalPercent >= 10 && totalPercent <= 99 ? (
              <SvgText
                fill="url(#grad)"
                x={30}
                y={80}
                style={styles.mainPercent}
                stroke="black">
                {totalPercent}%
              </SvgText>
            ) : totalPercent == 100 ? (
              <SvgText
                fill="url(#grad)"
                x={0}
                y={80}
                style={styles.mainPercent}
                stroke="black">
                {totalPercent}%
              </SvgText>
            ) : (
              <SvgText
                fill="url(#grad)"
                x={58}
                y={80}
                style={styles.mainPercent}
                stroke="black">
                {totalPercent}%
              </SvgText>
            )}
          </Svg>
        </View>
        <HomeProgressBar percent={totalPercent} />
        <Text style={styles.progressText}>Project Progress...</Text>
      </View>
      <ScrollView style={styles.members}>
        {teamInfo.member &&
          teamInfo.member.map(data => {
            const memberObj = completionRate.find(
              element => element.key == data.uid,
            );
            return (
              <TouchableOpacity
                key={data.uid}
                style={styles.member}
                onPress={() => {
                  if (data.uid == uid) return goMyPage();
                  else goMemberPage(data.uid);
                }}>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberText}>
                    {data.userName}{' '}
                    {data.role
                      ? '(' + data.role.replace('\n', ' ') + ')'
                      : null}
                  </Text>
                  {memberObj ? (
                    <>
                      <Text key={data.uid} style={styles.memberText}>
                        {(memberObj.percent * 100).toFixed(1)}%
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.memberText}>0%</Text>
                  )}
                </View>
                {memberObj ? (
                  <ProgressBar percent={(memberObj.percent * 100).toFixed(1)} />
                ) : (
                  <ProgressBar percent={0} />
                )}
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
    marginBottom: 10,
    width: '80%',
    alignSelf: 'center',
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
    textAlign: 'center',
  },
  teamProgress: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainPercent: {
    fontSize: 96,
    fontWeight: '900',
    height: 110,
    width: 300,
    textAlign: 'center',
    dominantBaseline: 'middle',
  },
  percentContainer: {
    width: 240,
    height: 100,
    marginTop: 10,
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
  memberText: {
    color: 'black',
  },
  memberBar: {
    width: '100%',
    height: 10,
    borderRadius: 20,
    borderColor: 'black',
    unfilledColor: 'gray',
  },
});
