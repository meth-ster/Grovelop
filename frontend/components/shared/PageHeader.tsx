import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  rightIconColor?: string;
  onRightIconPress?: () => void;
}

export default function PageHeader({
  title,
  showBackButton = true,
  rightIcon,
  rightIconColor = Colors.primary.goldenYellow,
  onRightIconPress
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {rightIcon && (
        <TouchableOpacity onPress={onRightIconPress}>
          <Ionicons name={rightIcon} size={24} color={rightIconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
});
