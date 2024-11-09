import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  padding?: number;
}

export default function Card({ 
  children, 
  onPress, 
  style, 
  padding = Layout.spacing.lg 
}: CardProps) {
  const CardComponent = onPress ? TouchableOpacity : View;
  
  return (
    <CardComponent
      style={[styles.card, { padding }, style]}
      onPress={onPress}
    >
      {children}
    </CardComponent>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
});
