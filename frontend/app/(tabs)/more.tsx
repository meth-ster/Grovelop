import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { AlertService } from '../../services/alertService';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  title: string;
  description?: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  action?: () => void;
  badge?: string | number;
  color?: string;
}

export default function MoreScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();

  };

  const handleNavigation = (route: string) => {
    router.push(route as any);
  };

  const menuSections: MenuSection[] = [
    {
      title: 'Career Development',
      items: [
        {
          id: 'activity-library',
          title: 'Activity Library',
          description: 'Manage your development activities',
          icon: 'library',
          route: '/activity-library',
          badge: '12',
        },
        {
          id: 'grovelop-x',
          title: 'Grovelop/X',
          description: 'Curated professional content',
          icon: 'logo-twitter',
          route: '/grovelop-x',
          color: Colors.primary.warmOrange,
        },
        {
          id: 'documents',
          title: 'Documents',
          description: 'Resumes, cover letters & portfolios',
          icon: 'document-text',
          route: '/documents',
          badge: '5',
        },
      ],
    },
    {
      title: 'Job Search',
      items: [
        {
          id: 'saved-jobs',
          title: 'Saved Jobs',
          description: 'Your bookmarked opportunities',
          icon: 'bookmark',
          route: '/saved-jobs',
          badge: '2',
        },
        {
          id: 'messages',
          title: 'Messages',
          description: 'Employer communications',
          icon: 'chatbubbles',
          route: '/messages',
          badge: '3',
          color: Colors.primary.goldenYellow,
        },
        {
          id: 'applications',
          title: 'Applications',
          description: 'Track your job applications',
          icon: 'briefcase',
          route: '/applications',
        },
      ],
    },
    {
      title: 'Account & Settings',
      items: [
        {
          id: 'settings',
          title: 'Settings',
          description: 'App preferences & notifications',
          icon: 'settings',
          route: '/settings',
        },
        {
          id: 'help-support',
          title: 'Help & Support',
          description: 'FAQs, tutorials & contact us',
          icon: 'help-circle',
          route: '/help-support',
        },
        {
          id: 'feedback',
          title: 'Send Feedback',
          description: 'Help us improve Grovelop',
          icon: 'chatbubble-ellipses',
          action: () => {
            AlertService.info('Thank you for your interest in helping us improve!', 'Feedback');
          },
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          id: 'logout',
          title: 'Sign Out',
          description: 'Sign out of your account',
          icon: 'log-out',
          action: handleLogout,
          color: Colors.error,
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={() => {
        if (item.action) {
          item.action();
        } else if (item.route) {
          handleNavigation(item.route);
        }
      }}
    >
      <View style={styles.menuItemContent}>
        <View style={[
          styles.iconContainer,
          item.color && { backgroundColor: `${item.color}20` }
        ]}>
          <Ionicons 
            name={item.icon} 
            size={24} 
            color={item.color || Colors.text.primary}
          />
        </View>
        
        <View style={styles.menuItemText}>
          <Text style={[
            styles.menuItemTitle,
            item.color && { color: item.color }
          ]}>
            {item.title}
          </Text>
          {item.description && (
            <Text style={styles.menuItemDescription}>{item.description}</Text>
          )}
        </View>
        
        <View style={styles.menuItemMeta}>
          {item.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
          )}
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={Colors.text.tertiary} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSection = (section: MenuSection) => (
    <View key={section.title} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionContent}>
        {section.items.map(renderMenuItem)}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>More</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userInitial}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              {user?.archetype && (
                <View style={styles.archetypeBadge}>
                  <Text style={styles.archetypeText}>
                    {user.archetype.primary.charAt(0).toUpperCase() + user.archetype.primary.slice(1)}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Ionicons name="pencil" size={16} color={Colors.primary.navyBlue} />
          </TouchableOpacity>
        </View>

        {/* Progress Overview */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Your Progress</Text>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>85%</Text>
              <Text style={styles.progressLabel}>Profile Complete</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>12</Text>
              <Text style={styles.progressLabel}>Activities Done</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>5</Text>
              <Text style={styles.progressLabel}>Applications</Text>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map(renderSection)}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Grovelop</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appDescription}>
            AI-Powered Career Development Platform
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Mock data removed */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  scrollContent: {
    paddingBottom: Layout.spacing.xl,
  },
  header: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary.navyBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  userInitial: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  userEmail: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
  },
  archetypeBadge: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  archetypeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  editProfileButton: {
    width: Layout.touchTarget.small,
    height: Layout.touchTarget.small,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCard: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
  },
  progressTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressStat: {
    alignItems: 'center',
  },
  progressNumber: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.navyBlue,
    marginBottom: Layout.spacing.xs,
  },
  progressLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
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
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  menuItemDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  menuItemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  badge: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.full,
    minWidth: 24,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  appInfo: {
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
  },
  appName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.navyBlue,
    marginBottom: Layout.spacing.xs,
  },
  appVersion: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
  },
  appDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});