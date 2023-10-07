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
import { AlertService } from '../services/alertService';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';
import { Question, QuestionnaireResponse } from '../types';

const { width: screenWidth } = Dimensions.get('window');

// Questionnaire based on user specification
const mockQuestions: Question[] = [
  {
    id: '1',
    type: 'single_choice',
    text: 'Which of these statements best describes your current life phase?',
    options: [
      { id: '1a', text: 'Building foundations and exploring possibilities', value: 'foundations' },
      { id: '1b', text: 'Focused growth and skill development', value: 'growth' },
      { id: '1c', text: 'Deepening expertise and expanding influence', value: 'expertise' },
      { id: '1d', text: 'Integrating experiences and seeking wisdom', value: 'integration' },
      { id: '1e', text: 'Creating lasting impact and legacy', value: 'legacy' },
    ],
    required: true,
    category: 'life_phase',
    order: 1,
  },
  {
    id: '2',
    type: 'multi_text',
    text: 'Describe your current professional situation. If you are currently not employed please describe your ideal professional situation',
    fields: [
      { id: 'role', label: 'Current role/industry:', placeholder: 'e.g., Product Designer in Fintech' },
      { id: 'daily', label: 'Daily work activities:' },
      { id: 'enjoy', label: 'What you enjoy most about your work:' },
      { id: 'proud', label: "Skills you're most proud of:" },
    ],
    required: true,
    category: 'current_situation',
    order: 2,
  },
  { id: '3', type: 'open_text', text: 'What gives you the strongest sense of energy and engagement in your current professional life?', required: true, category: 'engagement', order: 3 },
  { id: '4', type: 'open_text', text: 'If you could change one aspect of your current professional situation, what would have the greatest positive impact?', required: true, category: 'change', order: 4 },
  {
    id: '5',
    type: 'categorized_multi_select',
    text: 'Select your most important Personal Values (max 3)',
    categories: [
      {
        id: 'personal',
        label: 'Personal Values',
        max: 3,
        options: [
          { id: 'v1', text: 'Compassion/Empathy', value: 'compassion' },
          { id: 'v2', text: 'Integrity', value: 'integrity' },
          { id: 'v3', text: 'Humility', value: 'humility' },
          { id: 'v4', text: 'Courage', value: 'courage' },
          { id: 'v5', text: 'Balance/Harmony', value: 'balance' },
          { id: 'v6', text: 'Mindfulness/Presence', value: 'mindfulness' },
          { id: 'v7', text: 'Gratitude', value: 'gratitude' },
          { id: 'v8', text: 'Resilience', value: 'resilience' },
          { id: 'v9', text: 'Self-discipline', value: 'discipline' },
          { id: 'v10', text: 'Fun/Joy/Playfulness', value: 'joy' },
        ],
      },
    ],
    required: true,
    category: 'values_personal',
    order: 5,
  },
  {
    id: '6',
    type: 'categorized_multi_select',
    text: 'Select your most important Social/Ethical Values (max 3)',
    categories: [
      {
        id: 'social',
        label: 'Social/Ethical Values',
        max: 3,
        options: [
          { id: 's1', text: 'Justice/Fairness', value: 'justice' },
          { id: 's2', text: 'Equality', value: 'equality' },
          { id: 's3', text: 'Environmental stewardship', value: 'environment' },
          { id: 's4', text: 'Peace', value: 'peace' },
          { id: 's5', text: 'Social responsibility', value: 'responsibility' },
          { id: 's6', text: 'Diversity/Inclusion', value: 'inclusion' },
        ],
      },
    ],
    required: true,
    category: 'values_social',
    order: 6,
  },
  {
    id: '7',
    type: 'categorized_multi_select',
    text: 'Select your most important Professional Values (max 3)',
    categories: [
      {
        id: 'professional',
        label: 'Professional Values',
        max: 3,
        options: [
          { id: 'p1', text: 'Excellence', value: 'excellence' },
          { id: 'p2', text: 'Innovation', value: 'innovation' },
          { id: 'p3', text: 'Reliability', value: 'reliability' },
          { id: 'p4', text: 'Learning', value: 'learning' },
          { id: 'p5', text: 'Efficiency', value: 'efficiency' },
        ],
      },
    ],
    required: true,
    category: 'values_professional',
    order: 7,
  },
  {
    id: '8',
    type: 'categorized_multi_select',
    text: 'Select your most important Spiritual/Philosophical Values (max 3)',
    categories: [
      {
        id: 'spiritual',
        label: 'Spiritual/Philosophical Values',
        max: 3,
        options: [
          { id: 'sp1', text: 'Purpose/Meaning', value: 'purpose' },
          { id: 'sp2', text: 'Truth', value: 'truth' },
          { id: 'sp3', text: 'Beauty', value: 'beauty' },
          { id: 'sp4', text: 'Hope', value: 'hope' },
          { id: 'sp5', text: 'Acceptance', value: 'acceptance' },
          { id: 'sp6', text: 'Simplicity', value: 'simplicity' },
          { id: 'sp7', text: 'Connection (to nature, universe, etc.)', value: 'connection' },
        ],
      },
    ],
    required: true,
    category: 'values_spiritual',
    order: 8,
  },
  { id: '9', type: 'ranking', text: 'Now rank your selected values from most important to least important', required: true, category: 'values_ranking', order: 9 },
  { id: '10', type: 'open_text', text: "Complete this statement: 'I feel most authentic and alive professionally when I am...'", required: true, category: 'authenticity', order: 10 },
  {
    id: '11',
    type: 'multi_text',
    text: 'Think of your greatest accomplishment. What Skills, Characteristics and Strengths made it possible?',
    fields: [
      { id: 'skills', label: 'Skills:' },
      { id: 'characteristics', label: 'Characteristics:' },
      { id: 'strengths', label: 'Strengths:' },
    ],
    required: true,
    category: 'accomplishment',
    order: 11,
  },
  {
    id: '12',
    type: 'multi_slider',
    text: 'Rate how naturally these strengths come to you (1-7)',
    sliders: [
      { id: 'st1', label: 'Analytical thinking', min: 1, max: 7 },
      { id: 'st2', label: 'Creative problem-solving', min: 1, max: 7 },
      { id: 'st3', label: 'Leading others', min: 1, max: 7 },
      { id: 'st4', label: 'Building relationships', min: 1, max: 7 },
      { id: 'st5', label: 'Learning new skills', min: 1, max: 7 },
      { id: 'st6', label: 'Teaching/mentoring', min: 1, max: 7 },
      { id: 'st7', label: 'Organizing systems', min: 1, max: 7 },
      { id: 'st8', label: 'Artistic expression', min: 1, max: 7 },
      { id: 'st9', label: 'Physical coordination', min: 1, max: 7 },
      { id: 'st10', label: 'Emotional sensitivity', min: 1, max: 7 },
    ],
    required: true,
    category: 'strengths_scale',
    order: 12,
  },
  { id: '13', type: 'open_text', text: 'When others seek your help, what do they most often ask you for?', required: true, category: 'others_help', order: 13 },
  { id: '14', type: 'open_text', text: 'What professional activities make you lose track of time because you enjoy doing it so much?', required: true, category: 'flow_work', order: 14 },
  { id: '15', type: 'open_text', text: "What other activities make you lose track of time because you're so engaged?", required: true, category: 'flow_other', order: 15 },
  {
    id: '16',
    type: 'select_with_inputs',
    text: 'What does professional success mean to you the most? Select the ones which resonate with you',
    options: [
      { id: 'o1', text: 'Financial security', value: 'financial', },
      { id: 'o2', text: 'Impact', value: 'impact' },
      { id: 'o3', text: 'Recognition', value: 'recognition' },
      { id: 'o4', text: 'Expertise', value: 'expertise' },
      { id: 'o5', text: 'Leadership', value: 'leadership' },
      { id: 'o6', text: 'Creativity', value: 'creativity' },
      { id: 'o7', text: 'Something else', value: 'other' },
    ],
    required: true,
    category: 'success',
    order: 16,
  },
  { id: '17', type: 'open_text', text: 'What skills or knowledge are you most excited to develop?', required: true, category: 'skills_excited', order: 17 },
  { id: '18', type: 'open_text', text: 'What skills or knowledge do you need to help accelerate your progress toward your professional aspirations?', required: true, category: 'skills_needed', order: 18 },
  { id: '19', type: 'open_text', text: 'If you feel called to solve any problems, what problems do you feel called to help solve?', required: true, category: 'called_problems', order: 19 },
  { id: '20', type: 'open_text', text: "What would you create, build, or change if resources weren't a constraint?", required: true, category: 'no_constraints', order: 20 },
  { id: '21', type: 'open_text', text: 'What change do you want to see in your industry or field?', required: true, category: 'industry_change', order: 21 },
  { id: '22', type: 'open_text', text: 'In your ideal job, what kind of goals/outcomes are a point of focus and priority for you?', required: true, category: 'ideal_job_goals', order: 22 },
  {
    id: '23',
    type: 'multi_text',
    text: "What kind of impact do you want your work to have on other people's lives?",
    fields: [
      { id: 'colleagues', label: 'Colleagues:', placeholder: 'If you are leading teams of people, what effect do you want to have on them?' },
      { id: 'clients', label: 'Clients:', placeholder: 'What kind of experience or value do you wish to provide to your clients?' },
      { id: 'communities', label: 'Communities:', placeholder: 'If your work affects greater communities, what impact do you want to have?' },
    ],
    required: true,
    category: 'impact',
    order: 23,
  },
  { id: '24', type: 'open_text', text: 'Imagine yourself 10 years from now, having achieved your most important career/life goals. Describe a typical day.', required: true, category: 'future_day', order: 24 },
  { id: '25', type: 'open_text', text: 'In this future version of your life, what are you most proud of having accomplished professionally?', required: true, category: 'future_proud', order: 25 },
  { id: '26', type: 'open_text', text: 'If you could only accomplish three major things professionally in the next five years, what would they be?', required: true, category: 'five_years', order: 26 },
  // Fillers to ensure 26 questions total (grouping related prompts)
  // Optional reflections (kept but will overflow beyond 26; comment out or renumber if needed)
  // { id: '27', type: 'open_text', text: 'What is one habit you will commit to building over the next 90 days?', required: false, category: 'habits', order: 27 },
  // { id: '28', type: 'open_text', text: 'Who or what inspires your professional journey the most and why?', required: false, category: 'inspiration', order: 28 },
  // { id: '29', type: 'open_text', text: 'Is there anything else we should know to help you realise your aspirations?', required: false, category: 'other', order: 29 },
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
      
      // Show success message
      AlertService.success('Assessment completed successfully! Your personality profile has been generated.');
      
      // Navigate to home immediately
      router.replace('/(tabs)/home');
    } catch (error) {
      console.error('Assessment submission error:', error);
      AlertService.error('Failed to submit assessment. Please try again.');
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

      case 'open_text':
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

      case 'multi_text':
        return (
          <View style={{ gap: Layout.spacing.md }}>
            {currentQuestion.fields?.map((f) => (
              <View key={f.id}>
                <Text style={{ color: Colors.text.primary, marginBottom: 6 }}>{f.label}</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder={f.placeholder || 'Type here...'}
                  value={(currentAnswer?.[f.id] as string) || ''}
                  onChangeText={(val) => handleAnswer({ ...(currentAnswer || {}), [f.id]: val })}
                  multiline
                  placeholderTextColor={Colors.text.tertiary}
                />
              </View>
            ))}
          </View>
        );

      case 'multi_slider':
        return (
          <View style={{ gap: Layout.spacing.md }}>
            {currentQuestion.sliders?.map((s) => {
              const min = s.min ?? 1;
              const max = s.max ?? 7;
              const current = currentAnswer?.[s.id] ?? Math.ceil((min + max) / 2);
              return (
                <View key={s.id}>
                  <Text style={{ color: Colors.text.primary, marginBottom: 6 }}>{s.label}</Text>
                  <View style={styles.sliderValues}>
                    {Array.from({ length: max - min + 1 }, (_, i) => i + min).map((value) => (
                      <TouchableOpacity
                        key={value}
                        style={[styles.sliderValue, current === value && styles.selectedSliderValue]}
                        onPress={() => handleAnswer({ ...(currentAnswer || {}), [s.id]: value })}
                      >
                        <Text style={[styles.sliderValueText, current === value && styles.selectedSliderValueText]}>{value}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        );

      case 'categorized_multi_select':
        return (
          <View style={{ gap: Layout.spacing.lg }}>
            {currentQuestion.categories?.map((cat) => {
              const selected = (currentAnswer?.[cat.id] as any[]) || [];
              const atMax = (cat.max ?? Infinity) <= selected.length;
              const toggle = (val: any) => {
                let next = selected.includes(val)
                  ? selected.filter((v) => v !== val)
                  : [...selected, val];
                if (cat.max && next.length > cat.max) return; // enforce limit
                handleAnswer({ ...(currentAnswer || {}), [cat.id]: next });
              };
              return (
                <View key={cat.id}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ color: Colors.text.primary, fontWeight: '600' }}>{cat.label}</Text>
                    {cat.max ? (
                      <Text style={{ color: Colors.text.secondary }}>{selected.length}/{cat.max} selected</Text>
                    ) : null}
                  </View>
                  <View style={styles.optionsContainer}>
                    {cat.options.map((opt) => {
                      const isSelected = selected.includes(opt.value);
                      const disabled = atMax && !isSelected;
                      return (
                        <TouchableOpacity
                          key={opt.id}
                          style={[
                            styles.optionButton,
                            isSelected && styles.selectedOption,
                            disabled && { opacity: 0.5 },
                          ]}
                          onPress={() => !disabled && toggle(opt.value)}
                        >
                          <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>{opt.text}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              );
            })}
          </View>
        );

      case 'select_with_inputs':
        return (
          <View style={{ gap: Layout.spacing.md }}>
            {currentQuestion.options?.map((opt) => {
              const selectedItems = currentAnswer || [];
              const found = selectedItems.find((i: any) => i.value === opt.value);
              const toggle = () => {
                if (found) {
                  handleAnswer(selectedItems.filter((i: any) => i.value !== opt.value));
                } else {
                  handleAnswer([...selectedItems, { value: opt.value, text: '' }]);
                }
              };
              return (
                <View key={opt.id}>
                  <TouchableOpacity style={[styles.optionButton, found && styles.selectedOption]} onPress={toggle}>
                    <Text style={[styles.optionText, found && styles.selectedOptionText]}>{opt.text}</Text>
                  </TouchableOpacity>
                  {found && (
                    <TextInput
                      style={[styles.textInput, { marginTop: 8 }]}
                      placeholder={
                        opt.value === 'financial' ? 'Define' :
                        opt.value === 'impact' ? 'what impact are you making?' :
                        opt.value === 'recognition' ? 'what is the recognition for?' :
                        opt.value === 'expertise' ? 'what are you an expert in?' :
                        opt.value === 'leadership' ? 'who are you leading? What are you leading?' :
                        opt.value === 'creativity' ? 'what are you creating?' :
                        'what is it?'
                      }
                      value={found.text}
                      onChangeText={(val) => {
                        const updated = selectedItems.map((i: any) => (i.value === opt.value ? { ...i, text: val } : i));
                        handleAnswer(updated);
                      }}
                      multiline
                      placeholderTextColor={Colors.text.tertiary}
                    />
                  )}
                </View>
              );
            })}
          </View>
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
      case 'ranking': {
        // If this is the values ranking step, derive options from step 5 selections
        let optionsForRanking = currentQuestion.options;
        if (currentQuestion.id === '9') {
          // Gather from steps 5-8
          const stepIds = ['5','6','7','8'];
          const selectedByCatAll = stepIds.map((id) => (responses.find((r) => r.questionId === id)?.answer as any) || {});
          const allSelectedValues: any[] = selectedByCatAll.flatMap((obj) => Object.values(obj)).flat();
          const indexByValue: Record<string, string> = {};
          const labelByValue: Record<string, string> = {};
          // Build lookup from defs (5-8)
          mockQuestions.filter((q) => ['5','6','7','8'].includes(q.id)).forEach((q) => {
            q.categories?.forEach((cat) => {
              cat.options.forEach((opt) => {
                indexByValue[String(opt.value)] = opt.id;
                labelByValue[String(opt.value)] = opt.text;
              });
            });
          });
          const unique = Array.from(new Set(allSelectedValues.map((v) => String(v))));
          optionsForRanking = unique.map((v) => ({ id: indexByValue[v] || v, text: labelByValue[v] || v, value: v }));
        }
        const selectedRanking = currentAnswer || [];
        return (
          <View style={styles.rankingContainer}>
            {optionsForRanking && optionsForRanking.length > 0 ? (
              optionsForRanking.map((option) => {
                const rankPosition = selectedRanking.findIndex((item: any) => item.value === option.value);
                const isRanked = rankPosition !== -1;
                return (
                  <TouchableOpacity
                    key={option.id}
                    style={[styles.rankingOption, isRanked && styles.rankedOption]}
                    onPress={() => {
                      let newRanking = [...selectedRanking];
                      if (isRanked) {
                        newRanking = newRanking.filter((item: any) => item.value !== option.value)
                          .map((item: any, idx: number) => ({ ...item, position: idx + 1 }));
                      } else {
                        newRanking.push({ value: option.value, text: option.text, position: newRanking.length + 1 });
                      }
                      handleAnswer(newRanking);
                    }}
                  >
                    <View style={styles.rankingContent}>
                      <View style={[styles.rankingNumber, isRanked && styles.rankedNumber]}>
                        <Text style={[styles.rankingNumberText, isRanked && styles.rankedNumberText]}>
                          {isRanked ? rankPosition + 1 : '?'}
                        </Text>
                      </View>
                      <Text style={[styles.rankingOptionText, isRanked && styles.rankedOptionText]}>
                        {option.text}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text style={{ color: Colors.text.secondary }}>
                Please select values in the previous step to rank them here.
              </Text>
            )}
          </View>
        );
      }

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
          onPress={() => {
            Alert.alert(
              'Exit Assessment', 
              'Are you sure you want to exit? Your progress will be lost.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Exit', onPress: () => router.back(), style: 'destructive' }
              ]
            );
          }}
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
        <TouchableOpacity
          style={[
            styles.nextButton,
            (!currentAnswer && currentQuestion.required) && styles.disabledButton,
          ]}
          onPress={async () => {
            console.log('Button clicked! Current question index:', currentQuestionIndex, 'Total:', mockQuestions.length);
            
            if (!currentAnswer && currentQuestion.required) {
              console.log('No answer provided');
              Alert.alert('Required', 'Please answer this question to continue.');
              return;
            }

            if (currentQuestionIndex === mockQuestions.length - 1) {
              // Last question - complete assessment
              console.log('Last question - completing assessment');
              setIsSubmitting(true);
              
              try {
                // Save the final response first
                const response: QuestionnaireResponse = {
                  questionId: currentQuestion.id,
                  answer: currentAnswer,
                  timestamp: new Date().toISOString(),
                };
                const finalResponses = [...responses.filter(r => r.questionId !== currentQuestion.id), response];
                
                // Create archetype based on responses (simplified)
                const mockArchetype = {
                  primary: 'thinker' as const,
                  secondary: 'creator' as const,
                  scores: { doer: 6, thinker: 9, creator: 8, helper: 5, persuader: 4, organiser: 7 },
                  description: 'You are a strategic thinker who thrives on solving complex problems and generating innovative solutions.',
                  strengths: ['Analytical thinking', 'Problem-solving', 'Innovation'],
                  growthAreas: ['Leadership skills', 'Communication', 'Team collaboration'],
                  careerSuggestions: ['Data Scientist', 'Research & Development', 'Strategy Consultant'],
                };

                await updateUser({
                  assessmentCompleted: true,
                  archetype: mockArchetype,
                });
                
                console.log('Assessment completed successfully! Navigating to dashboard...');
                
                // Small delay to show completion state, then navigate
                setTimeout(() => {
                  router.replace('/(tabs)/home');
                }, 1500);
                
              } catch (error) {
                console.error('Error completing assessment:', error);
                setIsSubmitting(false);
                Alert.alert('Error', 'Failed to complete assessment. Please try again.');
              }
            } else {
              // Regular next question logic
              console.log('Moving to next question');
              const response: QuestionnaireResponse = {
                questionId: currentQuestion.id,
                answer: currentAnswer,
                timestamp: new Date().toISOString(),
              };
              const updatedResponses = [...responses.filter(r => r.questionId !== currentQuestion.id), response];
              setResponses(updatedResponses);
              
              // Move to next question with animation
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
            }
          }}
          disabled={isSubmitting || (!currentAnswer && currentQuestion.required)}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestionIndex === mockQuestions.length - 1 
              ? (isSubmitting ? 'Analyzing...' : 'Complete Assessment')
              : 'Next'
            }
          </Text>
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
  completionButtons: {
    gap: Layout.spacing.md,
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