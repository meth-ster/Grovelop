import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/useAuthStore';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';
import { ArchetypeType } from '../../types';

export default function ProfileScreen() {
  const { user, updateUser, logout } = useAuthStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: logout, style: 'destructive' },
      ]
    );
  };

  const getArchetypeColor = (archetype: ArchetypeType) => {
    return Colors.archetypes[archetype]?.primary || Colors.primary.navyBlue;
  };

  const getArchetypeDescription = (archetype: ArchetypeType) => {
    const descriptions = {
      doer: 'Action-oriented and results-focused',
      thinker: 'Analytical and strategic mindset',
      creator: 'Innovative and visionary approach',
      helper: 'People-focused and supportive',
      persuader: 'Influential and charismatic leader',
      organiser: 'Systematic and detail-oriented',
    };
    return descriptions[archetype] || 'Balanced approach to work';
  };

  const renderArchetypeScore = (archetype: ArchetypeType, score: number) => (
    <View key={archetype} style={styles.scoreItem}>
      <View style={styles.scoreHeader}>
        <Text style={styles.scoreLabel}>
          {archetype.charAt(0).toUpperCase() + archetype.slice(1)}
        </Text>
        <Text style={styles.scoreValue}>{score}/10</Text>
      </View>
      <View style={styles.scoreBar}>
        <View 
          style={[
            styles.scoreProgress, 
            { 
              width: `${(score / 10) * 100}%`,
              backgroundColor: getArchetypeColor(archetype),
            }
          ]} 
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={async () => {
                if (isEditMode) {
                  // Save changes
                  try {
                    await updateUser({
                      name: editedName,
                      email: editedEmail,
                    });
                    Alert.alert('Success', 'Profile updated successfully!');
                    setIsEditMode(false);
                  } catch (error) {
                    Alert.alert('Error', 'Failed to update profile. Please try again.');
                  }
                } else {
                  // Enter edit mode
                  setEditedName(user?.name || '');
                  setEditedEmail(user?.email || '');
                  setIsEditMode(true);
                }
              }}
            >
              <Ionicons 
                name={isEditMode ? "checkmark" : "pencil"} 
                size={24} 
                color={Colors.text.primary} 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
              <Ionicons name="log-out-outline" size={24} color={Colors.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            {user?.profilePicture ? (
              <Image source={{ uri: user.profilePicture }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={40} color={Colors.text.tertiary} />
              </View>
            )}
            
            {isEditMode && (
              <TouchableOpacity 
                style={styles.editImageButton}
                onPress={() => {
                  Alert.alert(
                    'Update Profile Picture',
                    'Choose how you want to update your profile picture:',
                    [
                      { 
                        text: 'Take Photo', 
                        onPress: () => Alert.alert('Camera', 'Camera feature coming soon! You\'ll be able to take a new profile photo.') 
                      },
                      { 
                        text: 'Choose from Gallery', 
                        onPress: () => Alert.alert('Gallery', 'Gallery selection coming soon! You\'ll be able to choose from your photos.') 
                      },
                      { 
                        text: 'Remove Photo', 
                        onPress: () => Alert.alert('Photo Removed', 'Profile picture has been removed.'),
                        style: 'destructive'
                      },
                      { text: 'Cancel', style: 'cancel' }
                    ]
                  );
                }}
              >
                <Ionicons name="camera" size={16} color={Colors.text.inverse} />
              </TouchableOpacity>
            )}
          </View>
          
          {isEditMode ? (
            <TextInput
              style={[styles.userName, styles.editableField]}
              value={editedName}
              onChangeText={setEditedName}
              placeholder="Enter your name"
              placeholderTextColor={Colors.text.tertiary}
            />
          ) : (
            <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
          )}
          
          {isEditMode ? (
            <TextInput
              style={[styles.userEmail, styles.editableField]}
              value={editedEmail}
              onChangeText={setEditedEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              placeholderTextColor={Colors.text.tertiary}
            />
          ) : (
            <Text style={styles.userEmail}>{user?.email}</Text>
          )}
          
          {user?.archetype && (
            <View style={[
              styles.archetypeBadge, 
              { backgroundColor: getArchetypeColor(user.archetype.primary) }
            ]}>
              <Text style={styles.archetypeText}>
                {user.archetype.primary.charAt(0).toUpperCase() + user.archetype.primary.slice(1)}
              </Text>
            </View>
          )}
        </View>

        {/* Archetype Analysis */}
        {user?.archetype && (
          <View style={styles.analysisSection}>
            <Text style={styles.sectionTitle}>Career Archetype Analysis</Text>
            <View style={styles.primaryArchetype}>
              <Text style={styles.primaryTitle}>Primary Archetype</Text>
              <Text style={[
                styles.primaryName,
                { color: getArchetypeColor(user.archetype.primary) }
              ]}>
                {user.archetype.primary.charAt(0).toUpperCase() + user.archetype.primary.slice(1)}
              </Text>
              <Text style={styles.primaryDescription}>
                {getArchetypeDescription(user.archetype.primary)}
              </Text>
            </View>

            {user.archetype.description && (
              <View style={styles.descriptionCard}>
                <Text style={styles.descriptionText}>{user.archetype.description}</Text>
              </View>
            )}

            {/* Archetype Scores */}
            <View style={styles.scoresSection}>
              <Text style={styles.scoresTitle}>Detailed Breakdown</Text>
              {Object.entries(user.archetype.scores).map(([archetype, score]) =>
                renderArchetypeScore(archetype as ArchetypeType, score)
              )}
            </View>
          </View>
        )}

        {/* Strengths & Growth Areas */}
        {user?.archetype && (
          <View style={styles.strengthsSection}>
            <View style={styles.strengthsGrid}>
              <View style={styles.strengthsColumn}>
                <Text style={styles.strengthsTitle}>
                  <Ionicons name="trophy" size={16} color={Colors.success} /> Strengths
                </Text>
                {user.archetype.strengths.map((strength, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                    <Text style={styles.strengthText}>{strength}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.strengthsColumn}>
                <Text style={styles.strengthsTitle}>
                  <Ionicons name="trending-up" size={16} color={Colors.warning} /> Growth Areas
                </Text>
                {user.archetype.growthAreas.map((area, index) => (
                  <View key={index} style={styles.strengthItem}>
                    <Ionicons name="arrow-up-circle" size={16} color={Colors.warning} />
                    <Text style={styles.strengthText}>{area}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Career Suggestions */}
        {user?.archetype?.careerSuggestions && (
          <View style={styles.suggestionsSection}>
            <Text style={styles.sectionTitle}>Career Suggestions</Text>
            <View style={styles.suggestionsList}>
              {user.archetype.careerSuggestions.map((suggestion, index) => (
                <View key={index} style={styles.suggestionItem}>
                  <Ionicons name="briefcase" size={16} color={Colors.primary.navyBlue} />
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Your Journey</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="calendar" size={24} color={Colors.primary.navyBlue} />
              <Text style={styles.statNumber}>45</Text>
              <Text style={styles.statLabel}>Days Active</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="trending-up" size={24} color={Colors.success} />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Skills Improved</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="star" size={24} color={Colors.primary.goldenYellow} />
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
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
  scrollContent: {
    paddingBottom: Layout.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.lg,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Layout.spacing.sm,
  },
  headerButton: {
    width: Layout.touchTarget.small,
    height: Layout.touchTarget.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: Layout.spacing.lg,
    paddingBottom: Layout.spacing.xl,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: Layout.spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.navyBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.xs,
  },
  userEmail: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.md,
  },
  archetypeBadge: {
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.borderRadius.full,
  },
  archetypeText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.inverse,
  },
  analysisSection: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.lg,
  },
  primaryArchetype: {
    backgroundColor: Colors.background.secondary,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.lg,
  },
  primaryTitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Layout.spacing.xs,
  },
  primaryName: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Layout.spacing.sm,
  },
  primaryDescription: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.secondary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  descriptionCard: {
    backgroundColor: Colors.background.tertiary,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    marginBottom: Layout.spacing.lg,
  },
  descriptionText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text.primary,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  scoresSection: {
    marginTop: Layout.spacing.lg,
  },
  scoresTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  scoreItem: {
    marginBottom: Layout.spacing.md,
  },
  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Layout.spacing.xs,
  },
  scoreLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.text.primary,
  },
  scoreValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.secondary,
  },
  scoreBar: {
    height: 6,
    backgroundColor: Colors.neutral.gray200,
    borderRadius: Layout.borderRadius.sm,
    overflow: 'hidden',
  },
  scoreProgress: {
    height: '100%',
    borderRadius: Layout.borderRadius.sm,
  },
  strengthsSection: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  strengthsGrid: {
    flexDirection: 'row',
    gap: Layout.spacing.lg,
  },
  strengthsColumn: {
    flex: 1,
  },
  strengthsTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Layout.spacing.md,
  },
  strengthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.sm,
  },
  strengthText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginLeft: Layout.spacing.sm,
    flex: 1,
  },
  suggestionsSection: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  suggestionsList: {
    gap: Layout.spacing.sm,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    padding: Layout.spacing.md,
    borderRadius: Layout.borderRadius.md,
  },
  suggestionText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.primary,
    marginLeft: Layout.spacing.sm,
    flex: 1,
  },
  statsSection: {
    paddingHorizontal: Layout.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Layout.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
    padding: Layout.spacing.lg,
    borderRadius: Layout.borderRadius.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text.primary,
    marginVertical: Layout.spacing.sm,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});