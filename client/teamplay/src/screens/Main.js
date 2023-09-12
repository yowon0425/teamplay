import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

const Main = () => {
  const [idToken, setIdToken] = useState(undefined);

  useEffect(() => {
    googleConfig = GoogleSignin.configure({
      webClientId:
        '790378980309-58chnk7o3c9fes7r1e4vbpnp69dn1ta2.apps.googleusercontent.com',
    });
  }, []);

  /* ---------- 구글 로그인 ---------- */
  const onPressLogin = async () => {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const {idToken} = await GoogleSignin.signIn();
    console.log('idToekn : ', idToken);
    if (idToken) {
      setIdToken(idToken);
    }
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const res = await auth().signInWithCredential(googleCredential);
    console.log('ok');
  };

  return (
    <LinearGradient style={styles.background} colors={['#033495', '#AEE4FF']}>
      <View style={styles.container}>
        <Text style={styles.title}>TeamPlay</Text>
        <TouchableOpacity onPress={onPressLogin}>
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
