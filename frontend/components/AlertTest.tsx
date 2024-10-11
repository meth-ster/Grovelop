import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { AlertService } from '../services/alertService';

export const AlertTest = () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Custom Alert Test</Text>
      
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
});
