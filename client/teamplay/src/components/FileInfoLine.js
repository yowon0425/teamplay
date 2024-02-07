import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const FileInfoLine = ({file}) => {
  const openFile = () => {
    // 파일 다운로드 or 파일 미리보기 함수
  };
  return (
    <View>
      <TouchableOpacity style={styles.file}>
        <Text style={styles.fileName}>{file.name}</Text>
        <Text style={styles.time}>{file.uploadTime}</Text>
      </TouchableOpacity>
      <View style={styles.line}></View>
    </View>
  );
};

export default FileInfoLine;

const styles = StyleSheet.create({
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
