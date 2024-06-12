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

// Enhanced job data for detail view with all required components
const mockJobDetail: JobListing & {
  companyIntelligence: {
    size: string;
    culture: string;
    recentNews: string;
    values: string;
  };
  benefits: string[];
  successProbability: number;
} = {
  id: '1',
  title: 'Senior Data Analyst',
  company: 'TechCorp',
  location: 'San Francisco, CA (Remote friendly)',
  type: 'full-time',
  salary: { min: 90000, max: 120000, currency: 'USD' },
  description: `We are seeking an experienced Senior Data Analyst to join our analytics team and drive data-driven insights across our platform. You'll work with cutting-edge tools to analyze user behavior, market trends, and business performance.`,
  requirements: [
    '3+ years of data analysis experience',
    'Proficiency in SQL and Python/R',
    'Experience with data visualization tools (Tableau, Power BI)',
    'Statistical analysis and modeling skills',
    'Bachelor\'s degree in Data Science, Statistics, or related field',
    'Experience with cloud platforms (AWS, GCP) preferred'
  ],
  skills: ['Data Analysis', 'SQL', 'Python', 'Statistics', 'Tableau', 'Machine Learning'],
  postedAt: '2024-01-15',
  applicationDeadline: '2024-02-15',
  matchScore: 87,
  successProbability: 87,
  saved: false,
  applied: false,
  companyIntelligence: {
    size: '500-1000 employees',
    culture: 'Innovation-focused, data-driven decision making',
    recentNews: 'Expanding analytics team by 40%',
    values: 'Excellence, collaboration, continuous learning'
  },
  benefits: [
    'Health, dental, and vision insurance',
    'Flexible work arrangements',
    'Professional development budget',
    '401(k) with company matching',
    'Unlimited PTO policy',
    'Stock options'
  ]
};

export default function JobDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  // In a real app, you would fetch job details based on params.id
  const job = mockJobDetail;

  const toggleSection = (section: string) => {
    if (expandedSections.includes(section)) {
      setExpandedSections(expandedSections.filter(s => s !== section));
    } else {
      setExpandedSections([...expandedSections, section]);
    }
  };

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
            <Text style={styles.postedDate}>Posted 3 days ago</Text>
          </View>
          
          <View style={[styles.matchScore, { backgroundColor: getMatchScoreColor(job.matchScore) }]}>
            <Text style={styles.matchScoreText}>{job.matchScore}%</Text>
            <Text style={styles.matchScoreLabel}>Match</Text>
          </View>
        </View>

        {/* Profile Match Analysis */}
        <View style={styles.profileMatchAnalysis}>
          <View style={styles.successProbability}>
            <Ionicons name="trending-up" size={24} color={Colors.success} />
            <View style={styles.probabilityContent}>
              <Text style={styles.probabilityText}>{job.successProbability}% success probability</Text>
              <Text style={styles.probabilitySubtext}>Based on your profile match</Text>
            </View>
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

        {/* Action Buttons as specified in PDF */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.secondaryActionButton} onPress={handleSave}>
            <Ionicons name="bookmark-outline" size={20} color={Colors.primary.navyBlue} />
            <Text style={styles.secondaryActionText}>Save Job</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryActionButton} onPress={() => {
            Alert.alert('Message Employer', 'Direct messaging feature coming soon!');
          }}>
            <Ionicons name="mail-outline" size={20} color={Colors.primary.navyBlue} />
            <Text style={styles.secondaryActionText}>Message Employer</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.primaryActionButton} onPress={() => {
          router.push({
            pathname: '/document-setup',
            params: { jobId: job.id, jobTitle: job.title, company: job.company }
          });
        }}>
          <Text style={styles.primaryActionButtonText}>Create Tailored Application</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.text.inverse} />
        </TouchableOpacity>

        {/* Job Description - Expandable */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.expandableHeader}
            onPress={() => toggleSection('description')}
          >
            <Text style={styles.sectionTitle}>Job Description</Text>
            <Ionicons 
              name={expandedSections.includes('description') ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={Colors.text.secondary} 
            />
          </TouchableOpacity>
          {expandedSections.includes('description') && (
            <Text style={styles.descriptionText}>{job.description}</Text>
          )}
        </View>

        {/* Requirements - Highlighted Matching */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.expandableHeader}
            onPress={() => toggleSection('requirements')}
          >
            <Text style={styles.sectionTitle}>Requirements</Text>
            <Ionicons 
              name={expandedSections.includes('requirements') ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={Colors.text.secondary} 
            />
          </TouchableOpacity>
          {expandedSections.includes('requirements') && (
            <View>
              {job.requirements.map((requirement, index) => {
                // Simulate matching - first 3 requirements match user profile
                const isMatching = index < 3;
                return (
                  <View key={index} style={styles.requirementItem}>
                    <View style={[
                      styles.requirementBullet,
                      isMatching && styles.matchingBullet
                    ]}>
                      <Ionicons 
                        name={isMatching ? 'checkmark-circle' : 'ellipse-outline'} 
                        size={16} 
                        color={isMatching ? Colors.success : Colors.text.secondary} 
                      />
                    </View>
                    <Text style={[
                      styles.requirementText,
                      isMatching && styles.matchingRequirement
                    ]}>
                      {requirement}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Company Intelligence */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Intelligence</Text>
          <View style={styles.companyIntelligence}>
            <View style={styles.intelligenceItem}>
              <View style={styles.intelligenceIcon}>
                <Ionicons name="people" size={20} color={Colors.primary.navyBlue} />
              </View>
              <View style={styles.intelligenceContent}>
                <Text style={styles.intelligenceLabel}>Size</Text>
                <Text style={styles.intelligenceValue}>{job.companyIntelligence.size}</Text>
              </View>
            </View>
            
            <View style={styles.intelligenceItem}>
              <View style={styles.intelligenceIcon}>
                <Ionicons name="bulb" size={20} color={Colors.primary.goldenYellow} />
              </View>
              <View style={styles.intelligenceContent}>
                <Text style={styles.intelligenceLabel}>Culture</Text>
                <Text style={styles.intelligenceValue}>{job.companyIntelligence.culture}</Text>
              </View>
            </View>
            
            <View style={styles.intelligenceItem}>
              <View style={styles.intelligenceIcon}>
                <Ionicons name="newspaper" size={20} color={Colors.primary.warmOrange} />
              </View>
              <View style={styles.intelligenceContent}>
                <Text style={styles.intelligenceLabel}>Recent News</Text>
                <Text style={styles.intelligenceValue}>{job.companyIntelligence.recentNews}</Text>
              </View>
            </View>
            
            <View style={styles.intelligenceItem}>
              <View style={styles.intelligenceIcon}>
                <Ionicons name="heart" size={20} color={Colors.success} />
              </View>
              <View style={styles.intelligenceContent}>
                <Text style={styles.intelligenceLabel}>Values</Text>
                <Text style={styles.intelligenceValue}>{job.companyIntelligence.values}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Benefits - Structured List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Benefits & Perks</Text>
          <View style={styles.benefitsList}>
            {job.benefits.map((benefit, index) => (
              <View key={index} style={styles.benefitItem}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
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
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  requirementBullet: {
    marginRight: Layout.spacing.sm,
    marginTop: 2,
  },
  matchingBullet: {
    // Already styled with icon
  },
  matchingRequirement: {
    color: Colors.success,
    fontWeight: Typography.fontWeight.medium,
  },
  profileMatchAnalysis: {
    backgroundColor: Colors.background.tertiary,
    padding: Layout.spacing.lg,
    marginHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.lg,
  },
  successProbability: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  probabilityContent: {
    flex: 1,
  },
  probabilityText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.success,
    marginBottom: Layout.spacing.xs,
  },
  probabilitySubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  postedDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: Layout.spacing.xs,
  },
  companyIntelligence: {
    gap: Layout.spacing.md,
  },
  intelligenceItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Layout.spacing.md,
  },
  intelligenceIcon: {
    width: 40,
    height: 40,
    borderRadius: Layout.borderRadius.md,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intelligenceContent: {
    flex: 1,
  },
  intelligenceLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  intelligenceValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  benefitsList: {
    gap: Layout.spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  benefitText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  secondaryActionButton: {
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
  secondaryActionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.navyBlue,
  },
  primaryActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.lg,
    marginHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.sm,
    marginBottom: Layout.spacing.lg,
  },
  primaryActionButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
});