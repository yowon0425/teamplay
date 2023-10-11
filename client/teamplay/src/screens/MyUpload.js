import {View, Text, Button} from 'react-native';
import React, {useState} from 'react';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';

const MyUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      setSelectedFile(result);
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
      });

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

  return (
    <View>
      <Text>MyUpload</Text>
      <Button title="Select File" onPress={handleFileSelect} />
      {selectedFile && <Text>선택한 파일: {selectedFile.name}</Text>}
      <Button title="Upload File" onPress={handleFileUpload} />
    </View>
  );
};

export default MyUpload;
