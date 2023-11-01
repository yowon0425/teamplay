import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native'; // Import TouchableOpacity
import { Calendar } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['fr'] = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: "오늘",
};
LocaleConfig.defaultLocale = 'fr';

class Calender extends Component {
  render() {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];

    return (
      <View style={{ paddingTop: 50, flex: 1, justifyContent: 'space-between' }}>
        <Calendar
          current={currentDateString}
          monthFormat={'yyyy년 MM월'}
        />
        <View style={{ position: 'absolute', top: 450, right: 10 }}>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'gray',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              // Handle the button press here
            }}
          >
            <Text style={{ fontSize: 24, color: 'white' }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default Calender;
