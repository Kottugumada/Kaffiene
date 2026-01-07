import { create } from 'zustand';
import { BrewLog } from '../types';
import { brewLogRepository } from '../repositories';

interface BrewLogState {
  logs: BrewLog[];
  isLoading: boolean;
  error: string | null;
  loadLogs: (limit?: number, offset?: number) => Promise<void>;
  loadLogsByBean: (beanId: string, limit?: number) => Promise<void>;
  addLog: (log: Omit<BrewLog, 'id' | 'timestamp'>) => Promise<BrewLog>;
  updateLog: (log: BrewLog) => Promise<void>;
  deleteLog: (id: string) => Promise<void>;
  getLogById: (id: string) => Promise<BrewLog | null>;
}

export const useBrewLogStore = create<BrewLogState>((set, get) => ({
  logs: [],
  isLoading: false,
  error: null,

  loadLogs: async (limit, offset) => {
    set({ isLoading: true, error: null });
    try {
      const logs = await brewLogRepository.findAll(limit, offset);
      set({ logs, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  loadLogsByBean: async (beanId, limit) => {
    set({ isLoading: true, error: null });
    try {
      const logs = await brewLogRepository.findByBeanId(beanId, limit);
      set({ logs, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addLog: async (logData) => {
    set({ isLoading: true, error: null });
    try {
      const newLog = await brewLogRepository.create(logData);
      set((state) => ({
        logs: [newLog, ...state.logs],
        isLoading: false,
      }));
      return newLog;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateLog: async (log) => {
    set({ isLoading: true, error: null });
    try {
      await brewLogRepository.update(log);
      set((state) => ({
        logs: state.logs.map((l) => (l.id === log.id ? log : l)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteLog: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await brewLogRepository.delete(id);
      set((state) => ({
        logs: state.logs.filter((l) => l.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  getLogById: async (id) => {
    try {
      return await brewLogRepository.findById(id);
    } catch (error) {
      set({ error: (error as Error).message });
      return null;
    }
  },
}));

