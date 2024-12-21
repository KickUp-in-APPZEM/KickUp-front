// components/AlarmCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AlarmCard = ({ time, onPress }: any) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text>{time}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
});

export default AlarmCard;
