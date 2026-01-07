import { create } from 'zustand';
import { Recipe } from '../types';
import { recipeRepository } from '../repositories';

interface RecipeState {
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  loadRecipes: () => Promise<void>;
  loadRecipesByMethod: (brewMethod: string) => Promise<void>;
  loadRecipesByBean: (beanId: string) => Promise<void>;
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Recipe>;
  updateRecipe: (recipe: Recipe) => Promise<void>;
  deleteRecipe: (id: string) => Promise<void>;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  isLoading: false,
  error: null,

  loadRecipes: async () => {
    set({ isLoading: true, error: null });
    try {
      const recipes = await recipeRepository.findAll();
      set({ recipes, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  loadRecipesByMethod: async (brewMethod) => {
    set({ isLoading: true, error: null });
    try {
      const recipes = await recipeRepository.findByBrewMethod(brewMethod);
      set({ recipes, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  loadRecipesByBean: async (beanId) => {
    set({ isLoading: true, error: null });
    try {
      const recipes = await recipeRepository.findByBeanId(beanId);
      set({ recipes, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addRecipe: async (recipeData) => {
    set({ isLoading: true, error: null });
    try {
      const id = `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const newRecipe = await recipeRepository.create({
        ...recipeData,
        id,
      });
      set((state) => ({
        recipes: [...state.recipes, newRecipe],
        isLoading: false,
      }));
      return newRecipe;
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
      throw error;
    }
  },

  updateRecipe: async (recipe) => {
    set({ isLoading: true, error: null });
    try {
      await recipeRepository.update(recipe);
      set((state) => ({
        recipes: state.recipes.map((r) => (r.id === recipe.id ? recipe : r)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  deleteRecipe: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await recipeRepository.delete(id);
      set((state) => ({
        recipes: state.recipes.filter((r) => r.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));

