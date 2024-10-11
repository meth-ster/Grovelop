import { create } from 'zustand';
import { Activity } from '../types';
import { api } from '../services/mockApi';
import { AlertService } from '../services/alertService';

interface ActivityState {
  activities: Activity[];
  isLoading: boolean;
  fetchActivities: () => Promise<void>;
  getActivityById: (activityId: string) => Activity | null;
  updateActivityProgress: (activityId: string, progress: Partial<Activity['progress']>) => Promise<void>;
  completeActivity: (activityId: string) => Promise<void>;
  startActivity: (activityId: string) => Promise<void>;
  refreshActivities: () => Promise<void>;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
  activities: [],
  isLoading: false,

  fetchActivities: async () => {
    try {
      set({ isLoading: true });
      const activities = await api.getActivities();
      set({ activities, isLoading: false });
    } catch (error) {
      console.error('Error fetching activities:', error);
      set({ isLoading: false });
      AlertService.error('Failed to load activities. Please try again.');
    }
  },

  getActivityById: (activityId: string) => {
    const { activities } = get();
    return activities.find(activity => activity.id === activityId) || null;
  },

  updateActivityProgress: async (activityId: string, progress: Partial<Activity['progress']>) => {
    try {
      const updatedActivity = await api.updateActivityProgress(activityId, progress);
      if (updatedActivity) {
        const { activities } = get();
        const updatedActivities = activities.map(activity => 
          activity.id === activityId ? updatedActivity : activity
        );
        set({ activities: updatedActivities });
      }
    } catch (error) {
      console.error('Error updating activity progress:', error);
      AlertService.error('Failed to update activity progress. Please try again.');
    }
  },

  completeActivity: async (activityId: string) => {
    try {
      const activity = get().getActivityById(activityId);
      if (!activity) {
        AlertService.error('Activity not found.');
        return;
      }

      const progress = {
        completed: true,
        completedAt: new Date().toISOString(),
        timeSpent: activity.progress.timeSpent + 30, // Add 30 minutes
      };

      await get().updateActivityProgress(activityId, progress);
      AlertService.success(`Congratulations! You completed "${activity.title}"!`);
    } catch (error) {
      console.error('Error completing activity:', error);
      AlertService.error('Failed to complete activity. Please try again.');
    }
  },

  startActivity: async (activityId: string) => {
    try {
      const activity = get().getActivityById(activityId);
      if (!activity) {
        AlertService.error('Activity not found.');
        return;
      }

      const progress = {
        startedAt: new Date().toISOString(),
        timeSpent: 0,
      };

      await get().updateActivityProgress(activityId, progress);
      AlertService.success(`You started "${activity.title}"! Good luck!`);
    } catch (error) {
      console.error('Error starting activity:', error);
      AlertService.error('Failed to start activity. Please try again.');
    }
  },

  refreshActivities: async () => {
    await get().fetchActivities();
  },
}));
