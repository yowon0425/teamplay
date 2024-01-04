import React, {useEffect, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Button from '../components/Button';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import {Shadow} from 'react-native-shadow-2';
import MenuBar from '../components/TabNavigator';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import TeamCard from '../components/TeamCard';

const TeamList = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [teamInfo, setTeamInfo] = useState();

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const navigation = useNavigation();

  const openHome = () => {
    console.log('네비게이터');
    navigation.navigate('MenuBar', {
      screen: 'Home',
    });
  };
  console.log('1teamInfo : ' + teamInfo);

  const getTeams = async () => {
    await axios
      .post('/api/teamList', {uid: 'jnpUeRCXKtOEsr7NDFXW4qJybgW2'})
      .then(res => {
        if (res.data) {
          const data = JSON.stringify(res.data);
          console.log('data : ' + data);
          setTeamInfo(res.data);
          console.log('if 안 teamInfo : ' + teamInfo);
          /* 응답 형식
              {
                teamList: [ { teamId: '21212', name: '팀플이름', description: '팀플 설명~~' } ]
              }
            */
        }
      })
      .catch(err => console.log(err));
  };

  useEffect(() => {
    const {uid} = auth().currentUser;
    getTeams();
  }, []);
  console.log('2teamInfo : ' + teamInfo);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>나의 팀</Text>
      </View>
      <ScrollView style={styles.teamListContainer}>
        <View style={styles.teamList}>
          {teamInfo &&
            teamInfo.map(data => {
              return <TeamCard key={data.teamId} team={data} />;
            })}
          <TouchableOpacity onPress={toggleOptions} style={styles.teamBlock}>
            <Shadow
              style={styles.shadow}
              distance={1}
              offset={[3, 3]}
              paintInside={true}>
              <LinearGradient
                colors={['#EAEAEA', '#EAEAEA']}
                style={styles.linearGradient}>
                <View>
                  <Text style={styles.plusText}>+</Text>
                </View>
              </LinearGradient>
            </Shadow>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  teamListContainer: {
    width: '100%',
  },
  teamList: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  teamBlock: {
    width: '95%',
    margin: 5,
  },
  linearGradient: {
    width: '100%',
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  white: {
    height: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  teamDescription: {
    marginTop: 10,
    color: 'black',
  },
  buttonContainer: {
    marginTop: 20,
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionText: {
    fontSize: 12,
    color: 'black',
  },
  button: {
    height: 50,
    borderRadius: 10,
    borderColor: 'black',
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 5,
  },
  plusText: {
    fontSize: 36,
    color: 'black',
  },
  shadow: {
    width: '100%',
  },
});

export default TeamList;
