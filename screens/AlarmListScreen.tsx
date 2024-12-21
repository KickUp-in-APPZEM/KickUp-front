import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity, StyleSheet, Switch, ImageBackground, Image, Animated, Easing, Vibration } from 'react-native';
import { Audio } from 'expo-av'; // 소리 재생을 위한 추가
import { useAlarms } from '../context/AlarmContext';
import AddAlarmModal from './AddAlarmScreen'; // AddAlarmModal import


const AlarmListScreen = ({ navigation }: any) => {
  const { alarms, setAlarms, toggleAlarm, deleteAlarm } = useAlarms();
  const [loading, setLoading] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuAnimation = useState(new Animated.Value(-200))[0];
  const [contentTranslateY, setContentTranslateY] = useState(new Animated.Value(0));

  const [isAddAlarmModalVisible, setAddAlarmModalVisible] = useState(false);

  useEffect(() => {
    fetchAlarms();
  }, []);

  useEffect(() => {
    Animated.timing(menuAnimation, {
      toValue: menuVisible ? 0 : -200,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();

    Animated.timing(contentTranslateY, {
      toValue: menuVisible ? 50 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [menuVisible]);

  const fetchAlarms = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://port-0-appzem-m1qhzohka7273c65.sel4.cloudtype.app/Alarm');
      const data = await response.json();

      if (response.ok) {
        setAlarms(data);
      } else {
        Alert.alert('알람 목록 불러오기 실패', '알람 목록을 불러올 수 없습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('알람 목록 불러오기 실패', '서버와의 연결에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              if (response.ok) {
                fetchAlarms();
                Alert.alert('알람 삭제', '알람이 삭제되었습니다.');
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

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const updatedStatus = !currentStatus;

    try {
      const response = await fetch(`https://port-0-appzem-m1qhzohka7273c65.sel4.cloudtype.app/Alarm/${id}/activate`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          active: updatedStatus,
        }),
      });

      if (response.ok) {
        toggleAlarm(id);
        Alert.alert('알람 상태 변경', updatedStatus ? '알람이 활성화되었습니다.' : '알람이 비활성화되었습니다.');
      } else {
        Alert.alert('알람 상태 변경 실패', '알람 상태를 변경할 수 없습니다.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('알람 상태 변경 실패', '서버와의 연결에 실패했습니다.');
    }
  };

  const renderAlarm = ({ item }: any) => (
    <TouchableOpacity
      style={styles.alarmItem}
      onPress={() => navigation.navigate('EditAlarm', { alarm: item })}
    >
      <View style={styles.alarmInfo}>
        <Text style={styles.alarmTitle}>{item.title}</Text>
        <Text style={styles.alarmTime}>{item.time.includes('AM') ? '오전' : '오후'} {item.time.slice(0, 5)}</Text>
      </View>
      <View style={styles.switchContainer}>
        <Switch
          trackColor={{ false: '#767577', true: '#D1C4E9' }}
          thumbColor={item.active ? '#7E57C2' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => handleToggle(item.id, item.active)}
          value={item.active}
        />
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>삭제</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const MainPress = () => {
    navigation.navigate('AlarmList');
  };

  return (
    <ImageBackground source={require('../assets/dark.png')} style={styles.backgroundImage}>
      <View style={styles.header}>
        {!menuVisible && (
          <TouchableOpacity onPress={() => setMenuVisible(true)}>
            <Image source={require('../assets/menu.png')} style={styles.menuIcon} />
          </TouchableOpacity>
        )}
      </View>

      {menuVisible && (
        <TouchableOpacity
          style={styles.menuOverlay}
          onPress={() => setMenuVisible(false)}
        >
          <Animated.View style={[styles.menuContainer, { transform: [{ translateY: menuAnimation }] }]}>            
            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => {
                setMenuVisible(false);
                setAddAlarmModalVisible(true);
              }}
            >
              <Image source={require('../assets/watch.png')} style={styles.watchIcon} />
              <Text style={styles.menuButtonText}>알람 추가</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backgroundButton}
              onPress={() => {
                setMenuVisible(false);
                setTimeout(() => {
                  navigation.navigate('BackgroundSettings');
                }, 300);
              }}
            >
              <Image source={require('../assets/backgroundchange.png')} style={styles.backgroundIcon} />
              <Text style={styles.menuButtonText}>배경설정</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      )}

      <Animated.View style={[styles.containerWithMargin, { transform: [{ translateY: contentTranslateY }] }]}>        
        {loading ? (
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
      </Animated.View>

      <View style={styles.fixedFooter}>
        <TouchableOpacity style={styles.footerButton} onPress={MainPress}>
          <View style={styles.footerBar} />
          <Text style={styles.footerText}>알람</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <View style={styles.footerBar} />
          <Text style={styles.footerText}>캐릭터</Text>
        </TouchableOpacity>
      </View>

      {/* AddAlarmModal 모달을 여는 부분 */}
      <AddAlarmModal
        isVisible={isAddAlarmModalVisible}
        onClose={() => setAddAlarmModalVisible(false)}
        onAddAlarm={() => fetchAlarms()}
      />

      {/* 알람 트리거 추가 */}
      <AlarmTrigger alarms={alarms} />
    </ImageBackground>
  );
};

// 알람 트리거 컴포넌트 추가
const AlarmTrigger = ({ alarms }: { alarms: any[] }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // 소리 로드
  const loadSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(require('../assets/music.mp3'));
      setSound(sound);
    } catch (error) {
      console.error('소리 로드 실패:', error);
    }
  };

  useEffect(() => {
    loadSound();

    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      for (const alarm of alarms) {
        const [alarmHours, alarmMinutes] = alarm.time.split(':').map(Number);

        if (
          alarm.active && // 알람이 활성화되어 있고
          currentHours === alarmHours && // 현재 시간이 알람 시간과 같으며
          currentMinutes === alarmMinutes // 현재 분이 알람 분과 같을 때
        ) {
          triggerAlarm(alarm);
        }
      }
    }, 50000); // 10초마다 실행

    return () => {
      clearInterval(interval);
      if (sound) sound.unloadAsync(); // 컴포넌트 언마운트 시 소리 해제
    };
  }, [alarms]);

  const triggerAlarm = async (alarm: any) => {
    try {
      Alert.alert('알람', `${alarm.title} 시간이 되었습니다!`);
      Vibration.vibrate([5000, 5000, 5000]); // 진동 패턴
      if (sound) {
        await sound.replayAsync(); // 소리 재생
      }
    } catch (error) {
      console.error('알람 트리거 실패:', error);
    }
  };

  return null; // UI가 없는 컴포넌트
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  header: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 2,
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  menuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  menuText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  containerWithMargin: {
    flex: 1,
    padding: 20,
    paddingTop: '50%', // 화면 상단 30% 여백 추가
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alarmItem: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    backgroundColor: 'rgba(249, 249, 249, 0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alarmInfo: {
    flex: 1,
  },
  alarmTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  alarmTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 50,
  },
  addButton: {
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: '#3F51B5',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  fixedFooter: {
    position: 'absolute',
    bottom: 20, // 화면 하단에 고정
    flexDirection: 'row', // 버튼을 가로로 나열
    justifyContent: 'space-around', // 버튼 간 간격 균등 분배
    alignItems: 'center', // 세로축 가운데 정렬
    width: '100%', // 전체 너비 사용
    paddingHorizontal: 20, // 좌우 여백
  },
  footerButton: {
    alignItems: 'center', // 버튼 내부 콘텐츠를 가운데 정렬
    justifyContent: 'center', // 버튼 내부 콘텐츠를 수직 정렬
  },
  footerBar: {
    width: 150, // 막대의 너비
    height: 0.2, // 막대의 높이
    backgroundColor: '#B0BEC5', // 막대 색상 (회색)
    borderRadius: 2, // 막대의 모서리 둥글게 처리
    marginBottom: 5, // 텍스트와의 간격
  },
  footerText: {
    fontSize: 12, // 텍스트 크기
    color: '#FFFFFF', // 텍스트 색상
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '20%',
    backgroundColor: 'rgba(128, 128, 128, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    flexDirection: 'row', // 버튼들을 수평으로 정렬
    justifyContent: 'space-evenly', // 버튼 간의 간격을 균등하게 배치
  },
  menuButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'column', // 이미지를 위로, 텍스트를 아래로 배치
  },
  backgroundButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'column', // 이미지를 위로, 텍스트를 아래로 배치
  },
  watchIcon: {
    width: 45, // 아이콘 크기
    height: 45, // 아이콘 크기
    marginBottom: 10, // 이미지와 텍스트 간격 조정
  },
  backgroundIcon: {
    width: 45, // 아이콘 크기
    height: 45, // 아이콘 크기
    marginBottom: 10, // 이미지와 텍스트 간격 조정
  },
  menuButtonText: {
    fontSize: 18,
    flexDirection: 'row',
    color: '#FFFFFF',
  },
});

export default AlarmListScreen;
