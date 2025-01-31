import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';
import { JobListing } from '../../types';
import { router } from 'expo-router';
import { Search } from '../../components';
// Mock job data
const mockJobs: JobListing[] = [
  {
    id: '1',
    title: 'Senior Product Manager',
    company: 'TechCorp Solutions',
    location: 'San Francisco, CA',
    type: 'full-time',
    salary: { min: 120000, max: 160000, currency: 'USD' },
    description: 'Lead product strategy and development for our flagship SaaS platform. Work with cross-functional teams to deliver innovative solutions.',
    requirements: ['5+ years product management experience', 'Strong analytical skills', 'Excellent communication'],
    skills: ['Product Strategy', 'Data Analysis', 'Leadership', 'Agile'],
    postedAt: '2024-01-15',
    matchScore: 92,
    saved: false,
    applied: false,
  },
  {
    id: '2',
    title: 'Data Scientist',
    company: 'Analytics Pro',
    location: 'Remote',
    type: 'full-time',
    salary: { min: 95000, max: 130000, currency: 'USD' },
    description: 'Build machine learning models and derive insights from complex datasets to drive business decisions.',
    requirements: ['PhD in Data Science or related field', 'Python/R proficiency', 'ML experience'],
    skills: ['Machine Learning', 'Python', 'Statistics', 'SQL'],
    postedAt: '2024-01-14',
    matchScore: 88,
    saved: true,
    applied: false,
  },
  {
    id: '3',
    title: 'UX Design Lead',
    company: 'Creative Studios',
    location: 'New York, NY',
    type: 'full-time',
    salary: { min: 110000, max: 140000, currency: 'USD' },
    description: 'Lead UX design initiatives for multiple client projects. Mentor junior designers and establish design standards.',
    requirements: ['7+ years UX design experience', 'Team leadership experience', 'Portfolio required'],
    skills: ['UX Design', 'Figma', 'User Research', 'Leadership'],
    postedAt: '2024-01-13',
    matchScore: 76,
    saved: false,
    applied: true,
  },
  {
    id: '4',
    title: 'Marketing Director',
    company: 'Growth Inc',
    location: 'Austin, TX',
    type: 'full-time',
    salary: { min: 100000, max: 135000, currency: 'USD' },
    description: 'Develop and execute comprehensive marketing strategies to drive customer acquisition and brand awareness.',
    requirements: ['8+ years marketing experience', 'Digital marketing expertise', 'Team management'],
    skills: ['Digital Marketing', 'Strategy', 'Analytics', 'Leadership'],
    postedAt: '2024-01-12',
    matchScore: 84,
    saved: true,
    applied: false,
  },
];

type FilterType = 'all' | 'saved' | 'applied' | 'all_matches' | 'very_high_success';

export default function JobsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [jobs, setJobs] = useState(mockJobs);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'saved' && job.saved) ||
                         (activeFilter === 'applied' && job.applied) ||
                         (activeFilter === 'all_matches' && job.matchScore >= 60) ||
                         (activeFilter === 'very_high_success' && job.matchScore >= 90);
    
    return matchesSearch && matchesFilter;
  });

  const handleSaveJob = (jobId: string) => {
    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        const newSavedState = !job.saved;
        // Show feedback
        Alert.alert(
          newSavedState ? 'Job Saved!' : 'Job Removed',
          newSavedState ? 'This job has been added to your saved jobs.' : 'This job has been removed from your saved jobs.',
          [{ text: 'OK' }]
        );
        return { ...job, saved: newSavedState };
      }
      return job;
    });
    setJobs(updatedJobs);
  };

  const handleApplyJob = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    Alert.alert(
      `Apply for ${job.title}`,
      `You are about to apply for the ${job.title} position at ${job.company}. This will mark the job as applied and prepare your application materials.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Apply Now', 
          onPress: () => {
            setJobs(jobs.map(currentJob => 
              currentJob.id === jobId ? { ...currentJob, applied: true } : currentJob
            ));
            
            // Show success with next steps
            Alert.alert(
              'Application Submitted!',
              `Your application for ${job.title} at ${job.company} has been submitted successfully. You can track your application status in the Applications section.`,
              [
                { text: 'View Applications', onPress: () => console.log('Navigate to applications') },
                { text: 'OK' }
              ]
            );
          },
          style: 'default'
        },
      ]
    );
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return Colors.success;
    if (score >= 75) return Colors.primary.goldenYellow;
    if (score >= 60) return Colors.warning;
    return Colors.error;
  };

  const renderJobCard = ({ item: job }: { item: JobListing }) => (
    <View style={styles.jobCard}>
      {/* Job Header */}
      <View style={styles.jobHeader}>
        <View style={styles.jobMainInfo}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.company}</Text>
          <View style={styles.jobMeta}>
            <Ionicons name="location-outline" size={14} color={Colors.text.secondary} />
            <Text style={styles.locationText}>{job.location}</Text>
            <View style={styles.jobType}>
              <Text style={styles.jobTypeText}>{job.type.replace('-', ' ')}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.jobActions}>
          <View style={[styles.matchScore, { backgroundColor: getMatchScoreColor(job.matchScore) }]}>
            <Text style={styles.matchScoreText}>{job.matchScore}%</Text>
          </View>
          <TouchableOpacity 
            style={styles.saveButton}
            onPress={() => handleSaveJob(job.id)}
          >
            <Ionicons 
              name={job.saved ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color={job.saved ? Colors.primary.goldenYellow : Colors.text.secondary} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Salary */}
      {job.salary && (
        <View style={styles.salaryContainer}>
          <Ionicons name="cash-outline" size={16} color={Colors.success} />
          <Text style={styles.salaryText}>
            ${job.salary.min.toLocaleString()} - ${job.salary.max.toLocaleString()} {job.salary.currency}
          </Text>
        </View>
      )}

      {/* Description */}
      <Text style={styles.jobDescription} numberOfLines={2}>
        {job.description}
      </Text>

      {/* Skills */}
      <View style={styles.skillsContainer}>
        {job.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {job.skills.length > 3 && (
          <Text style={styles.moreSkills}>+{job.skills.length - 3} more</Text>
        )}
      </View>

      {/* Actions */}
      <View style={styles.jobCardActions}>
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={() => {
            router.push({
              pathname: '/job-detail',
              params: { jobId: job.id }
            });
          }}
        >
          <Text style={styles.viewButtonText}>View Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.applyButton,
            job.applied && styles.appliedButton,
          ]}
          onPress={() => handleApplyJob(job.id)}
          disabled={job.applied}
        >
          <Text style={[
            styles.applyButtonText,
            job.applied && styles.appliedButtonText,
          ]}>
            {job.applied ? 'Applied' : 'Apply Now'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Opportunities</Text>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="options-outline" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.headerSubtitleContainer}>
        <Text style={styles.headerSubtitleText}>Jobs matched to your aspirations</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Search
          placeholder="Search jobs, companies, skills..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSearch={(query) => {
            // Optional: Add any additional search logic here
            console.log('Searching for:', query);
          }}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {[
            { key: 'all', label: 'All Jobs', count: jobs.length },
            { key: 'all_matches', label: 'All Matches', count: jobs.filter(j => j.matchScore >= 60).length },
            { key: 'very_high_success', label: 'Very High Success', count: jobs.filter(j => j.matchScore >= 90).length },
            { key: 'saved', label: 'Saved', count: jobs.filter(j => j.saved).length },
            { key: 'applied', label: 'Applied', count: jobs.filter(j => j.applied).length },
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
      </View>

      {/* Job List */}
      <View style={styles.jobsList}>
        <FlashList
          data={filteredJobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.jobsListContent}
        />
      </View>

      {/* Quick Actions FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => {
          Alert.alert(
            'Quick Actions',
            'What would you like to do?',
            [
              { text: 'Create Job Alert', onPress: () => Alert.alert('Job Alert', 'Job alert created! You\'ll be notified of matching opportunities.') },
              { text: 'Upload Resume', onPress: () => Alert.alert('Upload Resume', 'Resume upload feature coming soon!') },
              { text: 'Set Preferences', onPress: () => Alert.alert('Preferences', 'Job preferences updated successfully!') },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
        }}
      >
        <Ionicons name="add" size={24} color={Colors.text.inverse} />
      </TouchableOpacity>

      {/* Filter Modal - Display Only */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <TouchableOpacity 
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <TouchableOpacity 
                onPress={() => setShowFilterModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={20} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalDescription}>
                Use the filter chips above to filter jobs by category. This modal is for display purposes only.
              </Text>
              
              <View style={styles.modalInfo}>
                <Text style={styles.modalInfoTitle}>Available Filters:</Text>
                <Text style={styles.modalInfoText}>• All Jobs - Shows all available positions</Text>
                <Text style={styles.modalInfoText}>• All Matches - Jobs with 60%+ match score</Text>
                <Text style={styles.modalInfoText}>• Very High Success - Jobs with 90%+ match score</Text>
                <Text style={styles.modalInfoText}>• Saved - Your bookmarked jobs</Text>
                <Text style={styles.modalInfoText}>• Applied - Jobs you've applied to</Text>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
    paddingBottom: Layout.spacing.sm
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  headerSubtitleContainer: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  headerSubtitleText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  filterButton: {
    width: Layout.touchTarget.small,
    height: Layout.touchTarget.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  filtersContainer: {
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
  jobsList: {
    flex: 1,
  },
  jobsListContent: {
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
  },
  jobCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  jobMainInfo: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  jobTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  companyName: {
    fontSize: Typography.fontSize.base,
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
  jobActions: {
    alignItems: 'flex-end',
    gap: Layout.spacing.sm,
  },
  matchScore: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  matchScoreText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
  },
  saveButton: {
    width: Layout.touchTarget.small,
    height: Layout.touchTarget.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  salaryText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.success,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: Layout.spacing.xs,
  },
  jobDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    marginBottom: Layout.spacing.md,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    marginBottom: Layout.spacing.lg,
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
  jobCardActions: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  viewButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
  },
  viewButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary.navyBlue,
  },
  applyButton: {
    flex: 1,
    backgroundColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
  },
  appliedButton: {
    backgroundColor: Colors.success,
  },
  applyButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  appliedButtonText: {
    color: Colors.text.inverse,
  },
  fab: {
    position: 'absolute',
    bottom: Layout.spacing.xl,
    right: Layout.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary.goldenYellow,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 70,
    paddingRight: Layout.spacing.md,
  },
  modalContent: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.borderRadius.md,
    width: 230,
    maxHeight: 400,
    elevation: 8,
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: Colors.background.secondary,
  },
  modalBody: {
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.md,
  },
  modalDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    marginBottom: Layout.spacing.md,
  },
  modalInfo: {
    marginTop: Layout.spacing.sm,
  },
  modalInfoTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  modalInfoText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.xs,
    marginBottom: Layout.spacing.xs,
  },
});