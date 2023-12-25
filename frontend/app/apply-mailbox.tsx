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

interface ActivityProduct {
  id: string;
  title: string;
  completedDate: string;
  selected: boolean;
}

const mockActivityProducts: ActivityProduct[] = [
  {
    id: '1',
    title: 'Systems Analysis for Customer Retention Strategy',
    completedDate: 'Completed 2 days ago',
    selected: true,
  },
  {
    id: '2',
    title: 'Advanced Analytics Workshop Portfolio',
    completedDate: 'Completed 1 week ago',
    selected: true,
  },
  {
    id: '3',
    title: 'Leadership Communication Framework Summary',
    completedDate: 'Completed 3 weeks ago',
    selected: false,
  },
];

export default function ApplyMailboxScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { jobTitle, company } = params;

  const [emailTo, setEmailTo] = useState('careers@techcorp.com');
  const [emailSubject, setEmailSubject] = useState(`Application for ${jobTitle} Position - John Smith`);
  const [emailBody, setEmailBody] = useState(`Dear Hiring Manager,

I am writing to express my interest in the ${jobTitle} position at ${company}. I have attached my resume, cover letter, and relevant activity products that demonstrate my qualifications for this role.

I look forward to discussing how my skills and experience can contribute to your team.

Best regards,
John Smith`);
  const [activityProducts, setActivityProducts] = useState(mockActivityProducts);

  const handleActivityProductToggle = (productId: string) => {
    setActivityProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, selected: !product.selected }
          : product
      )
    );
  };

  const handleSendApplication = () => {
    const selectedProducts = activityProducts.filter(p => p.selected);
    Alert.alert(
      'Application Sent',
      `Your application has been sent to ${emailTo} with ${selectedProducts.length} activity products attached.`,
      [
        { text: 'OK', onPress: () => router.push('/(tabs)/jobs') }
      ]
    );
  };

  const handleSaveDraft = () => {
    Alert.alert('Draft Saved', 'Your application has been saved as a draft.');
  };

  const handleScheduleSend = () => {
    Alert.alert(
      'Schedule Send',
      'Choose when to send your application:',
      [
        { text: 'In 1 hour', onPress: () => Alert.alert('Scheduled', 'Application will be sent in 1 hour.') },
        { text: 'Tomorrow at 9 AM', onPress: () => Alert.alert('Scheduled', 'Application will be sent tomorrow at 9 AM.') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apply through mailbox</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Job Context */}
        <View style={styles.jobContext}>
          <Text style={styles.contextTitle}>Send Application Package</Text>
        </View>

        {/* Email Integration */}
        <View style={styles.emailSection}>
          <Text style={styles.sectionTitle}>Email Integration:</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>To:</Text>
            <TextInput
              style={styles.textInput}
              value={emailTo}
              onChangeText={setEmailTo}
              placeholder="Enter recipient email"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject:</Text>
            <TextInput
              style={styles.textInput}
              value={emailSubject}
              onChangeText={setEmailSubject}
              placeholder="Enter email subject"
              placeholderTextColor={Colors.text.tertiary}
            />
          </View>
        </View>

        {/* Attachments */}
        <View style={styles.attachmentsSection}>
          <Text style={styles.sectionTitle}>Attachments:</Text>
          <View style={styles.attachmentsList}>
            <View style={styles.attachmentItem}>
              <Ionicons name="document-text" size={20} color={Colors.primary.navyBlue} />
              <Text style={styles.attachmentText}>📎 John_Smith_Resume_TechCorp.pdf</Text>
            </View>
            <View style={styles.attachmentItem}>
              <Ionicons name="mail" size={20} color={Colors.primary.navyBlue} />
              <Text style={styles.attachmentText}>📎 John_Smith_CoverLetter_TechCorp.pdf</Text>
            </View>
            <View style={styles.attachmentItem}>
              <Ionicons name="library" size={20} color={Colors.primary.navyBlue} />
              <Text style={styles.attachmentText}>📎 Systems_Analysis_Activity_Product.pdf</Text>
            </View>
            <View style={styles.attachmentItem}>
              <Ionicons name="library" size={20} color={Colors.primary.navyBlue} />
              <Text style={styles.attachmentText}>📎 Strategic_Planning_Portfolio_Summary.pdf</Text>
            </View>
          </View>
        </View>

        {/* Available Activity Products */}
        <View style={styles.activityProductsSection}>
          <Text style={styles.sectionTitle}>Available Activity Products ({activityProducts.length}):</Text>
          <View style={styles.activityProductsList}>
            {activityProducts.map((product) => (
              <View key={product.id} style={styles.activityProductItem}>
                <Text style={styles.activityProductTitle}>- {product.title}</Text>
                <Text style={styles.activityProductDate}>({product.completedDate})</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Email Template */}
        <View style={styles.emailTemplateSection}>
          <Text style={styles.sectionTitle}>Email Template:</Text>
          <Text style={styles.templateNote}>[Pre-written professional email with activity product context]</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleSendApplication}>
            <Text style={styles.primaryButtonText}>Send Application</Text>
          </TouchableOpacity>
          
          <View style={styles.secondaryButtons}>
            <TouchableOpacity style={styles.secondaryButton} onPress={handleSaveDraft}>
              <Text style={styles.secondaryButtonText}>Save as Draft</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.secondaryButton} onPress={handleScheduleSend}>
              <Text style={styles.secondaryButtonText}>Schedule Send</Text>
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
  emailSection: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  inputGroup: {
    marginBottom: Layout.spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
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
  attachmentsSection: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  attachmentsList: {
    gap: Layout.spacing.sm,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
    gap: Layout.spacing.sm,
  },
  attachmentText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    flex: 1,
  },
  activityProductsSection: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  activityProductsList: {
    gap: Layout.spacing.sm,
  },
  activityProductItem: {
    marginBottom: Layout.spacing.sm,
  },
  activityProductTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  activityProductDate: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  emailTemplateSection: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  templateNote: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    marginBottom: Layout.spacing.md,
  },
  emailBodyInput: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    textAlignVertical: 'top',
    minHeight: 120,
  },
  actionButtons: {
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.md,
  },
  primaryButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.lg,
  },
  primaryButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  secondaryButtons: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  secondaryButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary.navyBlue,
  },
  secondaryButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary.navyBlue,
  },
});
