import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';

type AuthMode = 'login' | 'register';

export default function WelcomeScreen() {
  const router = useRouter();
  const { login, register, loginWithGoogle, loginWithApple } = useAuthStore();
  
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    
    if (authMode === 'register' && !name) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === 'login') {
        await login(email, password);
        // User will be redirected by the index.tsx based on auth state
        console.log('Login successful, user will be redirected automatically');
      } else {
        await register(email, password, name);
        // User will be redirected by the index.tsx based on auth state
        console.log('Registration successful, user will be redirected automatically');
      }
    } catch (error) {
      Alert.alert('Error', `${authMode === 'login' ? 'Login' : 'Registration'} failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      // User will be redirected automatically by index.tsx
      console.log('Google authentication successful');
    } catch (error) {
      Alert.alert('Error', 'Google authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleAuth = async () => {
    setIsLoading(true);
    try {
      await loginWithApple();
      // User will be redirected automatically by index.tsx
      console.log('Apple authentication successful');
    } catch (error) {
      Alert.alert('Error', 'Apple authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoText}>Grovelop</Text>
            </View>
            <Text style={styles.tagline}>
              Unlock Your Career Potential with AI-Powered Development
            </Text>
            <Text style={styles.description}>
              Discover your unique career archetype, generate personalized activities, 
              and accelerate your professional growth with intelligent insights.
            </Text>
          </View>

          {/* Benefits Section */}
          <View style={styles.benefitsSection}>
            <View style={styles.benefitItem}>
              <Ionicons name="analytics" size={24} color={Colors.primary.goldenYellow} />
              <Text style={styles.benefitText}>AI-Powered Career Analysis</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="trending-up" size={24} color={Colors.primary.goldenYellow} />
              <Text style={styles.benefitText}>Personalized Growth Activities</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="briefcase" size={24} color={Colors.primary.goldenYellow} />
              <Text style={styles.benefitText}>Smart Job Matching</Text>
            </View>
          </View>

          {/* Authentication Section */}
          <View style={styles.authSection}>
            {/* Social Authentication */}
            <TouchableOpacity 
              style={styles.socialButton}
              onPress={handleGoogleAuth}
              disabled={isLoading}
            >
              <Ionicons name="logo-google" size={20} color={Colors.text.primary} />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity 
                style={styles.socialButton}
                onPress={handleAppleAuth}
                disabled={isLoading}
              >
                <Ionicons name="logo-apple" size={20} color={Colors.text.primary} />
                <Text style={styles.socialButtonText}>Continue with Apple</Text>
              </TouchableOpacity>
            )}

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Email Authentication */}
            <View style={styles.emailAuthSection}>
              {authMode === 'register' && (
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    placeholderTextColor={Colors.text.tertiary}
                  />
                </View>
              )}
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor={Colors.text.tertiary}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  placeholderTextColor={Colors.text.tertiary}
                />
              </View>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleEmailAuth}
                disabled={isLoading}
              >
                <Text style={styles.primaryButtonText}>
                  {isLoading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Auth Mode Toggle */}
            <View style={styles.authToggle}>
              <Text style={styles.authToggleText}>
                {authMode === 'login' 
                  ? "Don't have an account? " 
                  : "Already have an account? "
                }
              </Text>
              <TouchableOpacity 
                onPress={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              >
                <Text style={styles.authToggleLink}>
                  {authMode === 'login' ? 'Sign Up' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Trial Information */}
          <View style={styles.trialSection}>
            <Text style={styles.trialText}>
              🎉 Start your 12-hour free trial and discover your career potential!
            </Text>
          </View>

          {/* Direct Dashboard Access for Testing */}
          <View style={styles.testSection}>
            <TouchableOpacity
              style={styles.testButton}
              onPress={() => {
                console.log('Direct dashboard access button clicked');
                router.push('/(tabs)/home');
              }}
            >
              <Text style={styles.testButtonText}>🧪 Test: Go to Dashboard Directly</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary.navyBlue,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: Layout.spacing.xl,
    paddingBottom: Layout.spacing.lg,
  },
  logoContainer: {
    marginBottom: Layout.spacing.md,
  },
  logoText: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.goldenYellow,
    textAlign: 'center',
  },
  tagline: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
  },
  description: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    opacity: 0.9,
  },
  benefitsSection: {
    paddingVertical: Layout.spacing.lg,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  benefitText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.inverse,
    marginLeft: Layout.spacing.md,
    flex: 1,
  },
  authSection: {
    paddingVertical: Layout.spacing.lg,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.neutral.white,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    minHeight: Layout.touchTarget.medium,
  },
  socialButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    marginLeft: Layout.spacing.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Layout.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.text.inverse,
    opacity: 0.3,
  },
  dividerText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.inverse,
    marginHorizontal: Layout.spacing.md,
    opacity: 0.7,
  },
  emailAuthSection: {
    marginBottom: Layout.spacing.lg,
  },
  inputContainer: {
    marginBottom: Layout.spacing.md,
  },
  input: {
    backgroundColor: Colors.neutral.white,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    minHeight: Layout.touchTarget.medium,
  },
  primaryButton: {
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    marginTop: Layout.spacing.sm,
    minHeight: Layout.touchTarget.medium,
  },
  primaryButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  authToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authToggleText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.inverse,
    opacity: 0.8,
  },
  authToggleLink: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary.goldenYellow,
    fontWeight: Typography.fontWeight.medium,
  },
  trialSection: {
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginVertical: Layout.spacing.lg,
  },
  trialText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    textAlign: 'center',
    fontWeight: Typography.fontWeight.medium,
  },
  testSection: {
    backgroundColor: Colors.neutral.gray200,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginVertical: Layout.spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary.goldenYellow,
    borderStyle: 'dashed',
  },
  testButton: {
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    minHeight: Layout.touchTarget.medium,
  },
  testButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
});