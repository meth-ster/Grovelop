import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';

interface FilterChipProps {
  label: string;
  count?: number;
  isActive: boolean;
  onPress: () => void;
}

export default function FilterChip({
  label,
  count,
  isActive,
  onPress
}: FilterChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.filterChip,
        isActive && styles.activeFilterChip,
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.filterText,
        isActive && styles.activeFilterText,
      ]}>
        {label} {count !== undefined && `(${count})`}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  filterChip: {
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeFilterChip: {
    backgroundColor: Colors.primary.goldenYellow,
    borderColor: Colors.primary.goldenYellow,
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  activeFilterText: {
    color: Colors.text.primary,
  },
});
