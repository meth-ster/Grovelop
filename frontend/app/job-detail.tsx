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
import { JobListing } from '../types';

// Mock job data for detail view
const mockJobDetail: JobListing = {
  id: '1',
  title: 'Senior Product Manager',
  company: 'TechCorp Solutions',
  location: 'San Francisco, CA',
  type: 'full-time',
  salary: { min: 120000, max: 160000, currency: 'USD' },
  description: `We are seeking an experienced Senior Product Manager to join our dynamic team and lead the development of our flagship SaaS platform. In this role, you will be responsible for defining product strategy, working closely with engineering and design teams, and ensuring that our products meet the evolving needs of our customers.

Key Responsibilities:
• Define and execute product roadmap aligned with business objectives
• Collaborate with cross-functional teams including engineering, design, marketing, and sales
• Conduct market research and competitive analysis
• Gather and prioritize product requirements from stakeholders
• Analyze product performance metrics and user feedback
• Lead product launches and go-to-market strategies
• Mentor junior product team members

About TechCorp Solutions:
We are a fast-growing SaaS company focused on providing innovative solutions for enterprise customers. Our culture values collaboration, innovation, and continuous learning. We offer competitive compensation, comprehensive benefits, and opportunities for professional growth.`,
  requirements: [
    '5+ years of product management experience in B2B SaaS',
    'Strong analytical and problem-solving skills',
    'Excellent written and verbal communication skills',
    'Experience with Agile development methodologies',
    'Bachelor\'s degree in Business, Engineering, or related field',
    'MBA preferred but not required'
  ],
  skills: ['Product Strategy', 'Data Analysis', 'Leadership', 'Agile', 'Market Research', 'User Experience'],
  postedAt: '2024-01-15',
  applicationDeadline: '2024-02-15',
  matchScore: 92,
  saved: false,
  applied: false,
};

export default function JobDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // In a real app, you would fetch job details based on params.id
  const job = mockJobDetail;

  const handleApply = () => {
    Alert.alert(
      `Apply for ${job.title}`,
      `You are about to apply for the ${job.title} position at ${job.company}. This will redirect you to the application form.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue to Application', 
          onPress: () => {
            Alert.alert('Application Started', 'Redirecting to application form...');
            // In a real app, this would navigate to application form or external URL
          }
        },
      ]
    );
  };

  const handleSave = () => {
    Alert.alert('Job Saved!', 'This job has been added to your saved jobs.');
  };

  const handleShare = () => {
    Alert.alert('Share Job', 'Job details copied to clipboard and ready to share!');
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return Colors.success;
    if (score >= 75) return Colors.primary.goldenYellow;
    if (score >= 60) return Colors.warning;
    return Colors.error;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Job Details</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Job Header */}
        <View style={styles.jobHeader}>
          <View style={styles.jobMainInfo}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            <Text style={styles.companyName}>{job.company}</Text>
            <View style={styles.jobMeta}>
              <Ionicons name="location-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.locationText}>{job.location}</Text>
              <View style={styles.jobType}>
                <Text style={styles.jobTypeText}>{job.type.replace('-', ' ')}</Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.matchScore, { backgroundColor: getMatchScoreColor(job.matchScore) }]}>
            <Text style={styles.matchScoreText}>{job.matchScore}%</Text>
            <Text style={styles.matchScoreLabel}>Match</Text>
          </View>
        </View>

        {/* Salary */}
        {job.salary && (
          <View style={styles.salaryContainer}>
            <Ionicons name="cash-outline" size={20} color={Colors.success} />
            <Text style={styles.salaryText}>
              ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} {job.salary.currency}
            </Text>
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
            <Ionicons name="bookmark-outline" size={20} color={Colors.primary.navyBlue} />
            <Text style={styles.actionButtonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.primaryAction]} onPress={handleApply}>
            <Ionicons name="send" size={20} color={Colors.text.inverse} />
            <Text style={[styles.actionButtonText, styles.primaryActionText]}>Apply Now</Text>
          </TouchableOpacity>
        </View>

        {/* Job Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Description</Text>
          <Text style={styles.descriptionText}>{job.description}</Text>
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          {job.requirements.map((requirement, index) => (
            <View key={index} style={styles.requirementItem}>
              <Text style={styles.requirementBullet}>•</Text>
              <Text style={styles.requirementText}>{requirement}</Text>
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Required Skills</Text>
          <View style={styles.skillsContainer}>
            {job.skills.map((skill, index) => (
              <View key={index} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Job Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Job Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Posted</Text>
              <Text style={styles.infoValue}>Jan 15, 2024</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Deadline</Text>
              <Text style={styles.infoValue}>Feb 15, 2024</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Job Type</Text>
              <Text style={styles.infoValue}>{job.type.replace('-', ' ')}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Match Score</Text>
              <Text style={[styles.infoValue, { color: getMatchScoreColor(job.matchScore) }]}>
                {job.matchScore}% Match
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.bottomActionButton} onPress={handleSave}>
          <Ionicons name="bookmark-outline" size={24} color={Colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomActionButton, styles.applyButton]} onPress={handleApply}>
          <Text style={styles.applyButtonText}>Apply for this Job</Text>
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
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  backButton: {
    width: Layout.touchTarget.small,
    height: Layout.touchTarget.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  shareButton: {
    width: Layout.touchTarget.small,
    height: Layout.touchTarget.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom actions
  },
  jobHeader: {
    flexDirection: 'row',
    padding: Layout.spacing.lg,
    backgroundColor: Colors.background.secondary,
  },
  jobMainInfo: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  jobTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  companyName: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
  },
  jobMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  locationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  jobType: {
    backgroundColor: Colors.primary.navyBlue,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
    marginLeft: Layout.spacing.sm,
  },
  jobTypeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.inverse,
    textTransform: 'capitalize',
  },
  matchScore: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  matchScoreText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
  },
  matchScoreLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.inverse,
    marginTop: Layout.spacing.xs,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Layout.spacing.lg,
    backgroundColor: Colors.background.tertiary,
  },
  salaryText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.success,
    fontWeight: Typography.fontWeight.semibold,
    marginLeft: Layout.spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    padding: Layout.spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  primaryAction: {
    backgroundColor: Colors.primary.navyBlue,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.navyBlue,
  },
  primaryActionText: {
    color: Colors.text.inverse,
  },
  section: {
    padding: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  descriptionText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  requirementBullet: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    marginRight: Layout.spacing.sm,
    marginTop: 2,
  },
  requirementText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  skillTag: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
  },
  skillText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.lg,
  },
  infoItem: {
    flex: 1,
    minWidth: '40%',
  },
  infoLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  infoValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    textTransform: 'capitalize',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: Layout.spacing.lg,
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
    gap: Layout.spacing.md,
  },
  bottomActionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  applyButton: {
    flex: 1,
    backgroundColor: Colors.primary.navyBlue,
  },
  applyButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
});