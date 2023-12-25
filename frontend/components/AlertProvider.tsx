import React, { useState, useEffect } from 'react';
import { CustomAlert, AlertData } from './CustomAlert';
import { alertManager } from '../services/alertManager';

interface AlertProviderProps {
  children: React.ReactNode;
}

export const AlertProvider: React.FC<AlertProviderProps> = ({ children }) => {
  const [currentAlert, setCurrentAlert] = useState<AlertData | null>(null);

  useEffect(() => {
    const unsubscribe = alertManager.subscribe((alerts) => {
      setCurrentAlert(alertManager.getCurrentAlert());
    });

    return unsubscribe;
  }, []);

  const handleDismiss = () => {
    alertManager.dismissCurrent();
  };

  return (
    <>
      {children}
      <CustomAlert alert={currentAlert} onDismiss={handleDismiss} />
    </>
  );
};
