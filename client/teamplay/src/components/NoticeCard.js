import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Ionic from 'react-native-vector-icons/Ionicons';

const NoticeCard = ({title, writer, content}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [textLines, setTextLines] = useState(0);
  const getLineLength = e => {
    const lines = e.nativeEvent.lines.length;
    setTextLines(lines);
  };

  return (
    <LinearGradient style={styles.notice} colors={['#B9E3FC', '#FFFFFF']}>
      <View style={styles.comment}>
        <View style={styles.noticeTop}>
          <Text style={styles.noticeTitle}>{title}</Text>
          <Text style={{fontSize: 12, color: 'black'}}>{writer}</Text>
        </View>
        <View>
          {isOpen ? (
            <Text style={styles.noticeContent} onTextLayout={getLineLength}>
              {content}
            </Text>
          ) : (
            <Text
              onTextLayout={getLineLength}
              style={styles.noticeContent}
              numberOfLines={3}
              ellipsizeMode="tail">
              {content}
            </Text>
          )}
        </View>
        {textLines > 3 ? (
          isOpen ? (
            <TouchableOpacity onPress={() => setIsOpen(false)}>
              <Ionic name="chevron-up-outline" style={styles.more} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsOpen(true)}>
              <Ionic name="chevron-down-outline" style={styles.more} />
            </TouchableOpacity>
          )
        ) : null}
      </View>
    </LinearGradient>
  );
};

export default NoticeCard;

const styles = StyleSheet.create({
  notice: {
    width: '90%',
    margin: 5,
    padding: 5,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  comment: {
    flexDirection: 'column',
    width: '94%',
    margin: 5,
  },
  noticeTop: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  noticeTitle: {
    height: 30,
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
    marginBottom: 5,
  },
  noticeContent: {
    fontSize: 12,
    fontWeight: '300',
    color: 'black',
    marginBottom: 5,
  },
  more: {
    textAlign: 'center',
    fontSize: 16,
  },
});
