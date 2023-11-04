import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LocaleConfig } from 'react-native-calendars';
import Modal from 'react-native-modal';

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
    isModalVisible: false,
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

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
            style={styles.addButton}
            onPress={this.toggleModal}
          >
            <Text style={{ fontSize: 24, color: 'white' }}>+</Text>
          </TouchableOpacity>
        </View>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => this.toggleModal()}>
              <Text style={styles.optionText}>일정 추가</Text>
            </TouchableOpacity>
            <View style={styles.separator}></View>
            <TouchableOpacity onPress={() => this.toggleModal()}>
              <Text style={styles.optionText}>일정 삭제</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginVertical: 10,
  },
  optionText: {
    fontSize: 18, // Adjust the font size as needed
    marginVertical: 8, // Add some vertical spacing between options
  },
});

export default Calender;
