import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

const MyMapBubble = ({
  teamId,
  todoData,
  nowTodo,
  editMode,
  setEditNum,
  showEditTodo,
}) => {
  const handleEditMode = () => {
    setEditNum(todoData.number);
    showEditTodo(true);
  };

  const navigation = useNavigation();
  const openMyUpload = () => {
    navigation.navigate('MenuBar', {
      screen: 'Maps',
      teamId,
      todoData,
      params: {
        screen: 'MyUpload',
      },
    });
  };

  return (
    /* 
    완료 -> 색칠된 동그라미
    완료X -> 지금 해야함 -> 테두리 색칠된 동그라미
          -> 나머지 -> 회색 동그라미
    */
    <View>
      {todoData.isCompleted ? (
        <>
          {todoData.number == 1 ? null : (
            <LinearGradient
              style={styles.line}
              colors={['#033495', '#AEE4FF']}
            />
          )}
          <TouchableOpacity
            style={styles.map}
            onPress={editMode ? handleEditMode : openMyUpload}>
            <LinearGradient
              style={styles.coloredCircle}
              colors={['#033495', '#AEE4FF']}>
              <Text style={styles.mapNum}>{todoData.number}</Text>
            </LinearGradient>
            <View style={styles.plan}>
              <Text style={styles.planTitle}>
                {todoData.content.replace('\n', ' ')}
              </Text>
              <Text style={styles.planDue}>{todoData.deadline}</Text>
            </View>
          </TouchableOpacity>
        </>
      ) : todoData.number == nowTodo ? (
        <>
          {todoData.number == 1 ? null : (
            <LinearGradient
              style={styles.line}
              colors={['#033495', '#AEE4FF']}
            />
          )}
          <TouchableOpacity
            style={styles.map}
            onPress={editMode ? handleEditMode : openMyUpload}>
            <MaskedView
              maskElement={
                <View style={styles.strokedCircle}>
                  <Text style={styles.mapNumB}>{todoData.number}</Text>
                </View>
              }>
              <LinearGradient
                style={styles.coloredCircle}
                colors={['#033495', '#AEE4FF']}
              />
            </MaskedView>
            <View style={styles.plan}>
              <Text style={styles.planTitle}>
                {todoData.content.replace('\n', ' ')}
              </Text>
              <Text style={styles.planDue}>{todoData.deadline}</Text>
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <View style={[styles.line, {backgroundColor: '#7D7D7D'}]} />
          <TouchableOpacity
            style={styles.map}
            onPress={editMode ? handleEditMode : openMyUpload}>
            <View style={styles.circle}>
              <Text style={styles.mapNumB}>{todoData.number}</Text>
            </View>
            <View style={styles.plan}>
              <Text style={styles.planTitle}>
                {todoData.content.replace('\n', ' ')}
              </Text>
              <Text style={styles.planDue}>{todoData.deadline}</Text>
            </View>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default MyMapBubble;

const styles = StyleSheet.create({
  map: {
    flexDirection: 'row',
  },
  coloredCircle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strokedCircle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 100,
    borderCurve: 100,
    backgroundColor: '#D9D9D9',
    borderColor: '#7D7D7D',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapNum: {
    fontSize: 20,
    color: 'white',
  },
  mapNumB: {
    color: 'black',
    fontSize: 20,
  },
  plan: {
    marginLeft: 15,
  },
  planTitle: {
    fontSize: 16,
    color: 'black',
  },
  planDue: {
    fontSize: 12,
    color: 'black',
  },
  line: {
    height: 90,
    width: 2,
    left: 20,
  },
});
