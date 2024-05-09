import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionic from 'react-native-vector-icons/Ionicons';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import NoticeCard from '../components/NoticeCard'; // NoticeCard 컴포넌트 불러오기

const Notice = ({teamId}) => {
  console.log('notice: ' + teamId);
  const [noticeList, setNoticeList] = useState([]);

  // 알림 리스트 불러오는 함수
  const fetchNoticeList = async () => {
    try {
      const {uid} = auth().currentUser;
      const response = await axios.post('/api/notice', {uid, teamId});
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
      const {uid} = auth().currentUser;
      const response = await axios.post('/api/notice', {uid, teamId});
      fetchNoticeList();
    } catch (error) {
      console.log(error);
    }
  };

  // 알림 보내기 페이지로 이동
  const navigation = useNavigation();
  const openSendNotice = () => {
    console.log('네비게이터');
    navigation.navigate('SendNotice', {teamId});
  };

  useEffect(() => {
    fetchNoticeList();
    readNotice();
  }, [teamId]);

  useFocusEffect(
    React.useCallback(() => {
      fetchNoticeList();
    }, []),
  );

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <View style={{width: 22}} />
        <Text style={styles.title}>알림</Text>
        <TouchableOpacity onPress={openSendNotice}>
          <Ionic name="notifications-outline" style={styles.noticeIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.noticeCardContainer}>
          {noticeList.length > 0 ? (
            noticeList
              .reverse()
              .map((notice, index) => (
                <NoticeCard
                  key={index}
                  title={notice.title}
                  content={notice.content}
                  writer={notice.writer}
                />
              ))
          ) : (
            <Text style={styles.empty}>아직 알림이 없습니다.</Text>
          )}
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
    width: '90%',
    flexDirection: 'row',
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 10,
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  noticeIcon: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  noticeCardContainer: {
    alignItems: 'center', // Center the NoticeCard components horizontally
  },
  empty: {
    fontSize: 16,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: 100,
  },
});

export default Notice;
