import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import Ionic from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import PinkButton from '../components/PinkButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const Profile = ({teamId}) => {
  const {uid} = auth().currentUser;
  const [user, setUser] = useState([]);
  const [role, setRole] = useState('아직 역할을 설정하지 않았습니다');
  const [isVisible, setIsVisible] = useState(false);
  const [clicked, setClicked] = useState(false);

  /* 유저 정보 받아오기 */
  const getUserInfo = async () => {
    await axios
      .post('/api/user', {uid})
      .then(res => {
        if (res.data) {
          console.log(JSON.stringify(res.data));
          setUser(res.data);
          const found = res.data.teamList.find(
            element => element.teamId == teamId,
          );
          if (found.role) {
            setRole(found.role);
          }
        } else {
          console.log(error);
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    getUserInfo();
    setClicked(false);
    console.log(JSON.stringify(role));
  }, [clicked]);

  useEffect(() => {
    getUserInfo();
  }, []);

  /* 유저 역할 등록/수정하기 */
  const editRole = async () => {
    setRole(role.replace('\n', ' '));
    await axios
      .post('/api/role', {uid, teamId, role})
      .then(res => {
        if (res.data) {
          setIsVisible(false);
          setClicked(true);
        } else {
          console.log(error);
          setIsVisible(false);
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <View>
      <View style={styles.top}>
        <Text style={styles.title}>내 정보</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={[styles.line, {backgroundColor: 'black'}]} />
        <View style={styles.infoLine}>
          <Text style={styles.listTitle}>이름</Text>
          <Text style={styles.content}>{user.name}</Text>
        </View>
        <View style={[styles.line, {backgroundColor: '#9F9F9F'}]} />
        <View style={styles.infoLine}>
          <Text style={styles.listTitle}>학교</Text>
          <Text style={styles.content}>{user.organization}</Text>
        </View>
        <View style={[styles.line, {backgroundColor: '#9F9F9F'}]} />
        <View style={styles.infoLine}>
          <Text style={styles.listTitle}>전공</Text>
          <Text style={styles.content}>{user.major}</Text>
        </View>
        <View style={[styles.line, {backgroundColor: '#9F9F9F'}]} />
        <View style={styles.infoLine}>
          <Text style={styles.listTitle}>학번</Text>
          <Text style={styles.content}>{user.studentId}</Text>
        </View>
        <View style={[styles.line, {backgroundColor: '#9F9F9F'}]} />
        <View style={styles.infoLine}>
          <Text style={styles.listTitle}>이메일</Text>
          <Text style={styles.content}>{user.email}</Text>
        </View>
        <View style={[styles.line, {backgroundColor: '#9F9F9F'}]} />
        <View style={styles.infoLine}>
          <Text style={styles.listTitle}>역할</Text>
          <TouchableOpacity
            style={styles.role}
            onPress={() => setIsVisible(true)}>
            <Text style={styles.content}>{role.replace('\n', ' ')}</Text>
            <Ionic
              name="chevron-forward-outline"
              style={{fontSize: 14, color: '#123690'}}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.line, {backgroundColor: 'black'}]} />
      </View>
      <Modal
        isVisible={isVisible}
        swipeDirection={['down']}
        useNativeDriverForBackdrop
        onSwipeComplete={() => {
          setIsVisible(false);
          setClicked(true);
        }}
        onBackdropPress={() => {
          setIsVisible(false);
          setClicked(true);
        }}
        onBackButtonPress={() => {
          setIsVisible(false);
          setClicked(true);
        }}
        style={styles.modal}>
        <View style={styles.modalScreen}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}> </Text>
            <Text style={styles.modalTitle}>역할 입력</Text>
            <TouchableOpacity
              onPress={() => {
                setIsVisible(false);
                setClicked(true);
              }}>
              <Text style={styles.x}>X</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.modalContentContainer}>
            <Text style={styles.text}>역할</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setRole(text)}
              defaultValue={
                role != '아직 역할을 설정하지 않았습니다'
                  ? role.replace('\n', ' ')
                  : null
              }
            />
          </View>
          <View style={styles.footer}>
            {role ? (
              <PinkButton text="완료" light={true} onPress={editRole} />
            ) : (
              <PinkButton text="완료" light={false} />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  top: {
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },
  contentContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  line: {
    width: '95%',
    height: 1,
  },
  infoLine: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  listTitle: {
    fontSize: 14,
    color: 'black',
  },
  content: {
    fontSize: 14,
    color: '#123690',
  },
  role: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 모달 스타일
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalScreen: {
    width: '100%',
    backgroundColor: 'white',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    paddingTop: 15,
  },
  header: {
    alignItems: 'center',
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  modalTitle: {
    fontSize: 20,
    color: 'black',
  },
  x: {
    fontSize: 20,
  },
  modalContentContainer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  text: {
    fontSize: 14,
    height: 30,
    color: 'black',
    fontWeight: '100',
    marginVertical: 15,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginRight: 20,
  },
  input: {
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    width: 200,
    height: 30,
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginVertical: 15,
  },
  inputText: {
    fontSize: 14,
    color: 'black',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 60,
  },
});
