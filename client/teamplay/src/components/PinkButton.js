import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Shadow} from 'react-native-shadow-2';

const PinkButton = ({text, light, onPress}) => {
  /*
  text prop은 버튼 안에 써 있는 문구를 받아옴
  light는 버튼이 누를 수 있는 상태인지 아닌지 볼 수 있음
  light가 true이면 누를 수 있는 분홍색 버튼, false이면 누를 수 없는 회색 버튼 상태임
  */

  return (
    <View>
      {light ? (
        <Shadow style={styles.shadow}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: '#FAE6E2'}]}
            onPress={onPress}>
            <Text style={styles.text}>{text}</Text>
          </TouchableOpacity>
        </Shadow>
      ) : (
        <Shadow style={styles.shadow}>
          <View style={[styles.button, {backgroundColor: '#F1F1F1'}]}>
            <Text style={styles.text}>{text}</Text>
          </View>
        </Shadow>
      )}
    </View>
  );
};

export default PinkButton;

const styles = StyleSheet.create({
  button: {
    width: 160,
    height: 45,
    borderRadius: 20,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
  shadow: {
    distance: 15,
  },
});
