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
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';

type DocumentType = 'resume_only' | 'resume_cover_activity' | 'cover_letter_only';
type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';
type GeographicFormat = 'US' | 'EU' | 'Academic' | 'International';
type ToneStyle = 'conservative' | 'professional' | 'creative' | 'executive';

interface DocumentConfig {
  type: DocumentType;
  experienceLevel: ExperienceLevel;
  geographicFormat: GeographicFormat;
  tone: ToneStyle;
  targetRole: string;
  companyName: string;
  jobDescription: string;
}

export default function DocumentSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { jobTitle, company } = params;

  const [config, setConfig] = useState<DocumentConfig>({
    type: 'resume_cover_activity',
    experienceLevel: 'mid',
    geographicFormat: 'US',
    tone: 'professional',
    targetRole: (jobTitle as string) || '',
    companyName: (company as string) || '',
    jobDescription: '',
  });

  const handleContinue = () => {
    if (!config.targetRole.trim()) {
      Alert.alert('Missing Information', 'Please specify the target role.');
      return;
    }

    if (!config.companyName.trim()) {
      Alert.alert('Missing Information', 'Please specify the company name.');
      return;
    }

    // Skip activity portfolio selection if resume only
    if (config.type === 'resume_only') {
      router.push({
        pathname: '/ai-generation',
        params: {
          jobTitle: config.targetRole,
          company: config.companyName,
          documentType: config.type,
          experienceLevel: config.experienceLevel,
          geographicFormat: config.geographicFormat,
          tone: config.tone,
          targetRole: config.targetRole,
          jobDescription: config.jobDescription,
        }
      });
    } else {
      router.push({
        pathname: '/activity-portfolio-selection',
        params: {
          jobTitle: config.targetRole,
          company: config.companyName,
          documentType: config.type,
          experienceLevel: config.experienceLevel,
          geographicFormat: config.geographicFormat,
          tone: config.tone,
          targetRole: config.targetRole,
          jobDescription: config.jobDescription,
        }
      });
    }
  };

  const renderOption = (
    label: string,
    options: { value: any; label: string; description?: string }[],
    currentValue: any,
    onSelect: (value: any) => void
  ) => (
    <View style={styles.optionGroup}>
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={styles.optionButtons}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              currentValue === option.value && styles.selectedOption,
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[
              styles.optionText,
              currentValue === option.value && styles.selectedOptionText,
            ]}>
              {option.label}
            </Text>
            {/* {option.description && (
              <Text style={styles.optionDescription}>{option.description}</Text>
            )} */}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Document</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Target Position */}
        <Text style={styles.optionLabel2}>Target Position:</Text>
        <View style={styles.jobContext}>
          <Text style={styles.contextTitle}>{jobTitle}</Text>
          <Text style={styles.sectionTitle}>at {company}</Text>
        </View>

        {/* Document Type Selection */}
        {renderOption(
          'Document Type:',
          [
            { value: 'resume_only', label: 'Resume/CV only', description: 'User skips screen 3 and goes directly to screen 4' },
            { value: 'resume_cover_activity', label: 'Resume/CV + Cover Letter + Portfolio Item', description: 'Complete application package with portfolio' },
            { value: 'cover_letter_only', label: 'Cover Letter only', description: 'Cover letter tailored for this application' },
          ],
          config.type,
          (value) => setConfig({ ...config, type: value })
        )}


      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue</Text>
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
  headerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  scrollContent: {
    paddingBottom: Layout.spacing['2xl'],
  },
  jobContext: {
    backgroundColor: Colors.primary.navyBlue,
    padding: Layout.spacing.lg,
    marginHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.xl,
  },
  contextTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
    marginBottom: Layout.spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.goldenYellow,
  },
  optionGroup: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  optionLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  optionLabel2: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    paddingHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.lg,
  },
  optionButtons: {
    gap: Layout.spacing.sm,
  },
  optionButton: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: Colors.primary.goldenYellow,
    // borderColor: Colors.primary.navyBlue,
  },
  optionText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  selectedOptionText: {
    // fontWeight: Typography.fontWeight.bold,
  },
  optionDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  inputGroup: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  textInput: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: Colors.background.tertiary,
    marginHorizontal: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.goldenYellow,
    marginBottom: Layout.spacing.lg,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  summaryItems: {
    gap: Layout.spacing.sm,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
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
  continueButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
});