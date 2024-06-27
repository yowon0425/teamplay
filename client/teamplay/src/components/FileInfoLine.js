import {
  Alert,
  Linking,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import RNFetchBlob from 'rn-fetch-blob';

const FileInfoLine = ({file}) => {
  /* 파일 다운로드 함수 */
  const handleFileDownload = async () => {
    const {dirs} = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    await axios
      .post('/api/download', {
        uid: file.uid,
        name: file.name,
        uploadTime: file.uploadTime,
      })
      .then(res => {
        if (res.data.url) {
          console.log(res.data);
          try {
            RNFetchBlob.config({
              addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                path: `${dirToSave}/${file.name}`,
              },
              useDownloadManager: true,
              notification: true,
              path: `${dirToSave}/${file.name}`,
            })
              .fetch('GET', res.data.url)
              .then(res => {
                console.log('res: ' + JSON.stringify(res));
                if (Platform.OS === 'android') {
                  ToastAndroid.showWithGravity(
                    '파일 다운로드에 성공했습니다.',
                    ToastAndroid.SHORT,
                    ToastAndroid.BOTTOM,
                  );
                } else {
                  Alert.alert('Teamplay', '파일 다운로드에 성공했습니다.', [
                    {text: '확인'},
                  ]);
                }
              });
          } catch {
            console.log('catch로 들어옴');
            try {
              Linking.openURL(res.data.url);
            } catch {
              if (Platform.OS === 'android') {
                ToastAndroid.showWithGravity(
                  '파일 다운로드에 실패했습니다.',
                  ToastAndroid.SHORT,
                  ToastAndroid.BOTTOM,
                );
              } else {
                Alert.alert('Teamplay', '파일 다운로드에 실패했습니다.', [
                  {text: '확인'},
                ]);
              }
            }
          }
        } else {
          if (Platform.OS === 'android') {
            ToastAndroid.showWithGravity(
              '파일 다운로드에 실패했습니다.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          } else {
            Alert.alert('Teamplay', '파일 다운로드에 실패했습니다.', [
              {text: '확인'},
            ]);
          }
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.file}
        onPress={() => {
          Alert.alert('TeamPlay', '파일을 다운로드하시겠습니까?', [
            {
              text: '취소',
              style: 'cancel',
            },
            {
              text: '확인',
              onPress: handleFileDownload,
            },
          ]);
        }}>
        <Text style={styles.fileName}>{file.name}</Text>
        <Text style={styles.time}>{file.visibleTime}</Text>
      </TouchableOpacity>
      <View style={styles.line} />
    </View>
  );
};

export default FileInfoLine;

const styles = StyleSheet.create({
  file: {
    width: '95%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignSelf: 'center',
  },
  fileName: {
    fontSize: 12,
    color: 'black',
    width: '70%',
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
});
