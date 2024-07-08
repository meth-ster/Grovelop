import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';

const { width: screenWidth } = Dimensions.get('window');

type TabType = 'my-activities' | 'activity-pad' | 'portfolio-items';

interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'skill_building' | 'project' | 'reflection';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  status: 'completed' | 'in_progress' | 'not_started';
  progress: number;
  estimatedTime: string;
  skills: string[];
  createdAt: string;
  completedAt?: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: 'resume' | 'cover_letter' | 'portfolio' | 'certificate';
  createdAt: string;
  fileUrl?: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    title: 'Strategic Communication in Leadership',
    description: 'Develop your ability to communicate strategic vision and inspire teams through clear, compelling messaging.',
    type: 'skill_building',
    difficulty: 'intermediate',
    status: 'completed',
    progress: 100,
    estimatedTime: '6 hours',
    skills: ['Communication', 'Leadership', 'Strategic Thinking'],
    createdAt: '2024-01-15',
    completedAt: '2024-01-20',
  },
  {
    id: '2',
    title: 'Data Analysis for Business Decisions',
    description: 'Learn to analyze complex datasets and extract actionable insights for business strategy.',
    type: 'project',
    difficulty: 'advanced',
    status: 'in_progress',
    progress: 60,
    estimatedTime: '8 hours',
    skills: ['Data Analysis', 'Statistics', 'Business Intelligence'],
    createdAt: '2024-01-22',
  },
  {
    id: '3',
    title: 'Team Collaboration Workshop',
    description: 'Enhance your ability to work effectively in diverse teams and manage group dynamics.',
    type: 'skill_building',
    difficulty: 'beginner',
    status: 'not_started',
    progress: 0,
    estimatedTime: '4 hours',
    skills: ['Teamwork', 'Communication', 'Conflict Resolution'],
    createdAt: '2024-01-25',
  },
];

const mockPortfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Senior Developer Resume',
    description: 'Updated resume highlighting technical skills and leadership experience',
    type: 'resume',
    createdAt: '2024-01-20',
  },
  {
    id: '2',
    title: 'Project Management Cover Letter',
    description: 'Tailored cover letter for project management positions',
    type: 'cover_letter',
    createdAt: '2024-01-18',
  },
  {
    id: '3',
    title: 'Data Analysis Portfolio',
    description: 'Collection of data analysis projects and visualizations',
    type: 'portfolio',
    createdAt: '2024-01-15',
  },
];

const mockCurrentActivity: Activity = {
  id: '2',
  title: 'Data Analysis for Business Decisions',
  description: 'Learn to analyze complex datasets and extract actionable insights for business strategy.',
  type: 'project',
  difficulty: 'advanced',
  status: 'in_progress',
  progress: 60,
  estimatedTime: '8 hours',
  skills: ['Data Analysis', 'Statistics', 'Business Intelligence'],
  createdAt: '2024-01-22',
};

export default function ActivityPadScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('activity-pad');

  const renderTabButton = (tab: TabType, label: string, icon: keyof typeof Ionicons.glyphMap) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Ionicons 
        name={icon} 
        size={20} 
        color={activeTab === tab ? Colors.text.inverse : Colors.text.secondary} 
      />
      <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderMyActivities = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Completed Activities</Text>
        {mockActivities
          .filter(activity => activity.status === 'completed')
          .map(activity => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </View>
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                </View>
              </View>
              <View style={styles.activityMeta}>
                <Text style={styles.metaText}>Completed: {activity.completedAt}</Text>
                <Text style={styles.metaText}>Duration: {activity.estimatedTime}</Text>
              </View>
              <View style={styles.skillsContainer}>
                {activity.skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>In Progress</Text>
        {mockActivities
          .filter(activity => activity.status === 'in_progress')
          .map(activity => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </View>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressText}>{activity.progress}%</Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${activity.progress}%` }]} />
              </View>
              <View style={styles.activityMeta}>
                <Text style={styles.metaText}>Started: {activity.createdAt}</Text>
                <Text style={styles.metaText}>Remaining: {activity.estimatedTime}</Text>
              </View>
            </View>
          ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Not Started</Text>
        {mockActivities
          .filter(activity => activity.status === 'not_started')
          .map(activity => (
            <View key={activity.id} style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                </View>
                <TouchableOpacity style={styles.startButton}>
                  <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.activityMeta}>
                <Text style={styles.metaText}>Estimated: {activity.estimatedTime}</Text>
                <Text style={styles.metaText}>Difficulty: {activity.difficulty}</Text>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );

  const renderActivityPad = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.currentActivityCard}>
        <View style={styles.activityHeader}>
          <View style={styles.activityInfo}>
            <Text style={styles.currentActivityTitle}>{mockCurrentActivity.title}</Text>
            <Text style={styles.currentActivityDescription}>{mockCurrentActivity.description}</Text>
          </View>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              {mockCurrentActivity.difficulty.charAt(0).toUpperCase() + mockCurrentActivity.difficulty.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercentage}>{mockCurrentActivity.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${mockCurrentActivity.progress}%` }]} />
          </View>
        </View>

        <View style={styles.skillsContainer}>
          <Text style={styles.skillsLabel}>Skills Being Developed:</Text>
          <View style={styles.skillsRow}>
            {mockCurrentActivity.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.activityMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.metaText}>{mockCurrentActivity.estimatedTime}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.metaText}>Started {mockCurrentActivity.createdAt}</Text>
          </View>
        </View>

        <View style={styles.tasksSection}>
          <Text style={styles.tasksTitle}>Current Tasks</Text>
          <View style={styles.taskItem}>
            <View style={styles.taskHeader}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.taskTitle}>Task 1: Data Collection</Text>
            </View>
            <Text style={styles.taskDescription}>Gather relevant datasets for analysis</Text>
          </View>
          <View style={styles.taskItem}>
            <View style={styles.taskHeader}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.taskTitle}>Task 2: Data Cleaning</Text>
            </View>
            <Text style={styles.taskDescription}>Clean and prepare data for analysis</Text>
          </View>
          <View style={styles.taskItem}>
            <View style={styles.taskHeader}>
              <Ionicons name="ellipse-outline" size={20} color={Colors.text.secondary} />
              <Text style={styles.taskTitle}>Task 3: Statistical Analysis</Text>
            </View>
            <Text style={styles.taskDescription}>Perform statistical analysis on the dataset</Text>
          </View>
          <View style={styles.taskItem}>
            <View style={styles.taskHeader}>
              <Ionicons name="ellipse-outline" size={20} color={Colors.text.secondary} />
              <Text style={styles.taskTitle}>Task 4: Visualization</Text>
            </View>
            <Text style={styles.taskDescription}>Create visualizations to present findings</Text>
          </View>
        </View>

        <View style={styles.workArea}>
          <Text style={styles.workAreaTitle}>Your Work Area</Text>
          <TextInput
            style={styles.workInput}
            placeholder="Start working on your current task..."
            multiline
            placeholderTextColor={Colors.text.tertiary}
          />
          <View style={styles.workActions}>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Progress</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit Task</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderPortfolioItems = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Portfolio Items</Text>
        {mockPortfolioItems.map(item => (
          <View key={item.id} style={styles.portfolioCard}>
            <View style={styles.portfolioHeader}>
              <View style={styles.portfolioInfo}>
                <Text style={styles.portfolioTitle}>{item.title}</Text>
                <Text style={styles.portfolioDescription}>{item.description}</Text>
              </View>
              <View style={styles.portfolioTypeBadge}>
                <Text style={styles.portfolioTypeText}>
                  {item.type.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.portfolioMeta}>
              <Text style={styles.metaText}>Created: {item.createdAt}</Text>
              <View style={styles.portfolioActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="eye-outline" size={16} color={Colors.primary.navyBlue} />
                  <Text style={styles.actionButtonText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="download-outline" size={16} color={Colors.primary.navyBlue} />
                  <Text style={styles.actionButtonText}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="share-outline" size={16} color={Colors.primary.navyBlue} />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addPortfolioButton}>
        <Ionicons name="add-circle-outline" size={24} color={Colors.primary.navyBlue} />
        <Text style={styles.addPortfolioText}>Add New Portfolio Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ActivityPad</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.tabContainer}>
        {renderTabButton('my-activities', 'My Activities', 'list-outline')}
        {renderTabButton('activity-pad', 'ActivityPad', 'construct-outline')}
        {renderTabButton('portfolio-items', 'Portfolio Items', 'folder-outline')}
      </View>

      {activeTab === 'my-activities' && renderMyActivities()}
      {activeTab === 'activity-pad' && renderActivityPad()}
      {activeTab === 'portfolio-items' && renderPortfolioItems()}
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
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.sm,
    gap: Layout.spacing.xs,
  },
  activeTabButton: {
    backgroundColor: Colors.primary.navyBlue,
  },
  tabButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
  },
  activeTabButtonText: {
    color: Colors.text.inverse,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.lg,
  },
  activityCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  activityInfo: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  activityTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  activityDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  completedBadge: {
    alignItems: 'center',
  },
  progressBadge: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.neutral.gray200,
    borderRadius: Layout.borderRadius.sm,
    marginBottom: Layout.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.sm,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  metaText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  skillsContainer: {
    marginBottom: Layout.spacing.sm,
  },
  skillsLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.xs,
  },
  skillTag: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  skillText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  startButton: {
    backgroundColor: Colors.primary.navyBlue,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
  },
  startButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  currentActivityCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginVertical: Layout.spacing.lg,
  },
  currentActivityTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  currentActivityDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Layout.spacing.lg,
  },
  difficultyBadge: {
    backgroundColor: Colors.primary.warmOrange,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  difficultyText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  progressSection: {
    marginBottom: Layout.spacing.lg,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  progressLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  progressPercentage: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.navyBlue,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  tasksSection: {
    marginBottom: Layout.spacing.lg,
  },
  tasksTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
    gap: Layout.spacing.sm,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    flex: 1,
  },
  taskTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  taskDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginLeft: 36,
  },
  workArea: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  workAreaTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  workInput: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
    marginBottom: Layout.spacing.md,
  },
  workActions: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.navyBlue,
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  portfolioCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  portfolioInfo: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  portfolioTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  portfolioDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  portfolioTypeBadge: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  portfolioTypeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  portfolioMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  portfolioActions: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary.navyBlue,
  },
  addPortfolioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary.navyBlue,
    borderStyle: 'dashed',
    gap: Layout.spacing.sm,
  },
  addPortfolioText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary.navyBlue,
  },
});
