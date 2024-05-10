import React, {useState} from 'react';
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
import {Calendar, LocaleConfig} from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

LocaleConfig.locales['ko-KR'] = {
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
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘',
  monthNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};
LocaleConfig.defaultLocale = 'ko-KR';

const CalendarScreen = ({teamId}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [isTextInputVisible, setIsTextInputVisible] = useState(false);
  const [eventText, setEventText] = useState('');
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [events, setEvents] = useState({});
  const [showTimePicker, setShowTimePicker] = useState(false);

  const {uid} = auth().currentUser;

  // 이벤트 핸들러 함수들
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setIsTextInputVisible(false);
    setShowTimePicker(true);
  };

  const handleAddEvent = async () => {
    if (selectedDate && eventText) {
      const updatedEvents = {...events};
      const dateTime = `${selectedDate}`;
      if (!updatedEvents[dateTime]) {
        updatedEvents[dateTime] = [];
      }

      const formattedTime = selectedTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const formattedEvent = `${formattedTime} ${eventText}`;

      try {
        const res = await axios.post('/api/addCalender', {
          uid,
          teamId,
          name: eventText,
          date: selectedDate,
          time: formattedTime,
        });

        if (res.data) {
          console.log('성공');
          console.log(teamId, uid, eventText);
          setEvents(updatedEvents);
          setEventText('');
          setIsTextInputVisible(false);
          setShowTimePicker(false);
        } else {
          // 실패 시 할 작업
        }
      } catch (err) {
        console.error('Error adding event:', err);
      }
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === 'set') {
      setSelectedTime(selectedTime);
      setShowTimePicker(false);
      setIsTextInputVisible(true);
    } else {
      setShowTimePicker(false);
    }
  };

  const handleDeleteEvent = async (dateTime, index) => {
    const updatedEvents = {...events};
    const eventsOnDateTime = updatedEvents[dateTime];

    if (
      eventsOnDateTime &&
      eventsOnDateTime.length > index &&
      eventsOnDateTime[index]
    ) {
      const eventToDelete = eventsOnDateTime[index];

      if (eventToDelete && eventToDelete.time) {
        eventsOnDateTime.splice(index, 1);

        if (eventsOnDateTime.length === 0) {
          delete updatedEvents[dateTime];
        }

        // 이벤트를 삭제한 후 상태를 업데이트합니다.
        setEvents(updatedEvents);

        // 현재 사용자의 UID를 가져옵니다.
        const currentUser = auth().currentUser;
        if (currentUser) {
          const uid = currentUser.uid;

          try {
            console.log(eventToDelete.text.split(' ')[1], dateTime);
            const res = await axios.post('/api/deleteCalender', {
              uid,
              teamId,
              name: eventToDelete.text.split(' ')[1],
              date: dateTime,
              time: eventToDelete.time,
            });

            if (res.data) {
              // 성공 시 아무 작업도 하지 않습니다.
            } else {
              // 실패 시 할 작업
            }
          } catch (err) {
            // 에러 시 할 작업
            console.error('이벤트 삭제 중 오류 발생:', err);
          }
        } else {
          console.error('사용자 정보를 가져올 수 없습니다.');
        // 이벤트를 삭제한 후 바로 events 상태를 업데이트
        setEvents(updatedEvents);

        try {
          console.log(eventToDelete.text.split(' ')[1], selectedDate);
          const res = await axios.post('/api/deleteCalender', {
            uid,
            teamId,
            name: eventToDelete.text.split(' ')[1], // 이벤트의 설명 또는 이름으로 변경
            date: selectedDate,
            time: eventToDelete.time,
          });

          if (res.data) {
            // 성공 시 상태 업데이트
            setEvents(updatedEvents);
          } else {
            // 실패 시 할 작업
          }
        } catch (err) {
          // 에러 시 할 작업
          console.error('이벤트 삭제 중 오류 발생:', err);
        }
      } else {
        console.error(
          '이벤트 삭제 중 오류 발생: 이벤트 정보가 올바르게 설정되지 않았습니다.',
        );
      }
    } else {
      console.error(
        '이벤트 삭제 중 오류 발생: 이벤트 정보가 유효하지 않습니다.',
      );
    }
  };

  const readAlarm = async (uid, teamId) => {
    try {
      const response = await axios.post('/api/calender', { uid, teamId });
      const eventData = response.data;

      const updatedEvents = {};
      Object.keys(eventData).forEach((key) => {
        const event = eventData[key];
        const {name, date, time} = event;
        if (!updatedEvents[date]) {
          updatedEvents[date] = [];
        }
        updatedEvents[date].push({text: `${time} ${name}`, time: time});
      });
      setEvents(updatedEvents);
    } catch (error) {
      console.log(error);
    }
  };

  readAlarm(uid, teamId);

  const renderDay = (date) => {
    const eventsOnDate = events[date.dateString];
    const formattedDate = new Date(date.dateString).toLocaleDateString('en', {
      month: 'long',
      day: 'numeric',
    });
    
    const containerStyle = {
      backgroundColor: 'transparent',
    };
  
    return (
      <TouchableOpacity onPress={() => handleDayPress(date)}>
        <LinearGradient
          colors={['#FFB8D0', '#FEE5E1']}
          style={styles.circleContainer}>
          <View style={[styles.circle, containerStyle]}>
            <Text style={[styles.dayText, containerStyle]}>
              {formattedDate}
            </Text>
          </View>
        </LinearGradient>
        {eventsOnDate && eventsOnDate.length > 0 && (
          eventsOnDate.map((event, index) => (
            <View key={index} style={styles.eventContainer}>
              <TouchableOpacity
                onPress={() => handleDeleteEvent(date.dateString, index)}>
                <Text style={styles.deleteText}>X</Text>
              </TouchableOpacity>
              <Text style={styles.eventText}>{`${event.text}`}</Text>
            </View>
          ))
        )}
      </TouchableOpacity>
    );
  };  

  // 렌더링
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split('T')[0];

  const markedDates = Object.keys(events).reduce((acc, dateTime) => {
    const [date] = dateTime.split(' ');
    acc[date] = {
      marked: true,
      dotColor: '#FFB8D0',
      selectedColor: '#FFB8D0',
    };
    return acc;
  }, {});

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>일정</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Calendar
            current={currentDateString}
            monthFormat={'MMMM'}
            onDayPress={handleDayPress}
            markedDates={markedDates}
            theme={{
              arrowColor: 'gray',
              todayTextColor: 'black',
              calendarBackground: 'transparent', // Set the background color to transparent
            }}
            renderDay={renderDay}
            style={{backgroundColor: 'transparent'}}
          />

          {isTextInputVisible && (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="일정을 입력하세요..."
                value={eventText}
                onChangeText={(text) => setEventText(text)}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType="default"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddEvent}>
                <Text style={{fontSize: 24, color: 'white'}}>+</Text>
              </TouchableOpacity>
            </View>
          )}
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={false}
              display="spinner"
              onChange={handleTimeChange}
            />
          )}
          <EventList events={events} onDeleteEvent={handleDeleteEvent} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const EventList = ({events, onDeleteEvent}) => {
  const sortedDateTimes = Object.keys(events).sort();

  return (
    <View style={styles.eventListContainer}>
      {sortedDateTimes.map((dateTime, index) => (
        <View key={dateTime}>
          <View style={styles.dayTop}>
            <Text style={styles.dayText}>
              {new Date(dateTime).toLocaleDateString('en', {
                month: 'short',
                day: 'numeric',
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
    textAlign: 'right', // 월과 일을 오른쪽으로 정렬
    marginRight: 20,
  },
  Text2: {
    fontSize: 14,
    textAlign: 'right', // 월과 일을 오른쪽으로 정렬
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
