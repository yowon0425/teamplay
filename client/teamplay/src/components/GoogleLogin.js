import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';

/* "user" 데이터 내부 정보 예시
{
    "displayName": "류지민",
    "email": "jimins4920@gmail.com",
    "emailVerified": true,
    "isAnonymous": false,
    "metadata": {
        "creationTime": 1694519208702,
        "lastSignInTime": 1694521211078
    },
    "multiFactor": {
        "enrolledFactors": [Array]
    },
    "phoneNumber": null,
    "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocJDdNNxI5jQB3TrhrT8QFccOgoQwGdfs-ys2nADCCi6=s96-c",
    "providerData": [[Object]],
    "providerId": "firebase",
    "tenantId": null,
    "uid": "VLol7ScVwHM6T7CsdLp5niunPWs1"
}
*/

const GoogleLogin = () => {
  const navigation = useNavigation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [logInComplete, setLogInComplete] = useState(false);
  const [isNewComplete, setIsNewComplete] = useState(false);

  useEffect(() => {
    googleConfig = GoogleSignin.configure({
      webClientId:
        '790378980309-58chnk7o3c9fes7r1e4vbpnp69dn1ta2.apps.googleusercontent.com',
    });
  }, []);

  /* ---------- 로그인 여부 확인 ---------- */
  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setLoggedIn(true);
        sortUser(user.uid);
        setLogInComplete(true);
      } else {
        setLoggedIn(false);
        setLogInComplete(true);
      }
    });
  }, []);

  /* ---------- 신규 or 기존 유저 여부에 따라 redirect ---------- */
  const redirect = async () => {
    if (loggedIn) {
      if (isNewUser) {
        navigation.navigate('LogIn');
      } else {
        navigation.navigate('TeamList');
      }
    }
  };

  const onPressLogin = async () => {
    setIsNewComplete(false);
    setLogInComplete(false);
    await handleGoogleLogin();
    await redirect();
  };

  const sortUser = async uid => {
    await axios
      .post('/api/user', {uid})
      .then(res => {
        if (res.data.isCompleted) {
          setIsNewUser(true);
        } else {
          setIsNewUser(false);
        }
      })
      .catch(err => console.log(err));
    setIsNewComplete(true);
  };

  useEffect(() => {
    console.log('네비게이터');
    console.log(loggedIn, isNewUser, logInComplete, isNewComplete);
    if (logInComplete && isNewComplete) {
      redirect();
    }
  }, [logInComplete, isNewComplete]);

  /* ---------- 구글 로그인 ---------- */
  const handleGoogleLogin = async () => {
    console.log('======handleGoogleLogin========');
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const res = await auth().signInWithCredential(googleCredential);
    setIsNewUser(res.additionalUserInfo.isNewUser); // 새로 가입한 유저인지 체크
    console.log('새로가입? ' + res.additionalUserInfo.isNewUser);
    setIsNewComplete(true);
  };

  return (
    <TouchableOpacity onPress={onPressLogin}>
      <View style={styles.button}>
        <Image
          source={require('../../assets/images/google.png')}
          style={styles.logo}
        />
        <Text style={styles.text}>Google로 시작하기</Text>
      </View>
    </TouchableOpacity>
  );
};

export default GoogleLogin;

const styles = StyleSheet.create({
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
