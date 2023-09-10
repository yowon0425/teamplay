import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';

const Main = () => {
  const login = async () => {
    await axios
      .get('http://localhost:4000/login')
      .then(res => console.log(res.data))
      .catch(err => {
        console.log('error');
      });
  };
  return (
    <LinearGradient style={styles.background} colors={['#033495', '#AEE4FF']}>
      <View style={styles.container}>
        <Text style={styles.title}>TeamPlay</Text>
        <TouchableOpacity onPress={login}>
          <View style={styles.button}>
            <Image
              source={require('../../assets/images/google.png')}
              style={styles.logo}
            />
            <Text style={styles.text}>Google로 시작하기</Text>
          </View>
        </TouchableOpacity>
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
  button: {
    flexDirection: 'row',
    width: 250,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  logo: {
    width: 20,
    height: 20,
  },
  text: {
    fontSize: 16,
    color: 'black',
  },
});
