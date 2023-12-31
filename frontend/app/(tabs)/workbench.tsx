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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';

const { height: screenHeight } = Dimensions.get('window');
const MIN_PANEL_HEIGHT = 100;
const DEFAULT_SPLIT = screenHeight * 0.5;

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
  const [splitPosition, setSplitPosition] = useState(DEFAULT_SPLIT);
  const [activeTask, setActiveTask] = useState(0);
  const [taskResponses, setTaskResponses] = useState<{ [key: string]: string }>({});
  const [isGenerating, setIsGenerating] = useState(false);

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

  const handleGenerateActivity = async () => {
    setIsGenerating(true);
    try {
      // Mock AI activity generation - in real app this would call XAI API
      Alert.alert(
        'New Activity Generated!',
        'Based on your archetype and preferences, we\'ve created a personalized leadership development activity.',
        [{ text: 'Start Activity', onPress: () => {} }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate activity. Please try again.');
    } finally {
      setIsGenerating(false);
    }
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Workbench</Text>
        <TouchableOpacity onPress={handleGenerateActivity} disabled={isGenerating}>
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
});