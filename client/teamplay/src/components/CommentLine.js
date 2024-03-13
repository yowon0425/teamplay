import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Image} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const CommentLine = ({comment}) => {
  console.log(comment);
  return (
    <View style={styles.commentLine}>
      <View style={styles.image} />
      <Image style={styles.image} />
      <LinearGradient style={styles.chatbox} colors={['#E9E9EB', '#FFFFFF']}>
        <Text style={styles.chatboxText}>{comment.comment}</Text>
        <Text style={styles.time}>{comment.createdAt}</Text>
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
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: 'skyblue',
    marginRight: 10,
    borderColor: 'black',
    borderWidth: 1,
    color: '#D9D9D9',
  },
  chatbox: {
    borderRadius: 20,
    padding: 12,
    width: '80%',
  },
  chatboxText: {
    fontSize: 16,
    color: 'black',
  },
  time: {
    color: '#484848',
    fontSize: 12,
    textAlign: 'right',
  },
});
