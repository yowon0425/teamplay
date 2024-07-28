import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  Animated,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import Ionic from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import React, {useEffect, useRef, useState} from 'react';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import FileInfoLine from '../components/FileInfoLine';
import PinkButton from '../components/PinkButton';
import CommentLine from './../components/CommentLine';

const MyUpload = ({teamId, todoData}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState();
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState();
  const [clicked, setClicked] = useState(false);
  const [commentUpdated, setCommentUpdated] = useState(false);
  const [percent, setPercent] = useState(0);
  const [fileUploaded, setFileUploaded] = useState(false);
  const {uid} = auth().currentUser;
  const userName = auth().currentUser.displayName;
  const todoId = todoData.number;

  /* 파일 선택, 업로드 함수 */
  const handleFileSelect = async () => {
    setPercent(0);
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      setSelectedFile(result[0]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User canceled the picker
      } else {
        // Handle errors
        console.log(err);
      }
    }
  };

  const handleFileUpload = async () => {
    if (selectedFile) {
      // server에 보낼 FormData 객체 만들기
      const formData = new FormData();
      formData.append('file', {
        uri: selectedFile.uri,
        type: selectedFile.type,
        name: encodeURIComponent(selectedFile.name),
        date: new Date(),
      });

      const fileInfo = {
        name: selectedFile.name,
        uploadTime: handleAddUploadTime(),
        uri: selectedFile.uri,
        visibleTime: handleAddVisibleTime(),
        uid: uid,
      };

      formData.append('uid', uid);
      formData.append('fileInfo', JSON.stringify(fileInfo));
      formData.append('teamId', teamId);
      formData.append('todoId', todoData.number);
      // JSON으로 저장되어서 문자열 형태로 저장되어 문제 -> 서버에서 parse해서 객체 형태로 바꿈

      setPercent(100);
      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Server response:', response.data);
        setFileUploaded(response.data.uploaded);
        setSelectedFile(null);
        getFileInfo();
      } catch (error) {
        console.error('Error uploading file to server');
        Alert.alert(
          'Teamplay',
          '파일을 업로드하지 못했습니다.\n다시 시도해주십시오.',
        );
      }
    }
  };

  /* 파일 업로드 애니메이션 */
  const loaderValue = useRef(new Animated.Value(0)).current;

  const load = percent => {
    Animated.timing(loaderValue, {
      toValue: percent,
      duration: 4000,
      useNativeDriver: false,
    }).start();
  };

  const width = loaderValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    load(percent);
  }, [percent]);

  /* 업로드 시간 구하기 */
  const handleAddUploadTime = () => {
    const date = new Date();
    const uploadTime =
      date.getFullYear() +
      '-' +
      `${
        date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1
      }` +
      '-' +
      `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}` +
      ' ' +
      `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}` +
      ':' +
      `${
        date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
      }` +
      ':' +
      `${date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()}`;

    return uploadTime;
  };

  /* 표기 업로드 시간 구하기 */
  const handleAddVisibleTime = () => {
    const date = new Date();
    const uploadTime =
      date.getMonth() +
      1 +
      '/' +
      `${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}` +
      ' ' +
      `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}` +
      ':' +
      `${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;

    return uploadTime;
  };

  /* 코멘트 작성 함수 */
  const handleCommentInputChange = text => {
    setCommentInput(text);
  };

  const handleCommentSubmit = async () => {
    try {
      if (commentInput.trim() !== '') {
        if (uid) {
          const response = await axios.post('/api/addComment', {
            uid: uid,
            teamId,
            commentUser: userName,
            comment: commentInput,
            todoId,
          });

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
  }, []);

  const getFileInfo = async () => {
    try {
      await axios.post('/api/fileList', {uid}).then(res => {
        if (res.data) {
          setFileList(res.data[teamId][todoId]);
        } else {
          Alert.alert('Teamplay', '파일을 불러오지 못했습니다.');
        }
      });
    } catch (error) {
      console.error('err:', error);
      Alert.alert('Error', error);
    }
  };

  /* 코멘트 불러오기 */
  useEffect(() => {
    getComments();
  }, [clicked, commentUpdated]);

  const getComments = async () => {
    try {
      await axios
        .post('/api/teamData/comment', {teamId, memberId: uid, todoId})
        .then(res => {
          if (res.data) {
            setComments(res.data);
            setCommentUpdated(false);
          } else {
            console.log('코멘트를 불러오지 못했습니다.');
          }
        });
    } catch (error) {
      console.log('err: ', error);
      Alert.alert('Error', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <Text style={styles.todo}>{todoData.content.replace('\n', ' ')}</Text>
        <Text style={styles.time}>{todoData.deadline}</Text>
      </View>
      <View style={styles.line} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.uploadContainer}>
          <Text style={styles.title}>제출 상황</Text>
          <LinearGradient
            style={styles.uploadBox}
            colors={['#B9E3FC', '#FFFFFF']}>
            <ScrollView
              style={styles.fileList}
              showsVerticalScrollIndicator={false}>
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
          <View style={styles.uploadArea}>
            {selectedFile == null ? (
              <PinkButton
                text="파일 선택하기"
                light={true}
                onPress={handleFileSelect}
              />
            ) : (
              <>
                <View style={styles.selectedFileBlockContainer}>
                  {percent !== 0 ? (
                    <Animated.View style={[styles.uploadingBar, {width}]} />
                  ) : null}
                  <View style={styles.selectedFileBlock}>
                    <Text style={styles.selectedFileName}>
                      {selectedFile.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedFile(null);
                      }}>
                      <Text>X</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <PinkButton
                  text="파일 업로드하기"
                  light={true}
                  onPress={handleFileUpload}
                />
              </>
            )}
          </View>
          <View style={styles.comment}>
            <View>
              {comments &&
                comments.map((data, index) => (
                  <CommentLine
                    key={index}
                    teamId={teamId}
                    todoId={todoData.number}
                    ownerId={uid}
                    owner={userName}
                    comment={data.comment}
                    commentUser={data.commentUser}
                    createdAt={data.createdAt}
                    setCommentUpdated={setCommentUpdated}
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
            multiline={true}
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

export default MyUpload;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  top: {
    width: '90%',
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
  uploadContainer: {
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
  uploadArea: {
    marginTop: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  selectedFileBlockContainer: {
    width: 330,
    backgroundColor: '#E9E9E9',
    marginBottom: 20,
    borderRadius: 20,
  },
  selectedFileBlock: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  uploadingBar: {
    position: 'absolute',
    borderRadius: 20,
    backgroundColor: '#FFFBD3',
    padding: 10,
    height: '100%',
  },
  selectedFileName: {
    fontSize: 12,
    color: 'black',
  },
  comment: {
    alignItems: 'center',
    marginTop: 20,
  },
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
