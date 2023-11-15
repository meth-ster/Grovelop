import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';

type Status = 'completed' | 'in_progress' | 'not_started' | 'archived';

interface StatusIndicatorProps {
  status: Status;
  size?: number;
}

export default function StatusIndicator({ status, size = 32 }: StatusIndicatorProps) {
  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'completed': return Colors.success;
      case 'in_progress': return Colors.primary.goldenYellow;
      case 'not_started': return Colors.text.tertiary;
      case 'archived': return Colors.text.tertiary;
      default: return Colors.text.tertiary;
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'in_progress': return 'play-circle';
      case 'not_started': return 'ellipse-outline';
      case 'archived': return 'archive-outline';
      default: return 'ellipse-outline';
    }
  };

  return (
    <View style={[styles.statusIndicator, { 
      width: size, 
      height: size, 
      borderRadius: size / 2,
      backgroundColor: getStatusColor(status)
    }]}>
      <Ionicons 
        name={getStatusIcon(status)} 
        size={size * 0.5} 
        color={Colors.text.inverse} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statusIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
