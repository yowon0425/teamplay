import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TextInput,
  Button,
} from 'react-native';
import {LinearGradient} from 'react-native-linear-gradient';
import Ionic from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import React, {useEffect, useState} from 'react';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import MainButton from './../components/MainButton';
import {SafeAreaView} from 'react-native-safe-area-context';

const MyUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState([]);

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      setSelectedFile(result[0]);
      console.log(result);
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

      const fileInfo = new Map([
        ['name', selectedFile.name],
        ['uploadTime', handleAddEvent()],
        ['uri', selectedFile.uri],
      ]);

      const {uid} = auth().currentUser;
      formData.append('uid', uid);
      formData.append('fileInfo', fileInfo);

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Server response:', response.data);
      } catch (error) {
        console.error('Error uploading file to server:', error);
      }
    }
  };

  const handleAddEvent = () => {
    const date = new Date();
    const localTime = date.toLocaleDateString();
    const uploadTime =
      date.getMonth() +
      1 +
      '/' +
      date.getDate() +
      ' ' +
      localTime.substring(0, 5);
    return uploadTime;
  };

  useEffect(() => {
    getFileInfo();
  }, []);

  const getFileInfo = async () => {
    // const {uid} = auth().currentUser;
    const uid = jnpUeRCXKtOEsr7NDFXW4qJybgW2;
    try {
      await axios
        .post('/api/fileList', {uid})
        .then(res => console.log('fileList-> ', res.data));
    } catch (error) {
      console.error('Error uploading file to server:', error);
    }
  };

  const FileList = () => (
    <ScrollView style={styles.fileList}>
      {uploadedFile.map(file => (
        <View>
          <View style={styles.file}>
            <Text style={styles.fileName}>{file.name}</Text>
            <Text style={styles.time}>{file.uploadTime}</Text>
          </View>
          <View style={styles.line}></View>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.top}>
          <Text style={styles.task}>Today's Task</Text>
          <View style={styles.todoLine}>
            <Text style={styles.todo}>오픈소스 사례 정리하기</Text>
            <Text style={styles.time}>8/20 20:00</Text>
          </View>
        </View>
        <View style={styles.line}></View>
        <ScrollView style={styles.upload}>
          <View style={styles.uploadContainer}>
            <Text style={styles.title}>제출 상황</Text>
            <LinearGradient
              style={styles.uploadBox}
              colors={['#B9E3FC', '#FFFFFF']}>
              <FileList />
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
            {selectedFile == null ? (
              <MainButton
                text="파일 선택하기"
                light={true}
                onPress={handleFileSelect}
              />
            ) : (
              <MainButton
                text="파일 업로드하기"
                light={true}
                onPress={handleFileUpload}
              />
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
