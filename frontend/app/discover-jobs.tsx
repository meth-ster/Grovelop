import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  TextInput,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';
import { JobListing } from '../types';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CARD_WIDTH = screenWidth - 40;
const CARD_HEIGHT = screenHeight * 0.7;

// Mock job data for Tinder-style cards
const mockJobs: JobListing[] = [
  {
    id: '1',
    title: 'Senior Data Analyst',
    company: 'TechCorp',
    location: 'San Francisco, CA (Remote friendly)',
    type: 'full-time',
    salary: { min: 90000, max: 120000, currency: 'USD' },
    description: 'Join our data team to drive insights and analytics across our platform. Work with cutting-edge tools and make data-driven decisions that impact millions of users.',
    requirements: ['3+ years data analysis experience', 'SQL proficiency', 'Python/R skills', 'Statistical analysis'],
    skills: ['Data Analysis', 'SQL', 'Python', 'Statistics', 'Tableau'],
    postedAt: '2024-01-15',
    matchScore: 87,
    saved: false,
    applied: false,
  },
  {
    id: '2',
    title: 'Strategy Consultant',
    company: 'Consulting Pro',
    location: 'New York, NY',
    type: 'full-time',
    salary: { min: 110000, max: 150000, currency: 'USD' },
    description: 'Lead strategic initiatives for Fortune 500 clients. Drive business transformation and deliver high-impact recommendations.',
    requirements: ['MBA preferred', '5+ years consulting experience', 'Strategic thinking', 'Client management'],
    skills: ['Strategy', 'Consulting', 'Business Analysis', 'Presentation', 'Leadership'],
    postedAt: '2024-01-14',
    matchScore: 92,
    saved: false,
    applied: false,
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'Innovation Labs',
    location: 'Austin, TX (Hybrid)',
    type: 'full-time',
    salary: { min: 100000, max: 140000, currency: 'USD' },
    description: 'Own product strategy and roadmap for our flagship mobile app. Work cross-functionally to deliver amazing user experiences.',
    requirements: ['Product management experience', 'User research skills', 'Agile methodology', 'Technical background'],
    skills: ['Product Management', 'User Research', 'Agile', 'Analytics', 'Strategy'],
    postedAt: '2024-01-13',
    matchScore: 85,
    saved: false,
    applied: false,
  },
];

const recommendedRoles = ['Data Analyst', 'Strategy Consultant', 'Product Manager'];
const filterOptions = ['All Matches', 'Very High Success Probability'];

export default function DiscoverJobsScreen() {
  const router = useRouter();
  const [jobs, setJobs] = useState(mockJobs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Matches');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [dismissedJobs, setDismissedJobs] = useState<string[]>([]);

  const position = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        position.setValue(gestureState.dx);
        rotate.setValue(gestureState.dx * 0.1);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          // Swipe right - Save job
          swipeRight();
        } else if (gestureState.dx < -120) {
          // Swipe left - Not interested
          swipeLeft();
        } else {
          // Return to center
          Animated.parallel([
            Animated.spring(position, { toValue: 0, useNativeDriver: false }),
            Animated.spring(rotate, { toValue: 0, useNativeDriver: false }),
          ]).start();
        }
      },
    })
  ).current;

  const swipeRight = () => {
    const currentJob = jobs[currentIndex];
    setSavedJobs([...savedJobs, currentJob.id]);
    
    Animated.parallel([
      Animated.timing(position, { toValue: screenWidth, duration: 250, useNativeDriver: false }),
      Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: false }),
    ]).start(() => {
      nextCard();
    });
  };

  const swipeLeft = () => {
    const currentJob = jobs[currentIndex];
    setDismissedJobs([...dismissedJobs, currentJob.id]);
    
    Animated.parallel([
      Animated.timing(position, { toValue: -screenWidth, duration: 250, useNativeDriver: false }),
      Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: false }),
    ]).start(() => {
      nextCard();
    });
  };

  const nextCard = () => {
    if (currentIndex < jobs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      position.setValue(0);
      rotate.setValue(0);
      opacity.setValue(1);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate loading new jobs
    setTimeout(() => {
      setIsRefreshing(false);
      setCurrentIndex(0);
      setSavedJobs([]);
      setDismissedJobs([]);
    }, 1500);
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return Colors.success;
    if (score >= 75) return Colors.primary.goldenYellow;
    return Colors.warning;
  };

  const renderJobCard = (job: JobListing, index: number) => {
    const isCurrentCard = index === currentIndex;
    const cardTransform = isCurrentCard ? {
      transform: [
        { translateX: position },
        { rotate: rotate.interpolate({
          inputRange: [-200, 0, 200],
          outputRange: ['-30deg', '0deg', '30deg'],
        })}
      ],
      opacity
    } : {};

    return (
      <Animated.View
        key={job.id}
        style={[
          styles.jobCard,
          cardTransform,
          { zIndex: jobs.length - index }
        ]}
        {...(isCurrentCard ? panResponder.panHandlers : {})}
      >
        {/* Match Score */}
        <View style={[styles.matchBadge, { backgroundColor: getMatchScoreColor(job.matchScore) }]}>
          <Text style={styles.matchText}>{job.matchScore}% Match</Text>
        </View>

        {/* Job Header */}
        <View style={styles.cardHeader}>
          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.companyName}>{job.company}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color={Colors.text.secondary} />
            <Text style={styles.locationText}>{job.location}</Text>
          </View>
        </View>

        {/* Salary */}
        <View style={styles.salaryContainer}>
          <Ionicons name="cash-outline" size={20} color={Colors.success} />
          <Text style={styles.salaryText}>
            ${job.salary?.min.toLocaleString()} - ${job.salary?.max.toLocaleString()}
          </Text>
        </View>

        {/* Description */}
        <Text style={styles.jobDescription}>{job.description}</Text>

        {/* Skills */}
        <View style={styles.skillsContainer}>
          <Text style={styles.skillsTitle}>Required Skills:</Text>
          <View style={styles.skillsTags}>
            {job.skills.slice(0, 4).map((skill, skillIndex) => (
              <View key={skillIndex} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.rejectButton} onPress={swipeLeft}>
            <Ionicons name="close" size={24} color={Colors.error} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => router.push({
              pathname: '/job-detail',
              params: { jobId: job.id }
            })}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={swipeRight}>
            <Ionicons name="heart" size={24} color={Colors.success} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const currentJob = jobs[currentIndex];
  const isLastCard = currentIndex >= jobs.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Discover Opportunities</Text>
          <Text style={styles.headerSubtitle}>Jobs matched to your aspirations</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={24} color={Colors.text.primary} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="options-outline" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Ionicons name="search" size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchText}
            placeholder="Search jobs, companies..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.text.tertiary}
          />
        </View>
      </View>

      {/* Profile Match Summary */}
      <View style={styles.profileMatch}>
        <Text style={styles.profileMatchTitle}>Recommended for you:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedRoles}>
          {recommendedRoles.map((role, index) => (
            <View key={index} style={styles.roleTag}>
              <Text style={styles.roleText}>{role}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.filterChip,
                activeFilter === option && styles.activeFilterChip,
              ]}
              onPress={() => setActiveFilter(option)}
            >
              <Text style={[
                styles.filterText,
                activeFilter === option && styles.activeFilterText,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Job Cards */}
      <View style={styles.cardsContainer}>
        {isLastCard ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
            <Text style={styles.emptyStateTitle}>All done for today!</Text>
            <Text style={styles.emptyStateText}>No more jobs for today, come back tomorrow</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <Text style={styles.refreshButtonText}>Find More Jobs</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {jobs.slice(currentIndex, currentIndex + 3).map((job, index) => 
              renderJobCard(job, currentIndex + index)
            )}
          </>
        )}
      </View>

      {/* Swipe Hints */}
      {!isLastCard && (
        <View style={styles.swipeHints}>
          <View style={styles.swipeHint}>
            <Ionicons name="arrow-back" size={20} color={Colors.error} />
            <Text style={styles.swipeHintText}>Not Interested</Text>
          </View>
          <View style={styles.swipeHint}>
            <Ionicons name="arrow-forward" size={20} color={Colors.success} />
            <Text style={styles.swipeHintText}>Save Job</Text>
          </View>
        </View>
      )}
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
    alignItems: 'flex-start',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  headerButton: {
    position: 'relative',
    width: Layout.touchTarget.small,
    height: Layout.touchTarget.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.error,
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.inverse,
    fontWeight: Typography.fontWeight.bold,
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
  profileMatch: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  profileMatchTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  recommendedRoles: {
    marginBottom: Layout.spacing.sm,
  },
  roleTag: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
    marginRight: Layout.spacing.sm,
  },
  roleText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  filterBar: {
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
    backgroundColor: Colors.primary.navyBlue,
  },
  filterText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  activeFilterText: {
    color: Colors.text.inverse,
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Layout.spacing.lg,
  },
  jobCard: {
    position: 'absolute',
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.xl,
    padding: Layout.spacing.lg,
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
  matchBadge: {
    position: 'absolute',
    top: Layout.spacing.lg,
    right: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
  },
  matchText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
  },
  cardHeader: {
    marginTop: Layout.spacing.xl,
    marginBottom: Layout.spacing.lg,
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
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  locationText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  salaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
    backgroundColor: Colors.background.tertiary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  salaryText: {
    fontSize: Typography.fontSize.base,
    color: Colors.success,
    fontWeight: Typography.fontWeight.semibold,
    marginLeft: Layout.spacing.sm,
  },
  jobDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Layout.spacing.lg,
  },
  skillsContainer: {
    marginBottom: Layout.spacing.xl,
  },
  skillsTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
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
  cardActions: {
    position: 'absolute',
    bottom: Layout.spacing.lg,
    left: Layout.spacing.lg,
    right: Layout.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rejectButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.error,
  },
  detailsButton: {
    flex: 1,
    backgroundColor: Colors.primary.navyBlue,
    paddingVertical: Layout.spacing.md,
    marginHorizontal: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  saveButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.success,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing['3xl'],
  },
  emptyStateTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginTop: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  refreshButton: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  refreshButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  swipeHints: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.xl,
    paddingBottom: Layout.spacing.lg,
  },
  swipeHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  swipeHintText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
});