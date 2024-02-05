import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionic from 'react-native-vector-icons/Ionicons';
import axios from 'axios'; 
import auth from '@react-native-firebase/auth';

const MemberUpload = ({ todoId }) => {
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([]);
  const user = auth().currentUser;

  const handleCommentInputChange = (text) => {
    setCommentInput(text);
  };

  const handleCommentSubmit = async () => {
    try {
      if (commentInput.trim() !== '') {
        setComments([...comments, commentInput]);

        if (user) {
          const { uid, teamId } = user;
          const commentUserId = uid;

          // 여기서 todoId를 직접 사용
          const response = await axios.post('/api/addComment', {
            uid,
            teamId,
            commentUserId,
            comment: commentInput,
            todoId: todoId,
          });

          console.log('보내는 정보 ' + uid, teamId, commentUserId, commentInput, todoId);

          if (response.data.isCompleted) {
            console.log('Comment added successfully');
          } else {
            console.log('Failed to add comment');
          }

          setCommentInput('');
        } else {
          console.error('User is not authenticated');
        }
      }
    } catch (error) {
      console.error('코멘트 제출 오류:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.todo}>오픈소스 사례 정리하기</Text>
        <Text style={styles.time}>8/20 20:00</Text>
      </View>
      <View style={styles.line}></View>
      <View style={styles.upload}>
        <Text style={styles.title}>제출 상황</Text>
        <LinearGradient
          style={styles.uploadBox}
          colors={['#B9E3FC', '#FFFFFF']}>
          <ScrollView style={styles.fileList}>
            <View style={styles.file}>
              <Text style={styles.fileName}>오픈소스 사례-챗봇.hwp</Text>
              <Text style={styles.time}>8/12 17:34</Text>
            </View>
            <View style={styles.line}></View>
            <View style={styles.file}>
              <Text style={styles.fileName}>오픈소스 사례-챗봇.hwp</Text>
              <Text style={styles.time}>8/12 17:34</Text>
            </View>
            <View style={styles.line}></View>
          </ScrollView>
        </LinearGradient>
        <View style={styles.comment}>
          <Text style={styles.title}>코멘트</Text>
          <ScrollView style={styles.bubbles}>
            {comments.map((comment, index) => (
              <View key={index} style={styles.commentLine}>
                <Image style={styles.image} />
                <LinearGradient
                  style={styles.chatbox}
                  colors={['#E9E9EB', '#FFFFFF']}>
                  <Text style={styles.chatboxText}>{comment}</Text>
                </LinearGradient>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.message}>
          <KeyboardAvoidingView>
            <TextInput
              style={styles.input}
              placeholder="코멘트 작성하기"
              value={commentInput}
              onChangeText={handleCommentInputChange}
            />
          </KeyboardAvoidingView>
          
          <Ionic name="send" style={styles.sendIcon} onPress={handleCommentSubmit} />
        </View>
      </View>
    </View>
  );
};

const ParentComponent = () => {
  const todoId = '1';

  return (
    <MemberUpload todoId={todoId} />
  );
};

export default ParentComponent;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  top: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    margin: 10,
  },
  todo: {
    fontSize: 20,
    color: 'black',
    fontWeight: '900',
  },
  time: {
    fontSize: 12,
    color: 'black',
  },
  line: {
    width: '95%',
    height: 1,
    backgroundColor: 'black',
  },
  upload: {
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    color: 'black',
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 15,
  },
  uploadBox: {
    width: 330,
    height: 110,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
  },
  file: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  fileName: {
    fontSize: 12,
    color: 'black',
  },
  comment: {
    alignItems: 'center',
    height: '45%',
  },
  bubbles: {},
  commentLine: {
    flexDirection: 'row',
    width: 330,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: 'skyblue',
    margin: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  chatbox: {
    borderRadius: 20,
    padding: 10,
    width: '80%',
    height: 80,
  },
  chatboxText: {
    fontSize: 16,
    color: 'black',
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    width: 290,
    height: 30,
    backgroundColor: '#F1F1F1',
    flexDirection: 'row',
    borderRadius: 10,
    margin: 5,
    paddingLeft: 10,
    paddingVertical: 0,
    color: '#545454',
  },
  sendIcon: {
    fontSize: 30,
    color: '#749DF6',
  },
});
