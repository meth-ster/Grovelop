import { Alert } from 'react-native';
import { alertManager } from './alertManager';

export interface AlertOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export class AlertService {
  // Success Alert - Use custom alert
  static success(message: string, title: string = 'Success') {
    alertManager.success(message, title);
  }

  // Error Alert - Use custom alert
  static error(message: string, title: string = 'Error') {
    alertManager.error(message, title);
  }

  // Warning Alert - Use custom alert
  static warning(message: string, title: string = 'Warning') {
    alertManager.warning(message, title);
  }

  // Info Alert - Use custom alert
  static info(message: string, title: string = 'Info') {
    alertManager.info(message, title);
  }

  // Confirmation Alert - Keep using native Alert for confirmations
  static confirm(options: AlertOptions) {
    const {
      title = 'Confirm',
      message,
      confirmText = 'Yes',
      cancelText = 'No',
      onConfirm,
      onCancel,
    } = options;

    Alert.alert(title, message, [
      {
        text: cancelText,
        style: 'cancel',
        onPress: onCancel,
      },
      {
        text: confirmText,
        style: 'default',
        onPress: onConfirm,
      },
    ]);
  }

  // Custom Alert with multiple buttons
  static custom(
    title: string,
    message: string,
    buttons: Array<{
      text: string;
      style?: 'default' | 'cancel' | 'destructive';
      onPress?: () => void;
    }>
  ) {
    Alert.alert(title, message, buttons);
  }

  // Loading Alert (for operations that take time)
  static loading(message: string = 'Loading...') {
    // Note: React Native Alert doesn't support loading state
    // This is a placeholder for future implementation with custom modal
    console.log(`Loading: ${message}`);
  }

  // Network Error Alert
  static networkError() {
    this.error(
      'Please check your internet connection and try again.',
      'Network Error'
    );
  }

  // Validation Error Alert
  static validationError(message: string) {
    this.error(message, 'Validation Error');
  }

  // Authentication Error Alert
  static authError(message: string = 'Authentication failed. Please try again.') {
    this.error(message, 'Authentication Error');
  }

  // Server Error Alert
  static serverError(message: string = 'Something went wrong. Please try again.') {
    this.error(message, 'Server Error');
  }
}

// Convenience functions for common alerts
export const showSuccess = (message: string, title?: string) => 
  AlertService.success(message, title);

export const showError = (message: string, title?: string) => 
  AlertService.error(message, title);

export const showWarning = (message: string, title?: string) => 
  AlertService.warning(message, title);

export const showInfo = (message: string, title?: string) => 
  AlertService.info(message, title);

export const showConfirm = (options: AlertOptions) => 
  AlertService.confirm(options);
