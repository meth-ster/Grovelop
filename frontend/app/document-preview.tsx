import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';

const { width: screenWidth } = Dimensions.get('window');

type DocumentTab = 'resume' | 'cover_letter';

interface GeneratedDocument {
  type: DocumentTab;
  content: string;
  lastEdited: string;
}

const mockGeneratedDocuments: GeneratedDocument[] = [
  {
    type: 'resume',
    content: `JOHN DOE
Data Analyst | Strategic Thinker | Problem Solver
Email: john.doe@email.com | Phone: (555) 123-4567
Location: San Francisco, CA | LinkedIn: linkedin.com/in/johndoe

PROFESSIONAL SUMMARY
Strategic data analyst with 5+ years of experience driving business insights through advanced analytics and data visualization. Proven track record in leading cross-functional teams, implementing data-driven solutions, and transforming complex datasets into actionable business intelligence. Expertise in SQL, Python, and statistical modeling with strong communication and leadership skills.

CORE COMPETENCIES
• Data Analysis & Visualization • Statistical Modeling • SQL & Python
• Strategic Communication • Team Leadership • Project Management
• Business Intelligence • Process Optimization • Stakeholder Management

PROFESSIONAL EXPERIENCE

Senior Data Analyst | TechStart Inc. | 2021 - Present
• Led data-driven decision making initiatives that improved business efficiency by 40%
• Developed comprehensive analytics framework used by 5 different departments
• Mentored junior analysts, with 4 out of 5 receiving promotions within 6 months
• Created customer journey analysis that increased user satisfaction by 25%
• Collaborated with cross-functional teams to implement strategic communication protocols

Data Analyst | Analytics Pro | 2019 - 2021
• Performed statistical analysis and modeling on complex datasets
• Built automated reporting systems that reduced manual work by 60%
• Presented findings to C-level executives and stakeholder groups

EDUCATION
Bachelor of Science in Data Science | University of California | 2019
Relevant Coursework: Statistics, Machine Learning, Database Management

ACHIEVEMENTS & CERTIFICATIONS
• Strategic Communication in Leadership Workshop (2024)
• Advanced SQL Certification | Google Cloud Platform
• Led cross-functional project resulting in $2M cost savings
• Published research on predictive analytics in industry journal

TECHNICAL SKILLS
Programming: Python, R, SQL, JavaScript
Tools: Tableau, Power BI, Google Analytics, Jupyter
Databases: PostgreSQL, MongoDB, BigQuery
Cloud: AWS, Google Cloud Platform`,
    lastEdited: new Date().toISOString(),
  },
  {
    type: 'cover_letter',
    content: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Data Analyst position at TechCorp. With my proven track record in data-driven decision making and strategic communication, I am excited about the opportunity to contribute to your analytics team and help drive TechCorp's continued growth.

In my current role as Senior Data Analyst at TechStart Inc., I have successfully led initiatives that directly align with your job requirements. My experience includes:

Strategic Communication & Leadership: Through my recent completion of the Strategic Communication in Leadership workshop, I have developed the ability to translate complex data insights into compelling narratives for executive audiences. This skill has been instrumental in securing buy-in for data-driven initiatives across multiple departments.

Data Analysis Excellence: I have consistently delivered high-impact analytical solutions, including the development of a comprehensive analytics framework that improved decision-making efficiency by 40%. My technical expertise in SQL, Python, and statistical modeling enables me to extract meaningful insights from complex datasets.

Team Development & Mentoring: I take pride in developing talent, having successfully mentored 5 junior analysts with 4 receiving promotions. This demonstrates my ability to not only produce excellent work but also elevate team performance.

Project Impact: My customer journey analysis project resulted in a 25% improvement in user satisfaction, showcasing my ability to translate data insights into tangible business outcomes.

What particularly excites me about TechCorp is your commitment to innovation-focused, data-driven decision making. Your recent expansion of the analytics team by 40% demonstrates the strategic importance of data in your organization, and I am eager to contribute to this growth.

I would welcome the opportunity to discuss how my strategic thinking, analytical expertise, and proven leadership abilities can contribute to TechCorp's success. Thank you for considering my application.

Sincerely,
John Doe`,
    lastEdited: new Date().toISOString(),
  },
];

export default function DocumentPreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { jobTitle, company, documentType } = params;

  const [activeTab, setActiveTab] = useState<DocumentTab>('resume');
  const [documents, setDocuments] = useState(mockGeneratedDocuments);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');

  const activeDocument = documents.find(doc => doc.type === activeTab);

  const handleEdit = () => {
    if (activeDocument) {
      setEditContent(activeDocument.content);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = () => {
    const updatedDocuments = documents.map(doc => 
      doc.type === activeTab 
        ? { ...doc, content: editContent, lastEdited: new Date().toISOString() }
        : doc
    );
    setDocuments(updatedDocuments);
    setIsEditing(false);
    Alert.alert('Saved', 'Your changes have been saved successfully.');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
  };

  const handleRegenerateSection = () => {
    Alert.alert(
      'Regenerate Section',
      'Which section would you like to regenerate?',
      [
        { text: 'Professional Summary', onPress: () => regenerateSection('summary') },
        { text: 'Experience', onPress: () => regenerateSection('experience') },
        { text: 'Skills', onPress: () => regenerateSection('skills') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const regenerateSection = (section: string) => {
    Alert.alert(
      'Section Regenerated',
      `The ${section} section has been regenerated with fresh AI content based on your profile.`
    );
  };

  const handleExportDocuments = () => {
    router.push({
      pathname: '/export-distribution',
      params: {
        ...params,
        documentData: JSON.stringify(documents),
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Document Preview</Text>
        <TouchableOpacity onPress={handleRegenerateSection}>
          <Ionicons name="refresh" size={24} color={Colors.primary.goldenYellow} />
        </TouchableOpacity>
      </View>

      {/* Job Context */}
      <View style={styles.jobContext}>
        <Text style={styles.contextText}>Application for {jobTitle} at {company}</Text>
      </View>

      {/* Document Tabs */}
      {documentType === 'both' && (
        <View style={styles.tabContainer}>
          {documents.map((doc) => (
            <TouchableOpacity
              key={doc.type}
              style={[
                styles.tab,
                activeTab === doc.type && styles.activeTab,
              ]}
              onPress={() => setActiveTab(doc.type)}
            >
              <Ionicons 
                name={doc.type === 'resume' ? 'document-text' : 'mail'} 
                size={16} 
                color={activeTab === doc.type ? Colors.text.primary : Colors.text.secondary} 
              />
              <Text style={[
                styles.tabText,
                activeTab === doc.type && styles.activeTabText,
              ]}>
                {doc.type === 'resume' ? 'Resume' : 'Cover Letter'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Document Content */}
      <View style={styles.documentContainer}>
        {isEditing ? (
          <View style={styles.editMode}>
            <View style={styles.editHeader}>
              <Text style={styles.editTitle}>Editing {activeTab === 'resume' ? 'Resume' : 'Cover Letter'}</Text>
              <View style={styles.editActions}>
                <TouchableOpacity style={styles.cancelEditButton} onPress={handleCancelEdit}>
                  <Text style={styles.cancelEditText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveEditButton} onPress={handleSaveEdit}>
                  <Text style={styles.saveEditText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TextInput
              style={styles.editTextInput}
              value={editContent}
              onChangeText={setEditContent}
              multiline
              textAlignVertical="top"
            />
          </View>
        ) : (
          <ScrollView style={styles.previewContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.documentPreview}>
              <Text style={styles.documentContent}>{activeDocument?.content}</Text>
            </View>
          </ScrollView>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        {!isEditing && (
          <>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Ionicons name="pencil" size={20} color={Colors.primary.navyBlue} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.exportButton} onPress={handleExportDocuments}>
              <Text style={styles.exportButtonText}>Export & Apply</Text>
              <Ionicons name="arrow-forward" size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Document Info */}
      {!isEditing && (
        <View style={styles.documentInfo}>
          <View style={styles.infoItem}>
            <Ionicons name="time" size={16} color={Colors.text.secondary} />
            <Text style={styles.infoText}>
              Last edited: {new Date(activeDocument?.lastEdited || '').toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="document" size={16} color={Colors.text.secondary} />
            <Text style={styles.infoText}>
              {activeDocument?.content.split(' ').length} words
            </Text>
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
  jobContext: {
    backgroundColor: Colors.primary.navyBlue,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
  },
  contextText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.inverse,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.secondary,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.md,
    gap: Layout.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: Colors.primary.goldenYellow,
    backgroundColor: Colors.background.primary,
  },
  tabText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  activeTabText: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.semibold,
  },
  documentContainer: {
    flex: 1,
  },
  previewContainer: {
    flex: 1,
  },
  documentPreview: {
    backgroundColor: Colors.background.primary,
    margin: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
    minHeight: 400,
  },
  documentContent: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
  },
  editMode: {
    flex: 1,
    margin: Layout.spacing.lg,
  },
  editHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.md,
  },
  editTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  editActions: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  cancelEditButton: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelEditText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.error,
  },
  saveEditButton: {
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
    backgroundColor: Colors.success,
  },
  saveEditText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.inverse,
    fontWeight: Typography.fontWeight.semibold,
  },
  editTextInput: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    textAlignVertical: 'top',
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
  },
  actionBar: {
    flexDirection: 'row',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
    gap: Layout.spacing.md,
  },
  editButton: {
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
  editButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.navyBlue,
  },
  exportButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  exportButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  documentInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    backgroundColor: Colors.background.secondary,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  infoText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
});