import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';
import { AppSettings, NotificationSettings } from '../types';

interface SettingSection {
  title: string;
  items: SettingItem[];
}

interface SettingItem {
  id: string;
  title: string;
  description?: string;
  type: 'toggle' | 'navigation' | 'action';
  icon: keyof typeof Ionicons.glyphMap;
  value?: boolean;
  route?: string;
  action?: () => void;
  color?: string;
}

export default function SettingsScreen() {
  const router = useRouter();
  
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'auto',
    language: 'English',
    notifications: {
      pushNotifications: true,
      emailNotifications: true,
      activityReminders: true,
      jobAlerts: true,
      messageNotifications: true,
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: true,
      analytics: true,
    },
  });

  const handleToggleSetting = (key: string, section?: string) => {
    if (section === 'notifications') {
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [key]: !prev.notifications[key as keyof NotificationSettings],
        },
      }));
    } else if (section === 'privacy') {
      setSettings(prev => ({
        ...prev,
        privacy: {
          ...prev.privacy,
          [key]: !prev.privacy[key as keyof typeof prev.privacy],
        },
      }));
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deleted', 'Your account has been scheduled for deletion.');
          }
        },
      ]
    );
  };

  const settingSections: SettingSection[] = [
    {
      title: 'Notifications',
      items: [
        {
          id: 'pushNotifications',
          title: 'Push Notifications',
          description: 'Receive notifications on your device',
          type: 'toggle',
          icon: 'notifications',
          value: settings.notifications.pushNotifications,
        },
        {
          id: 'emailNotifications',
          title: 'Email Notifications',
          description: 'Receive updates via email',
          type: 'toggle',
          icon: 'mail',
          value: settings.notifications.emailNotifications,
        },
        {
          id: 'activityReminders',
          title: 'Activity Reminders',
          description: 'Get reminded about pending activities',
          type: 'toggle',
          icon: 'alarm',
          value: settings.notifications.activityReminders,
        },
        {
          id: 'jobAlerts',
          title: 'Job Alerts',
          description: 'Notifications for new job matches',
          type: 'toggle',
          icon: 'briefcase',
          value: settings.notifications.jobAlerts,
        },
        {
          id: 'messageNotifications',
          title: 'Message Notifications',
          description: 'Alerts for new messages from employers',
          type: 'toggle',
          icon: 'chatbubble',
          value: settings.notifications.messageNotifications,
        },
      ],
    },
    {
      title: 'Privacy & Data',
      items: [
        {
          id: 'profileVisibility',
          title: 'Profile Visibility',
          description: 'Currently set to public',
          type: 'navigation',
          icon: 'eye',
          route: '/privacy-settings',
        },
        {
          id: 'dataSharing',
          title: 'Data Sharing',
          description: 'Share data to improve recommendations',
          type: 'toggle',
          icon: 'share',
          value: settings.privacy.dataSharing,
        },
        {
          id: 'analytics',
          title: 'Analytics',
          description: 'Help us improve the app',
          type: 'toggle',
          icon: 'analytics',
          value: settings.privacy.analytics,
        },
      ],
    },
    {
      title: 'App Preferences',
      items: [
        {
          id: 'theme',
          title: 'Theme',
          description: 'Currently set to auto',
          type: 'navigation',
          icon: 'color-palette',
          route: '/theme-settings',
        },
        {
          id: 'language',
          title: 'Language',
          description: 'English',
          type: 'navigation',
          icon: 'language',
          route: '/language-settings',
        },
        {
          id: 'export-data',
          title: 'Export Data',
          description: 'Download your personal data',
          type: 'action',
          icon: 'download',
          action: () => Alert.alert('Export Data', 'Your data export will be emailed to you.'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'help',
          title: 'Help Center',
          description: 'FAQs and tutorials',
          type: 'navigation',
          icon: 'help-circle',
          route: '/help-support',
        },
        {
          id: 'contact',
          title: 'Contact Support',
          description: 'Get help from our team',
          type: 'action',
          icon: 'chatbubble-ellipses',
          action: () => Alert.alert('Contact Support', 'Redirecting to support chat...'),
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          description: 'Help us improve Grovelop',
          type: 'action',
          icon: 'thumbs-up',
          action: () => Alert.alert('Feedback', 'Thank you for your feedback!'),
        },
        {
          id: 'rate',
          title: 'Rate the App',
          description: 'Leave a review in the app store',
          type: 'action',
          icon: 'star',
          action: () => Alert.alert('Rate App', 'Redirecting to app store...'),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'delete-account',
          title: 'Delete Account',
          description: 'Permanently delete your account',
          type: 'action',
          icon: 'trash',
          action: handleDeleteAccount,
          color: Colors.error,
        },
      ],
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={() => {
        if (item.type === 'toggle') {
          const section = settingSections.find(s => s.items.includes(item))?.title.toLowerCase();
          if (section === 'notifications' || section === 'privacy & data') {
            handleToggleSetting(item.id, section.split(' ')[0]);
          }
        } else if (item.action) {
          item.action();
        } else if (item.route) {
          router.push(item.route as any);
        }
      }}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.settingContent}>
        <View style={[
          styles.settingIcon,
          item.color && { backgroundColor: `${item.color}20` }
        ]}>
          <Ionicons 
            name={item.icon} 
            size={24} 
            color={item.color || Colors.text.primary} 
          />
        </View>
        
        <View style={styles.settingText}>
          <Text style={[
            styles.settingTitle,
            item.color && { color: item.color }
          ]}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={styles.settingDescription}>{item.description}</Text>
          )}
        </View>
        
        <View style={styles.settingControl}>
          {item.type === 'toggle' ? (
            <Switch
              value={item.value}
              onValueChange={() => {
                const section = settingSections.find(s => s.items.includes(item))?.title.toLowerCase();
                if (section === 'notifications' || section === 'privacy & data') {
                  handleToggleSetting(item.id, section.split(' ')[0]);
                }
              }}
              trackColor={{ 
                false: Colors.neutral.gray300, 
                true: Colors.primary.goldenYellow 
              }}
              thumbColor={item.value ? Colors.primary.navyBlue : Colors.neutral.gray500}
            />
          ) : (
            <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section: SettingSection) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map(renderSettingItem)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Settings Sections */}
        {settingSections.map(renderSection)}

        {/* App Version */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>Grovelop v1.0.0</Text>
          <Text style={styles.buildText}>Build 2024.01.15</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    paddingBottom: Layout.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  section: {
    marginBottom: Layout.spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  sectionContent: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    overflow: 'hidden',
  },
  settingItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  settingIcon: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  settingDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  settingControl: {
    marginLeft: Layout.spacing.md,
  },
  versionInfo: {
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
  },
  versionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  buildText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
});