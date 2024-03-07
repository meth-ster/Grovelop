import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';
import { Activity } from '../types';

// Mock activities data
const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Strategic Communication in Leadership',
    description: 'Develop your ability to communicate strategic vision and inspire teams through clear, compelling messaging.',
    type: 'skill_building',
    status: 'in_progress',
    difficulty: 'intermediate',
    estimatedTime: '45 minutes',
    skills: ['Communication', 'Leadership', 'Strategy'],
    archetype: 'persuader',
    progress: {
      completed: false,
      startedAt: '2024-01-10T10:00:00Z',
      timeSpent: 25,
    },
    createdAt: '2024-01-10T09:00:00Z',
  },
  {
    id: '2',
    title: 'Data-Driven Decision Making',
    description: 'Learn to leverage analytics and data insights to make informed strategic decisions in complex business scenarios.',
    type: 'project',
    status: 'completed',
    difficulty: 'advanced',
    estimatedTime: '2 hours',
    skills: ['Data Analysis', 'Critical Thinking', 'Strategy'],
    archetype: 'thinker',
    progress: {
      completed: true,
      startedAt: '2024-01-05T14:00:00Z',
      completedAt: '2024-01-07T16:30:00Z',
      timeSpent: 120,
    },
    createdAt: '2024-01-05T14:00:00Z',
  },
  {
    id: '3',
    title: 'Creative Problem Solving Workshop',
    description: 'Explore innovative approaches to complex challenges using design thinking and creative methodologies.',
    type: 'reflection',
    status: 'not_started',
    difficulty: 'beginner',
    estimatedTime: '30 minutes',
    skills: ['Creativity', 'Problem Solving', 'Innovation'],
    archetype: 'creator',
    progress: {
      completed: false,
      timeSpent: 0,
    },
    createdAt: '2024-01-12T11:00:00Z',
  },
  {
    id: '4',
    title: 'Team Coaching and Mentorship',
    description: 'Build skills in coaching team members, providing constructive feedback, and fostering professional development.',
    type: 'skill_building',
    status: 'not_started',
    difficulty: 'intermediate',
    estimatedTime: '1 hour',
    skills: ['Coaching', 'Mentorship', 'Team Development'],
    archetype: 'helper',
    progress: {
      completed: false,
      timeSpent: 0,
    },
    createdAt: '2024-01-13T09:30:00Z',
  },
];

type FilterType = 'all' | 'in_progress' | 'completed' | 'not_started';
type SortType = 'recent' | 'difficulty' | 'time' | 'progress';

export default function ActivityLibraryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [activities] = useState(mockActivities);

  const filteredAndSortedActivities = activities
    .filter(activity => {
      const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           activity.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = activeFilter === 'all' || activity.status === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
          return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
        case 'time':
          return parseInt(a.estimatedTime) - parseInt(b.estimatedTime);
        case 'progress':
          if (a.progress.completed !== b.progress.completed) {
            return a.progress.completed ? 1 : -1;
          }
          return b.progress.timeSpent - a.progress.timeSpent;
        default:
          return 0;
      }
    });

  const getStatusColor = (status: Activity['status']) => {
    switch (status) {
      case 'completed': return Colors.success;
      case 'in_progress': return Colors.primary.goldenYellow;
      case 'not_started': return Colors.text.tertiary;
      default: return Colors.text.tertiary;
    }
  };

  const getStatusIcon = (status: Activity['status']) => {
    switch (status) {
      case 'completed': return 'checkmark-circle';
      case 'in_progress': return 'play-circle';
      case 'not_started': return 'ellipse-outline';
      default: return 'ellipse-outline';
    }
  };

  const getDifficultyColor = (difficulty: Activity['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return Colors.success;
      case 'intermediate': return Colors.warning;
      case 'advanced': return Colors.error;
      default: return Colors.text.tertiary;
    }
  };

  const getArchetypeColor = (archetype: string) => {
    return Colors.archetypes[archetype as keyof typeof Colors.archetypes]?.primary || Colors.primary.navyBlue;
  };

  const renderActivityCard = ({ item: activity }: { item: Activity }) => (
    <TouchableOpacity
      style={styles.activityCard}
      onPress={() => router.push({ pathname: '/(tabs)/workbench', params: { activityId: activity.id } })}
    >
      {/* Header */}
      <View style={styles.activityHeader}>
        <View style={styles.activityMainInfo}>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <Text style={styles.activityDescription} numberOfLines={2}>
            {activity.description}
          </Text>
        </View>
        <View style={styles.activityMeta}>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(activity.status) }]}>
            <Ionicons 
              name={getStatusIcon(activity.status)} 
              size={16} 
              color={Colors.text.inverse} 
            />
          </View>
        </View>
      </View>

      {/* Activity Info */}
      <View style={styles.activityInfo}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="time" size={16} color={Colors.text.secondary} />
            <Text style={styles.infoText}>{activity.estimatedTime}</Text>
          </View>
          <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(activity.difficulty) }]}>
            <Text style={styles.difficultyText}>{activity.difficulty}</Text>
          </View>
          <View style={[styles.archetypeBadge, { backgroundColor: getArchetypeColor(activity.archetype) }]}>
            <Text style={styles.archetypeText}>
              {activity.archetype.charAt(0).toUpperCase() + activity.archetype.slice(1)}
            </Text>
          </View>
        </View>
      </View>

      {/* Skills */}
      <View style={styles.skillsContainer}>
        {activity.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {activity.skills.length > 3 && (
          <Text style={styles.moreSkills}>+{activity.skills.length - 3}</Text>
        )}
      </View>

      {/* Progress */}
      {activity.status !== 'not_started' && (
        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>
              {activity.status === 'completed' ? 'Completed' : `${activity.progress.timeSpent} min spent`}
            </Text>
            {activity.status === 'in_progress' && (
              <Text style={styles.progressPercentage}>65%</Text>
            )}
          </View>
          {activity.status === 'in_progress' && (
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '65%' }]} />
            </View>
          )}
        </View>
      )}

      {/* Action Button */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          activity.status === 'completed' && styles.completedButton,
        ]}
        onPress={() => router.push({ pathname: '/(tabs)/workbench', params: { activityId: activity.id } })}
      >
        <Text style={[
          styles.actionButtonText,
          activity.status === 'completed' && styles.completedButtonText,
        ]}>
          {activity.status === 'completed' ? 'Review' : 
           activity.status === 'in_progress' ? 'Continue' : 'Start'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Activity Library</Text>
        <TouchableOpacity onPress={() => {
          Alert.alert(
            'Create New Activity',
            'Choose how you want to create your activity:',
            [
              { 
                text: 'AI Generated', 
                onPress: () => Alert.alert('AI Activity', 'AI will generate a personalized activity based on your profile and goals. Feature coming soon!') 
              },
              { 
                text: 'Custom Activity', 
                onPress: () => Alert.alert('Custom Activity', 'Create your own learning activity with custom goals and tasks. Feature coming soon!') 
              },
              { 
                text: 'Import Template', 
                onPress: () => Alert.alert('Import Template', 'Choose from pre-made activity templates. Feature coming soon!') 
              },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }}>
          <Ionicons name="add-circle" size={24} color={Colors.primary.goldenYellow} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchText}
            placeholder="Search activities, skills..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.text.tertiary}
          />
        </View>
      </View>

      {/* Filters and Sort */}
      <View style={styles.controlsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {[
            { key: 'all', label: 'All', count: activities.length },
            { key: 'in_progress', label: 'In Progress', count: activities.filter(a => a.status === 'in_progress').length },
            { key: 'completed', label: 'Completed', count: activities.filter(a => a.status === 'completed').length },
            { key: 'not_started', label: 'Not Started', count: activities.filter(a => a.status === 'not_started').length },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              style={[
                styles.filterChip,
                activeFilter === filter.key && styles.activeFilterChip,
              ]}
              onPress={() => setActiveFilter(filter.key as FilterType)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === filter.key && styles.activeFilterText,
              ]}>
                {filter.label} ({filter.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="filter" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{activities.filter(a => a.status === 'completed').length}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{activities.filter(a => a.status === 'in_progress').length}</Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {activities.reduce((sum, a) => sum + a.progress.timeSpent, 0)}m
          </Text>
          <Text style={styles.statLabel}>Time Spent</Text>
        </View>
      </View>

      {/* Activities List */}
      <View style={styles.activitiesList}>
        <FlashList
          data={filteredAndSortedActivities}
          renderItem={renderActivityCard}
          keyExtractor={(item) => item.id}
          estimatedItemSize={180}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.activitiesListContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
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
  searchContainer: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
  },
  searchText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    marginLeft: Layout.spacing.sm,
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Layout.spacing.md,
  },
  filters: {
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.sm,
  },
  filterChip: {
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeFilterChip: {
    backgroundColor: Colors.primary.goldenYellow,
    borderColor: Colors.primary.goldenYellow,
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  activeFilterText: {
    color: Colors.text.primary,
  },
  sortButton: {
    width: Layout.touchTarget.small,
    height: Layout.touchTarget.small,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.navyBlue,
    marginBottom: Layout.spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  activitiesList: {
    flex: 1,
  },
  activitiesListContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
  },
  activityCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  activityHeader: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
  },
  activityMainInfo: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  activityTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  activityDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  activityMeta: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityInfo: {
    marginBottom: Layout.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  infoText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  difficultyBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  difficultyText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
    textTransform: 'capitalize',
  },
  archetypeBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  archetypeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    marginBottom: Layout.spacing.md,
  },
  skillTag: {
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  skillText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.primary,
  },
  moreSkills: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
  },
  progressSection: {
    marginBottom: Layout.spacing.md,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  progressLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  progressPercentage: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.goldenYellow,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.neutral.gray200,
    borderRadius: Layout.borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.sm,
  },
  actionButton: {
    backgroundColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
  },
  completedButton: {
    backgroundColor: Colors.success,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  completedButtonText: {
    color: Colors.text.inverse,
  },
});