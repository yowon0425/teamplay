import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import NoticeCard from '../components/NoticeCard'; // NoticeCard 컴포넌트 불러오기

const Notice = ({ teamId }) => {
  console.log('notice: ' + teamId);
  const [noticeList, setNoticeList] = useState([]);

  // 알림 리스트 불러오는 함수
  const fetchNoticeList = async () => {
    try {
      const { uid } = auth().currentUser;
      const response = await axios.post('/api/notice', { uid, teamId });
      setNoticeList(response.data); // 알림 리스트 설정
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNoticeList();
  }, [teamId]);

  const readNotice = async () => {
    try {
      const { uid } = auth().currentUser;
      const response = await axios.post('/api/notice', { uid, teamId });
      console.log('읽은 알림: ', response.data);
      fetchNoticeList();
    } catch (error) {
      console.log(error);
    }
  };  
  
  // 알림 보내기 페이지로 이동
  const navigation = useNavigation();
  const openSendNotice = () => {
    console.log('네비게이터');
    navigation.navigate('SendNotice', { teamId });
  };

  useEffect(() => {
    fetchNoticeList();
    readNotice();
  }, [teamId]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.title}> </Text>
        <Text style={styles.title}>알림</Text>
        <TouchableOpacity onPress={openSendNotice}>
          <Ionic name="notifications-outline" style={styles.noticeIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.noticeCardContainer}>
          {noticeList &&
            noticeList.reverse().map(notice => ( // Reverse the order of noticeList
              <NoticeCard
                key={notice.index}
                title={notice.title}
                content={notice.content}
                writer={notice.writer}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  top: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    color: 'black',
    fontWeight: '900',
  },
  noticeIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  noticeCardContainer: {
    alignItems: 'center', // Center the NoticeCard components horizontally
  },
});

export default Notice;
