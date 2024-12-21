import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useAlarms } from '../context/AlarmContext';

const AlarmListScreen = ({ navigation }: any) => {
  const { alarms, setAlarms, toggleAlarm, deleteAlarm } = useAlarms();
  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
    fetchAlarms();  // 화면이 로드될 때 알람 목록을 불러옵니다.
  }, []);

  // 알람 목록을 서버에서 가져오는 함수
  const fetchAlarms = async () => {
    setLoading(true);  // 데이터 로딩 시작
    try {
      const response = await fetch('https://port-0-appzem-m1qhzohka7273c65.sel4.cloudtype.app/Alarm');  // 실제 API URL로 수정
      const data = await response.json();

      if (response.ok) {
        setAlarms(data);  // 받아온 데이터를 상태에 저장
      } else {
        Alert.alert('알람 목록 불러오기 실패', '알람 목록을 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('알람 목록 불러오기 실패', '서버와의 연결에 실패했습니다.');
    } finally {
      setLoading(false);  // 데이터 로딩 완료
    }
  };

  // 알람 삭제 함수
// 알람 삭제 함수
const handleDelete = (id: string) => {
  Alert.alert(
    '알람 삭제',
    '정말로 이 알람을 삭제하시겠습니까?',
    [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(`https://port-0-appzem-m1qhzohka7273c65.sel4.cloudtype.app/Alarm/${id}`, {
              method: 'DELETE',  // DELETE 메서드로 요청 보내기
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              fetchAlarms();  // 삭제 후 알람 목록 다시 불러오기
            } else {
              Alert.alert('알람 삭제 실패', '알람을 삭제할 수 없습니다.');
            }
          } catch (error) {
            console.error(error);
            Alert.alert('알람 삭제 중 오류 발생', '서버와의 연결에 실패했습니다.');
          }
        },
      },
    ]
  );
};


  // 알람 활성화/비활성화 함수
  const handleToggle = async (id: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;

    try {
      // 서버에 알람 상태 변경 요청 보내기
      const response = await fetch(`https://port-0-appzem-m1qhzohka7273c65.sel4.cloudtype.app/Alarm/${id}/activate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          active: updatedStatus,  // 활성화 상태를 변경
        }),
      });

      if (response.ok) {
        // 성공적으로 업데이트되면 상태 변경
        toggleAlarm(id);
      } else {
        Alert.alert('알람 상태 변경 실패', '알람 상태를 변경할 수 없습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('알람 상태 변경 실패', '서버와의 연결에 실패했습니다.');
    }
  };

  const renderAlarm = ({ item }: any) => (
    <View style={styles.alarmItem}>
      <Text style={styles.alarmText}>
        {item.title} - {item.time} - {item.active ? '활성화됨' : '비활성화됨'}
      </Text>
      <Button
        title={item.active ? '비활성화' : '활성화'}
        onPress={() => handleToggle(item.id, item.active)}  // 활성화 상태 변경
        color="#FF6F61"
      />
      <Button
        title="삭제"
        onPress={() => handleDelete(item.id)}
        color="#FF6F61"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (  // 로딩 중에는 로딩 표시
        <Text style={styles.emptyText}>알람 목록을 불러오는 중...</Text>
      ) : alarms.length === 0 ? (
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
