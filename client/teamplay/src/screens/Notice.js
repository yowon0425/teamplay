import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

const Notice = ({teamId}) => {
  console.log('notice: ' + teamId);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 알림 보내기 페이지로 이동
  const navigation = useNavigation();
  const openSendNotice = () => {
    console.log('네비게이터');
    navigation.navigate('SendNotice', {
      teamId,
    });
  };

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const handleDeleteNotice = () => {
    Alert.alert('알림 삭제', '알림을 삭제하시겠습니까?', [
      {text: '취소', onPress: () => console.log('취소')},
      {text: '확인', onPress: () => console.log('알림 삭제됨')},
    ]);
    toggleModal();
  };

  return (
    <View>
      <View style={styles.top}>
        <Text style={styles.title}> </Text>
        <Text style={styles.title}>알림</Text>
        <TouchableOpacity onPress={openSendNotice}>
          <Ionic name="notifications-outline" style={styles.noticeIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.category}>
        <View style={styles.type}>
          <Text style={styles.typeText}>전체</Text>
        </View>
        <View style={styles.type}>
          <Text style={styles.typeText}>완료</Text>
        </View>
        <View style={styles.type}>
          <Text style={styles.typeText}>공지</Text>
        </View>
      </View>
      <ScrollView>
        <View style={styles.noticeList}>
          <LinearGradient style={styles.notice} colors={['#B9E3FC', '#FFFFFF']}>
            <View style={styles.comment}>
              <Text style={styles.noticeTitle}>알림 제목</Text>
              <Text style={styles.noticeContent}>
                일해라 개미들아 오늘은 이거하고 저거할 예정
              </Text>
            </View>
            <View style={styles.etc}>
              <TouchableOpacity onPress={toggleModal}>
                <Entypo name="dots-three-vertical" style={styles.dot} />
              </TouchableOpacity>
              <Text style={styles.time}>15시간 전</Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleDeleteNotice}>
              <Text style={styles.modalText}>알림 삭제</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleModal}>
              <Text style={styles.modalText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Notice;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%', // 모달 창의 가로 너비를 조정할 수 있습니다.
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginVertical: 10,
  },
  top: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  type: {
    width: 80,
    height: 30,
    borderRadius: 50,
    borderCurve: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    margin: 5,
  },
  typeText: {
    fontSize: 16,
    color: 'black',
  },
  noticeList: {
    width: '100%',
    height: '80%',
    padding: 5,
    alignItems: 'center',
  },
  notice: {
    width: 320,
    height: 100,
    margin: 5,
    padding: 5,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: 'white',
    margin: 5,
  },
  comment: {
    flexDirection: 'column',
    width: 180,
    height: 100,
    margin: 5,
  },
  noticeTitle: {
    width: 200,
    height: 30,
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  noticeContent: {
    fontSize: 12,
    fontWeight: '300',
    color: 'black',
    width: '90%',
    height: 60,
  },
  etc: {
    width: 65,
    height: '80%',
    marginTop: 5,
    paddingRight: 7,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  dot: {
    color: 'black',
  },
  time: {
    color: '#484848',
    fontSize: 12,
  },
});
