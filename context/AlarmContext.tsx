import React, { createContext, useContext, useState } from 'react';
import UUID from 'react-native-uuid';  // react-native-uuid 사용

type Alarm = {
  id: string;
  time: string;
  title: string;
  active: boolean;
};

type AlarmContextType = {
  alarms: Alarm[];
  addAlarm: (time: string, title: string) => void;
  toggleAlarm: (id: string) => void;
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

  const addAlarm = (time: string, title: string) => {
    const newAlarm: Alarm = {
      id: UUID.v4().toString(), // react-native-uuid로 고유 ID 생성
      time,
      title,
      active: true,
    };
    setAlarms((prev) => [...prev, newAlarm]);
  };

  const toggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, active: !alarm.active } : alarm
      )
    );
  };

  return (
    <AlarmContext.Provider value={{ alarms, addAlarm, toggleAlarm }}>
      {children}
    </AlarmContext.Provider>
  );
};

export default AlarmProvider;
