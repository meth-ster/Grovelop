import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';
import { Activity } from '../types';
import { 
  PageHeader, 
  SearchInput, 
  FilterChip, 
  StatusIndicator, 
  ProgressBar, 
  BottomTabBar, 
  Card 
} from '../components/shared';

const { width: screenWidth } = Dimensions.get('window');

// Mock archetype data
interface ArchetypeData {
  name: string;
  percentage: number;
  color: string;
  description: string;
}

interface ArchetypeSnapshot {
  id: string;
  date: string;
  archetypes: ArchetypeData[];
  mainGoals: string[];
  aspirations: string[];
  overallProgress: number;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'professional' | 'personal' | 'skill_development';
  status: 'active' | 'completed' | 'paused';
  targetDate: string;
  progress: number;
}

// Mock archetype development data
const mockCurrentArchetypes: ArchetypeData[] = [
  {
    name: 'Thinker',
    percentage: 35,
    color: '#4A90E2',
    description: 'Analytical, strategic, and data-driven approach to problem-solving'
  },
  {
    name: 'Creator',
    percentage: 20,
    color: '#7ED321',
    description: 'Innovative, imaginative, and focused on generating new ideas'
  },
  {
    name: 'Helper',
    percentage: 25,
    color: '#F5A623',
    description: 'Supportive, empathetic, and focused on team development'
  },
  {
    name: 'Persuader',
    percentage: 20,
    color: '#D0021B',
    description: 'Influential, communicative, and focused on driving change'
  }
];

const mockHistoricalSnapshots: ArchetypeSnapshot[] = [
  {
    id: '1',
    date: '2024-01-15',
    archetypes: [
      { name: 'Thinker', percentage: 40, color: '#4A90E2', description: 'Analytical approach' },
      { name: 'Creator', percentage: 30, color: '#7ED321', description: 'Innovative thinking' },
      { name: 'Helper', percentage: 20, color: '#F5A623', description: 'Team support' },
      { name: 'Persuader', percentage: 10, color: '#D0021B', description: 'Influence and communication' }
    ],
    mainGoals: ['Develop leadership skills', 'Improve data analysis capabilities'],
    aspirations: ['Become a senior data analyst', 'Lead cross-functional teams'],
    overallProgress: 75
  },
  {
    id: '2',
    date: '2023-12-01',
    archetypes: [
      { name: 'Thinker', percentage: 50, color: '#4A90E2', description: 'Analytical approach' },
      { name: 'Creator', percentage: 25, color: '#7ED321', description: 'Innovative thinking' },
      { name: 'Helper', percentage: 15, color: '#F5A623', description: 'Team support' },
      { name: 'Persuader', percentage: 10, color: '#D0021B', description: 'Influence and communication' }
    ],
    mainGoals: ['Master data visualization', 'Build technical expertise'],
    aspirations: ['Become a data science expert', 'Contribute to open source projects'],
    overallProgress: 60
  },
  {
    id: '3',
    date: '2023-10-15',
    archetypes: [
      { name: 'Thinker', percentage: 60, color: '#4A90E2', description: 'Analytical approach' },
      { name: 'Creator', percentage: 20, color: '#7ED321', description: 'Innovative thinking' },
      { name: 'Helper', percentage: 10, color: '#F5A623', description: 'Team support' },
      { name: 'Persuader', percentage: 10, color: '#D0021B', description: 'Influence and communication' }
    ],
    mainGoals: ['Learn advanced statistics', 'Complete certification program'],
    aspirations: ['Transition to data science role', 'Publish research papers'],
    overallProgress: 45
  }
];

const mockCurrentGoals: Goal[] = [
  {
    id: '1',
    title: 'Develop Leadership Skills',
    description: 'Build confidence in leading teams and making strategic decisions',
    category: 'professional',
    status: 'active',
    targetDate: '2024-06-30',
    progress: 65
  },
  {
    id: '2',
    title: 'Master Data Visualization',
    description: 'Learn advanced visualization techniques and storytelling with data',
    category: 'skill_development',
    status: 'active',
    targetDate: '2024-04-15',
    progress: 80
  },
  {
    id: '3',
    title: 'Improve Work-Life Balance',
    description: 'Establish better boundaries and prioritize personal well-being',
    category: 'personal',
    status: 'active',
    targetDate: '2024-03-31',
    progress: 40
  }
];

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
type ViewType = 'archetype' | 'activities';

export default function ActivityLibraryScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('recent');
  const [activities] = useState(mockActivities);
  const [currentView, setCurrentView] = useState<ViewType>('archetype');
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);

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

  const getGoalCategoryColor = (category: Goal['category']) => {
    switch (category) {
      case 'professional': return Colors.primary.navyBlue;
      case 'personal': return Colors.primary.goldenYellow;
      case 'skill_development': return Colors.success;
      default: return Colors.text.secondary;
    }
  };

  const getGoalCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case 'professional': return 'briefcase';
      case 'personal': return 'heart';
      case 'skill_development': return 'school';
      default: return 'ellipse';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const renderArchetypePieChart = (archetypes: ArchetypeData[]) => {
    const chartSize = 200;
    const radius = chartSize / 2;
    
    // Calculate cumulative angles for proper pie segments
    let cumulativeAngle = 0;
    const segments = archetypes.map((archetype, index) => {
      const angle = (archetype.percentage / 100) * 360;
      const startAngle = cumulativeAngle;
      const endAngle = cumulativeAngle + angle;
      cumulativeAngle += angle;
      
      return {
        ...archetype,
        startAngle,
        endAngle,
        angle,
        index
      };
    });

    return (
      <View style={styles.chartContainer}>
        <View style={styles.pieChartContainer}>
          <Text style={styles.pieChartTitle}>Archetype Distribution</Text>
          
          {/* Proper Pie Chart with accurate segments */}
          <View style={styles.pieChartWrapper}>
            <View style={[styles.pieChart, { width: chartSize, height: chartSize }]}>
              {/* Create accurate pie segments using a different approach */}
              {segments.map((segment, index) => {
                // Create a circular progress ring for each segment
                const size = chartSize;
                const strokeWidth = 50;
                const radius = (size - strokeWidth) / 2;
                const circumference = radius * 2 * Math.PI;
                const strokeDasharray = circumference;
                const strokeDashoffset = circumference - (segment.angle / 360) * circumference;
                
                return (
                  <View
                    key={index}
                    style={[
                      styles.pieSegmentRing,
                      {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderWidth: strokeWidth,
                        borderColor: 'transparent',
                        borderTopColor: segment.color,
                        borderRightColor: segment.angle > 90 ? segment.color : 'transparent',
                        borderBottomColor: segment.angle > 180 ? segment.color : 'transparent',
                        borderLeftColor: segment.angle > 270 ? segment.color : 'transparent',
                        transform: [{ rotate: `${segment.startAngle}deg` }],
                        position: 'absolute',
                      }
                    ]}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderArchetypeLegend = (archetypes: ArchetypeData[]) => (
    <View style={styles.legendContainer}>
      {archetypes.map((archetype, index) => (
        <View key={index} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: archetype.color }]} />
          <View style={styles.legendTextContainer}>
            <Text style={styles.legendName}>{archetype.name} ({archetype.percentage}%)</Text>
            <Text style={styles.legendDescription}>{archetype.description}</Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderCurrentArchetypeView = () => (
    <ScrollView style={styles.archetypeContainer} showsVerticalScrollIndicator={false}>
      {/* Current Archetype Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Archetype Profile</Text>
        <Text style={styles.sectionSubtitle}>Your current personality and working style breakdown</Text>
        
        {renderArchetypePieChart(mockCurrentArchetypes)}
        {renderArchetypeLegend(mockCurrentArchetypes)}
      </View>

      {/* Current Goals Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Goals & Aspirations</Text>
        <Text style={styles.sectionSubtitle}>What you're working towards right now</Text>
        
        {mockCurrentGoals.map((goal) => (
          <View key={goal.id} style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalTitleContainer}>
                <Ionicons 
                  name={getGoalCategoryIcon(goal.category)} 
                  size={20} 
                  color={getGoalCategoryColor(goal.category)} 
                />
                <Text style={styles.goalTitle}>{goal.title}</Text>
              </View>
              <View style={[styles.goalStatusBadge, { backgroundColor: getGoalCategoryColor(goal.category) }]}>
                <Text style={styles.goalStatusText}>{goal.status.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.goalDescription}>{goal.description}</Text>
            <View style={styles.goalProgress}>
              <View style={styles.goalProgressInfo}>
                <Text style={styles.goalProgressLabel}>Progress</Text>
                <Text style={styles.goalProgressPercentage}>{goal.progress}%</Text>
              </View>
              <View style={styles.goalProgressBar}>
                <View style={[styles.goalProgressFill, { width: `${goal.progress}%` }]} />
              </View>
            </View>
            <View style={styles.goalMeta}>
              <Text style={styles.goalTargetDate}>Target: {formatDate(goal.targetDate)}</Text>
              <Text style={styles.goalCategory}>{goal.category.replace('_', ' ').toUpperCase()}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderHistoricalView = () => (
    <ScrollView style={styles.archetypeContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Archetype Development Timeline</Text>
        <Text style={styles.sectionSubtitle}>How your personality profile has evolved over time</Text>
        
        {mockHistoricalSnapshots.map((snapshot, index) => (
          <View key={snapshot.id} style={styles.snapshotCard}>
            <TouchableOpacity 
              style={styles.snapshotHeader}
              onPress={() => setSelectedSnapshot(selectedSnapshot === snapshot.id ? null : snapshot.id)}
            >
              <View style={styles.snapshotInfo}>
                <Text style={styles.snapshotDate}>{formatDate(snapshot.date)}</Text>
                <Text style={styles.snapshotProgress}>Overall Progress: {snapshot.overallProgress}%</Text>
              </View>
              <Ionicons 
                name={selectedSnapshot === snapshot.id ? "chevron-up" : "chevron-down"} 
                size={20} 
                color={Colors.text.secondary} 
              />
            </TouchableOpacity>
            
            {selectedSnapshot === snapshot.id && (
              <View style={styles.snapshotDetails}>
                {renderArchetypePieChart(snapshot.archetypes)}
                {renderArchetypeLegend(snapshot.archetypes)}
                
                <View style={styles.snapshotGoals}>
                  <Text style={styles.snapshotGoalsTitle}>Main Goals at this time:</Text>
                  {snapshot.mainGoals.map((goal, goalIndex) => (
                    <Text key={goalIndex} style={styles.snapshotGoalItem}>• {goal}</Text>
                  ))}
                </View>
                
                <View style={styles.snapshotAspirations}>
                  <Text style={styles.snapshotAspirationsTitle}>Aspirations:</Text>
                  {snapshot.aspirations.map((aspiration, aspIndex) => (
                    <Text key={aspIndex} style={styles.snapshotAspirationItem}>• {aspiration}</Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderActivityCard = ({ item: activity }: { item: Activity }) => (
    <Card
      onPress={() => router.push({ pathname: '/(tabs)/workbench', params: { activityId: activity.id } })}
      style={styles.activityCard}
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
          <StatusIndicator status={activity.status} />
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
            <ProgressBar progress={65} />
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
    </Card>
  );

  const handleRightIconPress = () => {
    if (currentView === 'archetype') {
      Alert.alert(
        'Update Profile',
        'Choose how you want to update your archetype profile:',
        [
          { 
            text: 'Take Assessment', 
            onPress: () => Alert.alert('Assessment', 'Take a comprehensive personality assessment to update your archetype profile. Feature coming soon!') 
          },
          { 
            text: 'Manual Update', 
            onPress: () => Alert.alert('Manual Update', 'Manually adjust your archetype percentages and goals. Feature coming soon!') 
          },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
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
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <PageHeader
        title={currentView === 'archetype' ? 'Archetype Development' : 'Activity Library'}
        rightIcon="add-circle"
        onRightIconPress={handleRightIconPress}
      />


      {/* Archetype Sub-View Toggle */}
      {currentView === 'archetype' && (
        <View style={styles.subViewToggleContainer}>
          <TouchableOpacity
            style={[styles.subViewToggleButton, selectedSnapshot === null && styles.activeSubViewToggle]}
            onPress={() => setSelectedSnapshot(null)}
          >
            <Text style={[
              styles.subViewToggleText,
              selectedSnapshot === null && styles.activeSubViewToggleText
            ]}>
              Current Profile
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.subViewToggleButton, selectedSnapshot === 'timeline' && styles.activeSubViewToggle]}
            onPress={() => setSelectedSnapshot('timeline')}
          >
            <Text style={[
              styles.subViewToggleText,
              selectedSnapshot === 'timeline' && styles.activeSubViewToggleText
            ]}>
              Timeline
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Conditional Content */}
      {currentView === 'archetype' ? (
        selectedSnapshot === 'timeline' ? renderHistoricalView() : renderCurrentArchetypeView()
      ) : (
        <>
          <SearchInput
            placeholder="Search activities, skills..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Filters and Sort */}
          <View style={styles.controlsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {[
                { key: 'all', label: 'All', count: activities.length },
                { key: 'in_progress', label: 'In Progress', count: activities.filter(a => a.status === 'in_progress').length },
                { key: 'completed', label: 'Completed', count: activities.filter(a => a.status === 'completed').length },
                { key: 'not_started', label: 'Not Started', count: activities.filter(a => a.status === 'not_started').length },
              ].map((filter) => (
                <FilterChip
                  key={filter.key}
                  label={filter.label}
                  count={filter.count}
                  isActive={activeFilter === filter.key}
                  onPress={() => setActiveFilter(filter.key as FilterType)}
                />
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
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.activitiesListContent}
            />
          </View>
        </>
      )}

      <BottomTabBar
        tabs={[
          { key: 'archetype', label: 'Archetype', icon: 'person' },
          { key: 'activities', label: 'Activities', icon: 'library' }
        ]}
        activeTab={currentView}
        onTabPress={(tabKey) => setCurrentView(tabKey as ViewType)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
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
    marginBottom: Layout.spacing.md,
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
  subViewToggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.primary,
    marginHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.xs,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  subViewToggleButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
  },
  activeSubViewToggle: {
    backgroundColor: Colors.primary.goldenYellow,
  },
  subViewToggleText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
  },
  activeSubViewToggleText: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  archetypeContainer: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.lg,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: Layout.spacing.lg,
  },
  pieChartContainer: {
    width: '100%',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
    alignItems: 'center',
  },
  pieChartTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  pieChartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.spacing.lg,
  },
  pieChart: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pieSegmentRing: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  circularProgressContainer: {
    marginTop: Layout.spacing.xl,
    width: '100%',
  },
  circularProgressTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  circularProgressGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: Layout.spacing.md,
  },
  circularProgressItem: {
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
    width: '45%',
  },
  circularProgressWrapper: {
    marginBottom: Layout.spacing.sm,
  },
  circularProgressRing: {
    borderStyle: 'solid',
    shadowColor: Colors.neutral.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  circularProgressText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
  },
  circularProgressLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xs,
  },
  circularProgressDescription: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.xs,
  },
  legendContainer: {
    marginTop: Layout.spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginTop: 2,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  legendDescription: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.xs,
  },
  goalCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  goalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Layout.spacing.sm,
  },
  goalTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    flex: 1,
  },
  goalStatusBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  goalStatusText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  goalDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.md,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  goalProgress: {
    marginBottom: Layout.spacing.sm,
  },
  goalProgressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  goalProgressLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  goalProgressPercentage: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.navyBlue,
  },
  goalProgressBar: {
    height: 6,
    backgroundColor: Colors.neutral.gray200,
    borderRadius: Layout.borderRadius.sm,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.sm,
  },
  goalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalTargetDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  goalCategory: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.tertiary,
  },
  snapshotCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  snapshotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Layout.spacing.lg,
  },
  snapshotInfo: {
    flex: 1,
  },
  snapshotDate: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  snapshotProgress: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  snapshotDetails: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
  },
  snapshotGoals: {
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  snapshotGoalsTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  snapshotGoalItem: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  snapshotAspirations: {
    marginBottom: Layout.spacing.md,
  },
  snapshotAspirationsTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  snapshotAspirationItem: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
});