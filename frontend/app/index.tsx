import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';

export default function Index() {
  const router = useRouter();

  const goToLogin = () => {
    router.push({ pathname: '/welcome', params: { authMode: 'login' } });
  };

  const goToSubscription = () => {
    router.push('/subscription');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
        <Text style={styles.heading}>Personal Growth | Professional Development</Text>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.primaryButton} onPress={goToLogin}>
            <Text style={styles.primaryButtonText}>I already have an account</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={goToSubscription}>
            <Text style={styles.secondaryButtonText}>I don’t have an account yet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.navyBlue,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.lg,
  },
  logo: {
    width: 220,
    height: 220,
    marginBottom: Layout.spacing.md,
  },
  heading: {
    color: Colors.primary.goldenYellow,
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    textAlign: 'center',
  },
  buttons: {
    width: '100%',
    marginTop: Layout.spacing.xl,
    gap: Layout.spacing.md,
  },
  primaryButton: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    minHeight: Layout.touchTarget.medium,
    justifyContent: 'center',
    width: '70%',
    alignSelf: 'center',
  },
  primaryButtonText: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  secondaryButton: {
    width: '70%',
    alignSelf: 'center',  
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.goldenYellow,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    minHeight: Layout.touchTarget.medium,
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: Colors.primary.goldenYellow,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
});