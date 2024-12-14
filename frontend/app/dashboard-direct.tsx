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
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';

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

export default function DashboardDirectScreen() {
  const router = useRouter();

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
      id: 'grovelop-x',
      title: 'Grovelop/X',
      icon: 'logo-twitter',
      route: 'grovelop-x',
      color: Colors.text.inverse,
      backgroundColor: Colors.primary.warmOrange,
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
      id: 'workbench',
      title: 'Workbench',
      icon: 'construct',
      route: 'workbench',
      color: Colors.text.inverse,
      backgroundColor: Colors.archetypes.thinker.primary,
    },
    {
      id: 'start',
      title: 'START',
      icon: 'play-circle',
      color: Colors.text.inverse,
      backgroundColor: Colors.success,
      action: () => {
        router.push('/(tabs)/workbench');
      },
    },
    {
      id: 'my-development',
      title: 'My\nDevelopment',
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
              Welcome to Grovelop Dashboard!
            </Text>
            <Text style={styles.subtitleText}>
              Direct access for testing - Your career development platform
            </Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        {/* Quick Access Navigation */}
        <View style={styles.quickNav}>
          <TouchableOpacity style={styles.quickNavButton} onPress={() => router.push('/(tabs)/home')}>
            <Text style={styles.quickNavText}>Go to Tab Home</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickNavButton} onPress={() => router.push('/welcome')}>
            <Text style={styles.quickNavText}>Back to Welcome</Text>
          </TouchableOpacity>
        </View>

        {/* Main Grid */}
        <View style={styles.gridContainer}>
          <Text style={styles.sectionTitle}>Your Career Dashboard</Text>
          <View style={styles.grid}>
            {gridItems.map(renderGridItem)}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Activities</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Applications</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Skills</Text>
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
  quickNav: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  quickNavButton: {
    flex: 1,
    backgroundColor: Colors.primary.goldenYellow,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  quickNavText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
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
});