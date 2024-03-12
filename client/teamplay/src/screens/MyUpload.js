import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import Ionic from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import {SafeAreaView} from 'react-native-safe-area-context';
import FileInfoLine from '../components/FileInfoLine';
import PinkButton from '../components/PinkButton';
import {useNavigation} from '@react-navigation/native';

const MyUpload = ({teamId, todoData}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState([]);
  const [fileList, setFileList] = useState();
  const {uid} = auth().currentUser;
  const todoId = todoData.number;

  console.log('MyUpload : ' + uid, teamId, todoData);
  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      setSelectedFile(result[0]);
      console.log('result' + JSON.stringify(result));
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
        name: selectedFile.name,
        date: new Date(),
      });

      const fileInfo = {
        name: selectedFile.name,
        uploadTime: handleAddEvent(),
        uri: selectedFile.uri,
      };

      formData.append('uid', uid);
      formData.append('fileInfo', JSON.stringify(fileInfo));
      formData.append('teamId', teamId);
      formData.append('todoId', todoData.number);
      // JSON으로 저장되어서 문자열 형태로 저장되어 문제 -> 서버에서 parse해서 객체 형태로 바꿈

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Server response:', response.data);
        setSelectedFile(null);
        getFileInfo();
      } catch (error) {
        console.error('Error uploading file to server:', error);
      }
    }
  };

  const handleAddEvent = () => {
    const date = new Date();
    const uploadTime =
      date.getMonth() +
      1 +
      '/' +
      date.getDate() +
      ' ' +
      date.getHours() +
      ':' +
      date.getMinutes();

    return uploadTime;
  };

  useEffect(() => {
    getFileInfo();
    console.log('getFileInfo 실행');
  }, []);

  const getFileInfo = async () => {
    try {
      await axios.post('/api/fileList', {uid}).then(res => {
        console.log('fileList-> ', res.data[teamId][todoId]);
        setFileList(res.data[teamId][todoId]);
      });
    } catch (error) {
      console.error('err:', error);
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.task}>Today's Task</Text>
          <View style={styles.todoLine}>
            <Text style={styles.todo}>
              {todoData.content.replace('\n', ' ')}
            </Text>
            <Text style={styles.time}>{todoData.deadline}</Text>
          </View>
        </View>
        <View style={styles.line}></View>
        <ScrollView style={styles.upload}>
          <View style={styles.uploadContainer}>
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
            {selectedFile == null ? (
              <PinkButton
                text="파일 선택하기"
                light={true}
                onPress={handleFileSelect}
              />
            ) : (
              <>
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
                <PinkButton
                  text="파일 업로드하기"
                  light={true}
                  onPress={handleFileUpload}
                />
              </>
            )}
            <View style={styles.comment}>
              <Text style={styles.title}>코멘트</Text>
              <View style={styles.bubbles}>
                <View style={styles.commentLine}>
                  <Image style={styles.image} />
                  <LinearGradient
                    style={styles.chatbox}
                    colors={['#E9E9EB', '#FFFFFF']}>
                    <Text style={styles.chatboxText}>
                      챗지피티 이외의 다양한 챗봇의 사례가 더 있었으면 좋겠어
                    </Text>
                  </LinearGradient>
                </View>
                <View style={styles.commentLine}>
                  <Image style={styles.image} />
                  <LinearGradient
                    style={styles.chatbox}
                    colors={['#E9E9EB', '#FFFFFF']}>
                    <Text style={styles.chatboxText}>
                      챗지피티 이외의 다양한 챗봇의 사례가 더 있었으면 좋겠어
                    </Text>
                  </LinearGradient>
                </View>
                <View style={styles.commentLine}>
                  <Image style={styles.image} />
                  <LinearGradient
                    style={styles.chatbox}
                    colors={['#E9E9EB', '#FFFFFF']}>
                    <Text style={styles.chatboxText}>
                      챗지피티 이외의 다양한 챗봇의 사례가 더 있었으면 좋겠어
                    </Text>
                  </LinearGradient>
                </View>
                <View style={styles.commentLine}>
                  <Image style={styles.image} />
                  <LinearGradient
                    style={styles.chatbox}
                    colors={['#E9E9EB', '#FFFFFF']}>
                    <Text style={styles.chatboxText}>
                      챗지피티 이외의 다양한 챗봇의 사례가 더 있었으면 좋겠어
                    </Text>
                  </LinearGradient>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default MyUpload;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  top: {
    width: '100%',
  },
  task: {
    paddingLeft: 15,
    paddingTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  todoLine: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  todo: {
    fontSize: 12,
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
    alignSelf: 'center',
  },
  uploadContainer: {
    alignItems: 'center',
  },
  upload: {},
  title: {
    fontSize: 16,
    color: 'black',
    fontWeight: '900',
    marginTop: 20,
    marginBottom: 15,
  },
  uploadBox: {
    width: 330,
    height: 180,
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
    width: '70%',
  },
  selectedFileBlock: {
    width: 330,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  selectedFileName: {
    fontSize: 12,
    color: 'black',
  },
  comment: {
    alignItems: 'center',
    height: '45%',
    marginVertical: 40,
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
    color: '#D9D9D9',
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
