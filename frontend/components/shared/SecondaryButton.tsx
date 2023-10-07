import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import Typography from '../../constants/Typography';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export default function SecondaryButton({ title, onPress, disabled, style, textStyle }: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && { opacity: 0.6 }, style]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Layout.touchTarget.medium,
  },
  text: {
    color: Colors.primary.goldenYellow,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
});


