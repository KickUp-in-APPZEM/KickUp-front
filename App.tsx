import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AlarmListScreen from './screens/AlarmListScreen';  // AlarmListScreen 컴포넌트 임포트
import AddAlarmScreen from './screens/AddAlarmScreen';  // AddAlarmScreen 컴포넌트 임포트
import AlarmProvider from './context/AlarmContext';  // AlarmProvider 임포트

const Stack = createStackNavigator();

const App = () => {
  return (
    <AlarmProvider>  {/* AlarmProvider로 감싸기 */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="AlarmList">
          <Stack.Screen name="AlarmList" component={AlarmListScreen} />
          <Stack.Screen name="AddAlarm" component={AddAlarmScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AlarmProvider>
  );
};

export default App;
