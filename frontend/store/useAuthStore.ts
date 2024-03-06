import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';
import { api, SUBSCRIPTION_PLANS } from '../services/mockApi';
import { AlertService } from '../services/alertService';
import { router } from 'expo-router';

// Get backend URL from environment (for future real API integration)
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: null,

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      
      // Use mock API for development/testing
      const data = await api.login(email, password);
      const { access_token, user } = data;
      
      // Store token and user data
      await AsyncStorage.setItem('token', access_token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('isAuthenticated', 'true');
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        token: access_token
      });
      
      // Show success message
      AlertService.success(`Welcome back, ${user.name}!`);
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
      
      // Show error message
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      AlertService.authError(errorMessage);
      throw error;
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ isLoading: true });
      
      // For now, create a mock Google login until we implement OAuth
      const mockUser: User = {
        id: 'google_' + Date.now(),
        email: 'user@gmail.com',
        name: 'Google User',
        password: 'password123',
        profilePicture: 'https://via.placeholder.com/100',
        assessmentCompleted: false,
        subscription: {
          ...SUBSCRIPTION_PLANS.EXPLORE,
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-02-15T00:00:00Z',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      await AsyncStorage.setItem('isAuthenticated', 'true');
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      // Show success message
      AlertService.success(`Welcome, ${mockUser.name}!`);
    } catch (error) {
      console.error('Google login error:', error);
      set({ isLoading: false });
      AlertService.error('Google login failed. Please try again.');
      throw error;
    }
  },

  loginWithApple: async () => {
    try {
      set({ isLoading: true });
      
      // For now, create a mock Apple login until we implement OAuth
      const mockUser: User = {
        id: 'apple_' + Date.now(),
        email: 'user@icloud.com',
        name: 'Apple User',
        password: 'password123',
        assessmentCompleted: false,
        subscription: {
          ...SUBSCRIPTION_PLANS.MASTER,
          startDate: '2024-01-01T00:00:00Z',
          endDate: '2025-01-01T00:00:00Z',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(mockUser));
      await AsyncStorage.setItem('isAuthenticated', 'true');
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      // Show success message
      AlertService.success(`Welcome, ${mockUser.name}!`);
    } catch (error) {
      console.error('Apple login error:', error);
      set({ isLoading: false });
      AlertService.error('Apple login failed. Please try again.');
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true });
      
      // Use mock API for development/testing
      const data = await api.register(email, password, name);
      const { access_token, user } = data;
      
      // Store token and user data
      await AsyncStorage.setItem('token', access_token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('isAuthenticated', 'true');
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        token: access_token
      });
      
      // Show success message
      AlertService.success(`Account created successfully! Welcome, ${user.name}!`);
    } catch (error) {
      console.error('Registration error:', error);
      set({ isLoading: false });
      
      // Show error message
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      AlertService.error(errorMessage);
      throw error;
    }
  },

  logout: async () => {
    try {
      console.log('Logging out...');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('isAuthenticated');

      router.replace('/welcome');
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        token: null
      });
      
      // Show success message
      AlertService.success('You have been logged out. Please Sign In again.');
    } catch (error) {
      console.error('Logout error:', error);
      AlertService.error('Logout failed. Please try again.');
    }
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      
      const [userData, authStatus, token] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('isAuthenticated'),
        AsyncStorage.getItem('token'),
      ]);
      
      if (userData && authStatus === 'true') {
        const user = JSON.parse(userData);
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false,
          token
        });
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false,
          token: null
        });
      }
    } catch (error) {
      console.error('Load user error:', error);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        token: null
      });
    }
  },

  updateUser: async (userData: Partial<User>) => {
    try {
      const currentUser = get().user;
      if (!currentUser) return;
      
      // Use mock API for development/testing
      const updatedUser = await api.updateUser(currentUser.id, userData);
      
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
      
      // Show success message
      AlertService.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update user error:', error);
      AlertService.error('Failed to update profile. Please try again.');
      throw error;
    }
  },
}));