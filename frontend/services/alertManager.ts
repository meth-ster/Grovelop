import { AlertData } from '../components/CustomAlert';

class AlertManager {
  private alerts: AlertData[] = [];
  private listeners: ((alerts: AlertData[]) => void)[] = [];
  private currentAlert: AlertData | null = null;

  // Subscribe to alert changes
  subscribe(listener: (alerts: AlertData[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Get current alert
  getCurrentAlert(): AlertData | null {
    return this.currentAlert;
  }

  // Show alert
  showAlert(alert: Omit<AlertData, 'id'>) {
    const newAlert: AlertData = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random()}`,
    };

    // If there's already an alert showing, queue this one
    if (this.currentAlert) {
      this.alerts.push(newAlert);
    } else {
      this.currentAlert = newAlert;
    }

    this.notifyListeners();
  }

  // Dismiss current alert
  dismissCurrent() {
    this.currentAlert = null;
    
    // Show next alert if any
    if (this.alerts.length > 0) {
      this.currentAlert = this.alerts.shift() || null;
    }

    this.notifyListeners();
  }

  // Clear all alerts
  clearAll() {
    this.alerts = [];
    this.currentAlert = null;
    this.notifyListeners();
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.alerts]));
  }

  // Convenience methods
  success(message: string, title: string = 'Success', duration?: number) {
    this.showAlert({
      type: 'success',
      title,
      message,
      duration: duration || 4000,
    });
  }

  error(message: string, title: string = 'Error', duration?: number) {
    this.showAlert({
      type: 'error',
      title,
      message,
      duration: duration || 5000,
    });
  }

  warning(message: string, title: string = 'Warning', duration?: number) {
    this.showAlert({
      type: 'warning',
      title,
      message,
      duration: duration || 4000,
    });
  }

  info(message: string, title: string = 'Info', duration?: number) {
    this.showAlert({
      type: 'info',
      title,
      message,
      duration: duration || 4000,
    });
  }
}

// Create singleton instance
export const alertManager = new AlertManager();
