import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import NoticeCard from '../components/NoticeCard';
import {useNavigation} from '@react-navigation/native';
import Ionic from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import axios from 'axios';

const MainNotice = () => {
  const {uid} = auth().currentUser;
  const [teams, setTeams] = useState();

  const [noticeList, setNoticeList] = useState([]);

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
      .post('/api/teamList', {uid})
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
      const response = await axios.post('/api/totalNotice', { uid });
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
      const response = await axios.post('/api/totalNotice', { uid });
      const filteredData = Object.values(response.data).flatMap(team => Object.values(team));
      setNoticeList(filteredData);
    } catch (error) {
      console.log(error);
    }
  };  

  useEffect(() => {
    readNotice();
  }, []);

  return (
    <View>
      <View style={styles.top}>
        <Text style={styles.title}>알림</Text>
      </View>
      <ScrollView horizontal={true} style={styles.category}>
        <TouchableOpacity style={[styles.team, {borderWidth: 1}]}>
          <LinearGradient
            style={styles.teamGrad}
            colors={['#749DF6', '#B9E3FC']}>
            <Text style={styles.teamText}>전체</Text>
          </LinearGradient>
        </TouchableOpacity>
        {teams &&
          teams.map(data => {
            return (
              <TouchableOpacity key={data.teamId} style={styles.team}>
                <Text numberOfLines={1} style={styles.teamText}>
                  {data.name}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
      {noticeList.length > 0 && (
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
    backgroundColor: '#D9D9D9',
    margin: 5,
  },
  teamGrad: {
    width: 88,
    height: 28,
    borderRadius: 50,
    zIndex: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamText: {
    fontSize: 16,
    color: 'black',
  },
  noticeCardContainer: {
    alignItems: 'center',
    marginBottom: 100,
  }
});