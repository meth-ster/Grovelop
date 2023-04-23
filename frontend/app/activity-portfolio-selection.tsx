import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';

interface PortfolioActivity {
  id: string;
  title: string;
  type: 'skill_building' | 'project' | 'reflection' | 'achievement';
  description: string;
  skills: string[];
  relevanceScore: number;
  impact: 'high' | 'medium' | 'low';
  completionDate: string;
  selected: boolean;
  archetype: 'Thinker' | 'Persuader' | 'Organiser' | 'Creator';
  relevanceLevel: 'highly_relevant' | 'moderately_relevant';
}

const mockActivities: PortfolioActivity[] = [
  {
    id: '1',
    title: 'Strategic Communication in Leadership',
    type: 'skill_building',
    description: 'Developed strategic communication skills through comprehensive leadership workshop and practical exercises.',
    skills: ['Communication', 'Leadership', 'Strategy'],
    relevanceScore: 95,
    impact: 'high',
    completionDate: '2024-01-10',
    selected: true,
    archetype: 'Thinker',
    relevanceLevel: 'highly_relevant',
  },
  {
    id: '2',
    title: 'Data-Driven Decision Making Project',
    type: 'project',
    description: 'Led a cross-functional team to implement data analytics framework that improved decision-making efficiency by 40%.',
    skills: ['Data Analysis', 'Project Management', 'Leadership'],
    relevanceScore: 92,
    impact: 'high',
    completionDate: '2024-01-05',
    selected: true,
    archetype: 'Thinker',
    relevanceLevel: 'highly_relevant',
  },
  {
    id: '3',
    title: 'Creative Problem Solving Workshop',
    type: 'skill_building',
    description: 'Completed intensive workshop on design thinking and innovative problem-solving methodologies.',
    skills: ['Problem Solving', 'Creativity', 'Innovation'],
    relevanceScore: 78,
    impact: 'medium',
    completionDate: '2023-12-20',
    selected: false,
    archetype: 'Persuader',
    relevanceLevel: 'moderately_relevant',
  },
  {
    id: '4',
    title: 'Team Mentoring Achievement',
    type: 'achievement',
    description: 'Successfully mentored 5 junior analysts, with 4 receiving promotions within 6 months.',
    skills: ['Mentoring', 'Leadership', 'People Development'],
    relevanceScore: 85,
    impact: 'high',
    completionDate: '2023-11-15',
    selected: false,
    archetype: 'Organiser',
    relevanceLevel: 'moderately_relevant',
  },
  {
    id: '5',
    title: 'Customer Journey Analysis',
    type: 'project',
    description: 'Conducted comprehensive customer journey mapping and analysis, resulting in 25% improvement in user satisfaction.',
    skills: ['User Research', 'Analysis', 'Customer Focus'],
    relevanceScore: 88,
    impact: 'high',
    completionDate: '2023-10-30',
    selected: false,
    archetype: 'Creator',
    relevanceLevel: 'moderately_relevant',
  },
  {
    id: '6',
    title: 'Professional Growth Reflection',
    type: 'reflection',
    description: 'Deep reflection on career growth, identifying key learnings and future development areas.',
    skills: ['Self-Awareness', 'Growth Mindset', 'Reflection'],
    relevanceScore: 70,
    impact: 'medium',
    completionDate: '2023-12-01',
    selected: false,
    archetype: 'Persuader',
    relevanceLevel: 'moderately_relevant',
  },
];

export default function ActivityPortfolioSelectionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activities, setActivities] = useState(mockActivities);
  const [selectedCount, setSelectedCount] = useState(
    mockActivities.filter(a => a.selected).length
  );

  const toggleActivity = (activityId: string) => {
    const updatedActivities = activities.map(activity => {
      if (activity.id === activityId) {
        const newSelected = !activity.selected;
        if (newSelected) {
          setSelectedCount(selectedCount + 1);
        } else {
          setSelectedCount(selectedCount - 1);
        }
        return { ...activity, selected: newSelected };
      }
      return activity;
    });
    setActivities(updatedActivities);
  };

  const handleContinue = () => {
    const selectedActivities = activities.filter(a => a.selected);
    
    if (selectedActivities.length === 0) {
      Alert.alert('No Activities Selected', 'Please select at least one activity to include in your application.');
      return;
    }

    router.push({
      pathname: '/ai-generation',
      params: {
        ...params,
        selectedActivities: JSON.stringify(selectedActivities.map(a => a.id)),
      }
    });
  };

  const handleSelectAll = () => {
    const highRelevanceActivities = activities.filter(a => a.relevanceScore >= 80);
    const updatedActivities = activities.map(activity => ({
      ...activity,
      selected: highRelevanceActivities.some(hra => hra.id === activity.id)
    }));
    setActivities(updatedActivities);
    setSelectedCount(highRelevanceActivities.length);
  };

  const handleSelectNone = () => {
    const updatedActivities = activities.map(activity => ({
      ...activity,
      selected: false
    }));
    setActivities(updatedActivities);
    setSelectedCount(0);
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return Colors.success;
    if (score >= 80) return Colors.primary.goldenYellow;
    if (score >= 70) return Colors.warning;
    return Colors.text.secondary;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return Colors.success;
      case 'medium': return Colors.warning;
      case 'low': return Colors.text.secondary;
      default: return Colors.text.secondary;
    }
  };

  const renderActivity = (activity: PortfolioActivity) => (
    <TouchableOpacity
      key={activity.id}
      style={[
        styles.activityCard,
        activity.selected && styles.selectedActivity,
      ]}
      onPress={() => toggleActivity(activity.id)}
    >
      {/* Selection Indicator */}
      <View style={styles.selectionIndicator}>
        <Ionicons 
          name={activity.selected ? 'checkmark-circle' : 'ellipse-outline'} 
          size={24} 
          color={activity.selected ? Colors.success : Colors.text.secondary} 
        />
      </View>

      {/* Activity Content */}
      <View style={styles.activityContent}>
        {/* Header */}
        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>{activity.title}</Text>
          <View style={styles.activityBadges}>
            <View style={[styles.relevanceBadge, { backgroundColor: getRelevanceColor(activity.relevanceScore) }]}>
              <Text style={styles.relevanceText}>{activity.relevanceScore}%</Text>
            </View>
            <View style={[styles.impactBadge, { backgroundColor: getImpactColor(activity.impact) }]}>
              <Text style={styles.impactText}>{activity.impact}</Text>
            </View>
          </View>
        </View>

        {/* Type and Date */}
        <View style={styles.activityMeta}>
          <View style={styles.typeTag}>
            <Text style={styles.typeText}>{activity.type.replace('_', ' ')}</Text>
          </View>
          <Text style={styles.completionDate}>Completed: {activity.completionDate}</Text>
        </View>

        {/* Description */}
        <Text style={styles.activityDescription}>{activity.description}</Text>

        {/* Archetype and Relevance Info */}
        <View style={styles.activityMeta}>
          <View style={styles.archetypeTag}>
            <Text style={styles.archetypeText}>{activity.archetype}</Text>
          </View>
          <Text style={styles.relevanceDescription}>
            → {activity.relevanceLevel === 'highly_relevant' 
              ? 'Demonstrates data analysis and strategic thinking' 
              : 'Could demonstrate soft skills and team dynamics'}
          </Text>
        </View>

        {/* Skills */}
        <View style={styles.skillsContainer}>
          <Text style={styles.skillsLabel}>Skills demonstrated:</Text>
          <View style={styles.skillsTags}>
            {activity.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Sort activities by relevance score
  const sortedActivities = [...activities].sort((a, b) => b.relevanceScore - a.relevanceScore);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Activity Portfolio Selection</Text>
          <Text style={styles.headerSubtitle}>Select Evidence of Your Knowledge and Skills</Text>
        </View>
        <TouchableOpacity onPress={() => {
          Alert.alert('Help', 'Select activities that best demonstrate your qualifications for this role. Higher relevance scores indicate better alignment.');
        }}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Selection Summary */}
      <View style={styles.selectionSummary}>
        <View style={styles.summaryStats}>
          <Text style={styles.selectedCount}>Selected: {selectedCount} of {activities.length} activities</Text>
        </View>
      </View>

      {/* Activities List */}
      <ScrollView style={styles.activitiesList} showsVerticalScrollIndicator={false}>
        {/* Highly Relevant Activities */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recommended Portfolio Items for This Role:</Text>
          <Text style={styles.subsectionTitle}>Highly Relevant (Auto-selected):</Text>
          {activities
            .filter(activity => activity.relevanceLevel === 'highly_relevant')
            .map(renderActivity)}
        </View>

        {/* Moderately Relevant Activities */}
        <View style={styles.sectionContainer}>
          <Text style={styles.subsectionTitle}>Moderately Relevant:</Text>
          {activities
            .filter(activity => activity.relevanceLevel === 'moderately_relevant')
            .map(renderActivity)}
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueButton, selectedCount === 0 && styles.disabledButton]} 
          onPress={handleContinue}
          disabled={selectedCount === 0}
        >
          <Text style={styles.continueButtonText}>
            Continue with Selection
          </Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.text.primary} />
        </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  selectionSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  summaryStats: {
    flex: 1,
  },
  selectedCount: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  recommendationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  selectionActions: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  selectionButton: {
    backgroundColor: Colors.primary.navyBlue,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
  },
  selectionButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.inverse,
  },
  activitiesList: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginVertical: Layout.spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedActivity: {
    borderColor: Colors.primary.goldenYellow,
    backgroundColor: Colors.background.tertiary,
  },
  selectionIndicator: {
    marginRight: Layout.spacing.md,
    alignSelf: 'flex-start',
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  activityTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    flex: 1,
    marginRight: Layout.spacing.sm,
  },
  activityBadges: {
    flexDirection: 'row',
    gap: Layout.spacing.xs,
  },
  relevanceBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  relevanceText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
  },
  impactBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  impactText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
    textTransform: 'uppercase',
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
    gap: Layout.spacing.sm,
  },
  typeTag: {
    backgroundColor: Colors.primary.navyBlue,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  typeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.inverse,
    textTransform: 'capitalize',
  },
  completionDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  activityDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    marginBottom: Layout.spacing.md,
  },
  skillsContainer: {
    marginBottom: Layout.spacing.sm,
  },
  skillsLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  skillsTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.xs,
  },
  skillTag: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
  },
  skillText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.primary,
  },
  footer: {
    padding: Layout.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
    backgroundColor: Colors.background.primary,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.lg,
    gap: Layout.spacing.sm,
  },
  disabledButton: {
    backgroundColor: Colors.neutral.gray300,
  },
  continueButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  sectionContainer: {
    marginBottom: Layout.spacing.xl,
    marginTop: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  subsectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.md,
  },
  archetypeTag: {
    backgroundColor: Colors.primary.navyBlue,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
    marginRight: Layout.spacing.sm,
  },
  archetypeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.inverse,
    fontWeight: Typography.fontWeight.medium,
  },
  relevanceDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    flex: 1,
  },
});