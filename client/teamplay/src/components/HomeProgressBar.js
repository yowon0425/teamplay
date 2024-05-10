import {Animated, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';

const HomeProgressBar = ({percent}) => {
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
              colors={['#6A9CFD', '#FEE5E1']}
              useAngle={true}
              angle={90}
            />
          </Animated.View>
        ) : null}
      </View>
    </View>
  );
};

export default HomeProgressBar;

const styles = StyleSheet.create({
  barContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  barBackground: {
    width: '80%',
    height: 30,
    borderRadius: 30,
    backgroundColor: '#D9D9D9',
  },
  bar: {
    height: 30,
    borderRadius: 30,
    borderColor: 'black',
    borderWidth: 1,
    zIndex: 1,
  },
  barGrad: {
    height: 28,
    borderRadius: 30,
    zIndex: 0,
  },
});
