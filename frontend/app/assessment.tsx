import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';
import { Question, QuestionnaireResponse } from '../types';

const { width: screenWidth } = Dimensions.get('window');

// Mock questions data - in real app this would come from API
const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'single_choice',
    text: 'What motivates you most in your career?',
    description: 'Choose the option that best describes your primary career motivation.',
    options: [
      { id: '1a', text: 'Making a direct impact on results', value: 'doer' },
      { id: '1b', text: 'Solving complex problems', value: 'thinker' },
      { id: '1c', text: 'Creating new ideas and innovations', value: 'creator' },
      { id: '1d', text: 'Helping and developing others', value: 'helper' },
      { id: '1e', text: 'Influencing and leading change', value: 'persuader' },
      { id: '1f', text: 'Organizing and optimizing systems', value: 'organiser' },
    ],
    required: true,
    category: 'motivation',
    order: 1,
  },
  {
    id: '2',
    type: 'slider',
    text: 'How important is work-life balance to you?',
    description: 'Rate from 1 (not important) to 10 (extremely important)',
    required: true,
    category: 'values',
    order: 2,
  },
  {
    id: '3',
    type: 'multiple_choice',
    text: 'Which skills would you most like to develop? (Select up to 3)',
    options: [
      { id: '3a', text: 'Leadership', value: 'leadership' },
      { id: '3b', text: 'Technical expertise', value: 'technical' },
      { id: '3c', text: 'Communication', value: 'communication' },
      { id: '3d', text: 'Project management', value: 'project_management' },
      { id: '3e', text: 'Creative thinking', value: 'creativity' },
      { id: '3f', text: 'Data analysis', value: 'data_analysis' },
    ],
    required: true,
    category: 'skills',
    order: 3,
  },
  {
    id: '4',
    type: 'text_input',
    text: 'What is your biggest career challenge right now?',
    description: 'Describe in a few sentences what you find most challenging in your current career situation.',
    required: true,
    category: 'challenges',
    order: 4,
  },
  {
    id: '5',
    type: 'ranking',
    text: 'Rank your career priorities (drag to reorder)',
    options: [
      { id: '5a', text: 'High salary', value: 'salary' },
      { id: '5b', text: 'Job security', value: 'security' },
      { id: '5c', text: 'Growth opportunities', value: 'growth' },
      { id: '5d', text: 'Meaningful work', value: 'meaning' },
      { id: '5e', text: 'Flexible schedule', value: 'flexibility' },
    ],
    required: true,
    category: 'priorities',
    order: 5,
  },
  // Adding more questions to reach closer to 26
  {
    id: '6',
    type: 'single_choice',
    text: 'How do you prefer to work?',
    options: [
      { id: '6a', text: 'Independently', value: 'independent' },
      { id: '6b', text: 'In small teams', value: 'small_team' },
      { id: '6c', text: 'In large teams', value: 'large_team' },
      { id: '6d', text: 'Leading others', value: 'leading' },
    ],
    required: true,
    category: 'work_style',
    order: 6,
  },
  {
    id: '7',
    type: 'single_choice',
    text: 'What motivates you most at work?',
    options: [
      { id: '7a', text: 'Recognition and praise', value: 'recognition' },
      { id: '7b', text: 'Financial rewards', value: 'money' },
      { id: '7c', text: 'Learning new things', value: 'learning' },
      { id: '7d', text: 'Making a difference', value: 'impact' },
    ],
    required: true,
    category: 'motivation',
    order: 7,
  },
  {
    id: '8',
    type: 'slider',
    text: 'How comfortable are you with taking risks?',
    description: 'Rate from 1 (very uncomfortable) to 10 (love taking risks)',
    required: true,
    category: 'personality',
    order: 8,
  },
  {
    id: '9',
    type: 'multiple_choice',
    text: 'Which work environments do you thrive in? (Select all that apply)',
    options: [
      { id: '9a', text: 'Fast-paced startup', value: 'startup' },
      { id: '9b', text: 'Large corporation', value: 'corporate' },
      { id: '9c', text: 'Remote work', value: 'remote' },
      { id: '9d', text: 'Creative agency', value: 'creative' },
      { id: '9e', text: 'Non-profit organization', value: 'nonprofit' },
    ],
    required: true,
    category: 'environment',
    order: 9,
  },
  {
    id: '10',
    type: 'text_input',
    text: 'Describe your ideal work day in a few sentences.',
    description: 'What would a perfect work day look like for you?',
    required: true,
    category: 'preferences',
    order: 10,
  },
];

export default function AssessmentScreen() {
  const router = useRouter();
  const { updateUser } = useAuthStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<QuestionnaireResponse[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const currentQuestion = mockQuestions[currentQuestionIndex];
  const progress = (currentQuestionIndex + 1) / mockQuestions.length;

  const handleAnswer = (answer: any) => {
    setCurrentAnswer(answer);
  };

  const handleNext = () => {
    console.log('handleNext called, currentAnswer:', currentAnswer);
    console.log('Current question required:', currentQuestion.required);
    console.log('Current question index:', currentQuestionIndex, 'Total questions:', mockQuestions.length);
    
    if (!currentAnswer && currentQuestion.required) {
      console.log('Validation failed - no answer provided');
      Alert.alert('Required', 'Please answer this question to continue.');
      return;
    }

    // Save response
    const response: QuestionnaireResponse = {
      questionId: currentQuestion.id,
      answer: currentAnswer,
      timestamp: new Date().toISOString(),
    };

    const updatedResponses = [
      ...responses.filter(r => r.questionId !== currentQuestion.id),
      response,
    ];
    setResponses(updatedResponses);

    if (currentQuestionIndex < mockQuestions.length - 1) {
      console.log('Moving to next question');
      // Move to next question
      Animated.timing(slideAnimation, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setCurrentAnswer(null);
        slideAnimation.setValue(screenWidth);
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    } else {
      console.log('This is the last question - submitting assessment');
      // Submit assessment
      handleSubmitAssessment(updatedResponses);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      Animated.timing(slideAnimation, {
        toValue: screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        // Load previous answer
        const previousResponse = responses.find(r => r.questionId === mockQuestions[currentQuestionIndex - 1].id);
        setCurrentAnswer(previousResponse?.answer || null);
        slideAnimation.setValue(-screenWidth);
        Animated.timing(slideAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handleSubmitAssessment = async (finalResponses: QuestionnaireResponse[]) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting assessment with responses:', finalResponses.length);
      
      // Mock analysis - in real app this would call Gemini Pro 2.5 API
      const mockArchetype = {
        primary: 'thinker' as const,
        secondary: 'creator' as const,
        scores: {
          doer: 6,
          thinker: 9,
          creator: 8,
          helper: 5,
          persuader: 4,
          organiser: 7,
        },
        description: 'You are a strategic thinker who thrives on solving complex problems and generating innovative solutions.',
        strengths: ['Analytical thinking', 'Problem-solving', 'Innovation'],
        growthAreas: ['Leadership skills', 'Communication', 'Team collaboration'],
        careerSuggestions: ['Data Scientist', 'Research & Development', 'Strategy Consultant'],
      };

      console.log('Updating user with archetype data...');
      await updateUser({
        assessmentCompleted: true,
        archetype: mockArchetype,
      });
      
      console.log('User updated successfully, navigating to home...');
      
      // Navigate to home immediately
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Assessment submission error:', error);
      Alert.alert('Error', 'Failed to submit assessment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case 'single_choice':
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  currentAnswer === option.value && styles.selectedOption,
                ]}
                onPress={() => handleAnswer(option.value)}
              >
                <Text style={[
                  styles.optionText,
                  currentAnswer === option.value && styles.selectedOptionText,
                ]}>
                  {option.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case 'multiple_choice':
        return (
          <View style={styles.optionsContainer}>
            {currentQuestion.options?.map((option) => {
              const selectedOptions = currentAnswer || [];
              const isSelected = selectedOptions.includes(option.value);
              
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.optionButton,
                    isSelected && styles.selectedOption,
                  ]}
                  onPress={() => {
                    const updated = isSelected
                      ? selectedOptions.filter((val: any) => val !== option.value)
                      : [...selectedOptions, option.value];
                    handleAnswer(updated);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}>
                    {option.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );

      case 'text_input':
        return (
          <TextInput
            style={styles.textInput}
            placeholder="Type your answer here..."
            value={currentAnswer || ''}
            onChangeText={handleAnswer}
            multiline
            placeholderTextColor={Colors.text.tertiary}
          />
        );

      case 'slider':
        return (
          <View style={styles.sliderContainer}>
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderLabel}>1</Text>
              <Text style={styles.sliderLabel}>10</Text>
            </View>
            <View style={styles.sliderValues}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.sliderValue,
                    currentAnswer === value && styles.selectedSliderValue,
                  ]}
                  onPress={() => handleAnswer(value)}
                >
                  <Text style={[
                    styles.sliderValueText,
                    currentAnswer === value && styles.selectedSliderValueText,
                  ]}>
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'ranking':
        return (
          <View style={styles.rankingContainer}>
            <Text style={styles.rankingInstructions}>
              Tap to select your order of importance (1 = most important)
            </Text>
            {currentQuestion.options?.map((option, index) => {
              const selectedRanking = currentAnswer || [];
              const rankPosition = selectedRanking.findIndex((item: any) => item.value === option.value);
              const isRanked = rankPosition !== -1;
              
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.rankingOption,
                    isRanked && styles.rankedOption,
                  ]}
                  onPress={() => {
                    let newRanking = [...selectedRanking];
                    
                    if (isRanked) {
                      // Remove from ranking
                      newRanking = newRanking.filter((item: any) => item.value !== option.value);
                      // Adjust positions of remaining items
                      newRanking = newRanking.map((item: any, idx: number) => ({
                        ...item,
                        position: idx + 1
                      }));
                    } else {
                      // Add to ranking
                      newRanking.push({
                        value: option.value,
                        text: option.text,
                        position: newRanking.length + 1
                      });
                    }
                    
                    handleAnswer(newRanking);
                  }}
                >
                  <View style={styles.rankingContent}>
                    <View style={[
                      styles.rankingNumber,
                      isRanked && styles.rankedNumber,
                    ]}>
                      <Text style={[
                        styles.rankingNumberText,
                        isRanked && styles.rankedNumberText,
                      ]}>
                        {isRanked ? rankPosition + 1 : '?'}
                      </Text>
                    </View>
                    <Text style={[
                      styles.rankingOptionText,
                      isRanked && styles.rankedOptionText,
                    ]}>
                      {option.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        );

      default:
        return <Text>Question type not implemented</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={currentQuestionIndex > 0 ? handlePrevious : undefined}
          style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
        >
          <Ionicons 
            name="chevron-back" 
            size={24} 
            color={currentQuestionIndex > 0 ? Colors.text.primary : Colors.text.tertiary} 
          />
        </TouchableOpacity>
        
        <Text style={styles.questionCounter}>
          {currentQuestionIndex + 1} of {mockQuestions.length}
        </Text>
        
        <TouchableOpacity 
          onPress={() => Alert.alert('Exit Assessment', 'Are you sure you want to exit?')}
          style={styles.navButton}
        >
          <Ionicons name="close" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      {/* Question Content */}
      <Animated.View style={[styles.questionContainer, { transform: [{ translateX: slideAnimation }] }]}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
          {currentQuestion.description && (
            <Text style={styles.questionDescription}>{currentQuestion.description}</Text>
          )}
          
          {renderQuestionContent()}
        </ScrollView>
      </Animated.View>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        {currentQuestionIndex === mockQuestions.length - 1 ? (
          /* Last question - show completion buttons */
          <View style={styles.completionButtons}>
            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: Colors.success }]}
              onPress={() => {
                console.log('Direct navigation test button clicked');
                router.replace('/(tabs)/home');
              }}
            >
              <Text style={styles.nextButtonText}>Skip to Dashboard (Test)</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.nextButton,
                !currentAnswer && styles.disabledButton,
              ]}
              onPress={() => {
                console.log('Complete Assessment clicked, currentAnswer:', currentAnswer);
                if (currentAnswer) {
                  // Update user first
                  updateUser({
                    assessmentCompleted: true,
                    archetype: {
                      primary: 'thinker' as const,
                      secondary: 'creator' as const,
                      scores: { doer: 6, thinker: 9, creator: 8, helper: 5, persuader: 4, organiser: 7 },
                      description: 'You are a strategic thinker.',
                      strengths: ['Analytical thinking', 'Problem-solving'],
                      growthAreas: ['Leadership skills', 'Communication'],
                      careerSuggestions: ['Data Scientist', 'Strategy Consultant'],
                    },
                  }).then(() => {
                    console.log('User updated, navigating to home');
                    router.replace('/(tabs)/home');
                  }).catch(error => {
                    console.error('Update failed:', error);
                    router.replace('/(tabs)/home'); // Navigate anyway
                  });
                } else {
                  Alert.alert('Required', 'Please answer this question to complete the assessment.');
                }
              }}
              disabled={isSubmitting}
            >
              <Text style={styles.nextButtonText}>
                {isSubmitting ? 'Analyzing...' : 'Complete Assessment'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Regular Next button */
          <TouchableOpacity
            style={[
              styles.nextButton,
              (!currentAnswer && currentQuestion.required) && styles.disabledButton,
            ]}
            onPress={() => {
              console.log('Next button clicked - calling handleNext');
              handleNext();
            }}
            disabled={isSubmitting || (!currentAnswer && currentQuestion.required)}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}
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
    paddingVertical: Layout.spacing.md,
  },
  navButton: {
    width: Layout.touchTarget.small,
    height: Layout.touchTarget.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.3,
  },
  questionCounter: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
  },
  progressContainer: {
    height: 3,
    backgroundColor: Colors.neutral.gray200,
    marginHorizontal: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.sm,
  },
  questionContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: Layout.spacing.lg,
    paddingTop: Layout.spacing.xl,
  },
  questionText: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
    lineHeight: Typography.lineHeight.snug * Typography.fontSize['2xl'],
  },
  questionDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xl,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  optionsContainer: {
    gap: Layout.spacing.md,
  },
  optionButton: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: Colors.primary.goldenYellow,
    borderColor: Colors.primary.goldenYellow,
  },
  optionText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  selectedOptionText: {
    fontWeight: Typography.fontWeight.semibold,
  },
  textInput: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  sliderContainer: {
    paddingVertical: Layout.spacing.lg,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.md,
  },
  sliderLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  sliderValues: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: Layout.spacing.sm,
  },
  sliderValue: {
    width: Layout.touchTarget.small,
    height: Layout.touchTarget.small,
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSliderValue: {
    backgroundColor: Colors.primary.goldenYellow,
    borderColor: Colors.primary.goldenYellow,
  },
  sliderValueText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
  },
  selectedSliderValueText: {
    fontWeight: Typography.fontWeight.semibold,
  },
  footer: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
  },
  nextButton: {
    backgroundColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
    minHeight: Layout.touchTarget.medium,
  },
  nextButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  rankingContainer: {
    gap: Layout.spacing.md,
  },
  rankingInstructions: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Layout.spacing.md,
    fontStyle: 'italic',
  },
  rankingOption: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  rankedOption: {
    backgroundColor: Colors.primary.goldenYellow,
    borderColor: Colors.primary.goldenYellow,
  },
  rankingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankingNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.neutral.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Layout.spacing.md,
  },
  rankedNumber: {
    backgroundColor: Colors.primary.navyBlue,
  },
  rankingNumberText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.secondary,
  },
  rankedNumberText: {
    color: Colors.text.inverse,
  },
  rankingOptionText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    flex: 1,
  },
  rankedOptionText: {
    fontWeight: Typography.fontWeight.semibold,
  },
});