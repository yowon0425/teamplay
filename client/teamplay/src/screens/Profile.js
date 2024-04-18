import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import auth from '@react-native-firebase/auth';
import axios from 'axios';
import Ionic from 'react-native-vector-icons/Ionicons';

const Profile = ({teamId}) => {
  const {uid} = auth().currentUser;
  const [user, setUser] = useState([]);
  const [role, setRole] = useState('아직 역할을 설정하지 않았습니다');

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
    console.log(JSON.stringify(role));
  }, []);

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
          <TouchableOpacity style={styles.role}>
            <Text style={styles.content}>{role}</Text>
            <Ionic
              name="chevron-forward-outline"
              style={{fontSize: 14, color: '#123690'}}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.line, {backgroundColor: 'black'}]} />
      </View>
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
});
