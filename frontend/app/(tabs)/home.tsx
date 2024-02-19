import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';

const { width: screenWidth } = Dimensions.get('window');
const gridItemSize = (screenWidth - Layout.spacing.lg * 4) / 3;

interface GridItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  route?: string;
  color: string;
  backgroundColor: string;
  action?: () => void;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleNavigation = (route: string) => {
    switch (route) {
      case 'jobs':
        router.push('/(tabs)/jobs');
        break;
      case 'grovelop-x':
        router.push('/grovelop-x');
        break;
      case 'workbench':
        router.push('/(tabs)/workbench');
        break;
      case 'my-development':
        router.push('/activity-library');
        break;
      case 'profile':
        router.push('/(tabs)/profile');
        break;
      case 'settings':
        router.push('/settings');
        break;
      case 'help':
        router.push('/help-support');
        break;
      default:
        break;
    }
  };

  const gridItems: GridItem[] = [
    {
      id: 'job-offers',
      title: 'Job Offers\n& Apply',
      icon: 'briefcase',
      route: 'jobs',
      color: Colors.text.inverse,
      backgroundColor: Colors.primary.navyBlue,
    },
    {
      id: 'grovelop-logo',
      title: 'Grovelop',
      icon: 'diamond',
      color: Colors.text.primary,
      backgroundColor: Colors.primary.goldenYellow,
      action: () => {
        // Maybe show app info or achievements
      },
    },
    {
      id: 'grovelop-x',
      title: 'Grovelop/X',
      icon: 'logo-twitter',
      route: 'grovelop-x',
      color: Colors.text.inverse,
      backgroundColor: Colors.primary.warmOrange,
    },
    {
      id: 'workbench',
      title: 'Workbench&\n My activities',
      icon: 'construct',
      route: 'workbench',
      color: Colors.text.inverse,
      backgroundColor: Colors.archetypes.thinker.primary,
    },
    {
      id: 'start',
      title: 'New Activity',
      icon: 'play-circle',
      color: Colors.text.inverse,
      backgroundColor: Colors.success,
      action: () => {
        // Maybe start a new activity or assessment
        router.push('/(tabs)/workbench');
      },
    },
    {
      id: 'my-development',
      title: 'Development\n History',
      icon: 'trending-up',
      route: 'my-development',
      color: Colors.text.inverse,
      backgroundColor: Colors.archetypes.creator.primary,
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      route: 'settings',
      color: Colors.text.primary,
      backgroundColor: Colors.neutral.gray300,
    },
    {
      id: 'profile',
      title: 'My Profile',
      icon: 'person-circle',
      route: 'profile',
      color: Colors.text.inverse,
      backgroundColor: Colors.archetypes.helper.primary,
    },
    {
      id: 'help',
      title: 'Help &\nSupport',
      icon: 'help-circle',
      route: 'help',
      color: Colors.text.inverse,
      backgroundColor: Colors.archetypes.persuader.primary,
    },
  ];

  const renderGridItem = (item: GridItem) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.gridItem, { backgroundColor: item.backgroundColor }]}
      onPress={() => {
        if (item.action) {
          item.action();
        } else if (item.route) {
          handleNavigation(item.route);
        }
      }}
      activeOpacity={0.8}
    >
      <Ionicons name={item.icon} size={32} color={item.color} />
      <Text style={[styles.gridItemText, { color: item.color }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>
              Welcome back, {user?.name || 'User'}!
            </Text>
            <Text style={styles.subtitleText}>
              {user?.archetype?.primary 
                ? `Your archetype: ${user.archetype.primary.charAt(0).toUpperCase() + user.archetype.primary.slice(1)}`
                : 'Ready to explore your potential?'
              }
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Daily Insight Card */}
        {user?.archetype && (
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <Ionicons name="bulb" size={20} color={Colors.primary.goldenYellow} />
              <Text style={styles.insightTitle}>Today's Insight</Text>
            </View>
            <Text style={styles.insightText}>
              As a {user.archetype.primary}, focus on leveraging your analytical strengths 
              to tackle complex challenges today. Consider starting a new project that 
              requires deep thinking and problem-solving.
            </Text>
          </View>
        )}

        {/* Main Grid */}
        <View style={styles.gridContainer}>
          <Text style={styles.sectionTitle}>Your Career Dashboard</Text>
          <View style={styles.grid}>
            {gridItems.map(renderGridItem)}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Activities Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Job Applications</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Skills Improved</Text>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Completed: Communication Skills Workshop</Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="bookmark" size={20} color={Colors.primary.goldenYellow} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Saved: Senior Developer position at TechCorp</Text>
                <Text style={styles.activityTime}>1 day ago</Text>
              </View>
            </View>
            <View style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <Ionicons name="document-text" size={20} color={Colors.primary.navyBlue} />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Generated new resume for Data Analyst role</Text>
                <Text style={styles.activityTime}>3 days ago</Text>
              </View>
            </View>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
  },
  welcomeText: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  subtitleText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  notificationButton: {
    width: Layout.touchTarget.small,
    height: Layout.touchTarget.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCard: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.goldenYellow,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  insightTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginLeft: Layout.spacing.sm,
  },
  insightText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  gridContainer: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Layout.spacing.md,
  },
  gridItem: {
    width: gridItemSize,
    height: gridItemSize,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Layout.spacing.md,
  },
  gridItemText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
    marginTop: Layout.spacing.sm,
    lineHeight: Typography.lineHeight.tight * Typography.fontSize.xs,
  },
  statsContainer: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.navyBlue,
    marginBottom: Layout.spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  recentSection: {
    paddingHorizontal: Layout.spacing.lg,
  },
  activityList: {
    gap: Layout.spacing.md,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.background.secondary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  activityIcon: {
    marginRight: Layout.spacing.md,
    marginTop: Layout.spacing.xs,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  activityTime: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
});