import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  PanResponder,
  Animated,
  Alert,
  LinearGradient,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';

const { height: screenHeight } = Dimensions.get('window');
const MIN_PANEL_HEIGHT = 100;
const DEFAULT_SPLIT = screenHeight * 0.5;

type PageType = 'archetypes' | 'skills' | 'generation' | 'preview' | 'workbench';

interface Archetype {
  id: string;
  name: string;
  percentage: number;
  isPrimary: boolean;
  subtitle: string;
  icon: string;
  gradient: string[];
}

interface Skill {
  id: string;
  name: string;
  relevance: string;
  priority: 'high' | 'medium' | 'low';
  isRecommended: boolean;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'skill_building' | 'project' | 'reflection';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readingMaterial?: string;
  tasks: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

const archetypes: Archetype[] = [
  {
    id: 'doer',
    name: 'Doer',
    percentage: 25,
    isPrimary: false,
    subtitle: 'Build tangible solutions',
    icon: 'hammer',
    gradient: ['#8B4513', '#228B22'],
  },
  {
    id: 'thinker',
    name: 'Thinker',
    percentage: 45,
    isPrimary: true,
    subtitle: 'Analyze and innovate',
    icon: 'bulb',
    gradient: ['#1E90FF', '#4682B4'],
  },
  {
    id: 'creator',
    name: 'Creator',
    percentage: 15,
    isPrimary: false,
    subtitle: 'Design and express',
    icon: 'color-palette',
    gradient: ['#9932CC', '#FF69B4'],
  },
  {
    id: 'helper',
    name: 'Helper',
    percentage: 20,
    isPrimary: false,
    subtitle: 'Support and guide',
    icon: 'heart',
    gradient: ['#FF6347', '#87CEEB'],
  },
  {
    id: 'persuader',
    name: 'Persuader',
    percentage: 30,
    isPrimary: false,
    subtitle: 'Lead and influence',
    icon: 'megaphone',
    gradient: ['#B22222', '#FF8C00'],
  },
  {
    id: 'organiser',
    name: 'Organiser',
    percentage: 10,
    isPrimary: false,
    subtitle: 'Structure and optimize',
    icon: 'clipboard',
    gradient: ['#2F4F4F', '#708090'],
  },
];

const skills: Skill[] = [
  {
    id: 'systems-thinking',
    name: 'Systems Thinking',
    relevance: 'Essential for analyzing complex business problems and understanding interconnected relationships.',
    priority: 'high',
    isRecommended: true,
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    relevance: 'Critical for making evidence-based decisions and identifying patterns in customer behavior.',
    priority: 'high',
    isRecommended: true,
  },
  {
    id: 'strategic-planning',
    name: 'Strategic Planning',
    relevance: 'Important for long-term vision and goal setting in leadership roles.',
    priority: 'medium',
    isRecommended: false,
  },
  {
    id: 'communication',
    name: 'Communication',
    relevance: 'Fundamental for presenting findings and influencing stakeholders.',
    priority: 'medium',
    isRecommended: false,
  },
];

const mockActivity: Activity = {
  id: '1',
  title: 'Strategic Communication in Leadership',
  description: 'Develop your ability to communicate strategic vision and inspire teams through clear, compelling messaging.',
  type: 'skill_building',
  difficulty: 'intermediate',
  readingMaterial: `# Strategic Communication in Leadership

## Introduction
Effective strategic communication is the cornerstone of successful leadership. It involves not just conveying information, but inspiring action, building trust, and aligning teams around a shared vision.

## Key Principles

### 1. Clarity Before Persuasion
Before you can convince others, you must be crystal clear about your message. This means:
- Defining your core message in one sentence
- Understanding your audience's perspective
- Identifying potential objections or concerns

### 2. Story-Driven Communication
Humans are wired to respond to stories. Great leaders use narrative to:
- Make complex ideas accessible
- Create emotional connection
- Help people remember key messages

### 3. Multi-Channel Approach
Strategic communication isn't just about what you say, but how and where you say it:
- Face-to-face conversations for sensitive topics
- Written communication for complex details
- Visual aids for data-heavy presentations
- Digital platforms for broad reach

## Practical Applications

### Team Meetings
Transform routine updates into strategic conversations by:
- Starting with the "why" behind initiatives
- Connecting day-to-day work to bigger goals
- Asking questions that prompt strategic thinking

### Change Management
When implementing organizational changes:
- Communicate the vision repeatedly
- Address concerns proactively
- Celebrate small wins along the way
- Be transparent about challenges

## Common Pitfalls to Avoid
- Information overload
- Inconsistent messaging
- One-size-fits-all communication
- Failing to listen and adapt

## Reflection Questions
1. What communication challenges do you face as a leader?
2. How can you better tailor your message to different audiences?
3. What stories can you use to illustrate your strategic vision?`,
  tasks: [
    {
      id: 'task1',
      title: 'Define Your Core Message',
      description: 'Write a one-sentence description of a strategic initiative you want to communicate to your team.',
    },
    {
      id: 'task2',
      title: 'Audience Analysis',
      description: 'Identify three different stakeholder groups and describe how you would tailor your message for each.',
    },
    {
      id: 'task3',
      title: 'Story Development',
      description: 'Create a brief story or example that illustrates the importance of your strategic initiative.',
    },
  ],
};

export default function WorkbenchScreen() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<PageType>('archetypes');
  const [selectedArchetype, setSelectedArchetype] = useState<Archetype | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [splitPosition, setSplitPosition] = useState(DEFAULT_SPLIT);
  const [activeTask, setActiveTask] = useState(0);
  const [taskResponses, setTaskResponses] = useState<{ [key: string]: string }>({});

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const newPosition = splitPosition + gestureState.dy;
        if (newPosition > MIN_PANEL_HEIGHT && newPosition < screenHeight - MIN_PANEL_HEIGHT) {
          setSplitPosition(newPosition);
        }
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const handleArchetypeSelect = (archetype: Archetype) => {
    setSelectedArchetype(archetype);
    setCurrentPage('skills');
  };

  const handleSkillToggle = (skillId: string) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(id => id !== skillId));
    } else if (selectedSkills.length < 2) {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  const handleStartGeneration = () => {
    if (selectedSkills.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one skill to develop.');
      return;
    }
    setCurrentPage('generation');
    startActivityGeneration();
  };

  const startActivityGeneration = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    
    const steps = [
      { progress: 25, message: 'Analyzing your archetype profile' },
      { progress: 50, message: 'Integrating selected skills focus' },
      { progress: 75, message: 'Finding verified reading materials' },
      { progress: 100, message: 'Crafting personalized questions' },
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGenerationProgress(step.progress);
    }
    
    setIsGenerating(false);
    setCurrentPage('preview');
  };

  const handleStartActivity = () => {
    setCurrentPage('workbench');
  };

  const handleSaveActivity = () => {
    Alert.alert(
      'Activity Saved Successfully ✓',
      'Systems Analysis for Customer Retention Strategy has been added to your Activity Library.',
      [
        { text: 'Launching ActivityPad…', onPress: () => setCurrentPage('workbench') }
      ]
    );
  };

  const handleTaskResponse = (taskId: string, response: string) => {
    setTaskResponses({ ...taskResponses, [taskId]: response });
  };

  const handleCompleteTask = () => {
    const currentTask = mockActivity.tasks[activeTask];
    const response = taskResponses[currentTask.id];
    
    if (!response?.trim()) {
      Alert.alert('Incomplete', 'Please provide a response before completing this task.');
      return;
    }

    Alert.alert(
      'Task Completed!',
      'Great work! Your response has been saved. Ready for the next task?',
      [
        { text: 'Continue', onPress: () => {
          if (activeTask < mockActivity.tasks.length - 1) {
            setActiveTask(activeTask + 1);
          } else {
            Alert.alert('Activity Complete!', 'You\'ve completed all tasks for this activity.');
          }
        }}
      ]
    );
  };

  const renderArchetypesPage = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Your Next Activity</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Choose the archetype you want to develop..</Text>
        
        <View style={styles.archetypeGrid}>
          {archetypes.map((archetype) => (
            <TouchableOpacity
              key={archetype.id}
              style={[
                styles.archetypeCard,
                archetype.isPrimary && styles.primaryArchetypeCard,
              ]}
              onPress={() => handleArchetypeSelect(archetype)}
            >
              <View style={[styles.archetypeGradient, { backgroundColor: archetype.gradient[0] }]}>
                <View style={styles.archetypeHeader}>
                  <View style={styles.percentageBadge}>
                    <Text style={styles.percentageText}>{archetype.percentage}%</Text>
                    {archetype.isPrimary && <Text style={styles.primaryLabel}>PRIMARY</Text>}
                  </View>
                  <Ionicons name={archetype.icon as any} size={32} color={Colors.text.inverse} />
                </View>
                <Text style={styles.archetypeName}>{archetype.name}</Text>
                <Text style={styles.archetypeSubtitle}>{archetype.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderSkillsPage = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentPage('archetypes')}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Skills to Develop</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.selectedArchetypeText}>{selectedArchetype?.name}</Text>
        <Text style={styles.skillsSubtitle}>Choose 1-2 recommended skills.</Text>
        
        <View style={styles.skillsList}>
          {skills.map((skill) => (
            <View key={skill.id} style={styles.skillCard}>
              <View style={styles.skillHeader}>
                <View style={styles.skillInfo}>
                  <Text style={styles.skillName}>{skill.name}</Text>
                  <View style={styles.priorityBadge}>
                    <Text style={styles.priorityText}>{skill.priority.toUpperCase()}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    selectedSkills.includes(skill.id) && styles.selectedButton,
                    selectedSkills.length >= 2 && !selectedSkills.includes(skill.id) && styles.disabledButton,
                  ]}
                  onPress={() => handleSkillToggle(skill.id)}
                  disabled={selectedSkills.length >= 2 && !selectedSkills.includes(skill.id)}
                >
                  <Text style={[
                    styles.selectButtonText,
                    selectedSkills.includes(skill.id) && styles.selectedButtonText,
                  ]}>
                    {selectedSkills.includes(skill.id) ? '✓' : 'Select'}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.skillRelevance}>Relevance: {skill.relevance}</Text>
            </View>
          ))}
        </View>

        <View style={styles.selectionCounter}>
          <Text style={styles.counterText}>{selectedSkills.length} of 2 skills selected</Text>
        </View>

        <TouchableOpacity style={styles.generateButton} onPress={handleStartGeneration}>
          <Text style={styles.generateButtonText}>Generate Activity</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  const renderGenerationPage = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentPage('skills')}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Activity</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.generationContent}>
        <Text style={styles.generationTitle}>We are creating a personalized learning activity based on your profile, values, and selected skills.</Text>
        
        <View style={styles.generationSteps}>
          <View style={[styles.step, generationProgress >= 25 && styles.completedStep]}>
            <Ionicons name="checkmark" size={20} color={generationProgress >= 25 ? Colors.success : Colors.text.secondary} />
            <Text style={styles.stepText}>Analyzing your archetype profile</Text>
          </View>
          <View style={[styles.step, generationProgress >= 50 && styles.completedStep]}>
            <Ionicons name="checkmark" size={20} color={generationProgress >= 50 ? Colors.success : Colors.text.secondary} />
            <Text style={styles.stepText}>Integrating selected skills focus</Text>
          </View>
          <View style={[styles.step, generationProgress >= 75 && styles.completedStep]}>
            <Ionicons name="checkmark" size={20} color={generationProgress >= 75 ? Colors.success : Colors.text.secondary} />
            <Text style={styles.stepText}>Finding verified reading materials</Text>
          </View>
          <View style={[styles.step, generationProgress >= 100 && styles.completedStep]}>
            <Ionicons name="checkmark" size={20} color={generationProgress >= 100 ? Colors.success : Colors.text.secondary} />
            <Text style={styles.stepText}>Crafting personalized questions</Text>
          </View>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${generationProgress}%` }]} />
        </View>

        <Text style={styles.estimatedTime}>Estimated completion: 2 minutes</Text>
      </View>
    </SafeAreaView>
  );

  const renderPreviewPage = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentPage('generation')}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Personalized Activity</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.activityPreview}>
          <Text style={styles.activityTitle}>Systems Analysis for Customer Retention Strategy</Text>
          <Text style={styles.activityDescription}>
            Design and implement a systematic approach to analyzing customer retention data while developing strategic thinking frameworks for data-driven decision making.
          </Text>
          
          <View style={styles.activityMeta}>
            <Text style={styles.metaText}>Skills Developed: Systems Thinking, Data Analysis</Text>
            <Text style={styles.metaText}>Duration: 6 hours across 4 phases</Text>
            <Text style={styles.metaText}>Archetype Focus: Thinker (Primary)</Text>
          </View>

          <View style={styles.phasesContainer}>
            <Text style={styles.phasesTitle}>Phase-by-Phase Breakdown</Text>
            <View style={styles.phaseItem}>
              <Text style={styles.phaseTitle}>Phase 1: Foundation (1.5 hours)</Text>
              <Text style={styles.phaseDescription}>Step 1: Systems Thinking Fundamentals (45 min)</Text>
              <Text style={styles.phaseDescription}>Step 2: Data Analysis Principles (45 min)</Text>
            </View>
            <View style={styles.phaseItem}>
              <Text style={styles.phaseTitle}>Phase 2: Analysis Framework (2 hours)</Text>
              <Text style={styles.phaseDescription}>Step 1: Systems Thinking Fundamentals (45 min)</Text>
              <Text style={styles.phaseDescription}>Step 2: Data Analysis Principles (45 min)</Text>
            </View>
            <View style={styles.phaseItem}>
              <Text style={styles.phaseTitle}>Phase 3: Data Implementation (2 hours)</Text>
              <Text style={styles.phaseDescription}>Step 1: Systems Thinking Fundamentals (45 min)</Text>
              <Text style={styles.phaseDescription}>Step 2: Data Analysis Principles (45 min)</Text>
            </View>
            <View style={styles.phaseItem}>
              <Text style={styles.phaseTitle}>Phase 4: Strategic Synthesis (30 minutes)</Text>
              <Text style={styles.phaseDescription}>Step 1: Systems Thinking Fundamentals (45 min)</Text>
              <Text style={styles.phaseDescription}>Step 2: Data Analysis Principles (45 min)</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.startButton} onPress={handleStartActivity}>
              <Text style={styles.startButtonText}>Start Activity</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSaveActivity}>
              <Text style={styles.saveButtonText}>Save for Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const renderWorkbenchPage = () => (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentPage('archetypes')}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workbench</Text>
        <TouchableOpacity onPress={() => setCurrentPage('archetypes')} disabled={isGenerating}>
          <Ionicons 
            name="add-circle" 
            size={24} 
            color={isGenerating ? Colors.text.tertiary : Colors.primary.goldenYellow} 
          />
        </TouchableOpacity>
      </View>

      {/* Activity Display Panel */}
      <View style={[styles.activityPanel, { height: splitPosition }]}>
        <View style={styles.activityHeader}>
          <View>
            <Text style={styles.activityTitle}>{mockActivity.title}</Text>
            <Text style={styles.activityMeta}>
              {mockActivity.type.replace('_', ' ')} • {mockActivity.difficulty}
            </Text>
          </View>
          <View style={styles.difficultyBadge}>
            <Text style={styles.difficultyText}>
              {mockActivity.difficulty.charAt(0).toUpperCase() + mockActivity.difficulty.slice(1)}
            </Text>
          </View>
        </View>

        <ScrollView style={styles.readingContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.readingText}>{mockActivity.readingMaterial}</Text>
        </ScrollView>
      </View>

      {/* Drag Handle */}
      <View style={styles.dragHandle} {...panResponder.panHandlers}>
        <View style={styles.dragIndicator} />
      </View>

      {/* WorkPad Panel */}
      <View style={[styles.workpadPanel, { height: screenHeight - splitPosition - 60 }]}>
        <View style={styles.workpadHeader}>
          <Text style={styles.workpadTitle}>WorkPad</Text>
          <View style={styles.taskNavigation}>
            <TouchableOpacity
              onPress={() => setActiveTask(Math.max(0, activeTask - 1))}
              disabled={activeTask === 0}
              style={[styles.navButton, activeTask === 0 && styles.disabledButton]}
            >
              <Ionicons 
                name="chevron-back" 
                size={20} 
                color={activeTask === 0 ? Colors.text.tertiary : Colors.text.primary} 
              />
            </TouchableOpacity>
            
            <Text style={styles.taskCounter}>
              {activeTask + 1} / {mockActivity.tasks.length}
            </Text>
            
            <TouchableOpacity
              onPress={() => setActiveTask(Math.min(mockActivity.tasks.length - 1, activeTask + 1))}
              disabled={activeTask === mockActivity.tasks.length - 1}
              style={[styles.navButton, activeTask === mockActivity.tasks.length - 1 && styles.disabledButton]}
            >
              <Ionicons 
                name="chevron-forward" 
                size={20} 
                color={activeTask === mockActivity.tasks.length - 1 ? Colors.text.tertiary : Colors.text.primary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.taskContent} showsVerticalScrollIndicator={false}>
          <View style={styles.taskCard}>
            <Text style={styles.taskTitle}>{mockActivity.tasks[activeTask].title}</Text>
            <Text style={styles.taskDescription}>{mockActivity.tasks[activeTask].description}</Text>
            
            <View style={styles.responseSection}>
              <Text style={styles.responseLabel}>Your Response:</Text>
              <TextInput
                style={styles.responseInput}
                placeholder="Type your response here..."
                value={taskResponses[mockActivity.tasks[activeTask].id] || ''}
                onChangeText={(text) => handleTaskResponse(mockActivity.tasks[activeTask].id, text)}
                multiline
                placeholderTextColor={Colors.text.tertiary}
              />
            </View>

            <TouchableOpacity style={styles.completeButton} onPress={handleCompleteTask}>
              <Text style={styles.completeButtonText}>Complete Task</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Progress Indicators */}
        <View style={styles.progressSection}>
          <View style={styles.progressDots}>
            {mockActivity.tasks.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.progressDot,
                  index === activeTask && styles.activeDot,
                  taskResponses[mockActivity.tasks[index].id] && styles.completedDot,
                ]}
              />
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );

  // Main render logic
  switch (currentPage) {
    case 'archetypes':
      return renderArchetypesPage();
    case 'skills':
      return renderSkillsPage();
    case 'generation':
      return renderGenerationPage();
    case 'preview':
      return renderPreviewPage();
    case 'workbench':
      return renderWorkbenchPage();
    default:
      return renderArchetypesPage();
  }
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  headerTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  activityPanel: {
    backgroundColor: Colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  activityTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  activityMeta: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textTransform: 'capitalize',
  },
  difficultyBadge: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.full,
  },
  difficultyText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  readingContent: {
    flex: 1,
    padding: Layout.spacing.lg,
  },
  readingText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  dragHandle: {
    height: 20,
    backgroundColor: Colors.neutral.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: Colors.neutral.gray400,
    borderRadius: Layout.borderRadius.sm,
  },
  workpadPanel: {
    backgroundColor: Colors.background.primary,
  },
  workpadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  workpadTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  taskNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  navButton: {
    width: Layout.touchTarget.small,
    height: Layout.touchTarget.small,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.borderRadius.full,
    backgroundColor: Colors.background.secondary,
  },
  disabledButton: {
    opacity: 0.3,
  },
  taskCounter: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
  },
  taskContent: {
    flex: 1,
  },
  taskCard: {
    margin: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
  },
  taskTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  taskDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Layout.spacing.lg,
  },
  responseSection: {
    marginBottom: Layout.spacing.lg,
  },
  responseLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  responseInput: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  completeButton: {
    backgroundColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
    minHeight: Layout.touchTarget.medium,
  },
  completeButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  progressSection: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.neutral.gray300,
  },
  activeDot: {
    backgroundColor: Colors.primary.goldenYellow,
  },
  completedDot: {
    backgroundColor: Colors.success,
  },
  // New styles for archetype selection
  content: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  subtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xl,
    textAlign: 'center',
  },
  archetypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Layout.spacing.md,
  },
  archetypeCard: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: Layout.borderRadius.md,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: Colors.text.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryArchetypeCard: {
    width: '48%',
    elevation: 4,
    shadowOpacity: 0.2,
  },
  archetypeGradient: {
    flex: 1,
    padding: Layout.spacing.md,
    justifyContent: 'space-between',
  },
  archetypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  percentageBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  percentageText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
  },
  primaryLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
    marginTop: Layout.spacing.xs,
  },
  archetypeName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.inverse,
    marginBottom: Layout.spacing.xs,
  },
  archetypeSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.inverse,
    opacity: 0.9,
  },
  // Skills selection styles
  selectedArchetypeText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
    textAlign: 'center',
  },
  skillsSubtitle: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xl,
    textAlign: 'center',
  },
  skillsList: {
    gap: Layout.spacing.md,
    marginBottom: Layout.spacing.xl,
  },
  skillCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  skillInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  skillName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  priorityBadge: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  priorityText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  selectButton: {
    backgroundColor: Colors.background.primary,
    borderWidth: 1,
    borderColor: Colors.primary.navyBlue,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
  },
  selectedButton: {
    backgroundColor: Colors.primary.navyBlue,
  },
  disabledButton: {
    opacity: 0.3,
  },
  selectButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary.navyBlue,
  },
  selectedButtonText: {
    color: Colors.text.inverse,
  },
  skillRelevance: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  selectionCounter: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  counterText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  generateButton: {
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  // Generation page styles
  generationContent: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.xl,
    justifyContent: 'center',
  },
  generationTitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Layout.spacing.xl,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.lg,
  },
  generationSteps: {
    gap: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.md,
  },
  completedStep: {
    opacity: 1,
  },
  stepText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.neutral.gray200,
    borderRadius: Layout.borderRadius.sm,
    marginBottom: Layout.spacing.lg,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.sm,
  },
  estimatedTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  // Preview page styles
  activityPreview: {
    paddingBottom: Layout.spacing.xl,
  },
  activityTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  activityDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Layout.spacing.lg,
  },
  activityMeta: {
    backgroundColor: Colors.background.secondary,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.xl,
  },
  metaText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  phasesContainer: {
    marginBottom: Layout.spacing.xl,
  },
  phasesTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.lg,
  },
  phaseItem: {
    backgroundColor: Colors.background.secondary,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.md,
  },
  phaseTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  phaseDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  startButton: {
    flex: 1,
    backgroundColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.lg,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.navyBlue,
  },
});