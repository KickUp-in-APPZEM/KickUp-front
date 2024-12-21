import React, { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';  // 알림을 띄우기 위해 추가

type Alarm = {
  id: string;
  time: string;
  title: string;
  active: boolean;
};

type AlarmContextType = {
  alarms: Alarm[];
  setAlarms: React.Dispatch<React.SetStateAction<Alarm[]>>;
  addAlarm: (time: string, title: string) => void;
  toggleAlarm: (id: string) => void;
  deleteAlarm: (id: string) => void;
  fetchAlarms: () => void;
};

const AlarmContext = createContext<AlarmContextType | undefined>(undefined);

export const useAlarms = () => {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarms must be used within an AlarmProvider');
  }
  return context;
};

const AlarmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  const fetchAlarms = async () => {
    try {
      const response = await fetch('https://your-api-url/Alarm');
      const data = await response.json();
      if (response.ok) {
        setAlarms(data);
      } else {
        Alert.alert('알람 목록 불러오기 실패', '알람 목록을 불러올 수 없습니다.');
      }
    } catch (error) {
      Alert.alert('서버와의 연결에 실패했습니다.', error.message);
    }
  };

  const addAlarm = async (time: string, title: string) => {
    try {
      const response = await fetch('https://your-api-url/Alarm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ time, title, active: true }),
      });
      if (response.ok) {
        const newAlarm = await response.json();
        setAlarms((prev) => [...prev, newAlarm]);  // 서버에서 받아온 새 알람을 리스트에 추가
      } else {
        Alert.alert('알람 추가 실패', '새 알람을 추가할 수 없습니다.');
      }
    } catch (error) {
      Alert.alert('서버와의 연결에 실패했습니다.', error.message);
    }
  };

  const toggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, active: !alarm.active } : alarm
      )
    );
  };

  const deleteAlarm = async (id: string) => {
    try {
      const response = await fetch(`https://your-api-url/Alarm/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setAlarms((prev) => prev.filter((alarm) => alarm.id !== id)); // 로컬 상태에서 삭제
      } else {
        Alert.alert('알람 삭제 실패', '알람을 삭제할 수 없습니다.');
      }
    } catch (error) {
      Alert.alert('알람 삭제 중 오류가 발생했습니다.', error.message);
    }
  };

  return (
    <AlarmContext.Provider value={{ alarms, setAlarms, addAlarm, toggleAlarm, deleteAlarm, fetchAlarms }}>
      {children}
    </AlarmContext.Provider>
  );
};

export default AlarmProvider;
