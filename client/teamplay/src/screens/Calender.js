import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'react-native-svg';

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
    selectedTime: new Date(),
    events: {},
    showTimePicker: false,
  };

  handleDayPress = (day) => {
    this.setState({
      selectedDate: day.dateString,
      isTextInputVisible: false,
      showTimePicker: true,
    });
  };

  handleAddEvent = () => {
    const { selectedDate, selectedTime, eventText, events } = this.state;

    if (selectedDate && eventText) {
      const updatedEvents = { ...events };
      const dateTime = `${selectedDate}`;
      if (!updatedEvents[dateTime]) {
        updatedEvents[dateTime] = [];
      }

      const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
      const formattedEvent = `${formattedTime} ${eventText}`;

      updatedEvents[dateTime].push({ text: formattedEvent, time: selectedTime });

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
      this.setState({
        selectedTime,
        showTimePicker: false,
        isTextInputVisible: true,
      });
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

  renderDay = (date, item) => {
    const eventsOnDate = this.state.events[date.dateString];
    const isSelectedDate = this.state.selectedDate === date.dateString;
  
    return (
      <TouchableOpacity onPress={() => this.handleDayPress(date)}>
        <View style={styles.circleContainer}>
          <LinearGradient
            colors={isSelectedDate ? ['#6A9CFD', '#FEE5E1'] : ['#FFB8D0', '#FF69B4']}
            style={styles.circle}
          />
          <Text style={styles.dayText}>{date.day}</Text>
        </View>
        {eventsOnDate && eventsOnDate.map((event, index) => (
          <View key={index}>
            <TouchableOpacity onPress={() => this.handleDeleteEvent(date.dateString, index)}>
              <Text style={styles.deleteText}>X</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ flex: 1 }}>{`${event.text.split(' ')[0]}`}</Text>
              <Text>{`${event.text.split(' ')[1]}`}</Text>
            </View>
          </View>
        ))}
      </TouchableOpacity>
    );
  };

  render() {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0];

    const markedDates = Object.keys(this.state.events).reduce((acc, dateTime) => {
      const [date] = dateTime.split(' ');
      acc[date] = { marked: false, selected: true, dotColor: '#FFB8D0', selectedColor: '#FFB8D0' };
      return acc;
    }, {});

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
            theme={{
              arrowColor: 'gray',
              todayTextColor: '#FFB8D0',
            }}
            renderDay={this.renderDay}
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
    borderColor: 'lightgray',
    borderWidth: 1,
    padding: 10,
    marginVertical: 5,
  },
  deleteText: {
    color: 'gray',
    fontSize: 18,
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  dayText: {
    color: 'white',
    fontSize: 16,
  },
});

const EventList = ({ events, onDeleteEvent }) => {
  const sortedDateTimes = Object.keys(events).sort();

  return (
    <View style={styles.eventListContainer}>
      {sortedDateTimes.map((dateTime) => (
        <View key={dateTime}>
          <Text>{`${dateTime}`}</Text>
          {events[dateTime].map((event, index) => (
            <View key={index} style={styles.eventContainer}>
              <View style={{ flex: 1 }}>
                <Text>{`${event.text}`}</Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <TouchableOpacity onPress={() => onDeleteEvent(dateTime, index)}>
                  <Text style={styles.deleteText}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default CalendarScreen;
