import { create } from 'zustand';
import { JobListing } from '../types';
import { api } from '../services/mockApi';
import { AlertService } from '../services/alertService';

interface JobState {
  jobs: JobListing[];
  savedJobs: JobListing[];
  appliedJobs: JobListing[];
  isLoading: boolean;
  fetchJobs: () => Promise<void>;
  saveJob: (jobId: string) => Promise<void>;
  unsaveJob: (jobId: string) => Promise<void>;
  applyToJob: (jobId: string) => Promise<void>;
  getJobById: (jobId: string) => JobListing | null;
  refreshJobs: () => Promise<void>;
}

export const useJobStore = create<JobState>((set, get) => ({
  jobs: [],
  savedJobs: [],
  appliedJobs: [],
  isLoading: false,

  fetchJobs: async () => {
    try {
      set({ isLoading: true });
      const jobs = await api.getJobs();
      const savedJobs = jobs.filter(job => job.saved);
      const appliedJobs = jobs.filter(job => job.applied);
      
      set({ 
        jobs, 
        savedJobs, 
        appliedJobs, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      set({ isLoading: false });
      AlertService.error('Failed to load jobs. Please try again.');
    }
  },

  saveJob: async (jobId: string) => {
    try {
      const job = await api.saveJob(jobId);
      if (job) {
        const { jobs, savedJobs } = get();
        const updatedJobs = jobs.map(j => j.id === jobId ? { ...j, saved: true } : j);
        const updatedSavedJobs = [...savedJobs, job];
        
        set({ 
          jobs: updatedJobs, 
          savedJobs: updatedSavedJobs 
        });
        
        AlertService.success(`"${job.title}" has been saved!`);
      }
    } catch (error) {
      console.error('Error saving job:', error);
      AlertService.error('Failed to save job. Please try again.');
    }
  },

  unsaveJob: async (jobId: string) => {
    try {
      const job = await api.unsaveJob(jobId);
      if (job) {
        const { jobs, savedJobs } = get();
        const updatedJobs = jobs.map(j => j.id === jobId ? { ...j, saved: false } : j);
        const updatedSavedJobs = savedJobs.filter(j => j.id !== jobId);
        
        set({ 
          jobs: updatedJobs, 
          savedJobs: updatedSavedJobs 
        });
        
        AlertService.success(`"${job.title}" has been removed from saved jobs.`);
      }
    } catch (error) {
      console.error('Error unsaving job:', error);
      AlertService.error('Failed to remove job from saved list. Please try again.');
    }
  },

  applyToJob: async (jobId: string) => {
    try {
      const job = await api.applyToJob(jobId);
      if (job) {
        const { jobs, appliedJobs } = get();
        const updatedJobs = jobs.map(j => j.id === jobId ? { ...j, applied: true } : j);
        const updatedAppliedJobs = [...appliedJobs, job];
        
        set({ 
          jobs: updatedJobs, 
          appliedJobs: updatedAppliedJobs 
        });
        
        AlertService.success(`Application submitted for "${job.title}"!`);
      }
    } catch (error) {
      console.error('Error applying to job:', error);
      AlertService.error('Failed to submit application. Please try again.');
    }
  },

  getJobById: (jobId: string) => {
    const { jobs } = get();
    return jobs.find(job => job.id === jobId) || null;
  },

  refreshJobs: async () => {
    await get().fetchJobs();
  },
}));
