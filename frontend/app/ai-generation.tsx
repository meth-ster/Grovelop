import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
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
      message: 'Analyzing job requirements and your profile...',
    },
    {
      step: 'generating_resume',
      progress: 50,
      message: 'Generating tailored resume content...',
    },
    {
      step: 'generating_cover_letter',
      progress: 80,
      message: 'Crafting personalized cover letter...',
    },
    {
      step: 'finalizing',
      progress: 95,
      message: 'Finalizing documents and formatting...',
    },
    {
      step: 'complete',
      progress: 100,
      message: 'Documents generated successfully!',
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
            {/* Generation Settings Summary */}
            <View style={styles.settingsSummary}>
              <Text style={styles.summaryTitle}>Generation Settings</Text>
              <View style={styles.settingsGrid}>
                <View style={styles.settingItem}>
                  <Ionicons name="person" size={16} color={Colors.primary.navyBlue} />
                  <Text style={styles.settingText}>Experience Level: {params.experienceLevel}</Text>
                </View>
                <View style={styles.settingItem}>
                  <Ionicons name="globe" size={16} color={Colors.primary.navyBlue} />
                  <Text style={styles.settingText}>Format: {params.geographicFormat}</Text>
                </View>
                <View style={styles.settingItem}>
                  <Ionicons name="chatbubble" size={16} color={Colors.primary.navyBlue} />
                  <Text style={styles.settingText}>Tone: {params.tone}</Text>
                </View>
                <View style={styles.settingItem}>
                  <Ionicons name="library" size={16} color={Colors.primary.navyBlue} />
                  <Text style={styles.settingText}>
                    Activities: {selectedActivities ? JSON.parse(selectedActivities as string).length : 0} selected
                  </Text>
                </View>
              </View>
            </View>

            {/* AI Features */}
            <View style={styles.aiFeatures}>
              <Text style={styles.featuresTitle}>AI-Powered Features</Text>
              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Ionicons name="scan" size={20} color={Colors.primary.goldenYellow} />
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>Smart Content Analysis</Text>
                    <Text style={styles.featureDescription}>
                      Analyzes job requirements and matches them with your activities
                    </Text>
                  </View>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="create" size={20} color={Colors.primary.goldenYellow} />
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>Tailored Content Generation</Text>
                    <Text style={styles.featureDescription}>
                      Creates custom content highlighting your relevant experience
                    </Text>
                  </View>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="trophy" size={20} color={Colors.primary.goldenYellow} />
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>Achievement Optimization</Text>
                    <Text style={styles.featureDescription}>
                      Emphasizes accomplishments that matter most for this role
                    </Text>
                  </View>
                </View>
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
              
              <Text style={styles.progressTitle}>Generating Your Documents</Text>
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
});