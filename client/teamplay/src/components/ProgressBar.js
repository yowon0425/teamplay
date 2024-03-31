import {Animated, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';

const ProgressBar = ({percent}) => {
  const loaderValue = useRef(new Animated.Value(0)).current;

  const load = percent => {
    Animated.timing(loaderValue, {
      toValue: percent,
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const width = loaderValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    load(percent);
  }, [percent]);

  return (
    <View style={styles.barContainer}>
      <View style={styles.barBackground}>
        {percent != 0 ? (
          <Animated.View style={[styles.bar, {width}]}>
            <LinearGradient
              style={styles.barGrad}
              colors={['#749DF6', '#FFFFFF']}
              useAngle={true}
              angle={90}
            />
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  barContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barBackground: {
    width: '100%',
    height: 10,
    borderRadius: 30,
    backgroundColor: '#D9D9D9',
  },
  bar: {
    height: 10,
    borderRadius: 30,
    borderColor: 'black',
    borderWidth: 1,
    zIndex: 1,
  },
  barGrad: {
    height: 8,
    borderRadius: 30,
    zIndex: 0,
  },
});
