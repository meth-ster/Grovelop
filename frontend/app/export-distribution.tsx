import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';
import { AlertService } from '../services/alertService';

type FormatOption = 'PDF' | 'Word' | 'Text' | 'HTML';
type BundleOption = 'resume_cover' | 'resume_only' | 'cover_only' | 'activity_portfolio' | 'complete_bundle';
type QualityOption = 'standard' | 'high' | 'print_ready';

interface ExportConfig {
  formats: FormatOption[];
  bundle: BundleOption;
  quality: QualityOption;
  activityProducts: string[];
}

const mockActivityProducts = [
  {
    id: '1',
    title: 'Systems Analysis for Customer Retention',
    pages: 6,
    selected: true,
  },
  {
    id: '2',
    title: 'Strategic Planning Workshop Portfolio',
    pages: 4,
    selected: false,
  },
  {
    id: '3',
    title: 'Leadership Communication Framework',
    pages: 3,
    selected: true,
  },
];

export default function ExportDistributionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { jobTitle, company } = params;

  const [config, setConfig] = useState<ExportConfig>({
    formats: ['PDF'],
    bundle: 'resume_cover',
    quality: 'high',
    activityProducts: ['1', '3'],
  });

  const handleFormatToggle = (format: FormatOption) => {
    setConfig(prev => ({
      ...prev,
      formats: prev.formats.includes(format)
        ? prev.formats.filter(f => f !== format)
        : [...prev.formats, format]
    }));
  };

  const handleBundleSelect = (bundle: BundleOption) => {
    setConfig(prev => ({ ...prev, bundle }));
  };

  const handleQualitySelect = (quality: QualityOption) => {
    setConfig(prev => ({ ...prev, quality }));
  };

  const handleActivityProductToggle = (productId: string) => {
    setConfig(prev => ({
      ...prev,
      activityProducts: prev.activityProducts.includes(productId)
        ? prev.activityProducts.filter(id => id !== productId)
        : [...prev.activityProducts, productId]
    }));
  };

  const handleDownload = () => {
    // Get the selected bundle configuration
    const bundleInfo = getBundleInfo(config.bundle);
    const formatInfo = config.formats.join(', ');
    const qualityInfo = getQualityInfo(config.quality);
    console.log('>>----> handleDownload');
    
    // Directly start the download process
    simulateDownload(bundleInfo, formatInfo, qualityInfo);
  };

  const handleEmailToSelf = () => {
    const bundleInfo = getBundleInfo(config.bundle);
    const formatInfo = config.formats.join(', ');
    
    // Directly start the email process
    simulateEmailSend(bundleInfo, formatInfo);
  };

  const getBundleInfo = (bundle: BundleOption): string => {
    switch (bundle) {
      case 'complete_bundle':
        return 'Complete Application Bundle (Resume + Cover Letter + Portfolio Item)';
      case 'resume_cover':
        return 'Resume + Cover Letter';
      case 'resume_only':
        return 'Resume Only';
      case 'cover_only':
        return 'Cover Letter Only';
      default:
        return 'Selected Documents';
    }
  };

  const getQualityInfo = (quality: QualityOption): string => {
    switch (quality) {
      case 'standard':
        return 'Standard Quality';
      case 'high':
        return 'High Quality';
      case 'print_ready':
        return 'Print Ready';
      default:
        return 'High Quality';
    }
  };

  const simulateDownload = (bundleInfo: string, formatInfo: string, qualityInfo: string) => {
    console.log(`Downloading: ${bundleInfo} in ${formatInfo} format (${qualityInfo})`);
    // Simulate download completion
    setTimeout(() => {
      console.log('Download completed successfully');
      AlertService.success('Download completed successfully');
      router.push('/apply-mailbox');
    }, 1000);
  };

  const simulateEmailSend = (bundleInfo: string, formatInfo: string) => {
    console.log(`Emailing: ${bundleInfo} in ${formatInfo} format`);
    // Simulate email sending
    setTimeout(() => {
      console.log('Email sent successfully');
      AlertService.success('Email sent successfully');
      router.push('/apply-mailbox');
    }, 1000);
  };

  const renderOption = (
    label: string,
    options: { value: any; label: string; description?: string }[],
    currentValue: any,
    onSelect: (value: any) => void,
    multiSelect = false
  ) => (
    <View style={styles.optionGroup}>
      <Text style={styles.optionLabel}>{label}</Text>
      <View style={styles.optionButtons}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              multiSelect 
                ? (currentValue as any[]).includes(option.value) && styles.selectedOption
                : currentValue === option.value && styles.selectedOption,
            ]}
            onPress={() => onSelect(option.value)}
          >
            <Text style={[
              styles.optionText,
              multiSelect 
                ? (currentValue as any[]).includes(option.value) && styles.selectedOptionText
                : currentValue === option.value && styles.selectedOptionText,
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
        <Text style={styles.headerTitle}>Export</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Job Context */}
        <View style={styles.jobContext}>
          <Text style={styles.contextTitle}>Download Your Documents</Text>
          <Text style={styles.contextSubtitle}>(your document is saved automatically)</Text>
        </View>


        {/* Format Options */}
        {renderOption(
          'Format Options:',
          [
            { value: 'PDF', label: 'PDF (Recommended for applications)', description: 'Best for job applications' },
            { value: 'Word', label: 'Word Document (.docx)', description: 'Editable format' },
            { value: 'Text', label: 'Plain Text (.txt)', description: 'Simple text format' },
            { value: 'HTML', label: 'HTML Web Format', description: 'Web-friendly format' },
          ],
          config.formats,
          handleFormatToggle,
          true
        )}

        {/* Bundle Options */}
        {renderOption(
          'Bundle Options:',
          [
            { value: 'complete_bundle', label: 'Complete Application Bundle (Resume + Cover Letter + Portfolio Item)', description: 'Everything included' },
            { value: 'resume_cover', label: 'Resume + Cover Letter', description: 'Complete application package' },
            { value: 'resume_only', label: 'Resume Only', description: 'Just the resume' },
            { value: 'cover_only', label: 'Cover Letter Only', description: 'Just the cover letter' },
          ],
          config.bundle,
          handleBundleSelect
        )}


        {/* Quality Settings */}
        {renderOption(
          'Quality Settings:',
          [
            { value: 'standard', label: 'Standard (Smaller file size)', description: 'Good for email attachments' },
            { value: 'high', label: 'High Quality (Recommended)', description: 'Best balance of quality and size' },
            { value: 'print_ready', label: 'Print Ready (Highest quality)', description: 'For printing and presentations' },
          ],
          config.quality,
          handleQualitySelect
        )}

        {/* Export Summary */}
        <View style={styles.exportSummary}>
          <Text style={styles.summaryTitle}>Export Summary</Text>
          <View style={styles.summaryContent}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Bundle:</Text>
              <Text style={styles.summaryValue}>{getBundleInfo(config.bundle)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Format:</Text>
              <Text style={styles.summaryValue}>{config.formats.join(', ')}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Quality:</Text>
              <Text style={styles.summaryValue}>{getQualityInfo(config.quality)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleDownload}>
            <Ionicons name="download" size={20} color={Colors.text.primary} />
            <Text style={styles.primaryButtonText}>Download Documents</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleEmailToSelf}>
            <Ionicons name="mail" size={20} color={Colors.primary.navyBlue} />
            <Text style={styles.secondaryButtonText}>Email documents to Myself</Text>
          </TouchableOpacity>
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
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
    marginBottom: Layout.spacing.xs,
  },
  contextSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.inverse,
    opacity: 0.8,
  },
  skipSection: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  skipButton: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
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
  activityProductsList: {
    gap: Layout.spacing.sm,
  },
  activityProductItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background.secondary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedActivityProduct: {
    borderColor: Colors.primary.goldenYellow,
    backgroundColor: Colors.background.tertiary,
  },
  activityProductContent: {
    flex: 1,
  },
  activityProductTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  activityProductPages: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  actionButtons: {
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.md,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.lg,
    gap: Layout.spacing.sm,
  },
  primaryButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.lg,
    gap: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.primary.navyBlue,
  },
  secondaryButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary.navyBlue,
  },
  exportSummary: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary.goldenYellow,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
    textAlign: 'center',
  },
  summaryContent: {
    gap: Layout.spacing.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  summaryLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    flex: 1,
  },
  summaryValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    flex: 2,
    textAlign: 'right',
  },
});
