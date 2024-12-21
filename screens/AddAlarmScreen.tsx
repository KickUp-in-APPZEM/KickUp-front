import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddAlarmScreen = ({ navigation }: any) => {
  const [alarmTitle, setAlarmTitle] = useState('');
  const [alarmTime, setAlarmTime] = useState(new Date()); // 시간 초기값을 현재 시간으로 설정
  const [show, setShow] = useState(false); // DateTimePicker의 표시 여부

  // 시간을 서버에 보낼 형식으로 변환 (HH:mm:ss), 초는 항상 00으로 고정
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = '00'; // 초는 항상 00으로 고정
    return `${hours}:${minutes}:${seconds}`;
  };

  // 알람 추가 핸들러
  const handleAddAlarm = async () => {
    if (!alarmTitle) {
      Alert.alert('입력 오류', '알람 제목을 입력해주세요!');
      return;
    }

    const formattedTime = formatTime(alarmTime); // 선택된 시간 포맷

    const alarmData = {
      time: formattedTime,
      title: alarmTitle,
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
        Alert.alert('알람 추가', `알람 "${data.title}"가 ${data.time}에 추가되었습니다!`);

        // 알람 목록 화면으로 돌아가며 리로드
        navigation.navigate('AlarmList', { reload: true }); // reload 플래그 전달

      } else {
        Alert.alert('알람 추가 실패', data.message || '알람을 추가할 수 없습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('알람 추가 실패', '서버와의 연결에 실패했습니다.');
    }
  };

  // DateTimePicker가 변경되었을 때 호출되는 함수
  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || alarmTime;
    setShow(false);
    setAlarmTime(currentDate); // 선택된 시간 업데이트
  };

  // DateTimePicker 표시를 위한 버튼 클릭 핸들러
  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알람 추가</Text>
      <TextInput
        style={styles.input}
        placeholder="알람 제목을 입력하세요"
        value={alarmTitle}
        onChangeText={setAlarmTitle}
      />
      <Button title="시간 선택하기" onPress={showDatepicker} color="#FF6F61" />

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={alarmTime}
          mode="time"
          is24Hour={true}
          onChange={onChange}
        />
      )}

      <Text style={styles.timeText}>선택된 시간: {formatTime(alarmTime)}</Text>

      <Button
        title="알람 추가하기 🌸"
        onPress={handleAddAlarm}
        color="#FF6F61"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFCF9',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6F61',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '80%',
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FF6F61',
    borderRadius: 10,
    backgroundColor: '#FFF2F2',
    fontSize: 18,
    color: '#FF6F61',
  },
  timeText: {
    fontSize: 20,
    color: '#FF6F61',
    marginVertical: 10,
  },
});

export default AddAlarmScreen;
