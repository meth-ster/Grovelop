import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

// Get backend URL from environment
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
      
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
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
    } catch (error) {
      console.error('Login error:', error);
      set({ isLoading: false });
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
        profilePicture: 'https://via.placeholder.com/100',
        assessmentCompleted: false,
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
    } catch (error) {
      console.error('Google login error:', error);
      set({ isLoading: false });
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
        assessmentCompleted: false,
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
    } catch (error) {
      console.error('Apple login error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      set({ isLoading: true });
      
      const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      const data = await response.json();
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
    } catch (error) {
      console.error('Registration error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('isAuthenticated');
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false,
        token: null
      });
    } catch (error) {
      console.error('Logout error:', error);
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
      
      const updatedUser = {
        ...currentUser,
        ...userData,
        updatedAt: new Date().toISOString(),
      };
      
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      set({ user: updatedUser });
    } catch (error) {
      console.error('Update user error:', error);
      throw error;
    }
  },
}));