// AlarmDetailScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAlarms } from '../context/AlarmContext';

const AlarmDetailScreen = ({ route, navigation }: any) => {
  const { alarms, setAlarms } = useAlarms();
  const { id } = route.params;  // 선택된 알람의 ID
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const alarm = alarms.find((alarm: any) => alarm.id === id);
    if (alarm) {
      setTitle(alarm.title);
      setTime(alarm.time);
    }
  }, [id, alarms]);

  const handleSave = async () => {
    try {
      const response = await fetch(`https://port-0-appzem-m1qhzohka7273c65.sel4.cloudtype.app/Alarm/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          time: `${time}:00`,  // 초는 00으로 고정
        }),
      });

      if (response.ok) {
        Alert.alert('수정 완료', '알람이 성공적으로 수정되었습니다.');
        // 수정 후 알람 목록을 다시 가져오기
        const updatedAlarms = await fetch('https://port-0-appzem-m1qhzohka7273c65.sel4.cloudtype.app/Alarm');
        const data = await updatedAlarms.json();
        setAlarms(data);
        navigation.goBack();  // 이전 화면으로 돌아가기
      } else {
        Alert.alert('수정 실패', '알람 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('서버 오류', '서버와의 연결에 실패했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알람 수정</Text>
      <TextInput
        style={styles.input}
        placeholder="알람 제목"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="알람 시간 (HH:mm)"
        value={time}
        onChangeText={setTime}
        keyboardType="numeric"
      />
      <Button title="저장" onPress={handleSave} color="#FF6F61" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFCF9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FF6F61',
  },
  input: {
    borderWidth: 1,
    borderColor: '#FF6F61',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    fontSize: 16,
  },
});

export default AlarmDetailScreen;
