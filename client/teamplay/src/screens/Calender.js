import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import auth from '@react-native-firebase/auth';
import { useRoute } from '@react-navigation/native';

LocaleConfig.locales['ko-KR'] = {
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
LocaleConfig.defaultLocale = 'ko-KR';

const CalendarScreen = ({ teamId }) => {
  const [state, setState] = useState({
    selectedDate: '',
    isTextInputVisible: false,
    eventText: '',
    selectedTime: new Date(),
    events: {},
    showTimePicker: false,
  });

  const { uid } = auth().currentUser;

  const handleDayPress = (day) => {
    setState((prevState) => ({
      ...prevState,
      selectedDate: day.dateString,
      isTextInputVisible: false,
      showTimePicker: true,
    }));
  };

  const handleAddEvent = async () => {
    const { selectedDate, eventText, selectedTime, events } = state;
    if (!selectedDate || !eventText) return;

    const formattedTime = selectedTime.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    const formattedEvent = `${formattedTime} ${eventText}`;

    const updatedEvents = {
      ...events,
      [selectedDate]: [
        ...(events[selectedDate] || []),
        { text: formattedEvent, time: formattedTime },
      ],
    };

    try {
      const res = await axios.post('/api/addCalender', {
        uid,
        teamId,
        name: eventText,
        date: selectedDate,
        time: formattedTime,
      });

      if (res.data) {
        setState((prevState) => ({
          ...prevState,
          events: updatedEvents,
          eventText: '',
          isTextInputVisible: false,
          showTimePicker: false,
        }));
      } else {
        // Handle failure
      }
    } catch (err) {
      console.error('Error adding event:', err);
    }
  };

  const handleDeleteEvent = async (dateTime, index) => {
    const { events } = state;
    const updatedEvents = { ...events };
    const eventsOnDateTime = updatedEvents[dateTime];

    if (!eventsOnDateTime || index >= eventsOnDateTime.length) return;

    const eventToDelete = eventsOnDateTime[index];
    eventsOnDateTime.splice(index, 1);

    if (eventsOnDateTime.length === 0) {
      delete updatedEvents[dateTime];
    }

    try {
      const res = await axios.post('/api/deleteCalender', {
        uid,
        teamId,
        name: eventToDelete.text.split(' ')[1],
        date: dateTime,
        time: eventToDelete.time,
      });

      if (res.data) {
        setState((prevState) => ({
          ...prevState,
          events: updatedEvents,
        }));
      } else {
        // Handle failure
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const confirmDeleteEvent = (dateTime, index) => {
    Alert.alert('TeamPlay', '일정을 삭제하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '확인',
        onPress: () => handleDeleteEvent(dateTime, index),
      },
    ]);
  };

  const readAlarm = async (uid, teamId) => {
    try {
      const response = await axios.post('/api/calender', { uid, teamId });
      const eventData = response.data;

      const updatedEvents = {};
      Object.keys(eventData).forEach((key) => {
        const event = eventData[key];
        const { name, date, time } = event;
        updatedEvents[date] = [
          ...(updatedEvents[date] || []),
          { text: `${time} ${name}`, time: time },
        ];
      });

      setState((prevState) => ({
        ...prevState,
        events: updatedEvents,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    readAlarm(uid, teamId);
  }, []);

  const renderDay = (date) => {
    const { events } = state;
    const eventsOnDate = events[date.dateString];
    const formattedDate = new Date(date.dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'short',
    });

    return (
      <TouchableOpacity onPress={() => handleDayPress(date)}>
        <LinearGradient colors={['#FFB8D0', '#FEE5E1']} style={styles.circleContainer}>
          <View style={[styles.circle]}>
            <Text style={[styles.dayText]}>
              {formattedDate}
            </Text>
          </View>
        </LinearGradient>
        {eventsOnDate && eventsOnDate.length > 0 && (
          eventsOnDate.map((event, index) => (
            <View key={index} style={styles.eventContainer}>
              <TouchableOpacity
                onPress={() => confirmDeleteEvent(date.dateString, index)}
                style={styles.deleteButtonContainer}
              >
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.eventText}>{`${event.text}`}</Text>
            </View>
          ))
        )}
      </TouchableOpacity>
    );
  };

  const { selectedDate, isTextInputVisible, eventText, selectedTime, showTimePicker, events } = state;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>일정</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Calendar
            current={new Date().toISOString().split('T')[0]}
            monthFormat={'MMMM'}
            onDayPress={handleDayPress}
            markedDates={Object.keys(events).reduce((acc, dateTime) => {
              const [date] = dateTime.split(' ');
              acc[date] = {
                marked: true,
                dotColor: '#FFB8D0',
                selectedColor: '#FFB8D0',
              };
              return acc;
            }, {})}
            theme={{
              arrowColor: 'gray',
              todayTextColor: 'black',
              calendarBackground: 'transparent',
            }}
            renderDay={renderDay}
            style={{ backgroundColor: 'transparent' }}
          />

          {isTextInputVisible && (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="일정을 입력하세요..."
                value={eventText}
                onChangeText={(text) => setState((prevState) => ({ ...prevState, eventText: text }))}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="default"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddEvent}>
                <Text style={{ fontSize: 24, color: 'white' }}>+</Text>
              </TouchableOpacity>
            </View>
          )}
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={false}
              display="spinner"
              onChange={(event, selectedTime) => {
                if (event.type === 'set') {
                  setState((prevState) => ({
                    ...prevState,
                    selectedTime: selectedTime || new Date(),
                    showTimePicker: false,
                    isTextInputVisible: true,
                  }));
                } else {
                  setState((prevState) => ({
                    ...prevState,
                    showTimePicker: false,
                  }));
                }
              }}
            />
          )}
          <EventList events={events} onDeleteEvent={confirmDeleteEvent} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const EventList = ({ events, onDeleteEvent }) => {
  const sortedDateTimes = Object.keys(events).sort();

  return (
    <View style={styles.eventListContainer}>
      {sortedDateTimes.map((dateTime, index) => (
        <View key={dateTime}>
          <View style={styles.dayTop}>
            <Text style={styles.dayText}>
              {new Date(dateTime).toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
                weekday: 'long',
              })}
            </Text>
            <View style={styles.separator} />
          </View>
          {events[dateTime].map((event, eventIndex) => (
            <View
              key={`${dateTime}_${eventIndex}`}
              style={styles.eventContainer}>
              <View style={styles.eventTextContainer}>
                <Text style={styles.Text1}>{`${event.text.split(' ')[0]}`}</Text>
                <Text style={styles.Text2}>{`${event.text.split(' ')[1]}`}</Text>
              </View>
              <TouchableOpacity
                onPress={() => onDeleteEvent(dateTime, eventIndex)}
                style={styles.deleteButton}>
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

const styles = StyleSheet.create({
  header: {
    width: '90%',
    margin: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    alignSelf: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
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
    margin: 20,
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
  dayTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  dayText: {
    fontSize: 16,
    color: '#666666',
  },
  Text1: {
    fontSize: 14,
    left: '20%',
    marginRight: 20,
  },
  Text2: {
    fontSize: 14,
    left: '60%',
    color: 'black',
  },
  separator: {
    height: 1,
    backgroundColor: 'lightgray',
    width: '65%',
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
