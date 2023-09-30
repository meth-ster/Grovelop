import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpCategory {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
  color: string;
}

const mockFAQs: FAQItem[] = [
  {
    id: '1',
    question: 'How does the career assessment work?',
    answer: 'Our 26-question assessment analyzes your responses using AI to determine your career archetype. It evaluates your motivations, work style preferences, and career goals to provide personalized insights.',
    category: 'assessment',
  },
  {
    id: '2',
    question: 'What are career archetypes?',
    answer: 'Career archetypes are fundamental personality patterns that influence how you approach work. We identify six main types: Doer, Thinker, Creator, Helper, Persuader, and Organiser, each with unique strengths and career paths.',
    category: 'assessment',
  },
  {
    id: '3',
    question: 'How are activities generated?',
    answer: 'Activities are created using AI based on your archetype, current career goals, and skill gaps. Each activity is personalized to help you develop specific competencies aligned with your career path.',
    category: 'activities',
  },
  {
    id: '4',
    question: 'Can I modify my archetype results?',
    answer: 'While archetype results are based on your assessment responses, you can retake the assessment anytime. Your archetype may evolve as you grow professionally.',
    category: 'assessment',
  },
  {
    id: '5',
    question: 'How does job matching work?',
    answer: 'Our AI analyzes job descriptions and matches them against your archetype, skills, and preferences to provide compatibility scores. Higher scores indicate better alignment with your profile.',
    category: 'jobs',
  },
];

const helpCategories: HelpCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'rocket',
    description: 'New to Grovelop? Learn the basics',
    color: Colors.primary.goldenYellow,
  },
  {
    id: 'assessment',
    title: 'Career Assessment',
    icon: 'analytics',
    description: 'Understanding your archetype',
    color: Colors.archetypes.thinker.primary,
  },
  {
    id: 'activities',
    title: 'Activities & Growth',
    icon: 'trending-up',
    description: 'Making the most of your development',
    color: Colors.archetypes.creator.primary,
  },
  {
    id: 'jobs',
    title: 'Job Search',
    icon: 'briefcase',
    description: 'Finding and applying to opportunities',
    color: Colors.primary.navyBlue,
  },
  {
    id: 'account',
    title: 'Account & Settings',
    icon: 'person-circle',
    description: 'Managing your profile and preferences',
    color: Colors.archetypes.helper.primary,
  },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const filteredFAQs = mockFAQs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSendMessage = () => {
    if (!message.trim()) {
      Alert.alert('Empty Message', 'Please enter your message or question.');
      return;
    }

    Alert.alert(
      'Message Sent',
      'Thank you for your message! Our support team will get back to you within 24 hours.',
      [{ text: 'OK', onPress: () => setMessage('') }]
    );
  };

  const renderHelpCategory = (category: HelpCategory) => (
    <TouchableOpacity
      key={category.id}
      style={[styles.categoryCard, { borderLeftColor: category.color }]}
      onPress={() => setActiveCategory(category.id)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: `${category.color}20` }]}>
        <Ionicons name={category.icon} size={24} color={category.color} />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryTitle}>{category.title}</Text>
        <Text style={styles.categoryDescription}>{category.description}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={Colors.text.tertiary} />
    </TouchableOpacity>
  );

  const renderFAQItem = (faq: FAQItem) => (
    <TouchableOpacity
      key={faq.id}
      style={styles.faqItem}
      onPress={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
    >
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{faq.question}</Text>
        <Ionicons 
          name={expandedFAQ === faq.id ? "chevron-up" : "chevron-down"} 
          size={20} 
          color={Colors.text.secondary} 
        />
      </View>
      {expandedFAQ === faq.id && (
        <Text style={styles.faqAnswer}>{faq.answer}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="chatbubble-ellipses" size={24} color={Colors.primary.goldenYellow} />
            <Text style={styles.quickActionText}>Live Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="videocam" size={24} color={Colors.primary.navyBlue} />
            <Text style={styles.quickActionText}>Video Tutorials</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <Ionicons name="mail" size={24} color={Colors.archetypes.helper.primary} />
            <Text style={styles.quickActionText}>Email Support</Text>
          </TouchableOpacity>
        </View>

        {/* Help Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Help Topics</Text>
          <TouchableOpacity
            style={[
              styles.categoryFilter,
              activeCategory === 'all' && styles.activeCategoryFilter,
            ]}
            onPress={() => setActiveCategory('all')}
          >
            <Text style={[
              styles.categoryFilterText,
              activeCategory === 'all' && styles.activeCategoryFilterText,
            ]}>
              All Topics
            </Text>
          </TouchableOpacity>
          {helpCategories.map(renderHelpCategory)}
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Search FAQs</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={Colors.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Frequently Asked Questions
            {filteredFAQs.length > 0 && ` (${filteredFAQs.length})`}
          </Text>
          {filteredFAQs.length > 0 ? (
            <View style={styles.faqList}>
              {filteredFAQs.map(renderFAQItem)}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="help-circle-outline" size={48} color={Colors.text.tertiary} />
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'No FAQs found matching your search.' : 'No FAQs available for this category.'}
              </Text>
            </View>
          )}
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Still Need Help?</Text>
          <View style={styles.contactForm}>
            <Text style={styles.contactDescription}>
              Can't find what you're looking for? Send us a message and we'll get back to you.
            </Text>
            <TextInput
              style={styles.messageInput}
              placeholder="Describe your issue or question..."
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              placeholderTextColor={Colors.text.tertiary}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Text style={styles.sendButtonText}>Send Message</Text>
              <Ionicons name="send" size={16} color={Colors.text.inverse} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          <View style={styles.resourceList}>
            <TouchableOpacity style={styles.resourceItem}>
              <Ionicons name="document-text" size={20} color={Colors.primary.navyBlue} />
              <Text style={styles.resourceText}>User Guide</Text>
              <Ionicons name="open-outline" size={16} color={Colors.text.tertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceItem}>
              <Ionicons name="play-circle" size={20} color={Colors.archetypes.creator.primary} />
              <Text style={styles.resourceText}>Tutorial Videos</Text>
              <Ionicons name="open-outline" size={16} color={Colors.text.tertiary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceItem}>
              <Ionicons name="people" size={20} color={Colors.archetypes.helper.primary} />
              <Text style={styles.resourceText}>Community Forum</Text>
              <Ionicons name="open-outline" size={16} color={Colors.text.tertiary} />
            </TouchableOpacity>
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
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  quickAction: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.sm,
    textAlign: 'center',
  },
  section: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  categoryFilter: {
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    marginHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.full,
    marginBottom: Layout.spacing.md,
  },
  activeCategoryFilter: {
    backgroundColor: Colors.primary.goldenYellow,
  },
  categoryFilterText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  activeCategoryFilterText: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.sm,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    borderLeftWidth: 4,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  categoryDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  searchSection: {
    marginBottom: Layout.spacing.xl,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    paddingHorizontal: Layout.spacing.md,
    marginHorizontal: Layout.spacing.lg,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    paddingVertical: Layout.spacing.md,
    marginLeft: Layout.spacing.sm,
  },
  faqList: {
    marginHorizontal: Layout.spacing.lg,
  },
  faqItem: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.sm,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Layout.spacing.lg,
  },
  faqQuestion: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  faqAnswer: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Layout.spacing.xl,
    marginHorizontal: Layout.spacing.lg,
  },
  emptyStateText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Layout.spacing.md,
  },
  contactForm: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
  },
  contactDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.lg,
  },
  messageInput: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    textAlignVertical: 'top',
    marginBottom: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  sendButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  resourceList: {
    marginHorizontal: Layout.spacing.lg,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.sm,
  },
  resourceText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    flex: 1,
    marginLeft: Layout.spacing.md,
  },
});