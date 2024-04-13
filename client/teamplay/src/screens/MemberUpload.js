import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionic from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import FileInfoLine from '../components/FileInfoLine';
import CommentLine from '../components/CommentLine';

const MemberUpload = ({teamId, memberId, memberName, todoData}) => {
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState([]);
  const [fileList, setFileList] = useState();
  const [clicked, setClicked] = useState(false);
  const {uid} = auth().currentUser;
  const userName = auth().currentUser.displayName;
  const todoId = todoData.number;
  console.log(memberId, teamId, memberName);

  const handleCommentInputChange = text => {
    setCommentInput(text);
  };

  const handleCommentSubmit = async () => {
    try {
      if (commentInput.trim() !== '') {
        //setComments([...comments, commentInput]);

        if (uid) {
          const response = await axios.post('/api/addComment', {
            uid: memberId,
            teamId,
            commentUser: userName,
            comment: commentInput,
            todoId,
          });

          console.log(
            '보내는 정보 ' + memberId,
            teamId,
            uid,
            commentInput,
            todoId,
          );

          if (response && response.data && response.data.isCompleted) {
            console.log('코멘트가 성공적으로 추가되었습니다');
            setClicked(!clicked);
          } else {
            console.log('코멘트 추가 실패');
          }
          setCommentInput('');
        } else {
          console.error('User is not authenticated');
        }
      }
    } catch (error) {
      console.error('코멘트 제출 오류:', error);
    }
    Keyboard.dismiss(); // 키보드 내리기 메소드
  };

  /* 파일 리스트 불러오기 */
  useEffect(() => {
    getFileInfo();
    getComments();
    console.log('getFileInfo 실행');
  }, []);

  const getFileInfo = async () => {
    try {
      await axios.post('/api/fileList', {uid: memberId}).then(res => {
        if (res.data) {
          setFileList(res.data[teamId][todoId]);
        }
      });
    } catch (error) {
      console.error('err:', error);
    }
  };

  /* 코멘트 불러오기 */
  const getComments = async () => {
    try {
      await axios
        .post('/api/teamData/comment', {teamId, memberId, todoId})
        .then(res => {
          if (res.data) {
            setComments(res.data);
          }
        });
    } catch (error) {
      console.log('Err: ', error);
    }
  };

  useEffect(() => {
    getComments();
  }, [clicked]);

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.todo}>{todoData.content}</Text>
        <Text style={styles.time}>{todoData.deadline}</Text>
      </View>
      <View style={styles.line}></View>
      <ScrollView>
        <View style={styles.upload}>
          <Text style={styles.title}>제출 상황</Text>
          <LinearGradient
            style={styles.uploadBox}
            colors={['#B9E3FC', '#FFFFFF']}>
            <ScrollView style={styles.fileList}>
              {fileList &&
                fileList.map(data => {
                  return (
                    <FileInfoLine
                      key={data.name + data.uploadTime}
                      file={data}
                    />
                  );
                })}
            </ScrollView>
          </LinearGradient>
          <View style={styles.comment}>
            <View style={styles.bubbles}>
              {comments &&
                comments.map((data, index) => (
                  <CommentLine
                    key={index}
                    owner={memberName}
                    comment={data.comment}
                    commentUser={data.commentUser}
                    createdAt={data.createdAt}
                  />
                ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <KeyboardAvoidingView>
        <View style={styles.message}>
          <TextInput
            style={styles.input}
            placeholder="코멘트 작성하기"
            value={commentInput}
            onChangeText={handleCommentInputChange}
          />
          <Ionic
            name="send"
            style={styles.sendIcon}
            onPress={handleCommentSubmit}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default MemberUpload;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
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
    width: '100%',
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
  },
  bubbles: {},
  commentLine: {
    flexDirection: 'row',
    width: 330,
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
    justifyContent: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 10,
  },
  input: {
    fontSize: 16,
    width: 290,
    height: 30,
    backgroundColor: '#D9D9D9',
    flexDirection: 'row',
    borderRadius: 10,
    marginRight: 5,
    paddingLeft: 10,
    paddingVertical: 0,
    color: '#545454',
  },
  sendIcon: {
    fontSize: 24,
    color: '#749DF6',
  },
});