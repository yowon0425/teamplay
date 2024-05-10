import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import {Shadow} from 'react-native-shadow-2';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import TeamCard from '../components/TeamCard';
import Ionic from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';

const TeamList = () => {
  console.log('팀리스트로');
  const [showModal, setShowModal] = useState(false);
  const [teams, setTeams] = useState();

  /* 하드웨어 뒤로가기 제어 */
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert('TeamPlay', '앱을 종료하시겠습니까?', [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '확인',
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  // 전체 알림 페이지로
  const openMainNotice = () => {
    console.log('네비게이터');
    navigation.push('MainNotice');
  };

  const navigation = useNavigation();
  const openStartNew = () => {
    console.log('네비게이터');
    navigation.push('StartNew', {
      userName: {uid},
    });
    setShowModal(false);
  };
  const openStartJoin = () => {
    console.log('네비게이터');
    navigation.push('StartJoin', {
      userName: {uid},
    });
    setShowModal(false);
  };

  const modalOpen = () => {
    console.log(showModal);
    setShowModal(true);
  };

  const modalClose = e => {
    setShowModal(false);
  };

  useEffect(() => {
    getTeams();
    console.log('팀리스트 불러오는 함수 실행');
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getTeams();
    }, []),
  );

  const {uid} = auth().currentUser;
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{width: 22}} />
        <Text style={styles.headerText}>나의 팀</Text>
        <TouchableOpacity onPress={openMainNotice}>
          <Ionic name="notifications-outline" style={styles.noticeIcon} />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={styles.teamListContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.teamList}>
          {teams &&
            teams.map(data => {
              return <TeamCard key={data.teamId} team={data} />;
            })}
          <TouchableOpacity onPress={modalOpen} style={styles.teamBlock}>
            <Shadow
              style={styles.shadow}
              distance={1}
              offset={[3, 3]}
              paintInside={true}>
              <LinearGradient
                colors={['#EAEAEA', '#EAEAEA']}
                style={styles.linearGradient}>
                <View>
                  <Text style={styles.plusText}>+</Text>
                </View>
              </LinearGradient>
            </Shadow>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal
        style={styles.modal}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={showModal}
        onBackdropPress={modalClose}
        onBackButtonPress={modalClose}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={openStartNew}
              style={styles.modalTextContainer}>
              <Text style={styles.modalText}>새 팀 만들기</Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity
              onPress={openStartJoin}
              style={styles.modalTextContainer}>
              <Text style={styles.modalText}>팀 참가하기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '90%',
    alignItems: 'center',
    paddingHorizontal: 5,
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  noticeIcon: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
  },
  teamListContainer: {
    width: '100%',
  },
  teamList: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  teamBlock: {
    width: '95%',
    margin: 5,
  },
  linearGradient: {
    width: '100%',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  white: {
    height: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  teamDescription: {
    marginTop: 10,
    color: 'black',
  },
  buttonContainer: {
    marginTop: 20,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionText: {
    fontSize: 12,
    color: 'black',
  },
  button: {
    height: 50,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 5,
  },
  plusText: {
    fontSize: 36,
    color: 'black',
  },
  shadow: {
    width: '100%',
  },
  modal: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
  },
  modalView: {
    backgroundColor: 'white',
    width: 250,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  modalTextContainer: {
    alignItems: 'center',
    height: '50%',
    width: '100%',
    justifyContent: 'center',
  },
  modalText: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  line: {
    height: 1,
    width: '95%',
    backgroundColor: '#E8E8E8',
  },
});

export default TeamList;
