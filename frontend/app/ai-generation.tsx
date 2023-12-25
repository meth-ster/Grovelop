import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';

type GenerationStep = 'analyzing' | 'generating_resume' | 'generating_cover_letter' | 'finalizing' | 'complete';

interface GenerationProgress {
  step: GenerationStep;
  progress: number;
  message: string;
}

export default function AIGenerationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { jobTitle, company, documentType, selectedActivities } = params;

  const [generationState, setGenerationState] = useState<GenerationProgress>({
    step: 'analyzing',
    progress: 0,
    message: 'Analyzing job requirements and your profile...',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const progressAnimation = useState(new Animated.Value(0))[0];
  const pulseAnimation = useState(new Animated.Value(1))[0];

  const generationSteps: GenerationProgress[] = [
    {
      step: 'analyzing',
      progress: 20,
      message: 'Analyzing your profile and strengths',
    },
    {
      step: 'generating_resume',
      progress: 50,
      message: 'Integrating completed activity portfolio',
    },
    {
      step: 'generating_cover_letter',
      progress: 80,
      message: 'Crafting compelling achievement statements',
    },
    {
      step: 'finalizing',
      progress: 95,
      message: 'Generating employer-specific cover letter',
    },
    {
      step: 'complete',
      progress: 100,
      message: 'Formatting professional document layout',
    },
  ];

  const startGeneration = async () => {
    setIsGenerating(true);
    
    // Animate through each step
    for (let i = 0; i < generationSteps.length; i++) {
      const step = generationSteps[i];
      setGenerationState(step);
      
      // Animate progress bar
      Animated.timing(progressAnimation, {
        toValue: step.progress,
        duration: 1000,
        useNativeDriver: false,
      }).start();
      
      // Wait for step to complete (simulated)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    setIsGenerating(false);
    
    // Navigate to document preview
    setTimeout(() => {
      router.push({
        pathname: '/document-preview',
        params: params,
      });
    }, 1000);
  };

  useEffect(() => {
    // Start pulse animation
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnimation, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnimation, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]).start(() => {
        if (isGenerating) {
          pulse();
        }
      });
    };
    
    if (isGenerating) {
      pulse();
    }
  }, [isGenerating, pulseAnimation]);

  const getStepIcon = (step: GenerationStep) => {
    switch (step) {
      case 'analyzing': return 'analytics';
      case 'generating_resume': return 'document-text';
      case 'generating_cover_letter': return 'mail';
      case 'finalizing': return 'checkmark-circle';
      case 'complete': return 'checkmark-done-circle';
      default: return 'ellipse';
    }
  };

  const renderGenerationStep = (step: GenerationProgress, index: number) => {
    const isActive = generationState.step === step.step;
    const isCompleted = generationSteps.findIndex(s => s.step === generationState.step) > index;
    
    return (
      <View key={step.step} style={styles.stepItem}>
        <View style={[
          styles.stepIcon,
          isActive && styles.activeStepIcon,
          isCompleted && styles.completedStepIcon,
        ]}>
          <Ionicons 
            name={getStepIcon(step.step)} 
            size={20} 
            color={isCompleted ? Colors.success : isActive ? Colors.primary.goldenYellow : Colors.text.secondary} 
          />
        </View>
        <View style={styles.stepContent}>
          <Text style={[
            styles.stepTitle,
            isActive && styles.activeStepText,
            isCompleted && styles.completedStepText,
          ]}>
            {step.message}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} disabled={isGenerating}>
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color={isGenerating ? Colors.text.tertiary : Colors.text.primary} 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Generation</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Job Context */}
        <View style={styles.jobContext}>
          <Text style={styles.contextLabel}>Generating for:</Text>
          <Text style={styles.jobTitle}>{jobTitle}</Text>
          <Text style={styles.companyName}>at {company}</Text>
          <Text style={styles.documentType}>
            Document Type: {documentType === 'both' ? 'Resume + Cover Letter' : 
                         documentType === 'resume' ? 'Resume Only' : 'Cover Letter Only'}
          </Text>
        </View>

        {!isGenerating ? (
          <>
            {/* Generation Configuration */}
            <View style={styles.configurationContainer}>
              <Text style={styles.configTitle}>Generation Configuration</Text>
              <Text style={styles.configSubtitle}>Document Generation Settings</Text>
              
              {/* Tone & Style */}
              <View style={styles.configSection}>
                <Text style={styles.configLabel}>Tone & Style:</Text>
                <View style={styles.optionButtons}>
                  <TouchableOpacity style={[styles.optionButton, params.tone === 'conservative' && styles.selectedOption]}>
                    <Text style={[styles.optionText, params.tone === 'conservative' && styles.selectedOptionText]}>Conservative/Traditional</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.optionButton, params.tone === 'professional' && styles.selectedOption]}>
                    <Text style={[styles.optionText, params.tone === 'professional' && styles.selectedOptionText]}>Professional/Modern</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.optionButton, params.tone === 'creative' && styles.selectedOption]}>
                    <Text style={[styles.optionText, params.tone === 'creative' && styles.selectedOptionText]}>Creative/Dynamic</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.optionButton, params.tone === 'executive' && styles.selectedOption]}>
                    <Text style={[styles.optionText, params.tone === 'executive' && styles.selectedOptionText]}>Executive/Leadership</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Experience Level */}
              <View style={styles.configSection}>
                <Text style={styles.configLabel}>Experience Level:</Text>
                <View style={styles.optionButtons}>
                  <TouchableOpacity style={[styles.optionButton, params.experienceLevel === 'entry' && styles.selectedOption]}>
                    <Text style={[styles.optionText, params.experienceLevel === 'entry' && styles.selectedOptionText]}>Entry Level (0-2 years)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.optionButton, params.experienceLevel === 'mid' && styles.selectedOption]}>
                    <Text style={[styles.optionText, params.experienceLevel === 'mid' && styles.selectedOptionText]}>Mid-Level (3-7 years)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.optionButton, params.experienceLevel === 'senior' && styles.selectedOption]}>
                    <Text style={[styles.optionText, params.experienceLevel === 'senior' && styles.selectedOptionText]}>Senior Level (8+ years)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.optionButton, params.experienceLevel === 'executive' && styles.selectedOption]}>
                    <Text style={[styles.optionText, params.experienceLevel === 'executive' && styles.selectedOptionText]}>Executive Level (10+ years)</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Geographic Format */}
              <View style={styles.configSection}>
                <Text style={styles.configLabel}>Geographic Format:</Text>
                <View style={styles.optionButtons}>
                  <TouchableOpacity style={[styles.optionButton, params.geographicFormat === 'US' && styles.selectedOption]}>
                    <Text style={[styles.optionText, params.geographicFormat === 'US' && styles.selectedOptionText]}>US Resume Style</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.optionButton, params.geographicFormat === 'EU' && styles.selectedOption]}>
                    <Text style={[styles.optionText, params.geographicFormat === 'EU' && styles.selectedOptionText]}>European CV Style</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.optionButton, params.geographicFormat === 'Academic' && styles.selectedOption]}>
                    <Text style={[styles.optionText, params.geographicFormat === 'Academic' && styles.selectedOptionText]}>Academic CV Style</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.optionButton, params.geographicFormat === 'International' && styles.selectedOption]}>
                    <Text style={[styles.optionText, params.geographicFormat === 'International' && styles.selectedOptionText]}>International Format</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Education */}
              <View style={styles.configSection}>
                <Text style={styles.configLabel}>Education:</Text>
                <Text style={styles.configValue}>${'{educationFromUserProfile}'}</Text>
              </View>

              {/* Previous Work Experience */}
              <View style={styles.configSection}>
                <Text style={styles.configLabel}>Previous Work Experience:</Text>
                <Text style={styles.configValue}>${'{workExperienceFromUserProfile}'}</Text>
              </View>

              {/* References */}
              <View style={styles.configSection}>
                <Text style={styles.configLabel}>References and their contacts:</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter references and contact information"
                  placeholderTextColor={Colors.text.tertiary}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Attachments */}
              <View style={styles.configSection}>
                <Text style={styles.configLabel}>Attach transcripts / Letters of recommendations / University diplomas:</Text>
                <TouchableOpacity style={styles.attachmentButton}>
                  <Ionicons name="attach" size={20} color={Colors.primary.navyBlue} />
                  <Text style={styles.attachmentText}>Add Attachments</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Start Generation Button */}
            <TouchableOpacity style={styles.generateButton} onPress={startGeneration}>
              <Animated.View style={{ transform: [{ scale: pulseAnimation }] }}>
                <Ionicons name="sparkles" size={24} color={Colors.text.primary} />
              </Animated.View>
              <Text style={styles.generateButtonText}>Generate Documents</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Generation Progress */}
            <View style={styles.generationProgress}>
              <Animated.View style={[
                styles.progressIcon,
                { transform: [{ scale: pulseAnimation }] }
              ]}>
                <Ionicons name="sparkles" size={48} color={Colors.primary.goldenYellow} />
              </Animated.View>
              
              <Text style={styles.progressTitle}>Creating Your Professional Documents...</Text>
              <Text style={styles.progressMessage}>{generationState.message}</Text>
              
              {/* Progress Bar */}
              <View style={styles.progressBarContainer}>
                <Animated.View style={[
                  styles.progressBar,
                  {
                    width: progressAnimation.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  }
                ]} />
              </View>
              
              <Text style={styles.progressPercentage}>{generationState.progress}%</Text>
              <Text style={styles.estimatedTime}>Estimated completion: 45 seconds</Text>
            </View>

            {/* Generation Steps */}
            <View style={styles.stepsContainer}>
              {generationSteps.map(renderGenerationStep)}
            </View>

            {/* Cancel Button */}
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => {
                Alert.alert(
                  'Cancel Generation',
                  'Are you sure you want to cancel? Progress will be lost.',
                  [
                    { text: 'Continue Generating', style: 'cancel' },
                    { text: 'Cancel', onPress: () => router.back(), style: 'destructive' }
                  ]
                );
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel Generation</Text>
            </TouchableOpacity>
          </>
        )}
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
    paddingBottom: Layout.spacing.xl,
  },
  jobContext: {
    backgroundColor: Colors.primary.navyBlue,
    padding: Layout.spacing.lg,
    marginHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.lg,
  },
  contextLabel: {
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
    marginBottom: Layout.spacing.sm,
  },
  documentType: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.inverse,
    opacity: 0.9,
  },
  settingsSummary: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.lg,
  },
  summaryTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  settingsGrid: {
    gap: Layout.spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  settingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textTransform: 'capitalize',
  },
  aiFeatures: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  featuresTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.lg,
  },
  featuresList: {
    gap: Layout.spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Layout.spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  featureDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.goldenYellow,
    marginHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    gap: Layout.spacing.md,
  },
  generateButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  generationProgress: {
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing['2xl'],
  },
  progressIcon: {
    marginBottom: Layout.spacing.lg,
  },
  progressTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  progressMessage: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: Colors.neutral.gray200,
    borderRadius: Layout.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: Layout.spacing.md,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.sm,
  },
  progressPercentage: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.navyBlue,
  },
  estimatedTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: Layout.spacing.sm,
  },
  stepsContainer: {
    paddingHorizontal: Layout.spacing.lg,
    marginTop: Layout.spacing.xl,
    marginBottom: Layout.spacing.xl,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.lg,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  activeStepIcon: {
    backgroundColor: Colors.primary.goldenYellow,
  },
  completedStepIcon: {
    backgroundColor: Colors.success,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
  },
  activeStepText: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  completedStepText: {
    color: Colors.success,
    fontWeight: Typography.fontWeight.medium,
  },
  cancelButton: {
    marginHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelButtonText: {
    fontSize: Typography.fontSize.base,
    color: Colors.error,
    fontWeight: Typography.fontWeight.medium,
  },
  configurationContainer: {
    backgroundColor: Colors.background.secondary,
    marginHorizontal: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.lg,
  },
  configTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  configSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.lg,
  },
  configSection: {
    marginBottom: Layout.spacing.lg,
  },
  configLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  configValue: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    backgroundColor: Colors.background.primary,
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
  },
  optionButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  optionButton: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
  },
  selectedOption: {
    backgroundColor: Colors.primary.goldenYellow,
    borderColor: Colors.primary.navyBlue,
  },
  optionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
  },
  selectedOptionText: {
    fontWeight: Typography.fontWeight.semibold,
  },
  textInput: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.borderRadius.sm,
    padding: Layout.spacing.sm,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    textAlignVertical: 'top',
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.primary,
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
    borderWidth: 1,
    borderColor: Colors.neutral.gray300,
    borderStyle: 'dashed',
  },
  attachmentText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary.navyBlue,
    marginLeft: Layout.spacing.sm,
  },
});