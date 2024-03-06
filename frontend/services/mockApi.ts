// Mock API Service for Frontend Testing
// This will be replaced with real API calls when backend is ready

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserArchetype, JobListing, Activity, Document, Message, MessageThread } from '../types';

// Local Storage Keys
const STORAGE_KEYS = {
  USERS: 'grovelop_users',
  JOBS: 'grovelop_jobs',
  ACTIVITIES: 'grovelop_activities',
  DOCUMENTS: 'grovelop_documents',
  MESSAGES: 'grovelop_messages',
  THREADS: 'grovelop_threads',
};

// Subscription Plans Configuration
export const SUBSCRIPTION_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free Plan',
    type: 'free' as const,
    price: 0,
    currency: 'USD',
    billingCycle: 'monthly' as const,
    features: ['Basic features', 'Limited activities'],
    status: 'active' as const,
    startDate: new Date().toISOString(),
    autoRenew: false,
  },
  EXPLORE: {
    id: 'explore',
    name: 'Explore',
    type: 'explore' as const,
    price: 6.00, // $6/mo after discount
    originalPrice: 19.99,
    currency: 'USD',
    billingCycle: 'monthly' as const,
    features: [
      'Centralized team billing (per user/month)',
      'Usage analytics and reporting',
      'Org-wide privacy mode controls',
      'Role-based access control',
      'SAML/OIDC SSO',
    ],
    status: 'active' as const,
    startDate: new Date().toISOString(),
    autoRenew: true,
  },
  DEVELOP: {
    id: 'develop',
    name: 'Develop',
    type: 'develop' as const,
    price: 9.00, // $9/mo after discount
    originalPrice: 39.99,
    currency: 'USD',
    billingCycle: 'monthly' as const,
    features: [
      'Everything in Explore, plus:',
      'Curated X Feed (daily insights)',
      'Job Aspiration Matching',
      'Job Application Creator — 8/month (2/week)',
    ],
    status: 'active' as const,
    startDate: new Date().toISOString(),
    autoRenew: true,
  },
  MASTER: {
    id: 'master',
    name: 'Master',
    type: 'master' as const,
    price: 15.00, // $15/mo after discount
    originalPrice: 69.99,
    currency: 'USD',
    billingCycle: 'monthly' as const,
    features: [
      'Everything in Develop, plus:',
      'Unlimited Development Activities',
      'Priority support and account management',
    ],
    status: 'active' as const,
    startDate: new Date().toISOString(),
    autoRenew: true,
  },
};

// Default mock data (used for initial setup)
const defaultMockUsers: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    password: 'password123',
    profilePicture: 'https://via.placeholder.com/100',
    assessmentCompleted: true,
    subscription: {
      ...SUBSCRIPTION_PLANS.DEVELOP,
      startDate: '2024-01-15T00:00:00Z',
      endDate: '2024-02-15T00:00:00Z',
    },
    archetype: {
      primary: 'thinker',
      secondary: 'creator',
      scores: {
        doer: 6,
        thinker: 9,
        creator: 8,
        helper: 5,
        persuader: 4,
        organiser: 7,
      },
      description: 'You are a strategic thinker who thrives on solving complex problems and generating innovative solutions.',
      strengths: ['Analytical thinking', 'Problem-solving', 'Innovation'],
      growthAreas: ['Leadership skills', 'Communication', 'Team collaboration'],
      careerSuggestions: ['Data Scientist', 'Research & Development', 'Strategy Consultant'],
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'demo@example.com',
    name: 'Demo User',
    password: 'password123',
    assessmentCompleted: false,
    subscription: {
      ...SUBSCRIPTION_PLANS.MASTER,
      status: 'cancelled',
      startDate: '2024-01-01T00:00:00Z',
      endDate: '2024-12-31T00:00:00Z',
      autoRenew: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockJobs: JobListing[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: { min: 120000, max: 180000, currency: 'USD' },
    description: 'We are looking for a senior software engineer to join our team...',
    requirements: ['5+ years experience', 'React/Node.js', 'AWS'],
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'AWS'],
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    matchScore: 95,
    saved: false,
    applied: false,
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'StartupXYZ',
    location: 'Remote',
    type: 'full-time',
    salary: { min: 100000, max: 150000, currency: 'USD' },
    description: 'Lead product development and strategy...',
    requirements: ['3+ years PM experience', 'Agile methodology', 'Analytics'],
    skills: ['Product Management', 'Agile', 'Analytics', 'Leadership'],
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    matchScore: 87,
    saved: true,
    applied: false,
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'New York, NY',
    type: 'contract',
    salary: { min: 80, max: 120, currency: 'USD' },
    description: 'Create amazing user experiences...',
    requirements: ['Portfolio required', 'Figma expertise', 'User research'],
    skills: ['UI/UX Design', 'Figma', 'User Research', 'Prototyping'],
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    matchScore: 92,
    saved: false,
    applied: true,
  },
];

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Build a React Native App',
    description: 'Create a complete mobile application using React Native',
    type: 'project',
    status: 'not_started',
    difficulty: 'intermediate',
    estimatedTime: '2-3 weeks',
    skills: ['React Native', 'JavaScript', 'Mobile Development'],
    archetype: 'creator',
    content: {
      readingMaterial: 'React Native documentation and best practices',
      tasks: [
        {
          id: '1',
          title: 'Set up project structure',
          description: 'Initialize React Native project with proper folder structure',
          completed: false,
        },
        {
          id: '2',
          title: 'Implement navigation',
          description: 'Set up React Navigation for app navigation',
          completed: false,
        },
      ],
    },
    progress: {
      completed: false,
      timeSpent: 0,
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Learn TypeScript',
    description: 'Master TypeScript for better JavaScript development',
    type: 'skill_building',
    status: 'in_progress',
    difficulty: 'beginner',
    estimatedTime: '1-2 weeks',
    skills: ['TypeScript', 'JavaScript', 'Programming'],
    archetype: 'thinker',
    content: {
      readingMaterial: 'TypeScript Handbook and tutorials',
      tasks: [
        {
          id: '1',
          title: 'Basic types and interfaces',
          description: 'Learn about TypeScript basic types and interface definitions',
          completed: true,
          response: 'Completed basic types and interfaces module',
        },
        {
          id: '2',
          title: 'Advanced types',
          description: 'Study advanced TypeScript features like generics and utility types',
          completed: false,
        },
      ],
    },
    progress: {
      completed: false,
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      timeSpent: 120, // minutes
    },
    createdAt: new Date().toISOString(),
  },
];

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Software Engineer Resume',
    type: 'resume',
    content: 'Experienced software engineer with 5+ years...',
    format: 'pdf',
    targetJob: 'Senior Software Engineer',
    versions: [
      {
        id: '1',
        version: 1,
        content: 'Initial version of resume',
        changes: 'Created initial resume',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockMessages: Message[] = [
  {
    id: '1',
    threadId: '1',
    sender: 'employer',
    content: 'Thank you for your application. We would like to schedule an interview.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: '2',
    threadId: '1',
    sender: 'user',
    content: 'I would be happy to schedule an interview. What times work for you?',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
];

const mockThreads: MessageThread[] = [
  {
    id: '1',
    employerName: 'Tech Corp',
    jobTitle: 'Senior Software Engineer',
    lastMessage: mockMessages[1],
    unreadCount: 1,
    status: 'active',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Simulate network delay
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Local Storage Helper Functions
const getFromStorage = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading from storage ${key}:`, error);
    return defaultValue;
  }
};

const saveToStorage = async <T>(key: string, data: T): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to storage ${key}:`, error);
  }
};

// Initialize storage with default data if empty
const initializeStorage = async () => {
  const users = await getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
  if (users.length === 0) {
    await saveToStorage(STORAGE_KEYS.USERS, defaultMockUsers);
  }
  
  const jobs = await getFromStorage<JobListing[]>(STORAGE_KEYS.JOBS, []);
  if (jobs.length === 0) {
    await saveToStorage(STORAGE_KEYS.JOBS, mockJobs);
  }
  
  const activities = await getFromStorage<Activity[]>(STORAGE_KEYS.ACTIVITIES, []);
  if (activities.length === 0) {
    await saveToStorage(STORAGE_KEYS.ACTIVITIES, mockActivities);
  }
  
    const documents = await getFromStorage<Document[]>(STORAGE_KEYS.DOCUMENTS, []);
  if (documents.length === 0) {
    await saveToStorage(STORAGE_KEYS.DOCUMENTS, mockDocuments);
  }
  
  const messages = await getFromStorage<Message[]>(STORAGE_KEYS.MESSAGES, []);
  if (messages.length === 0) {
    await saveToStorage(STORAGE_KEYS.MESSAGES, mockMessages);
  }
  
  const threads = await getFromStorage<MessageThread[]>(STORAGE_KEYS.THREADS, []);
  if (threads.length === 0) {
    await saveToStorage(STORAGE_KEYS.THREADS, mockThreads);
  }
};

// Initialize storage on module load
initializeStorage();

// Mock API functions
export const mockApi = {
  // Authentication
  async login(email: string, password: string) {
    await delay();
    
    const users = await getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const user = users.find((u: User) => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Simulate password validation (in real app, this would be server-side)
    const pwCompare = users.find((u: User) => u.password === password)
    if ( !pwCompare) {
      throw new Error('Invalid password');
    }
    
    const token = `mock_token_${Date.now()}`;
    return {
      access_token: token,
      token_type: 'bearer',
      user,
    };
  },

  async register(email: string, password: string, name: string) {
    await delay();
    
    // Get current users from storage
    const users = await getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    
    // Check if user already exists
    const existingUser = users.find((u: User) => u.email === email);
    if (existingUser) {
      throw new Error('Email already registered');
    }
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      name,
      password,
      assessmentCompleted: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Add new user to storage
    const updatedUsers = [...users, newUser];
    await saveToStorage(STORAGE_KEYS.USERS, updatedUsers);
    
    const token = `mock_token_${Date.now()}`;
    return {
      access_token: token,
      token_type: 'bearer',
      user: newUser,
    };
  },

  // User management
  async getUser(userId: string) {
    await delay();
    const users = await getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    return users.find((u: User) => u.id === userId) || null;
  },

  async updateUser(userId: string, userData: Partial<User>) {
    await delay();
    
    const users = await getFromStorage<User[]>(STORAGE_KEYS.USERS, []);
    const userIndex = users.findIndex((u: User) => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser: User = {
      ...users[userIndex],
      ...userData,
      updatedAt: new Date().toISOString(),
    };
    
    users[userIndex] = updatedUser;
    await saveToStorage(STORAGE_KEYS.USERS, users);
    
    return updatedUser;
  },

  // Jobs
  async getJobs(filters?: { type?: string; saved?: boolean; applied?: boolean }) {
    await delay();
    
    const jobs = await getFromStorage<JobListing[]>(STORAGE_KEYS.JOBS, []);
    let filteredJobs = [...jobs];
    
    if (filters?.type && filters.type !== 'all') {
      if (filters.type === 'saved') {
        filteredJobs = filteredJobs.filter((job: JobListing) => job.saved);
      } else if (filters.type === 'applied') {
        filteredJobs = filteredJobs.filter((job: JobListing) => job.applied);
      }
    }
    
    return filteredJobs;
  },

  async getJob(jobId: string) {
    await delay();
    const jobs = await getFromStorage<JobListing[]>(STORAGE_KEYS.JOBS, []);
    return jobs.find((job: JobListing) => job.id === jobId) || null;
  },

  async saveJob(jobId: string) {
    await delay();
    const jobs = await getFromStorage<JobListing[]>(STORAGE_KEYS.JOBS, []);
    const jobIndex = jobs.findIndex((job: JobListing) => job.id === jobId);
    if (jobIndex !== -1) {
      jobs[jobIndex].saved = true;
      await saveToStorage(STORAGE_KEYS.JOBS, jobs);
      return jobs[jobIndex];
    }
    return null;
  },

  async unsaveJob(jobId: string) {
    await delay();
    const jobs = await getFromStorage<JobListing[]>(STORAGE_KEYS.JOBS, []);
    const jobIndex = jobs.findIndex((job: JobListing) => job.id === jobId);
    if (jobIndex !== -1) {
      jobs[jobIndex].saved = false;
      await saveToStorage(STORAGE_KEYS.JOBS, jobs);
      return jobs[jobIndex];
    }
    return null;
  },

  async applyToJob(jobId: string) {
    await delay();
    const jobs = await getFromStorage<JobListing[]>(STORAGE_KEYS.JOBS, []);
    const jobIndex = jobs.findIndex((job: JobListing) => job.id === jobId);
    if (jobIndex !== -1) {
      jobs[jobIndex].applied = true;
      await saveToStorage(STORAGE_KEYS.JOBS, jobs);
      return jobs[jobIndex];
    }
    return null;
  },

  // Activities
  async getActivities() {
    await delay();
    return await getFromStorage<Activity[]>(STORAGE_KEYS.ACTIVITIES, []);
  },

  async getActivity(activityId: string) {
    await delay();
    const activities = await getFromStorage<Activity[]>(STORAGE_KEYS.ACTIVITIES, []);
    return activities.find((activity: Activity) => activity.id === activityId) || null;
  },

  async updateActivityProgress(activityId: string, progress: Partial<Activity['progress']>) {
    await delay();
    const activities = await getFromStorage<Activity[]>(STORAGE_KEYS.ACTIVITIES, []);
    const activityIndex = activities.findIndex((a: Activity) => a.id === activityId);
    if (activityIndex !== -1) {
      activities[activityIndex].progress = { ...activities[activityIndex].progress, ...progress };
      await saveToStorage(STORAGE_KEYS.ACTIVITIES, activities);
      return activities[activityIndex];
    }
    return null;
  },

  // Documents
  async getDocuments() {
    await delay();
    return await getFromStorage<Document[]>(STORAGE_KEYS.DOCUMENTS, []);
  },

  async createDocument(document: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>) {
    await delay();
    const documents = await getFromStorage<Document[]>(STORAGE_KEYS.DOCUMENTS, []);
    const newDocument: Document = {
      ...document,
      id: `doc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    documents.push(newDocument);
    await saveToStorage(STORAGE_KEYS.DOCUMENTS, documents);
    return newDocument;
  },

  async updateDocument(documentId: string, updates: Partial<Document>) {
    await delay();
    const documents = await getFromStorage<Document[]>(STORAGE_KEYS.DOCUMENTS, []);
    const docIndex = documents.findIndex((d: Document) => d.id === documentId);
    if (docIndex === -1) {
      throw new Error('Document not found');
    }
    
    const updatedDocument: Document = {
      ...documents[docIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    documents[docIndex] = updatedDocument;
    await saveToStorage(STORAGE_KEYS.DOCUMENTS, documents);
    
    return updatedDocument;
  },

  // Messages
  async getMessageThreads() {
    await delay();
    return await getFromStorage<MessageThread[]>(STORAGE_KEYS.THREADS, []);
  },

  async getMessages(threadId: string) {
    await delay();
    const messages = await getFromStorage<Message[]>(STORAGE_KEYS.MESSAGES, []);
    return messages.filter((m: Message) => m.threadId === threadId);
  },

  async sendMessage(threadId: string, content: string) {
    await delay();
    const messages = await getFromStorage<Message[]>(STORAGE_KEYS.MESSAGES, []);
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      threadId,
      sender: 'user',
      content,
      timestamp: new Date().toISOString(),
      read: true,
    };
    messages.push(newMessage);
    await saveToStorage(STORAGE_KEYS.MESSAGES, messages);
    return newMessage;
  },

  // Assessment
  async submitAssessment(responses: any[]) {
    await delay();
    
    // Mock analysis - in real app this would call AI service
    const mockArchetype: UserArchetype = {
      primary: 'thinker',
      secondary: 'creator',
      scores: {
        doer: 6,
        thinker: 9,
        creator: 8,
        helper: 5,
        persuader: 4,
        organiser: 7,
      },
      description: 'You are a strategic thinker who thrives on solving complex problems and generating innovative solutions.',
      strengths: ['Analytical thinking', 'Problem-solving', 'Innovation'],
      growthAreas: ['Leadership skills', 'Communication', 'Team collaboration'],
      careerSuggestions: ['Data Scientist', 'Research & Development', 'Strategy Consultant'],
    };
    
    return mockArchetype;
  },
};

// Environment check - use mock API in development/testing
export const isDevelopment = __DEV__ || process.env.NODE_ENV === 'development' || process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';

export const api = isDevelopment ? mockApi : {
  // Real API calls will be implemented here when backend is ready
  login: mockApi.login,
  register: mockApi.register,
  getUser: mockApi.getUser,
  updateUser: mockApi.updateUser,
  getJobs: mockApi.getJobs,
  getJob: mockApi.getJob,
  saveJob: mockApi.saveJob,
  unsaveJob: mockApi.unsaveJob,
  applyToJob: mockApi.applyToJob,
  getActivities: mockApi.getActivities,
  getActivity: mockApi.getActivity,
  updateActivityProgress: mockApi.updateActivityProgress,
  getDocuments: mockApi.getDocuments,
  createDocument: mockApi.createDocument,
  updateDocument: mockApi.updateDocument,
  getMessageThreads: mockApi.getMessageThreads,
  getMessages: mockApi.getMessages,
  sendMessage: mockApi.sendMessage,
  submitAssessment: mockApi.submitAssessment,
};
