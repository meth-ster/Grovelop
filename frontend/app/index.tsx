import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/useAuthStore';
import Colors from '../constants/Colors';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace('/welcome');
      } else if (!user?.assessmentCompleted) {
        router.replace('/assessment');
      } else {
        router.replace('/(tabs)/home');
      }
    }
  }, [isAuthenticated, isLoading, user?.assessmentCompleted, router]);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: Colors.primary.navyBlue 
    }}>
      <ActivityIndicator size="large" color={Colors.primary.goldenYellow} />
    </View>
  );
}