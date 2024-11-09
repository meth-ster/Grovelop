import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import Typography from '../../constants/Typography';
import Layout from '../../constants/Layout';

interface Tab {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface BottomTabBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
}

export default function BottomTabBar({
  tabs,
  activeTab,
  onTabPress
}: BottomTabBarProps) {
  return (
    <View style={styles.bottomTabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[
            styles.bottomTab,
            activeTab === tab.key && styles.activeBottomTab
          ]}
          onPress={() => onTabPress(tab.key)}
        >
          <Ionicons 
            name={tab.icon} 
            size={24} 
            color={activeTab === tab.key ? Colors.primary.navyBlue : Colors.text.secondary} 
          />
          <Text style={[
            styles.bottomTabText,
            activeTab === tab.key && styles.activeBottomText
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomTabContainer: {
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
  activeBottomText: {
    color: Colors.primary.navyBlue,
    fontWeight: Typography.fontWeight.semibold,
  },
});
