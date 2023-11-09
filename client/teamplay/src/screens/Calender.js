import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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
  state = {
    selectedDate: '',
    isTextInputVisible: false,
    eventText: '',
    events: {},
  };

  handleDayPress = (day) => {
    this.setState({ selectedDate: day.dateString, isTextInputVisible: true });
  };

  handleAddEvent = () => {
    const { selectedDate, eventText, events } = this.state;

    if (selectedDate && eventText) {
      const updatedEvents = { ...events };
      if (!updatedEvents[selectedDate]) {
        updatedEvents[selectedDate] = [];
      }
      updatedEvents[selectedDate].push(eventText);

      this.setState({
        events: updatedEvents,
        eventText: '',
        isTextInputVisible: false,
      });
    }
  };

  render() {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
      >
        <View style={{ paddingTop: 50, flex: 1, justifyContent: 'space-between' }}>
          <Calendar
            current={currentDateString}
            monthFormat={'yyyy년 MM월'}
            onDayPress={this.handleDayPress}
            markedDates={{
              [this.state.selectedDate]: { selected: true, selectedColor: 'lightblue' },
            }}
          />
          {this.state.isTextInputVisible && (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="일정을 입력하세요..."
                value={this.state.eventText}
                onChangeText={(text) => this.setState({ eventText: text })}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="default"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={this.handleAddEvent}
              >
                <Text style={{ fontSize: 24, color: 'white' }}>+</Text>
              </TouchableOpacity>
            </View>
          )}
          <EventList events={this.state.events} />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  textInput: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  eventListContainer: {
    marginHorizontal: 20,
  },
});

const EventList = ({ events }) => (
  <ScrollView style={styles.eventListContainer}>
    {Object.keys(events).map((date) => (
      <View key={date}>
        <Text>날짜: {date}</Text>
        {events[date].map((event, index) => (
          <Text key={index}>일정: {event}</Text>
        ))}
      </View>
    ))}
  </ScrollView>
);

export default Calender;
