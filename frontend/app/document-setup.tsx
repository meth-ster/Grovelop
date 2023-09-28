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

type DocumentType = 'resume' | 'cover_letter' | 'both';
type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';
type GeographicFormat = 'US' | 'UK' | 'EU' | 'APAC';

interface DocumentConfig {
  type: DocumentType;
  experienceLevel: ExperienceLevel;
  geographicFormat: GeographicFormat;
  tone: 'professional' | 'creative' | 'technical' | 'executive';
  targetRole: string;
  customInstructions: string;
}

export default function DocumentSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { jobTitle, company } = params;

  const [config, setConfig] = useState<DocumentConfig>({
    type: 'both',
    experienceLevel: 'mid',
    geographicFormat: 'US',
    tone: 'professional',
    targetRole: (jobTitle as string) || '',
    customInstructions: '',
  });

  const handleContinue = () => {
    if (!config.targetRole.trim()) {
      Alert.alert('Missing Information', 'Please specify the target role.');
      return;
    }

    router.push({
      pathname: '/activity-portfolio-selection',
      params: {
        jobTitle,
        company,
        documentType: config.type,
        experienceLevel: config.experienceLevel,
        geographicFormat: config.geographicFormat,
        tone: config.tone,
        targetRole: config.targetRole,
        customInstructions: config.customInstructions,
      }
    });
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
            {option.description && (
              <Text style={styles.optionDescription}>{option.description}</Text>
            )}
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
        <Text style={styles.headerTitle}>Document Setup</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Job Context */}
        <View style={styles.jobContext}>
          <Text style={styles.contextTitle}>Applying for:</Text>
          <Text style={styles.jobTitle}>{jobTitle}</Text>
          <Text style={styles.companyName}>at {company}</Text>
        </View>

        {/* Document Type Selection */}
        {renderOption(
          'What documents do you need?',
          [
            { value: 'resume', label: 'Resume Only', description: 'Professional resume tailored for this role' },
            { value: 'cover_letter', label: 'Cover Letter Only', description: 'Compelling cover letter for this application' },
            { value: 'both', label: 'Complete Package', description: 'Resume + Cover Letter combo' },
          ],
          config.type,
          (value) => setConfig({ ...config, type: value })
        )}

        {/* Experience Level */}
        {renderOption(
          'Your Experience Level',
          [
            { value: 'entry', label: 'Entry Level', description: '0-2 years experience' },
            { value: 'mid', label: 'Mid-Level', description: '3-7 years experience' },
            { value: 'senior', label: 'Senior', description: '8-15 years experience' },
            { value: 'executive', label: 'Executive', description: '15+ years, leadership roles' },
          ],
          config.experienceLevel,
          (value) => setConfig({ ...config, experienceLevel: value })
        )}

        {/* Geographic Format */}
        {renderOption(
          'Geographic Format',
          [
            { value: 'US', label: 'United States', description: 'US resume format' },
            { value: 'UK', label: 'United Kingdom', description: 'UK CV format' },
            { value: 'EU', label: 'European', description: 'European CV format' },
            { value: 'APAC', label: 'Asia-Pacific', description: 'APAC resume format' },
          ],
          config.geographicFormat,
          (value) => setConfig({ ...config, geographicFormat: value })
        )}

        {/* Tone Selection */}
        {renderOption(
          'Writing Tone',
          [
            { value: 'professional', label: 'Professional', description: 'Formal business tone' },
            { value: 'creative', label: 'Creative', description: 'More dynamic and engaging' },
            { value: 'technical', label: 'Technical', description: 'Technical depth focus' },
            { value: 'executive', label: 'Executive', description: 'Leadership-focused tone' },
          ],
          config.tone,
          (value) => setConfig({ ...config, tone: value })
        )}

        {/* Target Role */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Target Role</Text>
          <TextInput
            style={styles.textInput}
            value={config.targetRole}
            onChangeText={(text) => setConfig({ ...config, targetRole: text })}
            placeholder="Enter specific role title"
            placeholderTextColor={Colors.text.tertiary}
          />
        </View>

        {/* Custom Instructions */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Custom Instructions (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            value={config.customInstructions}
            onChangeText={(text) => setConfig({ ...config, customInstructions: text })}
            placeholder="Any specific requirements or preferences..."
            placeholderTextColor={Colors.text.tertiary}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Configuration Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Configuration Summary</Text>
          <View style={styles.summaryItems}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Documents:</Text>
              <Text style={styles.summaryValue}>
                {config.type === 'both' ? 'Resume + Cover Letter' : 
                 config.type === 'resume' ? 'Resume Only' : 'Cover Letter Only'}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Experience:</Text>
              <Text style={styles.summaryValue}>
                {config.experienceLevel.charAt(0).toUpperCase() + config.experienceLevel.slice(1)}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Format:</Text>
              <Text style={styles.summaryValue}>{config.geographicFormat}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Tone:</Text>
              <Text style={styles.summaryValue}>
                {config.tone.charAt(0).toUpperCase() + config.tone.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue to Portfolio Selection</Text>
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
    marginTop: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.xl,
  },
  contextTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.inverse,
    opacity: 0.8,
    marginBottom: Layout.spacing.xs,
  },
  jobTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
    marginBottom: Layout.spacing.xs,
  },
  companyName: {
    fontSize: Typography.fontSize.base,
    color: Colors.primary.goldenYellow,
    fontWeight: Typography.fontWeight.medium,
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
    borderColor: Colors.primary.navyBlue,
  },
  optionText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  selectedOptionText: {
    fontWeight: Typography.fontWeight.bold,
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