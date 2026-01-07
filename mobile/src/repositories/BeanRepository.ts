import { getDatabase } from '../database/db';
import { Bean } from '../types';

export class BeanRepository {
  async findAll(): Promise<Bean[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<Bean>('SELECT * FROM beans ORDER BY name ASC');
    return result || [];
  }

  async findById(id: string): Promise<Bean | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<Bean>('SELECT * FROM beans WHERE id = ?', [id]);
    return result || null;
  }

  async search(query: string): Promise<Bean[]> {
    const db = await getDatabase();
    const result = await db.getAllAsync<Bean>(
      'SELECT * FROM beans WHERE name LIKE ? OR origin LIKE ? ORDER BY name ASC',
      [`%${query}%`, `%${query}%`]
    );
    return result || [];
  }

  async create(bean: Omit<Bean, 'createdAt' | 'updatedAt'>): Promise<Bean> {
    const db = await getDatabase();
    const now = Date.now();
    const newBean: Bean = {
      ...bean,
      createdAt: now,
      updatedAt: now,
    };

    await db.runAsync(
      `INSERT INTO beans (id, name, roastLevel, origin, processingMethod, notes, isSeedData, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newBean.id,
        newBean.name,
        newBean.roastLevel,
        newBean.origin || null,
        newBean.processingMethod || null,
        newBean.notes || null,
        newBean.isSeedData ? 1 : 0,
        newBean.createdAt,
        newBean.updatedAt,
      ]
    );

    return newBean;
  }

  async update(bean: Bean): Promise<Bean> {
    const db = await getDatabase();
    const updatedBean: Bean = {
      ...bean,
      updatedAt: Date.now(),
    };

    await db.runAsync(
      `UPDATE beans SET name = ?, roastLevel = ?, origin = ?, processingMethod = ?, notes = ?, updatedAt = ?
       WHERE id = ?`,
      [
        updatedBean.name,
        updatedBean.roastLevel,
        updatedBean.origin || null,
        updatedBean.processingMethod || null,
        updatedBean.notes || null,
        updatedBean.updatedAt,
        updatedBean.id,
      ]
    );

    return updatedBean;
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM beans WHERE id = ?', [id]);
  }
}

export const beanRepository = new BeanRepository();

