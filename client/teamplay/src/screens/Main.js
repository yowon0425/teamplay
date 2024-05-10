import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import GoogleLogin from '../components/GoogleLogin';

const Main = () => {
  return (
    <LinearGradient style={styles.background} colors={['#033495', '#AEE4FF']}>
      <View style={styles.container}>
        <Text style={styles.title}>TeamPlay</Text>
        <GoogleLogin />
      </View>
    </LinearGradient>
  );
};

export default Main;

const styles = StyleSheet.create({
  background: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    alignItems: 'center',
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 150,
  },
});
