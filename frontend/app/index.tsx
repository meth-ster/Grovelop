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
      console.log('Index routing - isAuthenticated:', isAuthenticated, 'user:', user?.name, 'assessmentCompleted:', user?.assessmentCompleted);
      
      if (!isAuthenticated) {
        console.log('Not authenticated, redirecting to welcome');
        router.replace('/welcome');
      } else if (!user?.assessmentCompleted) {
        console.log('Authenticated but assessment not completed, redirecting to assessment');
        router.replace('/assessment');
      } else {
        console.log('Authenticated and assessment completed, redirecting to home');
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