import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';

interface SearchProps extends Omit<TextInputProps, 'style'> {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
  containerStyle?: any;
  inputStyle?: any;
  iconColor?: string;
  iconSize?: number;
}

export default function Search({
  placeholder = "Search...",
  onSearch,
  onClear,
  showClearButton = true,
  containerStyle,
  inputStyle,
  iconColor = Colors.text.secondary,
  iconSize = 20,
  value,
  onChangeText,
  ...props
}: SearchProps) {
  const [internalValue, setInternalValue] = useState('');
  const currentValue = value !== undefined ? value : internalValue;

  const handleTextChange = (text: string) => {
    if (value === undefined) {
      setInternalValue(text);
    }
    onChangeText?.(text);
    onSearch?.(text);
  };

  const handleClear = () => {
    if (value === undefined) {
      setInternalValue('');
    }
    onChangeText?.('');
    onClear?.();
  };

  const handleSubmit = () => {
    onSearch?.(currentValue);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputContainer}>
        <Ionicons 
          name="search" 
          size={iconSize} 
          color={iconColor} 
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.input, inputStyle]}
          placeholder={placeholder}
          placeholderTextColor={Colors.text.tertiary}
          value={currentValue}
          onChangeText={handleTextChange}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          {...props}
        />
        {showClearButton && currentValue.length > 0 && (
          <TouchableOpacity 
            onPress={handleClear}
            style={styles.clearButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name="close-circle" 
              size={iconSize} 
              color={Colors.text.tertiary} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  searchIcon: {
    marginRight: Layout.spacing.sm,
    padding: Layout.spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    outlineColor: 'transparent',
    outlineWidth: 0,
    color: Colors.text.primary,
  },
  clearButton: {
    marginLeft: Layout.spacing.sm,
    padding: Layout.spacing.xs,
  },
});
