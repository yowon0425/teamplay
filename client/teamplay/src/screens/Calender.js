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
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import Modal from 'react-native-modal';

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
    isTimePickerVisible: false,
    eventText: '',
    selectedTime: '12:00', // Default time
    events: {},
  };

  handleDayPress = (day) => {
    this.setState({ selectedDate: day.dateString, isTextInputVisible: true });
  };

  handleAddEvent = () => {
    const { selectedDate, selectedTime, eventText, events } = this.state;

    if (selectedDate && eventText) {
      const updatedEvents = { ...events };
      const dateTime = `${selectedDate} ${selectedTime}`;
      if (!updatedEvents[dateTime]) {
        updatedEvents[dateTime] = [];
      }
      updatedEvents[dateTime].push(eventText);

      this.setState({
        events: updatedEvents,
        eventText: '',
        isTextInputVisible: false,
        selectedTime: '12:00', // Reset time after adding the event
      });
    }
  };

  toggleTimePicker = () => {
    this.setState({ isTimePickerVisible: !this.state.isTimePickerVisible });
  };

  handleTimeConfirm = (time) => {
    this.setState({ selectedTime: time, isTimePickerVisible: false });
  };

  handleDeleteEvent = (dateTime, index) => {
    const updatedEvents = { ...this.state.events };
    const eventsOnDateTime = updatedEvents[dateTime];

    if (eventsOnDateTime && eventsOnDateTime.length > index) {
      eventsOnDateTime.splice(index, 1);

      // Remove the date-time key if there are no more events on that date-time
      if (eventsOnDateTime.length === 0) {
        delete updatedEvents[dateTime];
      }

      this.setState({ events: updatedEvents });
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
          <View style={styles.selectedDateTimeContainer}>
            <Text style={styles.selectedDateTime}>{`선택된 날짜: ${this.state.selectedDate}`}</Text>
            <TouchableOpacity onPress={this.toggleTimePicker}>
              <Text style={styles.selectedDateTime}>{`선택된 시간: ${this.state.selectedTime}`}</Text>
            </TouchableOpacity>
          </View>
          <Modal
            isVisible={this.state.isTimePickerVisible}
            onBackdropPress={() => this.setState({ isTimePickerVisible: false })}
          >
            <View style={styles.modalContainer}>
              <View>
                <Text style={styles.modalTitle}>시간 선택</Text>
              </View>
              <TextInput
                style={styles.modalInput}
                placeholder="HH:mm"
                keyboardType="numeric"
                value={this.state.selectedTime}
                onChangeText={(text) => this.setState({ selectedTime: text })}
              />
              <TouchableOpacity onPress={() => this.handleTimeConfirm(this.state.selectedTime)}>
                <Text style={styles.modalButton}>확인</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <EventList
            events={this.state.events}
            onDeleteEvent={this.handleDeleteEvent}
          />
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
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButton: {
    color: 'blue',
    textAlign: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'blue',
    borderRadius: 5,
  },
  selectedDateTimeContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  selectedDateTime: {
    fontSize: 16,
    marginBottom: 10,
  },
  eventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  deleteText: {
    color: 'gray',
  },
});

const EventList = ({ events, onDeleteEvent }) => {
  const sortedDateTimes = Object.keys(events).sort();

  return (
    <ScrollView style={styles.eventListContainer}>
      {sortedDateTimes.map((dateTime) => (
        <View key={dateTime}>
          <Text>날짜/시간: {dateTime}</Text>
          {events[dateTime].map((event, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => onDeleteEvent(dateTime, index)}
            >
              <View style={styles.eventContainer}>
                <Text>일정: {event}</Text>
                <Text style={styles.deleteText}>X</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default CalendarScreen;
