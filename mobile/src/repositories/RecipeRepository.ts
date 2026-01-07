import { getDatabase } from '../database/db';
import { Recipe, BrewParameters } from '../types';

export class RecipeRepository {
  async findAll(): Promise<Recipe[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<Recipe>('SELECT * FROM recipes ORDER BY name ASC');
    return (result || []).map(this.deserialize);
  }

  async findById(id: string): Promise<Recipe | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<Recipe>('SELECT * FROM recipes WHERE id = ?', [id]);
    return result ? this.deserialize(result) : null;
  }

  async findByBrewMethod(brewMethod: string): Promise<Recipe[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<Recipe>(
      'SELECT * FROM recipes WHERE brewMethod = ? ORDER BY name ASC',
      [brewMethod]
    );
    return (result || []).map(this.deserialize);
  }

  async findByBeanId(beanId: string): Promise<Recipe[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<Recipe>(
      'SELECT * FROM recipes WHERE beanId = ? ORDER BY name ASC',
      [beanId]
    );
    return (result || []).map(this.deserialize);
  }

  async findDefaults(brewMethod?: string): Promise<Recipe[]> {
    const db = await getDatabase();
    let query = 'SELECT * FROM recipes WHERE isDefault = 1';
    const params: any[] = [];

    if (brewMethod) {
      query += ' AND brewMethod = ?';
      params.push(brewMethod);
    }

    query += ' ORDER BY name ASC';
    const result = await db.getAllAsync<Recipe>(query, params);
    return (result || []).map(this.deserialize);
  }

  async create(recipe: Omit<Recipe, 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    const db = await getDatabase();
    const now = Date.now();
    const newRecipe: Recipe = {
      ...recipe,
      createdAt: now,
      updatedAt: now,
    };

    await db.runAsync(
      `INSERT INTO recipes (id, name, brewMethod, beanId, parameters, notes, isDefault, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newRecipe.id,
        newRecipe.name,
        newRecipe.brewMethod,
        newRecipe.beanId || null,
        JSON.stringify(newRecipe.parameters),
        newRecipe.notes || null,
        newRecipe.isDefault ? 1 : 0,
        newRecipe.createdAt,
        newRecipe.updatedAt,
      ]
    );

    return newRecipe;
  }

  async update(recipe: Recipe): Promise<Recipe> {
    const db = await getDatabase();
    const updatedRecipe: Recipe = {
      ...recipe,
      updatedAt: Date.now(),
    };

    await db.runAsync(
      `UPDATE recipes SET name = ?, brewMethod = ?, beanId = ?, parameters = ?, notes = ?, isDefault = ?, updatedAt = ?
       WHERE id = ?`,
      [
        updatedRecipe.name,
        updatedRecipe.brewMethod,
        updatedRecipe.beanId || null,
        JSON.stringify(updatedRecipe.parameters),
        updatedRecipe.notes || null,
        updatedRecipe.isDefault ? 1 : 0,
        updatedRecipe.updatedAt,
        updatedRecipe.id,
      ]
    );

    return updatedRecipe;
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM recipes WHERE id = ?', [id]);
  }

  private deserialize(row: any): Recipe {
    return {
      ...row,
      parameters: JSON.parse(row.parameters) as BrewParameters,
    };
  }
}

export const recipeRepository = new RecipeRepository();

