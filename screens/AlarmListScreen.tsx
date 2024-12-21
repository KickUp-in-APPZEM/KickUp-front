import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useAlarms } from '../context/AlarmContext';  // 알람 Context 사용

const AlarmListScreen = ({ navigation }: any) => {
  const { alarms, toggleAlarm } = useAlarms();  // 알람 데이터와 상태 변경 함수

  const renderAlarm = ({ item }: { item: { id: number; time: string; title: string; active: boolean } }) => (
    <View style={styles.alarmItem}>
      <Text style={styles.alarmText}>
        {item.title} - {item.time} - {item.active ? '활성화됨' : '비활성화됨'}
      </Text>
      <Button
        title={item.active ? '비활성화' : '활성화'}
        onPress={() => toggleAlarm(item.id)}
        color="#FF6F61"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {alarms.length === 0 ? (
        <Text style={styles.emptyText}>등록된 알람이 없습니다.</Text>
      ) : (
        <FlatList
          data={alarms}
          renderItem={renderAlarm}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <Button
        title="새 알람 추가하기"
        onPress={() => navigation.navigate('AddAlarm')}
        color="#FF6F61"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFCF9',
  },
  alarmItem: {
    padding: 15,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: '#FF6F61',
    borderRadius: 10,
    backgroundColor: '#FFF2F2',
  },
  alarmText: {
    fontSize: 16,
    color: '#FF6F61',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    color: '#FF6F61',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default AlarmListScreen;
