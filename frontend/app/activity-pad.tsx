import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Image,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../store/useAuthStore';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';

const { width: screenWidth } = Dimensions.get('window');

type TabType = 'my-activities' | 'activity-pad' | 'portfolio-items';

interface Activity {
  id: string;
  title: {
    description: string;
    skillFocus: string[];
  };
  objectives: Array<{
    category: string;
    outcome: string;
  }>;
  duration: {
    total: string;
    totalHours: number;
    phases: number;
    breakdown: Array<{
      phase: number;
      duration: string;
      hours: number;
    }>;
  };
  phases: Phase[];
  resources: {
    readingMaterials: Resource[];
    additionalTools: string[];
  };
  followUpTasks: FollowUpTask[];
  status: 'completed' | 'in_progress' | 'not_started';
  progress: number;
  createdAt: string;
  completedAt?: string;
}

interface Phase {
  id: string;
  title: string;
  duration: string;
  steps: Step[];
}

interface Step {
  id: string;
  title: string;
  duration: string;
  focus: string;
  readingMaterial?: ReadingMaterial;
  guidingQuestions: string[];
}

interface ReadingMaterial {
  title: string;
  author: string;
  url: string;
  type: string;
  verified: string;
  keyQuote: string;
}

interface Resource {
  id: string;
  title: string;
  author: string;
  url: string;
  type: string;
  verified: string;
  accessType: string;
  description: string;
  relevance: string;
}

interface FollowUpTask {
  id: string;
  category: string;
  description: string;
  estimatedDuration: string;
  complexity: string;
}

interface ActivityResponse {
  stepId: string;
  questionIndex: number;
  response: string;
  wordCount: number;
  timestamp: string;
}

interface PortfolioItemDraft {
  id: string;
  title: string;
  description: string;
  type: 'resume' | 'cover_letter' | 'portfolio' | 'certificate';
  selectedResponses: string[];
  generatedContent: string;
  isGenerating: boolean;
  createdAt: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: 'resume' | 'cover_letter' | 'portfolio' | 'certificate';
  createdAt: string;
  fileUrl?: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    title: {
      description: 'Develop your ability to communicate strategic vision and inspire teams through clear, compelling messaging.',
      skillFocus: ['Communication', 'Leadership', 'Strategic Thinking']
    },
    objectives: [
      {
        category: 'Communication Skills',
        outcome: 'Develop clear and compelling strategic messaging'
      },
      {
        category: 'Leadership',
        outcome: 'Build trust and align teams around shared vision'
      },
      {
        category: 'Strategic Thinking',
        outcome: 'Connect day-to-day work to bigger goals'
      }
    ],
    duration: {
      total: '6 hours',
      totalHours: 6,
      phases: 4,
      breakdown: [
        { phase: 1, duration: '1.5 hours', hours: 1.5 },
        { phase: 2, duration: '2 hours', hours: 2 },
        { phase: 3, duration: '2 hours', hours: 2 },
        { phase: 4, duration: '30 minutes', hours: 0.5 }
      ]
    },
    phases: [
      {
        id: 'phase-1',
        title: 'Foundation',
        duration: '1.5 hours',
        steps: [
          {
            id: 'step-1',
            title: 'Systems Thinking Fundamentals',
            duration: '45 min',
            focus: 'Understanding interconnected business systems',
            readingMaterial: {
              title: 'Introduction to Systems Thinking',
              author: 'Peter Senge',
              url: 'https://example.com/systems-thinking',
              type: 'Book',
              verified: 'Yes',
              keyQuote: 'Systems thinking is a discipline for seeing wholes rather than parts.'
            },
            guidingQuestions: [
              'How do different departments in your organization interact with customer retention?',
              'What are the key feedback loops in your customer journey?',
              'How do external factors influence your retention rates?',
              'What system-wide changes could improve customer loyalty?'
            ]
          },
          {
            id: 'step-2',
            title: 'Data Analysis Principles',
            duration: '45 min',
            focus: 'Framework for customer data interpretation',
            readingMaterial: {
              title: 'Analytics for Business Decision Making',
              author: 'Harvard Business Review',
              url: 'https://example.com/analytics-guide',
              type: 'Article',
              verified: 'Yes',
              keyQuote: 'Data without context is just numbers; data with context becomes insight.'
            },
            guidingQuestions: [
              'What key metrics do you currently track for customer retention?',
              'How do you distinguish between correlation and causation in your data?',
              'What data sources are most reliable for retention analysis?',
              'How do you validate the accuracy of your retention metrics?'
            ]
          }
        ]
      },
      {
        id: 'phase-2',
        title: 'Analysis Framework',
        duration: '2 hours',
        steps: [
          {
            id: 'step-3',
            title: 'Framework Development',
            duration: '60 min',
            focus: 'Building systematic analysis approaches',
            readingMaterial: {
              title: 'Strategic Analysis Methods',
              author: 'McKinsey & Company',
              url: 'https://example.com/strategic-analysis',
              type: 'Report',
              verified: 'Yes',
              keyQuote: 'A good framework provides structure without constraining creativity.'
            },
            guidingQuestions: [
              'What framework will you use to analyze customer retention patterns?',
              'How will you segment your customer base for analysis?',
              'What time periods are most relevant for your retention analysis?',
              'How will you prioritize different retention factors?'
            ]
          },
          {
            id: 'step-4',
            title: 'Data Integration',
            duration: '60 min',
            focus: 'Connecting multiple data sources',
            readingMaterial: {
              title: 'Data Integration Best Practices',
              author: 'MIT Technology Review',
              url: 'https://example.com/data-integration',
              type: 'Research Paper',
              verified: 'Yes',
              keyQuote: 'The value of data increases exponentially when properly integrated.'
            },
            guidingQuestions: [
              'What data sources will you integrate for comprehensive analysis?',
              'How will you ensure data quality across different systems?',
              'What tools will you use to connect disparate data sources?',
              'How will you handle data privacy and security requirements?'
            ]
          }
        ]
      },
      {
        id: 'phase-3',
        title: 'Data Implementation',
        duration: '2 hours',
        steps: [
          {
            id: 'step-5',
            title: 'Data Collection',
            duration: '60 min',
            focus: 'Gathering relevant retention data',
            readingMaterial: {
              title: 'Customer Data Collection Strategies',
              author: 'Forrester Research',
              url: 'https://example.com/data-collection',
              type: 'White Paper',
              verified: 'Yes',
              keyQuote: 'Quality data collection is the foundation of meaningful analysis.'
            },
            guidingQuestions: [
              'What specific data points will you collect for retention analysis?',
              'How will you ensure data accuracy during collection?',
              'What sampling methods will you use for large datasets?',
              'How will you handle missing or incomplete data?'
            ]
          },
          {
            id: 'step-6',
            title: 'Analysis Execution',
            duration: '60 min',
            focus: 'Applying analytical methods to real data',
            readingMaterial: {
              title: 'Advanced Analytics Techniques',
              author: 'Stanford Business School',
              url: 'https://example.com/advanced-analytics',
              type: 'Academic Paper',
              verified: 'Yes',
              keyQuote: 'The best analysis combines statistical rigor with business intuition.'
            },
            guidingQuestions: [
              'What analytical methods will you apply to your retention data?',
              'How will you identify key patterns and trends?',
              'What statistical tests will you use to validate your findings?',
              'How will you present your analysis results clearly?'
            ]
          }
        ]
      },
      {
        id: 'phase-4',
        title: 'Strategic Synthesis',
        duration: '30 minutes',
        steps: [
          {
            id: 'step-7',
            title: 'Synthesis & Recommendations',
            duration: '30 min',
            focus: 'Synthesizing findings into actionable strategies',
            readingMaterial: {
              title: 'Strategic Communication of Insights',
              author: 'Deloitte Insights',
              url: 'https://example.com/strategic-communication',
              type: 'Industry Report',
              verified: 'Yes',
              keyQuote: 'Insights without action are just interesting observations.'
            },
            guidingQuestions: [
              'What are your key findings from the retention analysis?',
              'What specific recommendations will you make to improve retention?',
              'How will you prioritize your recommendations by impact?',
              'What implementation timeline do you propose for your strategies?'
            ]
          }
        ]
      }
    ],
    resources: {
      readingMaterials: [
        {
          id: 'resource-1',
          title: 'The Fifth Discipline',
          author: 'Peter Senge',
          url: 'https://example.com/fifth-discipline',
          type: 'Book',
          verified: 'Yes',
          accessType: 'Free',
          description: 'Comprehensive guide to systems thinking in organizations',
          relevance: 'Essential for understanding systems thinking principles'
        },
        {
          id: 'resource-2',
          title: 'Customer Analytics for Dummies',
          author: 'Jeff Sauro',
          url: 'https://example.com/customer-analytics',
          type: 'Book',
          verified: 'Yes',
          accessType: 'Paid',
          description: 'Practical guide to customer data analysis',
          relevance: 'Great for beginners in customer analytics'
        }
      ],
      additionalTools: [
        'Excel/Google Sheets for data analysis',
        'Tableau for data visualization',
        'Customer survey tools',
        'CRM system integration',
        'Statistical analysis software'
      ]
    },
    followUpTasks: [
      {
        id: 'followup-1',
        category: 'Implementation',
        description: 'Implement recommended retention strategies',
        estimatedDuration: '2 weeks',
        complexity: 'Medium'
      },
      {
        id: 'followup-2',
        category: 'Monitoring',
        description: 'Set up ongoing retention monitoring',
        estimatedDuration: '1 week',
        complexity: 'Low'
      }
    ],
    status: 'completed',
    progress: 100,
    createdAt: '2024-01-15',
    completedAt: '2024-01-20',
  },
  {
    id: '2',
    title: {
      description: 'Design a comprehensive teacher professional development program tailored to innovative pedagogy and social-emotional learning integration.',
      skillFocus: ['Educational Leadership and Policy', 'Advanced Pedagogy and Andragogy', 'Teacher Professional Development Design', 'Community Engagement and Partnership Building']
    },
    objectives: [
      {
        category: 'Educational Leadership',
        outcome: 'Develop comprehensive PD program design skills'
      },
      {
        category: 'Pedagogy',
        outcome: 'Integrate innovative teaching methods'
      },
      {
        category: 'Community Engagement',
        outcome: 'Build partnerships for educational impact'
      }
    ],
    duration: {
      total: '3.5 hours',
      totalHours: 3.5,
      phases: 4,
      breakdown: [
        { phase: 1, duration: '30 minutes', hours: 0.5 },
        { phase: 2, duration: '1 hour', hours: 1 },
        { phase: 3, duration: '1 hour', hours: 1 },
        { phase: 4, duration: '1 hour', hours: 1 }
      ]
    },
    status: 'in_progress',
    progress: 25,
    createdAt: '2024-01-22',
    phases: [
      {
        id: 'phase-1',
        title: 'Orientation and Selection',
        duration: '30 minutes',
        steps: [
          {
            id: 'step-1',
            title: 'Choosing Your PD Focus',
            duration: '30 minutes',
            focus: 'Identify a specific area for teacher PD that aligns with your vision for educational innovation and teacher passion.',
            readingMaterial: {
              title: 'Teacher professional learning and development',
              author: 'Helen Timperley',
              url: 'http://www.iaoed.org/downloads/EdPractices_18.pdf',
              type: 'PDF',
              verified: 'Yes',
              keyQuote: 'Professional learning opportunities that have little impact on student outcomes typically focus on mastery of specific teaching skills without checking whether the use of those skills has the desired effect on students. (Timperley, 2008, p. 8)'
            },
            guidingQuestions: [
              'What specific topic or skill (e.g., integrating arts into curriculum or fostering student purpose) will you choose as the object for your teacher PD program to enhance professionalism and passion?',
              'How does this chosen focus connect to valued student outcomes like excellence and justice in education, drawing on the principle of focusing on student needs from pages 8-9 of the reading?',
              'Why is this topic meaningful for your goal of leading teacher development in a way that expands your influence?',
              'What initial assumptions do you have about how this PD could ignite teacher passion, based on your experience?'
            ]
          }
        ]
      },
      {
        id: 'phase-2',
        title: 'Core Design Elements',
        duration: '1 hour',
        steps: [
          {
            id: 'step-2',
            title: 'Structuring Content and Activities',
            duration: '30 minutes',
            focus: 'Develop the foundational content and learning activities for your PD program using evidence-based strategies.',
            readingMaterial: {
              title: 'Effective Teacher Professional Development',
              author: 'Linda Darling-Hammond, Maria E. Hyler, Madelyn Gardner',
              url: 'https://learningpolicyinstitute.org/sites/default/files/product-files/Effective_Teacher_Professional_Development_BRIEF.pdf',
              type: 'PDF',
              verified: 'Yes',
              keyQuote: 'We define effective PD as structured professional learning that results in changes to teacher practices and improvements in student learning outcomes. (Darling-Hammond et al., 2017, p. 1)'
            },
            guidingQuestions: [
              'For your selected PD topic, what key teaching strategies will you emphasize to promote innovation and excellence, using content focus principles from pages 1-2 of the reading?',
              'How will you incorporate active learning elements, like hands-on practice with real classroom examples, to build teacher skills and purpose in their role?',
              'What models or examples from your vision (e.g., peer lesson planning) can you include to demonstrate high standards, drawing on modeling features from pages 3-4?',
              'How does this structure ensure the PD aligns with truth-seeking through evidence-based practices for your initiative?'
            ]
          },
          {
            id: 'step-3',
            title: 'Incorporating Collaboration',
            duration: '30 minutes',
            focus: 'Plan collaborative aspects to foster community and equity in teacher learning.',
            readingMaterial: {
              title: 'An Integrative Approach to Professional Development to Support College- and Career-Readiness Standards',
              author: 'Katie Pak, Laura M. Desimone, Arianna Parsons',
              url: 'https://files.eric.ed.gov/fulltext/EJ1265332.pdf',
              type: 'PDF',
              verified: 'Yes',
              keyQuote: 'District leaders agreed that the state\'s new CCR standards called for significant shifts in teacher practice... (Pak et al., 2020, p. 8)'
            },
            guidingQuestions: [
              'How will you design collective participation in your PD, such as including diverse teachers and leaders, to promote justice and fairness from pages 9-11 of the reading?',
              'What collaborative activities, like group discussions on equity challenges, will you include to support your goal of improving teacher passion?',
              'In what ways can this collaboration expand your influence as a leader in teacher development?',
              'How will you ensure the activities challenge teachers\' assumptions for meaningful growth, aligned with purpose?'
            ]
          }
        ]
      },
      {
        id: 'phase-3',
        title: 'Implementation Planning',
        duration: '1 hour',
        steps: [
          {
            id: 'step-4',
            title: 'Support and Feedback Mechanisms',
            duration: '30 minutes',
            focus: 'Outline coaching, feedback, and reflection to sustain teacher engagement.',
            readingMaterial: {
              title: 'Effective Teacher Professional Development',
              author: 'Linda Darling-Hammond, Maria E. Hyler, Madelyn Gardner',
              url: 'https://learningpolicyinstitute.org/sites/default/files/product-files/Effective_Teacher_Professional_Development_BRIEF.pdf',
              type: 'PDF',
              verified: 'Yes',
              keyQuote: 'In the process of making their work public and critiquing others, teachers learn how to make implicit rules and expectations explicit... (Darling-Hammond et al., 2017, p. 5)'
            },
            guidingQuestions: [
              'For your PD program, what coaching or expert support will you provide to help teachers apply new skills, using feedback principles from pages 4-5 of the reading?',
              'How will you build in reflection opportunities, like post-session journals, to reinforce excellence and innovation in teaching?',
              'What role will this play in achieving your vision of passionate, professional teachers under your leadership?',
              'How can these mechanisms address equity for all participants in your initiative?'
            ]
          },
          {
            id: 'step-5',
            title: 'Sustainability Strategies',
            duration: '30 minutes',
            focus: 'Ensure long-term impact through ongoing opportunities and leadership.',
            readingMaterial: {
              title: 'Teacher professional learning and development',
              author: 'Helen Timperley',
              url: 'http://www.iaoed.org/downloads/EdPractices_18.pdf',
              type: 'PDF',
              verified: 'Yes',
              keyQuote: 'Change appears to be promoted by a cyclical process in which teachers have their current assumptions challenged... (Timperley, 2008, p. 18)'
            },
            guidingQuestions: [
              'How will you structure sustained duration for your PD, such as follow-up sessions over months, drawing on principles from pages 15 and 24 of the reading?',
              'What leadership actions will you take to maintain momentum and align with your purpose of systemic influence?',
              'In what ways will this sustainability foster justice by supporting ongoing teacher growth?',
              'How does this connect to your desire for expanding influence in educational leadership?'
            ]
          }
        ]
      },
      {
        id: 'phase-4',
        title: 'Summative Integration',
        duration: '1 hour',
        steps: [
          {
            id: 'step-6',
            title: 'Evaluation and Refinement',
            duration: '30 minutes',
            focus: 'Create assessment tools to measure PD effectiveness and refine for future use.',
            readingMaterial: {
              title: 'An Integrative Approach to Professional Development to Support College- and Career-Readiness Standards',
              author: 'Katie Pak, Laura M. Desimone, Arianna Parsons',
              url: 'https://files.eric.ed.gov/fulltext/EJ1265332.pdf',
              type: 'PDF',
              verified: 'Yes',
              keyQuote: 'By including general teachers in district-wide PD sessions for SWDs and ELs, district leaders described \'trying to get all of our teachers better informed\'... (Pak et al., 2020, p. 9)'
            },
            guidingQuestions: [
              'What evaluation methods, like surveys on teacher passion or classroom observations, will you use for your PD, informed by sustained coherence from pages 12-14 of the reading?',
              'How will you measure alignment with values like excellence and justice in outcomes?',
              'What refinements based on feedback will enhance your leadership role?',
              'How does this evaluation tie back to your chosen focus for overall impact?'
            ]
          },
          {
            id: 'step-7',
            title: 'Final PD Plan Assembly',
            duration: '30 minutes',
            focus: 'Compile all elements into an actionable PD blueprint for implementation.',
            readingMaterial: {
              title: 'Teacher professional learning and development',
              author: 'Helen Timperley',
              url: 'http://www.iaoed.org/downloads/EdPractices_18.pdf',
              type: 'PDF',
              verified: 'Yes',
              keyQuote: 'Professional learning opportunities that have little impact on student outcomes typically focus on mastery of specific teaching skills... (Timperley, 2008, p. 8)'
            },
            guidingQuestions: [
              'How will you integrate all phases into a cohesive PD plan document for your topic, ensuring it promotes purpose and innovation?',
              'What key actionable steps emerge from this design to advance your goal of teacher professionalism?',
              'In what ways does this plan position you as a leader expanding influence in your current phase?',
              'Reflect: How does the final product align with your values of truth and fairness?'
            ]
          }
        ]
      }
    ],
    resources: {
      readingMaterials: [
        {
          id: 'resource-1',
          title: 'Teacher professional learning and development',
          author: 'Helen Timperley',
          url: 'http://www.iaoed.org/downloads/EdPractices_18.pdf',
          type: 'PDF',
          verified: 'Yes',
          accessType: 'Direct free download',
          description: 'A synthesis of research on effective PD principles focused on student outcomes and teacher inquiry.',
          relevance: 'Provides evidence-based principles for designing PD that aligns with purpose, excellence, and justice, supporting systemic teacher growth.'
        },
        {
          id: 'resource-2',
          title: 'Effective Teacher Professional Development',
          author: 'Linda Darling-Hammond, Maria E. Hyler, Madelyn Gardner',
          url: 'https://learningpolicyinstitute.org/sites/default/files/product-files/Effective_Teacher_Professional_Development_BRIEF.pdf',
          type: 'PDF',
          verified: 'Yes',
          accessType: 'Direct free download',
          description: 'Research brief outlining seven features of effective PD based on rigorous studies.',
          relevance: 'Offers practical frameworks for content, collaboration, and sustainability, integrating innovation and equity for leadership in teacher development.'
        },
        {
          id: 'resource-3',
          title: 'An Integrative Approach to Professional Development to Support College- and Career-Readiness Standards',
          author: 'Katie Pak, Laura M. Desimone, Arianna Parsons',
          url: 'https://files.eric.ed.gov/fulltext/EJ1265332.pdf',
          type: 'PDF',
          verified: 'Yes',
          accessType: 'Direct free download',
          description: 'Study on revised PD models for standards implementation, emphasizing collaboration and coherence.',
          relevance: 'Connects PD design to equity and excellence, aiding in creating inclusive programs that expand influence.'
        }
      ],
      additionalTools: [
        'Educational planning software',
        'Survey and assessment tools',
        'Collaboration platforms',
        'Professional development tracking systems'
      ]
    },
    followUpTasks: [
      {
        id: 'followup-1',
        category: 'Implementation',
        description: 'Pilot a small-scale version of your PD plan with 3-5 colleagues, gathering initial feedback on engagement and impact.',
        estimatedDuration: '2 hours',
        complexity: 'Medium'
      },
      {
        id: 'followup-2',
        category: 'Refinement',
        description: 'Revise your PD plan based on pilot insights, focusing on enhancing elements of justice and innovation.',
        estimatedDuration: '1 hour',
        complexity: 'Low'
      },
      {
        id: 'followup-3',
        category: 'Networking',
        description: 'Share your PD plan with a mentor or educational leader for advice on scaling it within your organization.',
        estimatedDuration: '30 minutes',
        complexity: 'Medium'
      },
      {
        id: 'followup-4',
        category: 'Application',
        description: 'Integrate one key principle from the activity into an existing teacher meeting to test real-world influence.',
        estimatedDuration: '1 hour',
        complexity: 'Low'
      }
    ]
  },
  {
    id: '3',
    title: {
      description: 'Enhance your ability to work effectively in diverse teams and manage group dynamics.',
      skillFocus: ['Teamwork', 'Communication', 'Conflict Resolution']
    },
    objectives: [
      {
        category: 'Teamwork',
        outcome: 'Develop effective collaboration skills'
      },
      {
        category: 'Communication',
        outcome: 'Improve team communication strategies'
      },
      {
        category: 'Conflict Resolution',
        outcome: 'Learn to manage group dynamics'
      }
    ],
    duration: {
      total: '4 hours',
      totalHours: 4,
      phases: 3,
      breakdown: [
        { phase: 1, duration: '1.5 hours', hours: 1.5 },
        { phase: 2, duration: '1.5 hours', hours: 1.5 },
        { phase: 3, duration: '1 hour', hours: 1 }
      ]
    },
    phases: [],
    resources: {
      readingMaterials: [],
      additionalTools: []
    },
    followUpTasks: [],
    status: 'not_started',
    progress: 0,
    createdAt: '2024-01-25',
  },
];

const mockPortfolioItems: PortfolioItem[] = [
  {
    id: '1',
    title: 'Senior Developer Resume',
    description: 'Updated resume highlighting technical skills and leadership experience',
    type: 'resume',
    createdAt: '2024-01-20',
  },
  {
    id: '2',
    title: 'Project Management Cover Letter',
    description: 'Tailored cover letter for project management positions',
    type: 'cover_letter',
    createdAt: '2024-01-18',
  },
  {
    id: '3',
    title: 'Data Analysis Portfolio',
    description: 'Collection of data analysis projects and visualizations',
    type: 'portfolio',
    createdAt: '2024-01-15',
  },
];

const mockCurrentActivity: Activity = {
  id: '2',
  title: {
    description: 'Design a comprehensive teacher professional development program tailored to innovative pedagogy and social-emotional learning integration.',
    skillFocus: ['Educational Leadership and Policy', 'Advanced Pedagogy and Andragogy', 'Teacher Professional Development Design', 'Community Engagement and Partnership Building']
  },
  objectives: [
    {
      category: 'Educational Leadership',
      outcome: 'Develop comprehensive PD program design skills'
    },
    {
      category: 'Pedagogy',
      outcome: 'Integrate innovative teaching methods'
    },
    {
      category: 'Community Engagement',
      outcome: 'Build partnerships for educational impact'
    }
  ],
  duration: {
    total: '3.5 hours',
    totalHours: 3.5,
    phases: 4,
    breakdown: [
      { phase: 1, duration: '30 minutes', hours: 0.5 },
      { phase: 2, duration: '1 hour', hours: 1 },
      { phase: 3, duration: '1 hour', hours: 1 },
      { phase: 4, duration: '1 hour', hours: 1 }
    ]
  },
  status: 'in_progress',
  progress: 25,
  createdAt: '2024-01-22',
  phases: [
    {
      id: 'phase-1',
      title: 'Orientation and Selection',
      duration: '30 minutes',
      steps: [
        {
          id: 'step-1',
          title: 'Choosing Your PD Focus',
          duration: '30 minutes',
          focus: 'Identify a specific area for teacher PD that aligns with your vision for educational innovation and teacher passion.',
          readingMaterial: {
            title: 'Teacher professional learning and development',
            author: 'Helen Timperley',
            url: 'http://www.iaoed.org/downloads/EdPractices_18.pdf',
            type: 'PDF',
            verified: 'Yes',
            keyQuote: 'Professional learning opportunities that have little impact on student outcomes typically focus on mastery of specific teaching skills without checking whether the use of those skills has the desired effect on students. (Timperley, 2008, p. 8)'
          },
          guidingQuestions: [
            'What specific topic or skill (e.g., integrating arts into curriculum or fostering student purpose) will you choose as the object for your teacher PD program to enhance professionalism and passion?',
            'How does this chosen focus connect to valued student outcomes like excellence and justice in education, drawing on the principle of focusing on student needs from pages 8-9 of the reading?',
            'Why is this topic meaningful for your goal of leading teacher development in a way that expands your influence?',
            'What initial assumptions do you have about how this PD could ignite teacher passion, based on your experience?'
          ]
        }
      ]
    },
    {
      id: 'phase-2',
      title: 'Core Design Elements',
      duration: '1 hour',
      steps: [
        {
          id: 'step-2',
          title: 'Structuring Content and Activities',
          duration: '30 minutes',
          focus: 'Develop the foundational content and learning activities for your PD program using evidence-based strategies.',
          readingMaterial: {
            title: 'Effective Teacher Professional Development',
            author: 'Linda Darling-Hammond, Maria E. Hyler, Madelyn Gardner',
            url: 'https://learningpolicyinstitute.org/sites/default/files/product-files/Effective_Teacher_Professional_Development_BRIEF.pdf',
            type: 'PDF',
            verified: 'Yes',
            keyQuote: 'We define effective PD as structured professional learning that results in changes to teacher practices and improvements in student learning outcomes. (Darling-Hammond et al., 2017, p. 1)'
          },
          guidingQuestions: [
            'For your selected PD topic, what key teaching strategies will you emphasize to promote innovation and excellence, using content focus principles from pages 1-2 of the reading?',
            'How will you incorporate active learning elements, like hands-on practice with real classroom examples, to build teacher skills and purpose in their role?',
            'What models or examples from your vision (e.g., peer lesson planning) can you include to demonstrate high standards, drawing on modeling features from pages 3-4?',
            'How does this structure ensure the PD aligns with truth-seeking through evidence-based practices for your initiative?'
          ]
        },
        {
          id: 'step-3',
          title: 'Incorporating Collaboration',
          duration: '30 minutes',
          focus: 'Plan collaborative aspects to foster community and equity in teacher learning.',
          readingMaterial: {
            title: 'An Integrative Approach to Professional Development to Support College- and Career-Readiness Standards',
            author: 'Katie Pak, Laura M. Desimone, Arianna Parsons',
            url: 'https://files.eric.ed.gov/fulltext/EJ1265332.pdf',
            type: 'PDF',
            verified: 'Yes',
            keyQuote: 'District leaders agreed that the state\'s new CCR standards called for significant shifts in teacher practice... (Pak et al., 2020, p. 8)'
          },
          guidingQuestions: [
            'How will you design collective participation in your PD, such as including diverse teachers and leaders, to promote justice and fairness from pages 9-11 of the reading?',
            'What collaborative activities, like group discussions on equity challenges, will you include to support your goal of improving teacher passion?',
            'In what ways can this collaboration expand your influence as a leader in teacher development?',
            'How will you ensure the activities challenge teachers\' assumptions for meaningful growth, aligned with purpose?'
          ]
        }
      ]
    },
    {
      id: 'phase-3',
      title: 'Implementation Planning',
      duration: '1 hour',
      steps: [
        {
          id: 'step-4',
          title: 'Support and Feedback Mechanisms',
          duration: '30 minutes',
          focus: 'Outline coaching, feedback, and reflection to sustain teacher engagement.',
          readingMaterial: {
            title: 'Effective Teacher Professional Development',
            author: 'Linda Darling-Hammond, Maria E. Hyler, Madelyn Gardner',
            url: 'https://learningpolicyinstitute.org/sites/default/files/product-files/Effective_Teacher_Professional_Development_BRIEF.pdf',
            type: 'PDF',
            verified: 'Yes',
            keyQuote: 'In the process of making their work public and critiquing others, teachers learn how to make implicit rules and expectations explicit... (Darling-Hammond et al., 2017, p. 5)'
          },
          guidingQuestions: [
            'For your PD program, what coaching or expert support will you provide to help teachers apply new skills, using feedback principles from pages 4-5 of the reading?',
            'How will you build in reflection opportunities, like post-session journals, to reinforce excellence and innovation in teaching?',
            'What role will this play in achieving your vision of passionate, professional teachers under your leadership?',
            'How can these mechanisms address equity for all participants in your initiative?'
          ]
        },
        {
          id: 'step-5',
          title: 'Sustainability Strategies',
          duration: '30 minutes',
          focus: 'Ensure long-term impact through ongoing opportunities and leadership.',
          readingMaterial: {
            title: 'Teacher professional learning and development',
            author: 'Helen Timperley',
            url: 'http://www.iaoed.org/downloads/EdPractices_18.pdf',
            type: 'PDF',
            verified: 'Yes',
            keyQuote: 'Change appears to be promoted by a cyclical process in which teachers have their current assumptions challenged... (Timperley, 2008, p. 18)'
          },
          guidingQuestions: [
            'How will you structure sustained duration for your PD, such as follow-up sessions over months, drawing on principles from pages 15 and 24 of the reading?',
            'What leadership actions will you take to maintain momentum and align with your purpose of systemic influence?',
            'In what ways will this sustainability foster justice by supporting ongoing teacher growth?',
            'How does this connect to your desire for expanding influence in educational leadership?'
          ]
        }
      ]
    },
    {
      id: 'phase-4',
      title: 'Summative Integration',
      duration: '1 hour',
      steps: [
        {
          id: 'step-6',
          title: 'Evaluation and Refinement',
          duration: '30 minutes',
          focus: 'Create assessment tools to measure PD effectiveness and refine for future use.',
          readingMaterial: {
            title: 'An Integrative Approach to Professional Development to Support College- and Career-Readiness Standards',
            author: 'Katie Pak, Laura M. Desimone, Arianna Parsons',
            url: 'https://files.eric.ed.gov/fulltext/EJ1265332.pdf',
            type: 'PDF',
            verified: 'Yes',
            keyQuote: 'By including general teachers in district-wide PD sessions for SWDs and ELs, district leaders described \'trying to get all of our teachers better informed\'... (Pak et al., 2020, p. 9)'
          },
          guidingQuestions: [
            'What evaluation methods, like surveys on teacher passion or classroom observations, will you use for your PD, informed by sustained coherence from pages 12-14 of the reading?',
            'How will you measure alignment with values like excellence and justice in outcomes?',
            'What refinements based on feedback will enhance your leadership role?',
            'How does this evaluation tie back to your chosen focus for overall impact?'
          ]
        },
        {
          id: 'step-7',
          title: 'Final PD Plan Assembly',
          duration: '30 minutes',
          focus: 'Compile all elements into an actionable PD blueprint for implementation.',
          readingMaterial: {
            title: 'Teacher professional learning and development',
            author: 'Helen Timperley',
            url: 'http://www.iaoed.org/downloads/EdPractices_18.pdf',
            type: 'PDF',
            verified: 'Yes',
            keyQuote: 'Professional learning opportunities that have little impact on student outcomes typically focus on mastery of specific teaching skills... (Timperley, 2008, p. 8)'
          },
          guidingQuestions: [
            'How will you integrate all phases into a cohesive PD plan document for your topic, ensuring it promotes purpose and innovation?',
            'What key actionable steps emerge from this design to advance your goal of teacher professionalism?',
            'In what ways does this plan position you as a leader expanding influence in your current phase?',
            'Reflect: How does the final product align with your values of truth and fairness?'
          ]
        }
      ]
    }
  ],
  resources: {
    readingMaterials: [
      {
        id: 'resource-1',
        title: 'Teacher professional learning and development',
        author: 'Helen Timperley',
        url: 'http://www.iaoed.org/downloads/EdPractices_18.pdf',
        type: 'PDF',
        verified: 'Yes',
        accessType: 'Direct free download',
        description: 'A synthesis of research on effective PD principles focused on student outcomes and teacher inquiry.',
        relevance: 'Provides evidence-based principles for designing PD that aligns with purpose, excellence, and justice, supporting systemic teacher growth.'
      },
      {
        id: 'resource-2',
        title: 'Effective Teacher Professional Development',
        author: 'Linda Darling-Hammond, Maria E. Hyler, Madelyn Gardner',
        url: 'https://learningpolicyinstitute.org/sites/default/files/product-files/Effective_Teacher_Professional_Development_BRIEF.pdf',
        type: 'PDF',
        verified: 'Yes',
        accessType: 'Direct free download',
        description: 'Research brief outlining seven features of effective PD based on rigorous studies.',
        relevance: 'Offers practical frameworks for content, collaboration, and sustainability, integrating innovation and equity for leadership in teacher development.'
      },
      {
        id: 'resource-3',
        title: 'An Integrative Approach to Professional Development to Support College- and Career-Readiness Standards',
        author: 'Katie Pak, Laura M. Desimone, Arianna Parsons',
        url: 'https://files.eric.ed.gov/fulltext/EJ1265332.pdf',
        type: 'PDF',
        verified: 'Yes',
        accessType: 'Direct free download',
        description: 'Study on revised PD models for standards implementation, emphasizing collaboration and coherence.',
        relevance: 'Connects PD design to equity and excellence, aiding in creating inclusive programs that expand influence.'
      }
    ],
    additionalTools: [
      'Educational planning software',
      'Survey and assessment tools',
      'Collaboration platforms',
      'Professional development tracking systems'
    ]
  },
  followUpTasks: [
    {
      id: 'followup-1',
      category: 'Implementation',
      description: 'Pilot a small-scale version of your PD plan with 3-5 colleagues, gathering initial feedback on engagement and impact.',
      estimatedDuration: '2 hours',
      complexity: 'Medium'
    },
    {
      id: 'followup-2',
      category: 'Refinement',
      description: 'Revise your PD plan based on pilot insights, focusing on enhancing elements of justice and innovation.',
      estimatedDuration: '1 hour',
      complexity: 'Low'
    },
    {
      id: 'followup-3',
      category: 'Networking',
      description: 'Share your PD plan with a mentor or educational leader for advice on scaling it within your organization.',
      estimatedDuration: '30 minutes',
      complexity: 'Medium'
    },
    {
      id: 'followup-4',
      category: 'Application',
      description: 'Integrate one key principle from the activity into an existing teacher meeting to test real-world influence.',
      estimatedDuration: '1 hour',
      complexity: 'Low'
    }
  ]
};

export default function ActivityPadScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('activity-pad');
  const [activityResponses, setActivityResponses] = useState<ActivityResponse[]>([]);
  const [showContentSelection, setShowContentSelection] = useState(false);
  const [showAIGeneration, setShowAIGeneration] = useState(false);
  const [showPortfolioEditor, setShowPortfolioEditor] = useState(false);
  const [selectedResponses, setSelectedResponses] = useState<string[]>([]);
  const [portfolioDraft, setPortfolioDraft] = useState<PortfolioItemDraft | null>(null);
  const [aiProgress, setAiProgress] = useState(0);
  const [expandedPhases, setExpandedPhases] = useState<{ [key: string]: boolean }>({});
  const [expandedSteps, setExpandedSteps] = useState<{ [key: string]: boolean }>({});
  const [questionResponses, setQuestionResponses] = useState<{ [key: string]: string }>({});
  const [completedQuestions, setCompletedQuestions] = useState<{ [key: string]: boolean }>({});
  const [savedPortfolioItems, setSavedPortfolioItems] = useState<PortfolioItem[]>(mockPortfolioItems);
  const [userActivities, setUserActivities] = useState<Activity[]>(mockActivities);
  const [currentActivityId, setCurrentActivityId] = useState<string>('2');
  const autoSaveInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-save functionality
  useEffect(() => {
    autoSaveInterval.current = setInterval(() => {
      if (activityResponses.length > 0) {
        // Auto-save responses to incomplete activities
        console.log('Auto-saving activity responses...');
        // In a real app, this would save to a backend or local storage
      }
    }, 30000); // 30 seconds

    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
    };
  }, [activityResponses]);

  const updateResponse = (stepId: string, questionIndex: number, response: string) => {
    const wordCount = response.trim().split(/\s+/).length;
    const newResponse: ActivityResponse = {
      stepId,
      questionIndex,
      response,
      wordCount,
      timestamp: new Date().toISOString(),
    };

    setActivityResponses(prev => {
      const existingIndex = prev.findIndex(r => r.stepId === stepId && r.questionIndex === questionIndex);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newResponse;
        return updated;
      }
      return [...prev, newResponse];
    });
  };

  const getResponseForQuestion = (stepId: string, questionIndex: number): string => {
    const questionId = `${stepId}-${questionIndex}`;
    return questionResponses[questionId] || '';
  };

  const getAllResponses = (): ActivityResponse[] => {
    return activityResponses;
  };

  const handleCreatePortfolioItem = () => {
    // Check if there are any responses in the new questionResponses structure
    const hasResponses = Object.keys(questionResponses).some(key => questionResponses[key]?.trim().length > 0);
    
    if (!hasResponses) {
      Alert.alert('No Responses', 'Please complete some activity questions before creating a portfolio item.');
      return;
    }
    
    // Get all question IDs that have responses
    const responseKeys = Object.keys(questionResponses).filter(key => questionResponses[key]?.trim().length > 0);
    setSelectedResponses(responseKeys);
    setShowContentSelection(true);
  };

  const handleContentSelectionContinue = () => {
    setShowContentSelection(false);
    setShowAIGeneration(true);
    simulateAIGeneration();
  };

  const simulateAIGeneration = () => {
    setAiProgress(0);
    const steps = [
      { progress: 20, text: 'Collecting your activity responses' },
      { progress: 40, text: 'Analyzing content themes and flow' },
      { progress: 60, text: 'Organizing into coherent structure' },
      { progress: 80, text: 'Formatting for professional presentation' },
      { progress: 100, text: 'Generating executive summary' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setAiProgress(steps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(interval);
        setShowAIGeneration(false);
        setShowPortfolioEditor(true);
        // Generate mock portfolio content
        setPortfolioDraft({
          id: 'draft-' + Date.now(),
          title: 'Teacher Professional Development Program Design',
          description: 'A comprehensive PD program design based on evidence-based practices',
          type: 'portfolio',
          selectedResponses: selectedResponses,
          generatedContent: 'Generated portfolio content based on your responses...',
          isGenerating: false,
          createdAt: new Date().toISOString()
        });
      }
    }, 1000);
  };

  const handleSaveToPortfolio = () => {
    if (portfolioDraft) {
      // Create a new portfolio item from the draft
      const newPortfolioItem: PortfolioItem = {
        id: portfolioDraft.id,
        title: portfolioDraft.title,
        description: portfolioDraft.description,
        type: portfolioDraft.type,
        createdAt: portfolioDraft.createdAt,
        fileUrl: undefined // No file URL for now
      };
      
      // Add to saved portfolio items
      setSavedPortfolioItems(prev => [newPortfolioItem, ...prev]);
      
      Alert.alert('Success', 'Portfolio item saved successfully!');
      setShowPortfolioEditor(false);
      setPortfolioDraft(null);
    }
  };

  const togglePhaseExpansion = (phaseId: string) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const handleQuestionResponse = (questionId: string, response: string) => {
    setQuestionResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const handleCompleteQuestion = (questionId: string) => {
    const response = questionResponses[questionId];
    if (!response?.trim()) {
      Alert.alert('Incomplete', 'Please provide a response before completing this question.');
      return;
    }
    
    setCompletedQuestions(prev => ({
      ...prev,
      [questionId]: true
    }));
    
    // Update activity progress and save to user activities
    updateActivityProgress();
    
    Alert.alert(
      'Question Completed!',
      'Your response has been saved to My Activities.',
      [{ text: 'Continue', onPress: () => {} }]
    );
  };

  const updateActivityProgress = () => {
    const currentActivity = userActivities.find(activity => activity.id === currentActivityId);
    if (!currentActivity) return;

    // Calculate total questions for the activity
    const totalQuestions = currentActivity.phases?.reduce((total, phase) => {
      return total + phase.steps.reduce((stepTotal, step) => {
        return stepTotal + step.guidingQuestions.length;
      }, 0);
    }, 0) || 0;

    // Count completed questions for this activity
    const completedCount = Object.keys(completedQuestions).filter(questionId => {
      // Check if this question belongs to the current activity
      return questionId.includes(currentActivityId) && completedQuestions[questionId];
    }).length;

    const newProgress = totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;
    
    // Update the activity in userActivities
    setUserActivities(prev => prev.map(activity => {
      if (activity.id === currentActivityId) {
        return {
          ...activity,
          progress: newProgress,
          status: newProgress === 100 ? 'completed' : 'in_progress',
          completedAt: newProgress === 100 ? new Date().toISOString() : undefined
        };
      }
      return activity;
    }));
  };

  const getCurrentActivity = (): Activity => {
    return userActivities.find(activity => activity.id === currentActivityId) || mockCurrentActivity;
  };

  const handleStartActivity = (activityId: string) => {
    setCurrentActivityId(activityId);
    setActiveTab('activity-pad');
  };

  const handleContinueActivity = (activityId: string) => {
    setCurrentActivityId(activityId);
    setActiveTab('activity-pad');
    
    // Load existing responses for this activity
    loadActivityResponses(activityId);
  };

  const loadActivityResponses = (activityId: string) => {
    // In a real app, this would load from storage/backend
    // For now, we'll simulate loading existing responses
    const activity = userActivities.find(a => a.id === activityId);
    if (activity) {
      // Load any existing responses for this activity
      // This would typically come from a database or local storage
      console.log(`Loading responses for activity ${activityId}`);
    }
  };


  const renderMyActivities = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Completed Activities</Text>
        {userActivities
          .filter(activity => activity.status === 'completed')
          .map(activity => (
            <TouchableOpacity 
              key={activity.id} 
              style={styles.activityCard}
              onPress={() => handleContinueActivity(activity.id)}
            >
              <View style={styles.activityHeader}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title.description}</Text>
                  <Text style={styles.activityDescription}>Skills: {activity.title.skillFocus.join(', ')}</Text>
                </View>
                <View style={styles.completedBadge}>
                  <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                </View>
              </View>
              <View style={styles.activityMeta}>
                <Text style={styles.metaText}>Completed: {activity.completedAt}</Text>
                <Text style={styles.metaText}>Duration: {activity.duration.total}</Text>
              </View>
              <View style={styles.skillsContainer}>
                {activity.title.skillFocus.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>In Progress</Text>
        {userActivities
          .filter(activity => activity.status === 'in_progress')
          .map(activity => (
            <TouchableOpacity 
              key={activity.id} 
              style={styles.activityCard}
              onPress={() => handleContinueActivity(activity.id)}
            >
              <View style={styles.activityHeader}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title.description}</Text>
                  <Text style={styles.activityDescription}>Skills: {activity.title.skillFocus.join(', ')}</Text>
                </View>
                <View style={styles.progressBadge}>
                  <Text style={styles.progressText}>{activity.progress}%</Text>
                </View>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${activity.progress}%` }]} />
              </View>
              <View style={styles.activityMeta}>
                <Text style={styles.metaText}>Started: {activity.createdAt}</Text>
                <Text style={styles.metaText}>Remaining: {activity.duration.total}</Text>
              </View>
              <View style={styles.continueButtonContainer}>
                <Text style={styles.continueButtonText}>Tap to continue →</Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Not Started</Text>
        {userActivities
          .filter(activity => activity.status === 'not_started')
          .map(activity => (
            <TouchableOpacity 
              key={activity.id} 
              style={styles.activityCard}
              onPress={() => handleStartActivity(activity.id)}
            >
              <View style={styles.activityHeader}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{activity.title.description}</Text>
                  <Text style={styles.activityDescription}>Skills: {activity.title.skillFocus.join(', ')}</Text>
                </View>
                <TouchableOpacity style={styles.startButton}>
                  <Text style={styles.startButtonText}>Start</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.activityMeta}>
                <Text style={styles.metaText}>Estimated: {activity.duration.total}</Text>
                <Text style={styles.metaText}>Phases: {activity.duration.phases}</Text>
              </View>
            </TouchableOpacity>
          ))}
      </View>
    </ScrollView>
  );

  const renderActivityPad = () => {
    const currentActivity = getCurrentActivity();
    
    return (
      <View style={styles.activityPadContainer}>
        {/* Fixed Progress Bar */}
        <View style={styles.fixedProgressBar}>
          <View style={styles.progressContainer}>
            <Text style={styles.fixedProgressText}>
              {currentActivity.title.description}
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${currentActivity.progress}%` }]} />
            </View>
            <Text style={styles.fixedProgressPercentage}>{currentActivity.progress}% Complete</Text>
          </View>
        </View>

        <ScrollView style={[styles.tabContent, styles.scrollViewWithFixedBar]} showsVerticalScrollIndicator={false}>
          <View style={styles.currentActivityCard}>
          <View style={styles.activityHeader}>
            <View style={styles.activityInfo}>
              <Text style={styles.currentActivityTitle}>{currentActivity.title.description}</Text>
              <Text style={styles.currentActivityDescription}>{currentActivity.title.description}</Text>
            </View>
            <View style={styles.difficultyBadge}>
              <Text style={styles.difficultyText}>Advanced</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPercentage}>{currentActivity.progress}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${currentActivity.progress}%` }]} />
            </View>
          </View>

          <View style={styles.skillsContainer}>
            <Text style={styles.skillsLabel}>Skills Being Developed:</Text>
            <View style={styles.skillsRow}>
              {currentActivity.title.skillFocus.map((skill, index) => (
                <View key={index} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.activityMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.metaText}>{currentActivity.duration.total}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color={Colors.text.secondary} />
              <Text style={styles.metaText}>Started {currentActivity.createdAt}</Text>
            </View>
          </View>

          <View style={styles.phasesSection}>
            <Text style={styles.phasesTitle}>Activity Phases</Text>
            {currentActivity.phases?.map((phase, phaseIndex) => (
            <View key={phase.id} style={styles.phaseCard}>
              <TouchableOpacity 
                style={styles.phaseHeader}
                onPress={() => togglePhaseExpansion(phase.id)}
              >
                <View style={styles.phaseHeaderContent}>
                  <Text style={styles.phaseNumber}>{phaseIndex + 1}</Text>
                  <View style={styles.phaseInfo}>
                    <Text style={styles.phaseTitle}>{phase.title}</Text>
                    <Text style={styles.phaseDuration}>{phase.duration} • {phase.steps.length} steps</Text>
                  </View>
                </View>
                <Ionicons 
                  name={expandedPhases[phase.id] ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color={Colors.text.secondary} 
                />
              </TouchableOpacity>
              
              {expandedPhases[phase.id] && (
                <View style={styles.phaseDetails}>
                  {phase.steps.map((step, stepIndex) => (
                    <View key={step.id} style={styles.stepCard}>
                      <TouchableOpacity 
                        style={[styles.stepHeaderNew, expandedSteps[step.id] && styles.expandedStepHeader]}
                        onPress={() => toggleStepExpansion(step.id)}
                      >
                        <View style={styles.stepHeaderContent}>
                          <Text style={styles.stepNumber}>{stepIndex + 1}</Text>
                          <View style={styles.stepInfo}>
                            <Text style={styles.stepTitle}>{step.title}</Text>
                            <Text style={styles.stepDuration}>{step.duration}</Text>
                          </View>
                        </View>
                        <Ionicons 
                          name={expandedSteps[step.id] ? "chevron-up" : "chevron-down"} 
                          size={16} 
                          color={Colors.text.secondary} 
                        />
                      </TouchableOpacity>
                      
                      {expandedSteps[step.id] && (
                        <View style={styles.stepDetailsNew}>
                          <View style={styles.readingSectionNew}>
                            <Text style={styles.sectionLabelNew}>Reading Material:</Text>
                            <Text style={styles.readingTitleNew}>"{step.readingMaterial?.title}"</Text>
                            <Text style={styles.readingAuthorNew}>by {step.readingMaterial?.author}</Text>
                            <Text style={styles.readingQuoteNew}>"{step.readingMaterial?.keyQuote}"</Text>
                          </View>
                          
                          <View style={styles.focusSectionNew}>
                            <Text style={styles.sectionLabelNew}>Focus:</Text>
                            <Text style={styles.focusText}>{step.focus}</Text>
                          </View>
                          
                          <View style={styles.questionsSectionNew}>
                            <Text style={styles.sectionLabelNew}>Guiding Questions:</Text>
                            {step.guidingQuestions.map((question, questionIndex) => {
                              const questionId = `${currentActivityId}-${phase.id}-${step.id}-${questionIndex}`;
                              const currentResponse = questionResponses[questionId] || '';
                              const isCompleted = completedQuestions[questionId];
                              
                              return (
                                <View key={questionIndex} style={styles.questionItem}>
                                  <Text style={styles.questionNumber}>{questionIndex + 1}.</Text>
                                  <Text style={styles.questionText}>{question}</Text>
                                  
                                  <View style={styles.responseSection}>
                                    <Text style={styles.responseLabel}>Your Response:</Text>
                                    <TextInput
                                      style={styles.responseInput}
                                      placeholder="Type your response here..."
                                      value={currentResponse}
                                      onChangeText={(text) => handleQuestionResponse(questionId, text)}
                                      multiline
                                      placeholderTextColor={Colors.text.tertiary}
                                    />
                                    
                                    <TouchableOpacity 
                                      style={[styles.completeButton, isCompleted && styles.completedButton]} 
                                      onPress={() => handleCompleteQuestion(questionId)}
                                    >
                                      <Text style={styles.completeButtonText}>
                                        {isCompleted ? '✓ Completed' : 'Complete Question'}
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              );
                            })}
                          </View>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {currentActivity.resources && currentActivity.resources.readingMaterials.length > 0 && (
          <View style={styles.resourcesSection}>
            <Text style={styles.resourcesTitle}>Resources</Text>
            {currentActivity.resources.readingMaterials.map((resource) => (
              <View key={resource.id} style={styles.resourceCard}>
                <View style={styles.resourceHeader}>
                  <Text style={styles.resourceTitle}>{resource.title}</Text>
                  <View style={styles.resourceTypeBadge}>
                    <Text style={styles.resourceTypeText}>{resource.type}</Text>
                  </View>
                </View>
                <Text style={styles.resourceAuthor}>by {resource.author}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
                <Text style={styles.resourceRelevance}>{resource.relevance}</Text>
                <TouchableOpacity style={styles.resourceLink}>
                  <Ionicons name="link-outline" size={16} color={Colors.primary.navyBlue} />
                  <Text style={styles.resourceLinkText}>Access Resource</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {currentActivity.followUpTasks && currentActivity.followUpTasks.length > 0 && (
          <View style={styles.followUpSection}>
            <Text style={styles.followUpTitle}>Follow-up Tasks</Text>
            {currentActivity.followUpTasks.map((task) => (
              <View key={task.id} style={styles.followUpCard}>
                <View style={styles.followUpHeader}>
                  <Text style={styles.followUpCategory}>{task.category}</Text>
                  <View style={styles.followUpMeta}>
                    <Text style={styles.followUpDuration}>{task.estimatedDuration}</Text>
                    <View style={[styles.complexityBadge, { backgroundColor: task.complexity === 'Low' ? Colors.success : task.complexity === 'Medium' ? Colors.primary.goldenYellow : Colors.primary.warmOrange }]}>
                      <Text style={styles.complexityText}>{task.complexity}</Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.followUpDescription}>{task.description}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.portfolioCreationSection}>
          <Text style={styles.portfolioCreationTitle}>Create Portfolio Item</Text>
          <Text style={styles.portfolioCreationDescription}>
            Transform your activity responses into a professional portfolio piece that you can attach to job applications.
          </Text>
          <TouchableOpacity 
            style={styles.createPortfolioButton}
            onPress={handleCreatePortfolioItem}
          >
            <Ionicons name="create-outline" size={24} color={Colors.text.inverse} />
            <Text style={styles.createPortfolioButtonText}>Create Portfolio Item</Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
  };

  const renderPortfolioItems = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Portfolio Items</Text>
        {savedPortfolioItems.map(item => (
          <View key={item.id} style={styles.portfolioCard}>
            <View style={styles.portfolioHeader}>
              <View style={styles.portfolioInfo}>
                <Text style={styles.portfolioTitle}>{item.title}</Text>
                <Text style={styles.portfolioDescription}>{item.description}</Text>
              </View>
              <View style={styles.portfolioTypeBadge}>
                <Text style={styles.portfolioTypeText}>
                  {item.type.replace('_', ' ').toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.portfolioMeta}>
              <Text style={styles.metaText}>Created: {item.createdAt}</Text>
              <View style={styles.portfolioActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="eye-outline" size={16} color={Colors.primary.navyBlue} />
                  <Text style={styles.actionButtonText}>View</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="download-outline" size={16} color={Colors.primary.navyBlue} />
                  <Text style={styles.actionButtonText}>Download</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="share-outline" size={16} color={Colors.primary.navyBlue} />
                  <Text style={styles.actionButtonText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addPortfolioButton}>
        <Ionicons name="add-circle-outline" size={24} color={Colors.primary.navyBlue} />
        <Text style={styles.addPortfolioText}>Add New Portfolio Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ActivityPad</Text>
        <View style={{ width: 24 }} />
      </View>

      {activeTab === 'my-activities' && renderMyActivities()}
      {activeTab === 'activity-pad' && renderActivityPad()}
      {activeTab === 'portfolio-items' && renderPortfolioItems()}

      {/* Bottom Tabs */}
      <View style={styles.bottomTabsContainer}>
        <TouchableOpacity
          style={[styles.bottomTab, activeTab === 'my-activities' && styles.activeBottomTab]}
          onPress={() => setActiveTab('my-activities')}
        >
          <Ionicons 
            name="list-outline" 
            size={24} 
            color={activeTab === 'my-activities' ? Colors.primary.navyBlue : Colors.text.secondary} 
          />
          <Text style={[
            styles.bottomTabText, 
            activeTab === 'my-activities' && styles.activeBottomTabText
          ]}>
            My Activities
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.bottomTab, activeTab === 'activity-pad' && styles.activeBottomTab]}
          onPress={() => setActiveTab('activity-pad')}
        >
          <Ionicons 
            name="construct-outline" 
            size={24} 
            color={activeTab === 'activity-pad' ? Colors.primary.navyBlue : Colors.text.secondary} 
          />
          <Text style={[
            styles.bottomTabText, 
            activeTab === 'activity-pad' && styles.activeBottomTabText
          ]}>
            ActivityPad
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.bottomTab, activeTab === 'portfolio-items' && styles.activeBottomTab]}
          onPress={() => setActiveTab('portfolio-items')}
        >
          <Ionicons 
            name="folder-outline" 
            size={24} 
            color={activeTab === 'portfolio-items' ? Colors.primary.navyBlue : Colors.text.secondary} 
          />
          <Text style={[
            styles.bottomTabText, 
            activeTab === 'portfolio-items' && styles.activeBottomTabText
          ]}>
            Portfolio Items
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Selection Modal */}
      <Modal
        visible={showContentSelection}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowContentSelection(false)}>
              <Ionicons name="close" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Content Selection Interface</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.contentSelectionContainer}>
            <Text style={styles.contentSelectionTitle}>Response Review & Selection</Text>
            <Text style={styles.contentSelectionSubtitle}>Select responses to include in your portfolio piece:</Text>
            
            {getCurrentActivity().phases?.map((phase, phaseIndex) => {
              // Map phase titles to match the exact requirements
              const phaseDisplayNames = [
                'Foundation Analysis',
                'Data Framework', 
                'Implementation',
                'Summative Integration'
              ];
              
              return (
                <View key={phase.id} style={styles.phaseSelectionGroup}>
                  <Text style={styles.phaseSelectionTitle}>Phase {phaseIndex + 1}: {phaseDisplayNames[phaseIndex] || phase.title}</Text>
                  {phase.steps.map((step, stepIndex) => (
                    <View key={step.id} style={styles.stepSelectionGroup}>
                      {step.guidingQuestions.map((question, qIndex) => {
                        const responseKey = `${phase.id}-${step.id}-${qIndex}`;
                        const response = getResponseForQuestion(step.id, qIndex);
                        const wordCount = response.trim().split(/\s+/).length;
                        const isSelected = selectedResponses.includes(responseKey);
                        
                        if (wordCount === 0) return null;
                        
                        // Determine if response is too brief (less than 200 words)
                        const isTooBrief = wordCount < 200;
                        
                        return (
                          <TouchableOpacity
                            key={qIndex}
                            style={[styles.responseSelectionItem, isSelected && styles.responseSelectionItemSelected]}
                            onPress={() => {
                              if (isSelected) {
                                setSelectedResponses(prev => prev.filter(r => r !== responseKey));
                              } else {
                                setSelectedResponses(prev => [...prev, responseKey]);
                              }
                            }}
                          >
                            <View style={styles.responseSelectionHeader}>
                              <Ionicons 
                                name={isSelected ? "checkbox" : "checkbox-outline"} 
                                size={20} 
                                color={isSelected ? Colors.primary.navyBlue : Colors.text.secondary} 
                              />
                              <Text style={styles.responseSelectionQuestion}>
                                Question {qIndex + 1}: {question.substring(0, 50)}...
                              </Text>
                            </View>
                            <Text style={styles.responseSelectionPreview}>
                              {response.substring(0, 100)}...
                            </Text>
                            <Text style={[styles.responseSelectionWordCount, isTooBrief && styles.tooBriefText]}>
                              ({wordCount} words{isTooBrief ? ' - too brief' : ''})
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  ))}
                </View>
              );
            })}
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={[styles.continueButton, selectedResponses.length === 0 && styles.continueButtonDisabled]}
              onPress={handleContentSelectionContinue}
              disabled={selectedResponses.length === 0}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* AI Generation Modal */}
      <Modal
        visible={showAIGeneration}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.aiGenerationOverlay}>
          <View style={styles.aiGenerationContainer}>
            <Text style={styles.aiGenerationTitle}>Arranging Your Responses...</Text>
            
            <View style={styles.aiProgressContainer}>
              <View style={styles.aiProgressBar}>
                <View style={[styles.aiProgressFill, { width: `${aiProgress}%` }]} />
              </View>
              <Text style={styles.aiProgressText}>{aiProgress}%</Text>
            </View>
            
            <View style={styles.aiStepsContainer}>
              <View style={[styles.aiStep, aiProgress >= 20 && styles.aiStepCompleted]}>
                <Ionicons name="checkmark-circle" size={20} color={aiProgress >= 20 ? Colors.success : Colors.text.secondary} />
                <Text style={[styles.aiStepText, aiProgress >= 20 && styles.aiStepTextCompleted]}>
                  Collecting your activity responses ({getAllResponses().length} responses)
                </Text>
              </View>
              
              <View style={[styles.aiStep, aiProgress >= 40 && styles.aiStepCompleted]}>
                <Ionicons name="checkmark-circle" size={20} color={aiProgress >= 40 ? Colors.success : Colors.text.secondary} />
                <Text style={[styles.aiStepText, aiProgress >= 40 && styles.aiStepTextCompleted]}>
                  Analyzing content themes and flow
                </Text>
              </View>
              
              <View style={[styles.aiStep, aiProgress >= 60 && styles.aiStepCompleted]}>
                <Ionicons 
                  name={aiProgress >= 60 ? "checkmark-circle" : "ellipse-outline"} 
                  size={20} 
                  color={aiProgress >= 60 ? Colors.success : Colors.text.secondary} 
                />
                <Text style={[styles.aiStepText, aiProgress >= 60 && styles.aiStepTextCompleted]}>
                  Organizing into coherent structure
                </Text>
              </View>
              
              <View style={[styles.aiStep, aiProgress >= 80 && styles.aiStepCompleted]}>
                <Ionicons 
                  name={aiProgress >= 80 ? "checkmark-circle" : "ellipse-outline"} 
                  size={20} 
                  color={aiProgress >= 80 ? Colors.success : Colors.text.secondary} 
                />
                <Text style={[styles.aiStepText, aiProgress >= 80 && styles.aiStepTextCompleted]}>
                  Formatting for professional presentation
                </Text>
              </View>
              
              <View style={[styles.aiStep, aiProgress >= 100 && styles.aiStepCompleted]}>
                <Ionicons 
                  name={aiProgress >= 100 ? "checkmark-circle" : "ellipse-outline"} 
                  size={20} 
                  color={aiProgress >= 100 ? Colors.success : Colors.text.secondary} 
                />
                <Text style={[styles.aiStepText, aiProgress >= 100 && styles.aiStepTextCompleted]}>
                  Generating executive summary
                </Text>
              </View>
            </View>
            
            <Text style={styles.aiEstimatedTime}>Estimated completion: 45 seconds</Text>
          </View>
        </View>
      </Modal>

      {/* Portfolio Editor Modal */}
      <Modal
        visible={showPortfolioEditor}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPortfolioEditor(false)}>
              <Ionicons name="close" size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Portfolio Item</Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.portfolioEditorContainer}>
            <View style={styles.portfolioEditorField}>
              <Text style={styles.portfolioEditorLabel}>Title</Text>
              <TextInput
                style={styles.portfolioEditorInput}
                value={portfolioDraft?.title || ''}
                onChangeText={(text) => setPortfolioDraft(prev => prev ? { ...prev, title: text } : null)}
                placeholder="Enter portfolio item title"
              />
            </View>
            
            <View style={styles.portfolioEditorField}>
              <Text style={styles.portfolioEditorLabel}>Description</Text>
              <TextInput
                style={[styles.portfolioEditorInput, styles.portfolioEditorTextArea]}
                value={portfolioDraft?.description || ''}
                onChangeText={(text) => setPortfolioDraft(prev => prev ? { ...prev, description: text } : null)}
                placeholder="Enter portfolio item description"
                multiline
                textAlignVertical="top"
              />
            </View>
            
            <View style={styles.portfolioEditorField}>
              <Text style={styles.portfolioEditorLabel}>Generated Content</Text>
              <TextInput
                style={[styles.portfolioEditorInput, styles.portfolioEditorTextArea]}
                value={portfolioDraft?.generatedContent || ''}
                onChangeText={(text) => setPortfolioDraft(prev => prev ? { ...prev, generatedContent: text } : null)}
                placeholder="Generated content will appear here"
                multiline
                textAlignVertical="top"
              />
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.saveToPortfolioButton}
              onPress={handleSaveToPortfolio}
            >
              <Ionicons name="save-outline" size={20} color={Colors.text.inverse} />
              <Text style={styles.saveToPortfolioButtonText}>Save to Portfolio Items</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  bottomTabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
    paddingTop: Layout.spacing.sm,
    paddingBottom: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.sm,
  },
  bottomTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.xs,
    gap: Layout.spacing.xs,
  },
  activeBottomTab: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.sm,
  },
  bottomTabText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  activeBottomTabText: {
    color: Colors.primary.navyBlue,
    fontWeight: Typography.fontWeight.semibold,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  section: {
    // marginBottom: Layout.spacing.md,
    marginTop: Layout.spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.lg,
  },
  activityCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  activityInfo: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  activityTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  activityDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  completedBadge: {
    alignItems: 'center',
  },
  progressBadge: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  progressText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.neutral.gray200,
    borderRadius: Layout.borderRadius.sm,
    marginBottom: Layout.spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary.goldenYellow,
    borderRadius: Layout.borderRadius.sm,
  },
  activityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Layout.spacing.sm,
  },
  metaText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  skillsContainer: {
    marginBottom: Layout.spacing.sm,
  },
  skillsLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.xs,
  },
  skillTag: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
    marginTop: Layout.spacing.sm,
  },
  skillText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  startButton: {
    backgroundColor: Colors.primary.navyBlue,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
  },
  startButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  currentActivityCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginVertical: Layout.spacing.lg,
  },
  currentActivityTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  currentActivityDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Layout.spacing.lg,
  },
  difficultyBadge: {
    backgroundColor: Colors.primary.warmOrange,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  difficultyText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  progressSection: {
    marginBottom: Layout.spacing.lg,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  progressLabel: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  progressPercentage: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.navyBlue,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  tasksSection: {
    marginBottom: Layout.spacing.lg,
  },
  tasksTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
    gap: Layout.spacing.sm,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
    flex: 1,
  },
  taskTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  taskDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginLeft: 36,
  },
  workArea: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  workAreaTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  workInput: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
    marginBottom: Layout.spacing.md,
  },
  workActions: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  saveButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.navyBlue,
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.sm,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  portfolioCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.sm,
  },
  portfolioInfo: {
    flex: 1,
    marginRight: Layout.spacing.md,
  },
  portfolioTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  portfolioDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  portfolioTypeBadge: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  portfolioTypeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  portfolioMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  portfolioActions: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary.navyBlue,
  },
  addPortfolioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    borderWidth: 2,
    borderColor: Colors.primary.navyBlue,
    borderStyle: 'dashed',
    gap: Layout.spacing.sm,
  },
  addPortfolioText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.primary.navyBlue,
  },
  phasesSection: {
    marginBottom: Layout.spacing.lg,
  },
  phasesTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  phaseCard: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  phaseTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    flex: 1,
  },
  phaseDuration: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  stepItem: {
    marginBottom: Layout.spacing.md,
    paddingLeft: Layout.spacing.md,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
    gap: Layout.spacing.sm,
  },
  stepTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    flex: 1,
  },
  stepDuration: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  stepFocus: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
    fontStyle: 'italic',
  },
  readingMaterial: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.sm,
    padding: Layout.spacing.sm,
    marginBottom: Layout.spacing.sm,
  },
  readingTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  readingAuthor: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  readingQuote: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.xs,
  },
  guidingQuestions: {
    marginTop: Layout.spacing.sm,
  },
  guidingQuestionsTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  guidingQuestion: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.xs,
  },
  resourcesSection: {
    marginBottom: Layout.spacing.lg,
  },
  resourcesTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  resourceCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.xs,
  },
  resourceTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    flex: 1,
    marginRight: Layout.spacing.sm,
  },
  resourceTypeBadge: {
    backgroundColor: Colors.primary.goldenYellow,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  resourceTypeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  resourceAuthor: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  resourceDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  resourceRelevance: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
    fontStyle: 'italic',
    marginBottom: Layout.spacing.sm,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.xs,
  },
  resourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  resourceLinkText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary.navyBlue,
    fontWeight: Typography.fontWeight.medium,
  },
  followUpSection: {
    marginBottom: Layout.spacing.lg,
  },
  followUpTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  followUpCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
  },
  followUpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  followUpCategory: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.navyBlue,
  },
  followUpMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  followUpDuration: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  complexityBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  complexityText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  followUpDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  // New styles for text inputs and portfolio creation
  questionContainer: {
    marginBottom: Layout.spacing.md,
  },
  responseInput: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
    marginTop: Layout.spacing.sm,
  },
  responseMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Layout.spacing.xs,
  },
  wordCount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  portfolioCreationSection: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.lg,
    marginVertical: Layout.spacing.lg,
    borderWidth: 1,
    borderColor: Colors.primary.navyBlue,
  },
  portfolioCreationTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  portfolioCreationDescription: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.lg,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  createPortfolioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  createPortfolioButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  modalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  modalActions: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
  },
  // Content Selection styles
  contentSelectionContainer: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
    paddingTop: Layout.spacing.md,
  },
  contentSelectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  contentSelectionSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.lg,
  },
  phaseSelectionGroup: {
    marginBottom: Layout.spacing.lg,
  },
  phaseSelectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  stepSelectionGroup: {
    marginLeft: Layout.spacing.md,
  },
  responseSelectionItem: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  responseSelectionItemSelected: {
    borderColor: Colors.primary.navyBlue,
    backgroundColor: Colors.primary.navyBlue + '10',
  },
  responseSelectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
    gap: Layout.spacing.sm,
  },
  responseSelectionQuestion: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    flex: 1,
  },
  responseSelectionPreview: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.xs,
  },
  responseSelectionWordCount: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  tooBriefText: {
    color: Colors.warning,
    fontWeight: Typography.fontWeight.medium,
  },
  continueButton: {
    backgroundColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: Colors.neutral.gray300,
  },
  continueButtonText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.primary.navyBlue,
    fontWeight: Typography.fontWeight.medium,
  },
  // AI Generation styles
  aiGenerationOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiGenerationContainer: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.borderRadius.lg,
    padding: Layout.spacing.xl,
    marginHorizontal: Layout.spacing.lg,
    minWidth: 300,
  },
  aiGenerationTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Layout.spacing.lg,
  },
  aiProgressContainer: {
    marginBottom: Layout.spacing.lg,
  },
  aiProgressBar: {
    height: 8,
    backgroundColor: Colors.neutral.gray200,
    borderRadius: Layout.borderRadius.sm,
    marginBottom: Layout.spacing.sm,
  },
  aiProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.sm,
  },
  aiProgressText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary.navyBlue,
    textAlign: 'center',
  },
  aiStepsContainer: {
    marginBottom: Layout.spacing.lg,
  },
  aiStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
    gap: Layout.spacing.sm,
  },
  aiStepCompleted: {
    opacity: 1,
  },
  aiStepText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    flex: 1,
  },
  aiStepTextCompleted: {
    color: Colors.text.primary,
    fontWeight: Typography.fontWeight.medium,
  },
  aiEstimatedTime: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  // Portfolio Editor styles
  portfolioEditorContainer: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  portfolioEditorField: {
    marginBottom: Layout.spacing.lg,
    marginTop: Layout.spacing.md,
  },
  portfolioEditorLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  portfolioEditorInput: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  portfolioEditorTextArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  saveToPortfolioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.md,
    gap: Layout.spacing.sm,
  },
  saveToPortfolioButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  // New styles for expandable structure
  phaseHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Layout.spacing.md,
  },
  phaseNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.navyBlue,
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
    lineHeight: 32,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseDetails: {
    backgroundColor: Colors.background.primary,
    paddingVertical: Layout.spacing.sm,
    gap: Layout.spacing.md,
  },
  stepCard: {
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    // marginBottom: Layout.spacing.sm,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  stepHeaderNew: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.sm,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
  },
  expandedStepHeader: {
    backgroundColor: Colors.primary.goldenYellow,
  },
  stepHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Layout.spacing.md,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary.navyBlue,
    color: Colors.text.inverse,
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    textAlign: 'center',
    lineHeight: 28,
  },
  stepInfo: {
    flex: 1,
  },
  stepDetailsNew: {
    backgroundColor: Colors.background.primary,
    borderRadius: Layout.borderRadius.md,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary.goldenYellow,
  },
  readingSectionNew: {
    marginBottom: Layout.spacing.md,
  },
  focusSectionNew: {
    marginBottom: Layout.spacing.md,
  },
  questionsSectionNew: {
    marginBottom: Layout.spacing.md,
  },
  sectionLabelNew: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  readingTitleNew: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  readingAuthorNew: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.sm,
  },
  readingQuoteNew: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    backgroundColor: Colors.neutral.gray100,
    padding: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.sm,
  },
  focusText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  questionItem: {
    marginBottom: Layout.spacing.lg,
    padding: Layout.spacing.md,
    backgroundColor: Colors.background.secondary,
    borderRadius: Layout.borderRadius.md,
    borderWidth: 1,
    borderColor: Colors.neutral.gray200,
  },
  questionNumber: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  questionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.md,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.sm,
  },
  responseSection: {
    marginTop: Layout.spacing.md,
  },
  responseLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.sm,
  },
  completeButton: {
    backgroundColor: Colors.primary.navyBlue,
    borderRadius: Layout.borderRadius.md,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.md,
    alignItems: 'center',
    marginTop: Layout.spacing.sm,
  },
  completedButton: {
    backgroundColor: Colors.success,
  },
  completeButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  // Fixed Progress Bar styles
  activityPadContainer: {
    flex: 1,
  },
  fixedProgressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: Colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
    paddingVertical: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.lg,
    shadowColor: Colors.neutral.gray900,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressContainer: {
    gap: Layout.spacing.xs,
  },
  fixedProgressText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  fixedProgressPercentage: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  scrollViewWithFixedBar: {
    paddingTop: 80, // Account for fixed progress bar height
  },
  continueButtonContainer: {
    marginTop: Layout.spacing.sm,
    alignItems: 'center',
  },
});
