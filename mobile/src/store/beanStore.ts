import { create } from 'zustand';
import { Bean } from '../types';
import { beanRepository } from '../repositories';

interface BeanState {
  beans: Bean[];
  isLoading: boolean;
  error: string | null;
  loadBeans: () => Promise<void>;
  addBean: (bean: Omit<Bean, 'id' | 'createdAt' | 'updatedAt' | 'isSeedData'>) => Promise<Bean>;
  updateBean: (bean: Bean) => Promise<void>;
  deleteBean: (id: string) => Promise<void>;
  searchBeans: (query: string) => Promise<Bean[]>;
}

export const useBeanStore = create<BeanState>((set, get) => ({
  beans: [],
  isLoading: false,
  error: null,

  loadBeans: async () => {
    set({ isLoading: true, error: null });
    try {
      const beans = await beanRepository.findAll();
      set({ beans, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addBean: async (beanData) => {
    set({ isLoading: true, error: null });
    try {
      const id = `bean_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newBean = await beanRepository.create({
        ...beanData,
        id,
        isSeedData: false,
      });
      set((state) => ({
        beans: [...state.beans, newBean],
        isLoading: false,
      }));
      return newBean;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateBean: async (bean) => {
    set({ isLoading: true, error: null });
    try {
      await beanRepository.update(bean);
      set((state) => ({
        beans: state.beans.map((b) => (b.id === bean.id ? bean : b)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteBean: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await beanRepository.delete(id);
      set((state) => ({
        beans: state.beans.filter((b) => b.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  searchBeans: async (query) => {
    try {
      return await beanRepository.search(query);
    } catch (error) {
      set({ error: (error as Error).message });
      return [];
    }
  },
}));

