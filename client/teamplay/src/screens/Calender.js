import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';

LocaleConfig.locales['fr'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월',
  ],
  monthNamesShort: [
    '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'fr';

class CalendarScreen extends Component {
  state = {
    selectedDate: '',
    isTextInputVisible: false,
    eventText: '',
    selectedTime: new Date(), // Default time
    events: {},
    showTimePicker: false,
  };

  handleDayPress = (day) => {
    this.setState({
      selectedDate: day.dateString,
      isTextInputVisible: true,
      showTimePicker: true,
    });
  };

  handleAddEvent = () => {
    const { selectedDate, selectedTime, eventText, events } = this.state;

    if (selectedDate && eventText) {
      const updatedEvents = { ...events };
      const dateTime = `${selectedDate} ${selectedTime.toLocaleTimeString()}`;
      if (!updatedEvents[dateTime]) {
        updatedEvents[dateTime] = [];
      }
      updatedEvents[dateTime].push({ text: eventText, time: selectedTime });

      this.setState({
        events: updatedEvents,
        eventText: '',
        isTextInputVisible: false,
        showTimePicker: false,
      });
    }
  };

  handleTimeChange = (event, selectedTime) => {
    if (event.type === 'set') {
      this.setState({ selectedTime, showTimePicker: false });
    } else {
      this.setState({ showTimePicker: false });
    }
  };

  handleDeleteEvent = (dateTime, index) => {
    const updatedEvents = { ...this.state.events };
    const eventsOnDateTime = updatedEvents[dateTime];

    if (eventsOnDateTime && eventsOnDateTime.length > index) {
      eventsOnDateTime.splice(index, 1);

      if (eventsOnDateTime.length === 0) {
        delete updatedEvents[dateTime];
      }

      this.setState({ events: updatedEvents });
    }
  };

  render() {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];

    const markedDates = {};
    Object.keys(this.state.events).forEach((dateTime) => {
      const [date] = dateTime.split(' ');
      markedDates[date] = { marked: true, dotColor: 'lightblue' };
    });

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
            markedDates={markedDates}
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
          {this.state.showTimePicker && (
            <DateTimePicker
              value={this.state.selectedTime}
              mode="time"
              is24Hour={false}
              display="spinner"
              onChange={this.handleTimeChange}
            />
          )}
          <ScrollView style={{ flex: 1 }}>
            <EventList
              events={this.state.events}
              onDeleteEvent={this.handleDeleteEvent}
            />
          </ScrollView>
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
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
  deleteText: {
    color: 'gray',
    fontSize: 18,
  },
});

const EventList = ({ events, onDeleteEvent }) => {
  const sortedDateTimes = Object.keys(events).sort();

  return (
    <View style={styles.eventListContainer}>
      {sortedDateTimes.map((dateTime) => (
        <View key={dateTime}>
          <Text>{`날짜/시간: ${dateTime}`}</Text>
          {events[dateTime].map((event, index) => (
            <View key={index} style={styles.eventContainer}>
              <Text>{`일정: ${event.text}`}</Text>
              <TouchableOpacity onPress={() => onDeleteEvent(dateTime, index)}>
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default CalendarScreen;
