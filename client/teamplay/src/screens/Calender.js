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
import LinearGradient from 'react-native-linear-gradient';

LocaleConfig.locales['fr'] = {
  monthNames: [
    '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월',
  ],
  monthNamesShort: [
    '1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
  today: '오늘',
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ],
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

  renderDay = (date) => {
    const eventsOnDate = this.state.events[date.dateString];

    // Use toLocaleDateString to format the date string
    const formattedDate = new Date(date.dateString).toLocaleDateString({
      weekday: 'long',
      day: 'numeric',
    });

    return (
      <TouchableOpacity onPress={() => this.handleDayPress(date)}>
        <LinearGradient
          colors={['#FFB8D0', '#FEE5E1']}
          style={styles.circleContainer}
        >
          <View style={styles.circle}>
            <Text style={styles.dayText}>{formattedDate}</Text>
          </View>
        </LinearGradient>
        {eventsOnDate &&
          eventsOnDate.map((event, index) => (
            <View key={index} style={styles.eventContainer}>
              <TouchableOpacity onPress={() => this.handleDeleteEvent(date.dateString, index)}>
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.eventText}>{`${event.text}`}</Text>
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
          monthFormat={'MMMM'}
          onDayPress={this.handleDayPress}
          markedDates={markedDates}
          theme={{
            arrowColor: 'gray',
            todayTextColor: 'black',
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
    padding: 10,
    marginVertical: 5,
  },
  circleContainer: {
    width: '90%', 
    aspectRatio: 1, 
    borderRadius: 50, 
    overflow: 'hidden', 
  },
  circle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },  
  dayText: {
    fontSize: 14,
  },
  Text1 :{
    fontSize: 14,
    left: '20%'
  },
  Text2 : {
    fontSize: 14,
    left: '60%'
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgray',
    marginVertical: 5,
  },
  deleteText: {
    color: 'gray',
    fontSize: 14,
    position: 'absolute',
    right: '90%',
  },
  eventTextContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  
});

const EventList = ({ events, onDeleteEvent }) => {
  const sortedDateTimes = Object.keys(events).sort();

  return (
    <View style={styles.eventListContainer}>
      {sortedDateTimes.map((dateTime, index) => (
        <View key={dateTime}>
          <Text style={styles.dayText}>{new Date(dateTime).toLocaleDateString('en', {
            weekday: 'long',
            day: 'numeric',
          })}</Text>
          {events[dateTime].map((event, eventIndex) => (
            <View key={`${dateTime}_${eventIndex}`} style={styles.eventContainer}>
              <View style={styles.eventTextContainer}>
                <Text style={styles.Text1}>{`${event.text.split(' ')[0]}`}</Text>
                <Text style={styles.Text2}>{`${event.text.split(' ')[1]}`}</Text>
              </View>
              <TouchableOpacity onPress={() => onDeleteEvent(dateTime, eventIndex)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
          {index !== sortedDateTimes.length - 1 && <View style={styles.separator} />}
        </View>
      ))}
    </View>
  );
};

export default CalendarScreen;
