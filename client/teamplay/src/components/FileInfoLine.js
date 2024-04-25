import {
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
  const {uid} = auth().currentUser;

  /* 파일 다운로드 함수 */
  const handleFileDownload = async () => {
    const {dirs} = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    await axios
      .post('/api/download', {
        uid,
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
            }).fetch('GET', res.data.url);
            ToastAndroid.showWithGravity(
              '파일 다운로드에 성공했습니다.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM,
            );
          } catch {
            Linking.openURL(res.data.url);
          }
        } else {
          ToastAndroid.showWithGravity(
            '파일 다운로드에 실패했습니다.',
            ToastAndroid.SHORT,
            ToastAndroid.BOTTOM,
          );
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <View>
      <TouchableOpacity style={styles.file} onPress={handleFileDownload}>
        <Text style={styles.fileName}>{file.name}</Text>
        <Text style={styles.time}>{file.visibleTime}</Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
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
