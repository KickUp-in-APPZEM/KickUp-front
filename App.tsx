// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AlarmProvider from './context/AlarmContext'; // 경로 확인

import AlarmListScreen from './screens/AlarmListScreen';
import AddAlarmScreen from './screens/AddAlarmScreen';
import EditAlarmScreen from './screens/EditAlarmScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <AlarmProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="AlarmList" 
            component={AlarmListScreen} 
            options={{ headerShown: false }} // 헤더 숨기기
          />
          <Stack.Screen name="AddAlarm" component={AddAlarmScreen} />
          <Stack.Screen name="EditAlarm" component={EditAlarmScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AlarmProvider>
  );
};

export default App;
