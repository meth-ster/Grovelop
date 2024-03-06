// Grovelop Type Definitions

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  profilePicture?: string;
  archetype?: UserArchetype;
  assessmentCompleted: boolean;
  subscription?: SubscriptionPlan;
  createdAt: string;
  updatedAt: string;
}

export interface UserArchetype {
  primary: ArchetypeType;
  secondary?: ArchetypeType;
  scores: {
    doer: number;
    thinker: number;
    creator: number;
    helper: number;
    persuader: number;
    organiser: number;
  };
  description: string;
  strengths: string[];
  growthAreas: string[];
  careerSuggestions: string[];
}

export type ArchetypeType = 'doer' | 'thinker' | 'creator' | 'helper' | 'persuader' | 'organiser';

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: 'free' | 'explore' | 'develop' | 'master';
  price: number;
  originalPrice?: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  description?: string;
  options?: QuestionOption[];
  // New fields for richer question types
  fields?: Array<{ id: string; label: string; placeholder?: string }>; // for multi_text
  sliders?: Array<{ id: string; label: string; min?: number; max?: number }>; // for multi_slider
  categories?: Array<{ id: string; label: string; max?: number; options: QuestionOption[] }>; // for categorized_multi_select
  required: boolean;
  category: string;
  order: number;
}

export type QuestionType = 
  | 'single_choice' 
  | 'multiple_choice' 
  | 'text_input' 
  | 'slider' 
  | 'ranking' 
  | 'open_text'
  | 'multi_text' // multiple labeled text inputs
  | 'multi_slider' // multiple labeled sliders
  | 'categorized_multi_select' // grouped multi-select with per-group max
  | 'select_with_inputs'; // checkbox options that reveal text inputs

export interface QuestionOption {
  id: string;
  text: string;
  value: any;
}

export interface QuestionnaireResponse {
  questionId: string;
  answer: any;
  timestamp: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: ActivityType;
  status: ActivityStatus;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  skills: string[];
  archetype: ArchetypeType;
  content?: {
    readingMaterial?: string;
    tasks: ActivityTask[];
  };
  progress: {
    completed: boolean;
    startedAt?: string;
    completedAt?: string;
    timeSpent: number;
  };
  createdAt: string;
}

export type ActivityType = 'skill_building' | 'project' | 'reflection' | 'networking' | 'research';
export type ActivityStatus = 'not_started' | 'in_progress' | 'completed' | 'archived';

export interface ActivityTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  response?: string;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary?: {
    min: number;
    max: number;
    currency: string;
  };
  description: string;
  requirements: string[];
  skills: string[];
  postedAt: string;
  applicationDeadline?: string;
  matchScore: number;
  saved: boolean;
  applied: boolean;
}

export interface Document {
  id: string;
  title: string;
  type: 'resume' | 'cover_letter' | 'portfolio';
  content: string;
  format: 'pdf' | 'docx' | 'txt';
  targetJob?: string;
  versions: DocumentVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentVersion {
  id: string;
  version: number;
  content: string;
  changes: string;
  createdAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  sender: 'user' | 'employer' | 'system';
  content: string;
  attachments?: string[];
  timestamp: string;
  read: boolean;
}

export interface MessageThread {
  id: string;
  employerName: string;
  jobTitle: string;
  lastMessage: Message;
  unreadCount: number;
  status: 'active' | 'archived';
  createdAt: string;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  activityReminders: boolean;
  jobAlerts: boolean;
  messageNotifications: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  privacy: {
    profileVisibility: 'public' | 'private';
    dataSharing: boolean;
    analytics: boolean;
  };
}

// Navigation Types
export type RootStackParamList = {
  Welcome: undefined;
  Assessment: undefined;
  Home: undefined;
  Profile: undefined;
  Workbench: { activityId?: string };
  ActivityLibrary: undefined;
  JobOffers: undefined;
  SavedJobs: undefined;
  Messages: undefined;
  Documents: undefined;
  Settings: undefined;
  HelpSupport: undefined;
  GrovelopX: undefined;
};