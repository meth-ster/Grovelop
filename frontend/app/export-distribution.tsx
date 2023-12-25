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
    Alert.alert(
      'Download Started',
      'Your documents are being prepared for download. You will be notified when ready.',
      [
        { text: 'OK', onPress: () => router.push('/apply-mailbox') }
      ]
    );
  };

  const handleEmailToSelf = () => {
    Alert.alert(
      'Email Sent',
      'Your documents have been emailed to your registered email address.',
      [
        { text: 'OK', onPress: () => router.push('/apply-mailbox') }
      ]
    );
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
        <Text style={styles.headerTitle}>Export & Distribution</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Job Context */}
        <View style={styles.jobContext}>
          <Text style={styles.contextTitle}>Download Your Documents</Text>
          <Text style={styles.contextSubtitle}>(your document is saved automatically)</Text>
        </View>

        {/* Skip Option */}
        <View style={styles.skipSection}>
          <TouchableOpacity style={styles.skipButton} onPress={() => router.push('/apply-mailbox')}>
            <Text style={styles.skipButtonText}>Skip: Go to Apply with documents</Text>
          </TouchableOpacity>
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
            { value: 'resume_cover', label: 'Resume + Cover Letter Package', description: 'Complete application package' },
            { value: 'resume_only', label: 'Resume Only', description: 'Just the resume' },
            { value: 'cover_only', label: 'Cover Letter Only', description: 'Just the cover letter' },
            { value: 'activity_portfolio', label: 'Activity Product Portfolio (Selected activities)', description: 'Portfolio of your activities' },
            { value: 'complete_bundle', label: 'Complete Application Bundle (Resume + Cover Letter + Activity Products)', description: 'Everything included' },
          ],
          config.bundle,
          handleBundleSelect
        )}

        {/* Activity Product Selection */}
        <View style={styles.optionGroup}>
          <Text style={styles.optionLabel}>Activity Product Selection:</Text>
          <View style={styles.activityProductsList}>
            {mockActivityProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                style={[
                  styles.activityProductItem,
                  config.activityProducts.includes(product.id) && styles.selectedActivityProduct,
                ]}
                onPress={() => handleActivityProductToggle(product.id)}
              >
                <View style={styles.activityProductContent}>
                  <Text style={styles.activityProductTitle}>{product.title}</Text>
                  <Text style={styles.activityProductPages}>({product.pages} pages)</Text>
                </View>
                <Ionicons
                  name={config.activityProducts.includes(product.id) ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={config.activityProducts.includes(product.id) ? Colors.success : Colors.text.secondary}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

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

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleDownload}>
            <Ionicons name="download" size={20} color={Colors.text.primary} />
            <Text style={styles.primaryButtonText}>Download and go to Apply</Text>
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
});
