import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { AlertService } from '../services/alertService';

export const AlertDemo = () => {
  const handleSuccessAlert = () => {
    AlertService.success('This is a success message!');
  };

  const handleErrorAlert = () => {
    AlertService.error('This is an error message!');
  };

  const handleWarningAlert = () => {
    AlertService.warning('This is a warning message!');
  };

  const handleInfoAlert = () => {
    AlertService.info('This is an info message!');
  };

  const handleConfirmAlert = () => {
    AlertService.confirm({
      title: 'Confirm Action',
      message: 'Are you sure you want to perform this action?',
      confirmText: 'Yes, do it',
      cancelText: 'Cancel',
      onConfirm: () => {
        AlertService.success('Action confirmed!');
      },
      onCancel: () => {
        AlertService.info('Action cancelled.');
      },
    });
  };

  const handleNetworkError = () => {
    AlertService.networkError();
  };

  const handleValidationError = () => {
    AlertService.validationError('Please fill in all required fields.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alert System Demo</Text>
      
      <TouchableOpacity style={[styles.button, styles.successButton]} onPress={handleSuccessAlert}>
        <Text style={styles.buttonText}>Success Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.errorButton]} onPress={handleErrorAlert}>
        <Text style={styles.buttonText}>Error Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={handleWarningAlert}>
        <Text style={styles.buttonText}>Warning Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.infoButton]} onPress={handleInfoAlert}>
        <Text style={styles.buttonText}>Info Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirmAlert}>
        <Text style={styles.buttonText}>Confirm Alert</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.networkButton]} onPress={handleNetworkError}>
        <Text style={styles.buttonText}>Network Error</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.validationButton]} onPress={handleValidationError}>
        <Text style={styles.buttonText}>Validation Error</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successButton: {
    backgroundColor: '#4CAF50',
  },
  errorButton: {
    backgroundColor: '#F44336',
  },
  warningButton: {
    backgroundColor: '#FF9800',
  },
  infoButton: {
    backgroundColor: '#2196F3',
  },
  confirmButton: {
    backgroundColor: '#9C27B0',
  },
  networkButton: {
    backgroundColor: '#607D8B',
  },
  validationButton: {
    backgroundColor: '#795548',
  },
});
