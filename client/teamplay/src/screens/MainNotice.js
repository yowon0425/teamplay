import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import NoticeCard from '../components/NoticeCard';
import { useNavigation } from '@react-navigation/native';
import Ionic from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import axios from 'axios';

const MainNotice = () => {
  const { uid } = auth().currentUser;
  const [teams, setTeams] = useState();

  const [noticeList, setNoticeList] = useState([]);
  const [clickedTeamId, setClickedTeamId] = useState(null);

  useEffect(() => {
    getTeams();
    console.log('팀리스트 불러오는 함수 실행');
  }, []);

  useEffect(() => {
    getTeams();
    console.log('팀리스트 불러오는 함수 실행');
  }, []);

  const getTeams = async () => {
    await axios
      .post('/api/teamList', { uid })
      .then(res => {
        if (res.data) {
          setTeams(res.data);
          /* 응답 형식
                  {
                    teamList: [ { teamId: '21212', name: '팀플이름', description: '팀플 설명~~' } ]
                  }
              */
        }
      })
      .catch(err => console.log(err));
  };

  const fetchNoticeList = async () => {
    try {
      const response = await axios.post('/api/totalNotice', {uid});
      setNoticeList(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNoticeList();
  }, []);

  const readNotice = async () => {
    try {
      const response = await axios.post('/api/totalNotice', {uid});
      const filteredData = Object.values(response.data).flatMap(team =>
        Object.values(team),
      );
      setNoticeList(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    readNotice();
  }, []);

  const handleTeamClick = async (teamId) => {
    console.log('handleTeamClick 함수 호출됨:', teamId);
    try {
      let response;
      if (teamId === '전체') {
        console.log('전체 알림을 가져오는 요청 보냄');
        readNotice();
        setClickedTeamId(null); 
      } else {
        console.log('특정 팀 알림을 가져오는 요청 보냄');
        response = await axios.post('/api/notice', { uid, teamId });
        setClickedTeamId(teamId); // 특정 팀을 클릭했을 때만 clickedTeamId를 설정합니다.
      }
      setNoticeList(response.data);
    } catch (error) {
      console.log(error);
    }
  }; 
  
   
  return (
    <View>
      <View style={styles.top}>
        <Text style={styles.title}>알림</Text>
      </View>
      <ScrollView horizontal={true} style={styles.category}>
        <TouchableOpacity
  style={[
    styles.team,
  ]}
  onPress={() => handleTeamClick('전체')}>
  <View style={styles.teamContent}>
    {clickedTeamId === null ? (
      <LinearGradient
        colors={['#749DF6', '#B9E3FC']}
        style={styles.linearGradient}>
        <Text numberOfLines={1} style={styles.teamText}>
          전체
        </Text>
      </LinearGradient>
    ) : (
      <Text numberOfLines={1} style={styles.teamText}>
        전체
      </Text>
    )}
  </View>
</TouchableOpacity>


    {teams &&
          teams.map(data => {
            return (
              <TouchableOpacity
                key={data.teamId}
                style={[
                  styles.team,
                  clickedTeamId === data.teamId && styles.clickedTeam,
                ]}
                onPress={() => handleTeamClick(data.teamId)}>
                <View style={styles.teamContent}>
                  {clickedTeamId === data.teamId ? (
                    <LinearGradient
                      colors={['#749DF6', '#B9E3FC']}
                      style={styles.linearGradient}>
                      <Text numberOfLines={1} style={styles.teamText}>
                        {data.name}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <Text numberOfLines={1} style={styles.teamText}>
                      {data.name}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
      {noticeList.length > 0 ? (
        <ScrollView style={{flexGrow: 1}}>
          <View style={styles.noticeCardContainer}>
            {noticeList.reverse().map((notice, index) => (
              <View style={styles.noticeCard} key={index}>
                <NoticeCard
                  title={notice.title}
                  content={notice.content}
                  writer={notice.writer}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <Text style={styles.empty}>아직 알림이 없습니다.</Text>
      )}
    </View>
  );
};

export default MainNotice;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  top: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 10,
  },
  title: {
    fontSize: 20,
    color: 'black',
    fontWeight: '900',
  },
  noticeIcon: {
    fontSize: 24,
  },
  category: {
    width: '85%',
    flexDirection: 'row',
    alignSelf: 'center',
    marginBottom: 6,
  },
  team: {
    width: 90,
    height: 30,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  teamText: {
    fontSize: 16,
    color: 'black',
  },
  noticeCardContainer: {
    alignItems: 'center',
    marginBottom: 100,
  },
  defaultTeam: {
    backgroundColor: '#D9D9D9',
  },
  linearGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 100,
  },
});