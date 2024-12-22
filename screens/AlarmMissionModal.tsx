import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';

const AlarmMissionModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [question, setQuestion] = useState<string>('');
  const [correctAnswer, setCorrectAnswer] = useState<string>('8');
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [alarmSound, setAlarmSound] = useState<Audio.Sound | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // 로딩 상태 추가

  // 랜덤 미션을 가져오는 함수
  const fetchRandomMission = async () => {
    setLoading(true); // 로딩 시작
    try {
      const response = await fetch('https://port-0-appzem-m1qhzohka7273c65.sel4.cloudtype.app/mission/random');
      const data = await response.json();

      console.log('Fetched mission:', data); // 데이터 확인용 로그 추가

      if (response.ok) {
        setQuestion(data.question);
         // 정답은 사용자에게 표시되지 않음
      } else {
        Alert.alert('미션 로드 실패', '미션을 가져오는 데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error fetching mission:', error);
      Alert.alert('오류 발생', '서버와 연결할 수 없습니다.');
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 모달이 열릴 때 랜덤 미션 가져오고 음악 및 진동 시작
  useEffect(() => {
    if (visible) {
      fetchRandomMission();
      setUserAnswer('');

      // 진동 시작
      Vibration.vibrate([500, 1000], true); // 500ms 진동, 1000ms 멈춤 반복

      // 음악 재생
      const sound = new Audio.Sound();
      sound.loadAsync(require('../assets/music.mp3'))
        .then(() => {
          sound.setIsLoopingAsync(true); // 무한 반복
          sound.playAsync();
        })
        .catch(error => {
          console.error('Sound loading failed', error);
        });

      setAlarmSound(sound);
    } else {
      // 모달 닫힐 때 음악 및 진동 중지
      stopAlarm();
    }

    return () => {
      stopAlarm();
    };
  }, [visible]);

  // 음악 및 진동 중지 함수
  const stopAlarm = () => {
    if (alarmSound) {
      alarmSound.stopAsync().then(() => {
        alarmSound.unloadAsync(); // 메모리 해제
      });
      setAlarmSound(null);
    }
    Vibration.cancel(); // 진동 중지
  };

  // 정답 확인
  const handleCheckAnswer = () => {
    if (userAnswer.trim() === correctAnswer) {
      Alert.alert('정답!', '미션 성공!');
      stopAlarm(); // 음악 및 진동 중지
    } else {
      Alert.alert('오답!', '다시 시도해주세요.');
    }
    
    onClose(); // 모달 닫기
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>알람 미션</Text>

          {loading ? (
            // 문제를 가져오는 동안 로딩 스피너를 표시
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Text style={styles.question}>{question}</Text> // 문제 표시
          )}
        
          <TextInput
            style={styles.input}
            placeholder="정답을 입력하세요"
            keyboardType="numeric"
            value={userAnswer}
            onChangeText={setUserAnswer}
          />
          <View style={styles.buttonContainer}>
            <Text>5+8</Text>
            <TouchableOpacity style={styles.checkButton} onPress={handleCheckAnswer}>
              <Text style={styles.buttonText}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => {
              stopAlarm();
              onClose();
            }}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center', // 중앙 정렬
    justifyContent: 'center', // 내용 중앙 정렬
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  question: {
    fontSize: 18,
    textAlign: 'center', // 중앙 정렬
    marginBottom: 20,
    top: 50,
  },
  
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  checkButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    padding: 10,
    marginRight: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButton: {
    flex: 1,
    backgroundColor: '#F44336',
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AlarmMissionModal;
