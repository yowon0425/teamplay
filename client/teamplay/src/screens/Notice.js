import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import React from 'react';
import Ionic from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';

const Notice = () => {
  return (
    <View>
      <View style={styles.top}>
        <Text style={styles.title}>알림</Text>
        <Ionic name="notifications-outline" style={styles.noticeIcon} />
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
            <Image style={styles.image} />
            <View style={styles.comment}>
              <Text style={styles.noticeTitle}>알림 제목</Text>
              <Text style={styles.noticeContent}>
                일해라 개미들아 오늘은 이거하고 저거할 예정
              </Text>
            </View>
            <View style={styles.etc}>
              <Entypo name="dots-three-vertical" style={styles.dot} />
              <Text style={styles.time}>15시간 전</Text>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
};

export default Notice;

const styles = StyleSheet.create({
  top: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  title: {
    fontSize: 20,
    color: 'black',
    margin: 10,
    fontWeight: '900',
  },
  noticeIcon: {
    left: 120,
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
