import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';

const MapBubble = ({todoData}) => {
  return (
    /* 
    완료 -> 색칠된 동그라미
    완료X -> 지금 해야함 -> 테두리 색칠된 동그라미
          -> 나머지 -> 회색 동그라미
    */
    <View>
      {todoData.isCompleted ? (
        <TouchableOpacity style={styles.map}>
          <LinearGradient
            style={styles.coloredCircle}
            colors={['#033495', '#AEE4FF']}>
            <Text style={styles.mapNum}>1{todoData.number}</Text>
          </LinearGradient>
          <View style={styles.plan}>
            <Text style={styles.planTitle}>자료 조사{todoData.content}</Text>
            <Text style={styles.planDue}>8/20 20:00{todoData.deadline}</Text>
          </View>
        </TouchableOpacity>
      ) : todoData.number == nowTodo ? (
        <TouchableOpacity style={styles.map}>
          <MaskedView
            maskElement={
              <View style={styles.strokedCircle}>
                <Text style={styles.mapNumB}>2</Text>
              </View>
            }>
            <LinearGradient
              style={styles.coloredCircle}
              colors={['#033495', '#AEE4FF']}
            />
          </MaskedView>
          <View style={styles.plan}>
            <Text style={styles.planTitle}>자료 조사</Text>
            <Text style={styles.planDue}>8/20 20:00</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.map}>
          <View style={styles.circle}>
            <Text style={styles.mapNumB}>3</Text>
          </View>
          <View style={styles.plan}>
            <Text style={styles.planTitle}>자료 조사</Text>
            <Text style={styles.planDue}>8/20 20:00</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MapBubble;

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
