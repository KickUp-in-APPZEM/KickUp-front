// screens/EditAlarmScreen.tsx
import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

const EditAlarmScreen = ({ route, navigation }: any) => {
  const { alarmTime } = route.params;  // 기존 알람 시간을 받아옵니다
  const [newAlarmTime, setNewAlarmTime] = useState(alarmTime);

  const handleSaveChanges = () => {
    // 변경된 알람 시간을 저장하는 로직
    console.log('새로운 알람 시간:', newAlarmTime);
    navigation.goBack();  // 변경 후 이전 화면으로 돌아가기
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>알람 수정</Text>
      <TextInput
        style={styles.input}
        value={newAlarmTime}
        onChangeText={setNewAlarmTime}
      />
      <Button title="저장" onPress={handleSaveChanges} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    width: '80%',
    padding: 10,
    marginBottom: 20,
  },
});

export default EditAlarmScreen;
