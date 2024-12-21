import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import { useAlarms } from '../context/AlarmContext';  // 알람 Context 사용

const AddAlarmScreen = ({ navigation }: any) => {
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmTitle, setAlarmTitle] = useState('');
  const { addAlarm } = useAlarms();  // 알람 추가 함수

  const handleAddAlarm = () => {
    if (!alarmTime || !alarmTitle) {
      Alert.alert('입력 오류', '알람 시간과 제목을 모두 입력해주세요!');
      return;
    }

    addAlarm(alarmTime, alarmTitle);  // 알람 시간과 제목 추가
    Alert.alert('알람 추가', `알람 "${alarmTitle}"가 ${alarmTime}에 추가되었습니다!`);
    navigation.goBack();  // 알람 추가 후 이전 화면으로 돌아가기
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💖 알람 추가 💖</Text>
      <TextInput
        style={styles.input}
        placeholder="알람 제목을 입력하세요"
        value={alarmTitle}
        onChangeText={setAlarmTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="알람 시간을 입력하세요 (ex: 12:00)"
        value={alarmTime}
        onChangeText={setAlarmTime}
        keyboardType="numeric"
      />
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
});

export default AddAlarmScreen;
