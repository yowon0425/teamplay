import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Shadow} from 'react-native-shadow-2';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

const TeamCard = ({team}) => {
  const navigation = useNavigation();
  const openHome = () => {
    console.log('네비게이터');
    navigation.navigate('MenuBar', {
      screen: 'Home',
      teamId: team.teamId,
    });
  };
  return (
    <TouchableOpacity style={styles.teamBlock} onPress={openHome}>
      <Shadow style={styles.shadow} distance={1} offset={[3, 3]}>
        <LinearGradient
          colors={['#FFB8D0', '#FEE5E1']}
          style={styles.linearGradient}>
          <View>
            <View style={styles.textContainer}>
              <Text style={styles.teamName}>{team.name}</Text>
            </View>
            <Text style={styles.teamDescription}>{team.description}</Text>
          </View>
        </LinearGradient>
      </Shadow>
    </TouchableOpacity>
  );
};

export default TeamCard;

const styles = StyleSheet.create({
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
    alignSelf: 'center',
  },
  buttonContainer: {
    marginTop: 20,
  },
  shadow: {
    width: '100%',
  },
});
