import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      
      // Mock authentication - replace with real API call
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
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
      console.error('Login error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  loginWithGoogle: async () => {
    try {
      set({ isLoading: true });
      
      // Mock Google authentication
      const mockUser: User = {
        id: 'google_1',
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
      
      // Mock Apple authentication
      const mockUser: User = {
        id: 'apple_1',
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
      
      // Mock registration
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
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
      console.error('Registration error:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('isAuthenticated');
      
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  loadUser: async () => {
    try {
      set({ isLoading: true });
      
      const [userData, authStatus] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('isAuthenticated'),
      ]);
      
      if (userData && authStatus === 'true') {
        const user = JSON.parse(userData);
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        });
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        });
      }
    } catch (error) {
      console.error('Load user error:', error);
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
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