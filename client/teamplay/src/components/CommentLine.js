import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import auth from '@react-native-firebase/auth';
import {Shadow} from 'react-native-shadow-2';
import Modal from 'react-native-modal';
import axios from 'axios';

const CommentLine = ({
  teamId,
  todoId,
  ownerId,
  owner,
  comment,
  commentUser,
  createdAt,
  setCommentUpdated,
}) => {
  const [showMiniModal, setShowMiniModal] = useState(false);
  const userName = auth().currentUser.displayName;
  const deleteComment = async () => {
    await axios
      .post('/api/deleteComment', {
        teamId,
        ownerId,
        todoId,
        comment,
        commentUser,
        createdAt,
      })
      .then(res => {
        if (res.data) {
          setCommentUpdated(true);
        } else {
        }
      })
      .catch(err => console.log(err));
  };
  return (
    <View style={styles.commentLine}>
      <LinearGradient style={styles.chatbox} colors={['#E9E9EB', '#FFFFFF']}>
        <View style={styles.top}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {commentUser == owner ? (
              <Text
                style={[
                  styles.name,
                  {
                    backgroundColor: '#D9D9D9',
                    paddingVertical: 3,
                  },
                ]}>
                {commentUser}
              </Text>
            ) : (
              <Text style={styles.name}>{commentUser}</Text>
            )}
            <Text style={styles.time}>{createdAt}</Text>
          </View>
          {commentUser == userName ? (
            <View style={{flexDirection: 'column'}}>
              <TouchableOpacity
                onPress={() => setShowMiniModal(!showMiniModal)}>
                <Entypo name="dots-three-vertical" style={styles.dot} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
        <Text style={styles.chatboxText}>{comment}</Text>
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
          isVisible={showMiniModal}
          coverScreen={false}
          backdropColor={null}
          onRequestClose={() => setShowMiniModal(!showMiniModal)}
          onPress={() => setShowMiniModal(!showMiniModal)}
          onBackdropPress={() => setShowMiniModal(!showMiniModal)}>
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalView}
              onPress={() => setShowMiniModal(!showMiniModal)}>
              <Shadow>
                <View style={[styles.modalView, {height: 40}]}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowMiniModal(!showMiniModal);
                      Alert.alert('TeamPlay', '코멘트를 삭제하시겠습니까?', [
                        {
                          text: '취소',
                          style: 'cancel',
                        },
                        {
                          text: '확인',
                          onPress: deleteComment,
                        },
                      ]);
                    }}
                    style={styles.modalTextContainer}>
                    <Text style={styles.modalText}>삭제</Text>
                  </TouchableOpacity>
                </View>
              </Shadow>
            </TouchableOpacity>
          </View>
        </Modal>
      </LinearGradient>
    </View>
  );
};

export default CommentLine;

const styles = StyleSheet.create({
  commentLine: {
    flexDirection: 'row',
    width: 330,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatbox: {
    borderRadius: 20,
    padding: 12,
    width: '100%',
  },
  top: {
    flexDirection: 'row',
    marginBottom: 10,
    width: '100%',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    marginRight: 5,
    borderRadius: 50,
    paddingHorizontal: 10,
  },
  time: {
    color: '#484848',
    fontSize: 12,
  },
  dot: {
    fontSize: 14,
    textAlign: 'right',
  },
  chatboxText: {
    fontSize: 12,
    color: 'black',
    paddingHorizontal: 10,
  },

  // 미니모달 스타일
  modalOverlay: {
    alignItems: 'flex-end',
  },
  modalView: {
    backgroundColor: 'white',
    width: 70,
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
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    textAlignVertical: 'center',
  },

  // 모달 위치 설정
  modalContainer: {
    justifyContent: 'flex-end',
  },
});
