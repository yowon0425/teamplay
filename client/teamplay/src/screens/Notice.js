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
import Work from './Work';
import NoticeCard from '../components/NoticeCard';

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
      <ScrollView>
        <View style={styles.noticeList}>
          <NoticeCard />
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
    padding: 5,
    alignItems: 'center',
  },
  notice: {
    width: '90%',
    margin: 5,
    padding: 5,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  comment: {
    flexDirection: 'column',
    width: '94%',
    margin: 5,
  },
  noticeTop: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  noticeTitle: {
    height: 30,
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    marginBottom: 5,
  },
  noticeContent: {
    fontSize: 12,
    fontWeight: '300',
    color: 'black',
    height: 50,
    marginBottom: 5,
  },
  more: {
    textAlign: 'center',
    fontSize: 12,
  },
  etc: {
    width: 65,
    marginVertical: 5,
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
