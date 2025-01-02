import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';
import XLogo from '../../components/XLogo';

const { width: screenWidth } = Dimensions.get('window');
const gridItemSize = (screenWidth - Layout.spacing.lg * 4) / 5;

interface GridItem {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap | 'logo' | 'x-logo';
  route?: string;
  color: string;
  logoColor: string;
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
        router.push('/activity-pad');
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
      color: Colors.text.primary,
      logoColor: Colors.text.primary,
      backgroundColor: Colors.primary.goldenYellow,
    },
    {
      id: 'profile',
      title: 'My Profile',
      icon: 'person-circle',
      route: 'profile',
      color: Colors.text.primary,
      logoColor: Colors.neutral.white,
      backgroundColor: Colors.archetypes.helper.primary,
    },
    {
      id: 'grovelop-x',
      title: 'Grovelop/X',
      icon: 'x-logo',
      route: 'grovelop-x',
      color: Colors.text.primary,
      logoColor: Colors.neutral.white,
      backgroundColor: Colors.primary.warmOrange,
    },
    {
      id: 'workbench',
      title: 'ActivityPad',
      icon: 'construct',
      route: 'workbench',
      color: Colors.text.primary,
      logoColor: Colors.neutral.white,
      backgroundColor: Colors.archetypes.thinker.primary,
    },
    {
      id: 'grovelop-logo',
      title: '',
      icon: 'logo',
      color: Colors.neutral.white,
      logoColor: Colors.neutral.white,
      backgroundColor: Colors.neutral.white,
    },
    {
      id: 'start',
      title: 'New Activity',
      icon: 'play-circle',
      color: Colors.text.primary,
      logoColor: Colors.neutral.white,
      backgroundColor: Colors.success,
      action: () => {
        // Maybe start a new activity or assessment
        router.push('/(tabs)/workbench');
      },
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      route: 'settings',
      color: Colors.text.primary,
      logoColor: Colors.text.primary,
      backgroundColor: Colors.neutral.gray300,
    },
    {
      id: 'my-development',
      title: 'Development\n History',
      icon: 'trending-up',
      route: 'my-development',
      color: Colors.text.primary,
      logoColor: Colors.neutral.white,
      backgroundColor: Colors.archetypes.creator.primary,
    },
    {
      id: 'help',
      title: 'Help &\nSupport',
      icon: 'help-circle',
      route: 'help',
      color: Colors.text.primary,
      logoColor: Colors.neutral.white,
      backgroundColor: Colors.archetypes.persuader.primary,
    },
  ];

  const renderGridItem = (item: GridItem) => (
    <View style={styles.gridItemWrapper}>
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
        {item.icon === 'logo' ? (
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
        ) : item.icon === 'x-logo' ? (
          <XLogo size={32} color={item.logoColor} />
        ) : (
          <Ionicons name={item.icon} size={32} color={item.logoColor} />
        )}
      </TouchableOpacity>
      <Text style={[styles.gridItemText, { color: item.color }]}>
        {item.title}
      </Text>
    </View>
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
          </View>
        </View>

        {/* Main Grid */}
        <View style={styles.gridContainer}>
          <View style={styles.grid}>
            {gridItems.map(renderGridItem)}
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
  gridItemWrapper: {
    alignItems: 'center',
    padding: Layout.spacing.md,
  },
  gridItemText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    textAlign: 'center',
    marginTop: Layout.spacing.sm,
    lineHeight: Typography.lineHeight.tight * Typography.fontSize.xs,
  },
  logoImage: {
    width: 80,
    height: 80,
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
});