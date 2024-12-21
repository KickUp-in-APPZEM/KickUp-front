// navigation/BottomTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AlarmListScreen from '../screens/AlarmListScreen';
import AddAlarmScreen from '../screens/AddAlarmScreen';
import { Ionicons } from '@expo/vector-icons';  // 아이콘 사용

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="AlarmList"
        component={AlarmListScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="alarm" size={24} color={color} />,
        }}
      />
      <BottomTab.Screen
        name="AddAlarm"
        component={AddAlarmScreen}
        options={{
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={24} color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}
