import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';

const { width: screenWidth } = Dimensions.get('window');

export interface AlertData {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  title: string;
  message: string;
  duration?: number;
  onPress?: () => void;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface CustomAlertProps {
  alert: AlertData | null;
  onDismiss: () => void;
}

export const CustomAlert: React.FC<CustomAlertProps> = ({ alert, onDismiss }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (alert) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss after duration (except for confirm dialogs)
      if (alert.type !== 'confirm') {
        const timer = setTimeout(() => {
          handleDismiss();
        }, alert.duration || 4000);

        return () => clearTimeout(timer);
      }
    }
  }, [alert]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  };

  if (!alert) return null;

  const getAlertStyle = () => {
    switch (alert.type) {
      case 'success':
        return {
          backgroundColor: '#4CAF50',
          icon: 'checkmark-circle' as const,
          iconColor: '#FFFFFF',
        };
      case 'error':
        return {
          backgroundColor: '#F44336',
          icon: 'close-circle' as const,
          iconColor: '#FFFFFF',
        };
      case 'warning':
        return {
          backgroundColor: '#FF9800',
          icon: 'warning' as const,
          iconColor: '#FFFFFF',
        };
      case 'info':
        return {
          backgroundColor: '#2196F3',
          icon: 'information-circle' as const,
          iconColor: '#FFFFFF',
        };
      case 'confirm':
        return {
          backgroundColor: '#FFFFFF',
          icon: 'help-circle' as const,
          iconColor: '#2196F3',
        };
      default:
        return {
          backgroundColor: '#2196F3',
          icon: 'information-circle' as const,
          iconColor: '#FFFFFF',
        };
    }
  };

  const alertStyle = getAlertStyle();

  return (
    <Modal
      transparent
      visible={!!alert}
      animationType="none"
      onRequestClose={handleDismiss}
    >
      <View style={[
        styles.overlay,
        alert.type === 'confirm' && styles.overlayCentered
      ]}>
        <Animated.View
          style={[
            styles.alertContainer,
            alert.type === 'confirm' && styles.alertContainerCentered,
            {
              backgroundColor: alertStyle.backgroundColor,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {alert.type === 'confirm' ? (
            <View style={[styles.alertContentVertical]}>
              <View style={[styles.iconContainer, styles.iconContainerCentered]}>
                <Ionicons
                  name={alertStyle.icon}
                  size={32}
                  color={alertStyle.iconColor}
                />
              </View>
              
              <View style={[styles.textContainerCentered]}>
                <Text style={[styles.titleCentered, { color: '#000000' }]}>{alert.title}</Text>
                <Text style={[styles.messageCentered, { color: '#666666' }]}>{alert.message}</Text>
              </View>
              
              <View style={styles.confirmButtons}>
                <TouchableOpacity
                  style={[styles.confirmButton, styles.cancelButton]}
                  onPress={() => {
                    alert.onCancel?.();
                    handleDismiss();
                  }}
                >
                  <Text style={styles.cancelButtonText}>{alert.cancelText || 'Cancel'}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.confirmButton, styles.confirmButtonStyle]}
                  onPress={() => {
                    alert.onConfirm?.();
                    handleDismiss();
                  }}
                >
                  <Text style={styles.confirmButtonText}>{alert.confirmText || 'Confirm'}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.alertContent}
              onPress={alert.onPress || handleDismiss}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name={alertStyle.icon}
                  size={24}
                  color={alertStyle.iconColor}
                />
              </View>
              
              <View style={styles.textContainer}>
                <Text style={styles.title}>{alert.title}</Text>
                <Text style={styles.message}>{alert.message}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleDismiss}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={20} color={alertStyle.iconColor} />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  overlayCentered: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 0,
  },
  alertContainer: {
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  alertContainerCentered: {
    marginHorizontal: 40,
    maxWidth: 320,
    width: '100%',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  alertContentVertical: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 24,
  },
  iconContainer: {
    marginRight: 12,
  },
  iconContainerCentered: {
    marginRight: 0,
    marginBottom: 16,
  },
  textContainer: {
    flex: 1,
  },
  textContainerCentered: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  titleCentered: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  messageCentered: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  closeButton: {
    marginLeft: 12,
    padding: 4,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  confirmButtonStyle: {
    backgroundColor: '#2196F3',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666666',
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
