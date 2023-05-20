import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import Colors from '../constants/Colors';
import Typography from '../constants/Typography';
import Layout from '../constants/Layout';

interface Post {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  engagement: {
    likes: number;
    retweets: number;
    comments: number;
  };
  tags: string[];
  category: 'career' | 'leadership' | 'skills' | 'industry' | 'networking';
}

// Mock curated posts data
const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      handle: '@sarahchen_ceo',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b618?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    content: 'The future of leadership isn\'t about having all the answers—it\'s about asking the right questions and empowering your team to find solutions together. 🚀 #leadership #management',
    timestamp: '2h',
    engagement: {
      likes: 234,
      retweets: 45,
      comments: 18,
    },
    tags: ['Leadership', 'Management'],
    category: 'leadership',
  },
  {
    id: '2',
    author: {
      name: 'Tech Career Hub',
      handle: '@techcareerhub',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    content: 'Data shows that professionals who invest 5 hours per week in skill development are 3x more likely to get promoted within 12 months. What skill are you working on this week? 📊 #skillbuilding #careergrowth',
    timestamp: '4h',
    engagement: {
      likes: 189,
      retweets: 67,
      comments: 32,
    },
    tags: ['Skill Building', 'Career Growth'],
    category: 'skills',
  },
  {
    id: '3',
    author: {
      name: 'Innovation Weekly',
      handle: '@innovationweekly',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    content: 'AI isn\'t replacing creative professionals—it\'s amplifying their capabilities. The key is learning to collaborate with AI tools rather than competing against them. Thread 🧵 1/7',
    timestamp: '6h',
    engagement: {
      likes: 512,
      retweets: 128,
      comments: 94,
    },
    tags: ['AI', 'Creativity', 'Future of Work'],
    category: 'industry',
  },
  {
    id: '4',
    author: {
      name: 'Marcus Johnson',
      handle: '@marcusj_coach',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      verified: false,
    },
    content: 'Your network is your net worth, but your relationships are your real wealth. Focus on giving value first, and opportunities will follow naturally. 🤝 #networking #relationships',
    timestamp: '8h',
    engagement: {
      likes: 156,
      retweets: 34,
      comments: 12,
    },
    tags: ['Networking', 'Relationships'],
    category: 'networking',
  },
  {
    id: '5',
    author: {
      name: 'Future of Work',
      handle: '@futureofwork',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      verified: true,
    },
    content: 'Remote work has taught us that productivity isn\'t about time spent at a desk—it\'s about outcomes delivered and value created. The traditional 9-5 is evolving into something much more flexible and human-centered.',
    timestamp: '12h',
    engagement: {
      likes: 378,
      retweets: 89,
      comments: 56,
    },
    tags: ['Remote Work', 'Productivity', 'Work Culture'],
    category: 'career',
  },
];

const categories = [
  { key: 'all', label: 'All', icon: 'grid' as const },
  { key: 'career', label: 'Career', icon: 'briefcase' as const },
  { key: 'leadership', label: 'Leadership', icon: 'people' as const },
  { key: 'skills', label: 'Skills', icon: 'school' as const },
  { key: 'industry', label: 'Industry', icon: 'trending-up' as const },
  { key: 'networking', label: 'Network', icon: 'share-social' as const },
];

export default function GrovelopXScreen() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [posts, setPosts] = useState(mockPosts);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [retweetedPosts, setRetweetedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  const formatEngagement = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const handleLikePost = (postId: string) => {
    const isLiked = likedPosts.has(postId);
    const newLikedPosts = new Set(likedPosts);
    
    if (isLiked) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    
    setLikedPosts(newLikedPosts);
    
    // Update post engagement count
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, engagement: { ...post.engagement, likes: post.engagement.likes + (isLiked ? -1 : 1) } }
        : post
    ));
  };

  const handleRetweetPost = (postId: string) => {
    const isRetweeted = retweetedPosts.has(postId);
    const newRetweetedPosts = new Set(retweetedPosts);
    
    if (isRetweeted) {
      newRetweetedPosts.delete(postId);
    } else {
      newRetweetedPosts.add(postId);
    }
    
    setRetweetedPosts(newRetweetedPosts);
    
    // Update post engagement count
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, engagement: { ...post.engagement, retweets: post.engagement.retweets + (isRetweeted ? -1 : 1) } }
        : post
    ));

    // Show feedback
    Alert.alert(
      isRetweeted ? 'Retweet Removed' : 'Retweet Shared!',
      isRetweeted ? 'Post removed from your profile.' : 'Post shared to your professional network.',
      [{ text: 'OK' }]
    );
  };

  const handleBookmarkPost = (postId: string) => {
    const isBookmarked = bookmarkedPosts.has(postId);
    const newBookmarkedPosts = new Set(bookmarkedPosts);
    
    if (isBookmarked) {
      newBookmarkedPosts.delete(postId);
    } else {
      newBookmarkedPosts.add(postId);
    }
    
    setBookmarkedPosts(newBookmarkedPosts);

    // Show feedback
    Alert.alert(
      isBookmarked ? 'Bookmark Removed' : 'Post Bookmarked!',
      isBookmarked ? 'Post removed from your bookmarks.' : 'Post saved to your bookmarks for later reading.',
      [{ text: 'OK' }]
    );
  };

  const handleCommentPost = (postId: string) => {
    Alert.alert(
      'Add Comment',
      'Comment feature coming soon! You\'ll be able to engage in professional discussions.',
      [{ text: 'OK' }]
    );
  };

  const renderPost = ({ item: post }: { item: Post }) => (
    <View style={styles.postCard}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <Image source={{ uri: post.author.avatar }} style={styles.authorAvatar} />
        <View style={styles.authorInfo}>
          <View style={styles.authorNameRow}>
            <Text style={styles.authorName}>{post.author.name}</Text>
            {post.author.verified && (
              <Ionicons name="checkmark-circle" size={16} color={Colors.primary.goldenYellow} />
            )}
          </View>
          <Text style={styles.authorHandle}>{post.author.handle} • {post.timestamp}</Text>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Tags */}
      {post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag.toLowerCase().replace(' ', '')}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Engagement */}
      <View style={styles.engagementRow}>
        <TouchableOpacity style={styles.engagementButton}>
          <Ionicons name="heart-outline" size={20} color={Colors.text.secondary} />
          <Text style={styles.engagementText}>{formatEngagement(post.engagement.likes)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.engagementButton}>
          <Ionicons name="repeat-outline" size={20} color={Colors.text.secondary} />
          <Text style={styles.engagementText}>{formatEngagement(post.engagement.retweets)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.engagementButton}>
          <Ionicons name="chatbubble-outline" size={20} color={Colors.text.secondary} />
          <Text style={styles.engagementText}>{formatEngagement(post.engagement.comments)}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.engagementButton}>
          <Ionicons name="bookmark-outline" size={20} color={Colors.text.secondary} />
        </TouchableOpacity>
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
        <View style={styles.headerTitle}>
          <Text style={styles.headerText}>Grovelop</Text>
          <Text style={styles.headerSubtext}>/X</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.categories}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              style={[
                styles.categoryChip,
                activeCategory === category.key && styles.activeCategoryChip,
              ]}
              onPress={() => setActiveCategory(category.key)}
            >
              <Ionicons 
                name={category.icon} 
                size={16} 
                color={activeCategory === category.key ? Colors.text.primary : Colors.text.secondary}
              />
              <Text style={[
                styles.categoryText,
                activeCategory === category.key && styles.activeCategoryText,
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Posts Feed */}
      <View style={styles.feedContainer}>
        <FlashList
          data={filteredPosts}
          renderItem={renderPost}
          keyExtractor={(item) => item.id}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={Colors.primary.goldenYellow}
              colors={[Colors.primary.goldenYellow]}
            />
          }
          contentContainerStyle={styles.feedContent}
          ItemSeparatorComponent={() => <View style={styles.postSeparator} />}
        />
      </View>

      {/* Connection Status */}
      <View style={styles.connectionStatus}>
        <View style={styles.connectionIndicator}>
          <View style={styles.connectedDot} />
          <Text style={styles.connectionText}>Connected to X Professional Network</Text>
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
    paddingVertical: Layout.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  headerText: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.navyBlue,
  },
  headerSubtext: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary.warmOrange,
  },
  categoriesContainer: {
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral.gray200,
  },
  categories: {
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
    gap: Layout.spacing.xs,
  },
  activeCategoryChip: {
    backgroundColor: Colors.primary.goldenYellow,
  },
  categoryText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    fontWeight: Typography.fontWeight.medium,
  },
  activeCategoryText: {
    color: Colors.text.primary,
  },
  feedContainer: {
    flex: 1,
  },
  feedContent: {
    paddingBottom: Layout.spacing.xl,
  },
  postCard: {
    backgroundColor: Colors.background.primary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
  },
  postSeparator: {
    height: 1,
    backgroundColor: Colors.neutral.gray200,
    marginHorizontal: Layout.spacing.lg,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Layout.spacing.md,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: Layout.spacing.md,
  },
  authorInfo: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
    marginBottom: Layout.spacing.xs,
  },
  authorName: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
  },
  authorHandle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  moreButton: {
    width: Layout.touchTarget.small,
    height: Layout.touchTarget.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postContent: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
    marginBottom: Layout.spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Layout.spacing.xs,
    marginBottom: Layout.spacing.md,
  },
  tag: {
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.borderRadius.sm,
  },
  tagText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary.navyBlue,
    fontWeight: Typography.fontWeight.medium,
  },
  engagementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xl,
  },
  engagementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.xs,
  },
  engagementText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  connectionStatus: {
    backgroundColor: Colors.background.secondary,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.gray200,
  },
  connectionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Layout.spacing.sm,
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  connectionText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
});