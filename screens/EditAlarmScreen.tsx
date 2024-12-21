import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditAlarmScreen = ({ route, navigation }: any) => {
  const { alarm } = route.params;
  const [alarmTitle, setAlarmTitle] = useState(alarm.title);
  const [alarmTime, setAlarmTime] = useState(new Date(`1970-01-01T${alarm.time}Z`)); // 서버에서 받은 시간 초기화
  const [show, setShow] = useState(false);

  // 시간을 서버에 보낼 형식으로 변환 (HH:mm:ss)
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = '00'; // 초는 항상 00으로 고정
    return `${hours}:${minutes}:${seconds}`;
  };

  // 알람 수정 핸들러
  const handleEditAlarm = async () => {
    if (!alarmTitle) {
      Alert.alert('입력 오류', '알람 제목을 입력해주세요!');
      return;
    }

    const formattedTime = formatTime(alarmTime); // 선택된 시간 포맷

    const updatedAlarm = {
      time: formattedTime,
      title: alarmTitle,
      active: alarm.active, // 기존 활성화 상태 유지
      id: alarm.id, // 기존 ID 사용
    };

    try {
      const response = await fetch(`https://port-0-appzem-m1qhzohka7273c65.sel4.cloudtype.app/Alarm/${alarm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAlarm),
      });

      if (response.ok) {
        Alert.alert('알람 수정 완료', `알람 "${updatedAlarm.title}"가 ${updatedAlarm.time}으로 수정되었습니다.`);
        navigation.goBack();
      } else {
        Alert.alert('알람 수정 실패', '알람을 수정할 수 없습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('알람 수정 실패', '서버와의 연결에 실패했습니다.');
    }
  };

  // DateTimePicker 변경 핸들러
  const onChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || alarmTime;
    setShow(false);
    setAlarmTime(currentDate);
  };

  // DateTimePicker 표시
  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알람 수정</Text>
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
        title="알람 수정하기 🌸"
        onPress={handleEditAlarm}
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

export default EditAlarmScreen;
