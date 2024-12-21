import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddAlarmModal = ({ isVisible, onClose, onAddAlarm }: { isVisible: boolean; onClose: () => void; onAddAlarm?: () => void }) => {
  const [alarmTitle, setAlarmTitle] = useState('');
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [show, setShow] = useState(false);

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleAddAlarm = async () => {
    if (!alarmTitle.trim()) {
      Alert.alert('입력 오류', '알람 제목을 입력해주세요!');
      return;
    }

    const formattedTime = formatTime(alarmTime);

    const alarmData = {
      time: formattedTime,
      title: alarmTitle.trim(),
      active: true,
    };

    try {
      const response = await fetch('https://port-0-appzem-m1qhzohka7273c65.sel4.cloudtype.app/Alarm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alarmData),
      });

      const data = await response.json();

      if (response.ok) {
        if (onAddAlarm) onAddAlarm(); // 리로드를 트리거
        onClose(); // 팝업 닫기
      } else {
        console.error('Response Error:', data);
        Alert.alert('알람 추가 실패', data.message || '알람을 추가할 수 없습니다.');
      }
    } catch (error) {
      console.error('Request Error:', error);
      Alert.alert('알람 추가 실패', '서버와의 연결에 실패했습니다.');
    }
  };

  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || alarmTime;
    setShow(false);
    setAlarmTime(currentDate);
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>시간 설정</Text>
          <Image source={require('../assets/click.png')} style={styles.click} />
          <TextInput
            style={styles.input}
            placeholder="알람 제목을 입력하세요"
            value={alarmTitle}
            onChangeText={setAlarmTitle}
          />
          <Text style={styles.timeText}>선택된 시간: {formatTime(alarmTime)}</Text>
          <TouchableOpacity style={styles.timeButton} onPress={showDatepicker}>
            <Text style={styles.timeButtonText}>시간 선택하기</Text>
          </TouchableOpacity>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={alarmTime}
              mode="time"
              is24Hour={true}
              onChange={onChange}
            />
          )}

          <TouchableOpacity style={styles.addButton} onPress={handleAddAlarm}>
            <Text>확인</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text>닫기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    padding: 30,
    backgroundColor: '#F7F3FF',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: '300',
    color: '#333333',
    marginBottom: 20,
    right: '45%',
    top: '-3%',
  },
  input: {
    width: '80%',
    padding: 10,
    height: '13%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 30,
    borderWidth: 1,
    borderColor: '#DADADA',
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    fontSize: 16,
    color: '#333333',
  },
  timeButton: {
    width: '50%',
    padding: 15,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeButtonText: {
    color: '#4F46E5',
    fontSize: 16,
  },
  timeText: {
    fontSize: 16,
    color: '#4F46E5',
    marginBottom: 20,
  },
  addButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    padding: 15,
  },
  closeButton: {
    position: 'absolute',
    right: 70,
    bottom: 20,
    padding: 15,
  },
  click: {
    width: 90,
    height: 90,
  },
});

export default AddAlarmModal;
