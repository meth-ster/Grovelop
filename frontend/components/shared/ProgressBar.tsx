import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  showPercentage?: boolean;
  color?: string;
  backgroundColor?: string;
  style?: any;
}

export default function ProgressBar({
  progress,
  height = 6,
  showPercentage = false,
  color = Colors.primary.goldenYellow,
  backgroundColor = Colors.neutral.gray200,
  style
}: ProgressBarProps) {
  return (
    <View style={style}>
      {showPercentage && (
        <View style={styles.progressInfo}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
        </View>
      )}
      <View style={[styles.progressBar, { height, backgroundColor }]}>
        <View style={[
          styles.progressFill, 
          { 
            width: `${Math.min(100, Math.max(0, progress))}%`,
            backgroundColor: color,
            height: '100%'
          }
        ]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  progressLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  progressPercentage: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.goldenYellow,
  },
  progressBar: {
    borderRadius: Layout.borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: Layout.borderRadius.sm,
  },
});
