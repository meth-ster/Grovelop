import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';

export default function InfoScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Information</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Understanding Your Professional Archetypes</Text>
          
          <Text style={styles.paragraph}>
            Welcome to Grovelop! This page helps you learn about the six professional archetypes that form the foundation of your unique professional 
            value proposition. Based on a research-backed framework (inspired by John Holland's RIASEC model), these archetypes help us analyze your 
            strengths, motivations, and career aspirations through our questionnaire. By identifying your primary and secondary archetypes, we create 
            tailored development activities, job matches, and growth roadmaps to advance your career holistically.
          </Text>

          <Text style={styles.sectionTitle}>The Six Archetypes</Text>
          <Text style={styles.paragraph}>
            Each archetype represents a core personality type and work style. Most people are a blend of these, with one or two dominating.
          </Text>

          <View style={styles.archetypeCard}>
            <Text style={styles.archetypeName}>Doer (Realistic):</Text>
            <Text style={styles.archetypeDescription}>
              Doers are practical, hands-on individuals who thrive on building and fixing things. They enjoy physical work, using tools, machinery, or working 
              outdoors. Strengths include mechanical skills, athleticism, and a straightforward approach to problem-solving. If you're a Doer, you might excel 
              in roles like engineering, construction, or trades where tangible results matter.
            </Text>
          </View>

          <View style={styles.archetypeCard}>
            <Text style={styles.archetypeName}>Thinker (Investigative):</Text>
            <Text style={styles.archetypeDescription}>
              Thinkers are analytical and curious, focused on exploring ideas, data, and theories. They love research, science, math, and solving complex 
              problems intellectually. Strengths include critical thinking, precision, and independence. Common careers include scientists, researchers, or 
              analysts—perfect if you enjoy delving deep into "why" and "how" questions.
            </Text>
          </View>

          <View style={styles.archetypeCard}>
            <Text style={styles.archetypeName}>Creator (Artistic):</Text>
            <Text style={styles.archetypeDescription}>
              Creators are imaginative and expressive, driven by originality and self-expression. They flourish in unstructured environments involving art, 
              writing, music, design, or performance. Strengths include innovation, intuition, and emotional depth. If this is you, think of paths in graphic 
              design, writing, or the arts where creativity takes center stage.
            </Text>
          </View>

          <View style={styles.archetypeCard}>
            <Text style={styles.archetypeName}>Helper (Social):</Text>
            <Text style={styles.archetypeDescription}>
              Helpers are empathetic and people-oriented, dedicated to supporting and nurturing others. They excel in teaching, counseling, or teamwork, with 
              a focus on relationships and community. Strengths include communication, patience, and interpersonal skills. Ideal for roles in education, 
              healthcare, or human resources if helping others fulfill their potential excites you.
            </Text>
          </View>

          <View style={styles.archetypeCard}>
            <Text style={styles.archetypeName}>Persuader (Enterprising):</Text>
            <Text style={styles.archetypeDescription}>
              Persuaders are ambitious leaders who influence and motivate others. They thrive on persuasion, sales, and entrepreneurship, often taking risks 
              to achieve goals. Strengths include charisma, confidence, and strategic networking. This archetype suits careers in business, marketing, politics, 
              or management where driving change and closing deals is key.
            </Text>
          </View>

          <View style={styles.archetypeCard}>
            <Text style={styles.archetypeName}>Organiser (Conventional):</Text>
            <Text style={styles.archetypeDescription}>
              Organisers are detail-focused and efficient, preferring structured routines and data management. They excel at planning, organizing information, 
              and following procedures. Strengths include accuracy, reliability, and methodical thinking. Great for roles in administration, finance, or data entry 
              if you value order and precision.
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Why These Archetypes Are a Great Model for Holistic Development</Text>
          <Text style={styles.paragraph}>
            The six archetypes provide a comprehensive, evidence-based framework for personal and professional growth:
          </Text>

          <View style={styles.bulletPoint}>
            <Text style={styles.bulletText}>•</Text>
            <Text style={styles.bulletContent}>
              <Text style={styles.boldText}>Balanced Coverage of Human Traits:</Text> They encompass a wide range of personality dimensions— from physical action (Doer) to 
              intellectual exploration (Thinker), creative expression (Creator), relational support (Helper), leadership influence (Persuader), and 
              systematic organization (Organiser). This ensures no aspect of your professional self is overlooked, promoting well-rounded development 
              rather than focusing on just one skill set.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bulletText}>•</Text>
            <Text style={styles.bulletContent}>
              <Text style={styles.boldText}>Research-Backed and Practical:</Text> Rooted in John Holland's theory (developed in the 1950s and validated through decades of career 
              research), this model matches your personality to real-world work environments. Studies show people are more satisfied and successful 
              when their jobs align with their archetypes, reducing burnout and increasing engagement.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bulletText}>•</Text>
            <Text style={styles.bulletContent}>
              <Text style={styles.boldText}>Holistic Growth Focus:</Text> Unlike narrow skill-building tools, this approach considers your values, motivations, and natural strengths 
              holistically. It helps you deepen expertise in your primary archetype while building complementary skills from others—for example, a 
              Thinker might add Persuader traits to better pitch ideas. This leads to versatile career advancement, better job fits, and long-term 
              fulfillment.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <Text style={styles.bulletText}>•</Text>
            <Text style={styles.bulletContent}>
              <Text style={styles.boldText}>Personalized and Adaptive:</Text> In Grovelop, we use AI to generate insights from your questionnaire responses, creating activities that 
              balance your archetype mix. This fosters self-awareness, resilience, and adaptability in a changing job market, helping you not just 
              advance but thrive as a professional.
            </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  scrollContent: {
    paddingBottom: Layout.spacing.xl,
  },
  content: {
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.lg,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize['2xl'],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginTop: Layout.spacing.xl,
    marginBottom: Layout.spacing.md,
  },
  paragraph: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Layout.spacing.md,
  },
  archetypeCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  archetypeName: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.navyBlue,
    marginBottom: Layout.spacing.sm,
  },
  archetypeDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: Layout.spacing.md,
    alignItems: 'flex-start',
  },
  bulletText: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary.navyBlue,
    fontWeight: Typography.fontWeight.bold,
    marginRight: Layout.spacing.sm,
    marginTop: 2,
  },
  bulletContent: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  boldText: {
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
});
