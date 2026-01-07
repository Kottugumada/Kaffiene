import { getDatabase } from '../database/db';
import { BrewLog, BrewParameters } from '../types';

export class BrewLogRepository {
  async findAll(limit?: number, offset?: number): Promise<BrewLog[]> {
    const db = await getDatabase();
    let query = 'SELECT * FROM brew_logs ORDER BY timestamp DESC';
    const params: any[] = [];

    if (limit !== undefined) {
      query += ' LIMIT ?';
      params.push(limit);
      if (offset !== undefined) {
        query += ' OFFSET ?';
        params.push(offset);
      }
    }

    const result = await db.getAllAsync<BrewLog>(query, params);
    return (result || []).map(this.deserialize);
  }

  async findById(id: string): Promise<BrewLog | null> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<BrewLog>('SELECT * FROM brew_logs WHERE id = ?', [id]);
    return result ? this.deserialize(result) : null;
  }

  async findByBeanId(beanId: string, limit?: number): Promise<BrewLog[]> {
    const db = await getDatabase();
    let query = 'SELECT * FROM brew_logs WHERE beanId = ? ORDER BY timestamp DESC';
    const params: any[] = [beanId];

    if (limit !== undefined) {
      query += ' LIMIT ?';
      params.push(limit);
    }

    const result = await db.getAllAsync<BrewLog>(query, params);
    return (result || []).map(this.deserialize);
  }

  async create(brewLog: Omit<BrewLog, 'id' | 'timestamp'>): Promise<BrewLog> {
    const db = await getDatabase();
    const id = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = Date.now();
    const newLog: BrewLog = {
      ...brewLog,
      id,
      timestamp,
    };

    await db.runAsync(
      `INSERT INTO brew_logs (id, beanId, brewMethod, recipeId, timestamp, parameters, rating, tasteNotes, structuredTaste, equipment, notes, troubleshootingSessionId, images)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        newLog.id,
        newLog.beanId,
        newLog.brewMethod,
        newLog.recipeId || null,
        newLog.timestamp,
        JSON.stringify(newLog.parameters),
        newLog.rating || null,
        newLog.tasteNotes || null,
        newLog.structuredTaste ? JSON.stringify(newLog.structuredTaste) : null,
        newLog.equipment || null,
        newLog.notes || null,
        newLog.troubleshootingSessionId || null,
        newLog.images ? JSON.stringify(newLog.images) : null,
      ]
    );

    return newLog;
  }

  async update(brewLog: BrewLog): Promise<BrewLog> {
    const db = await getDatabase();

    await db.runAsync(
      `UPDATE brew_logs SET beanId = ?, brewMethod = ?, recipeId = ?, parameters = ?, rating = ?, tasteNotes = ?, structuredTaste = ?, equipment = ?, notes = ?, troubleshootingSessionId = ?, images = ?
       WHERE id = ?`,
      [
        brewLog.beanId,
        brewLog.brewMethod,
        brewLog.recipeId || null,
        JSON.stringify(brewLog.parameters),
        brewLog.rating || null,
        brewLog.tasteNotes || null,
        brewLog.structuredTaste ? JSON.stringify(brewLog.structuredTaste) : null,
        brewLog.equipment || null,
        brewLog.notes || null,
        brewLog.troubleshootingSessionId || null,
        brewLog.images ? JSON.stringify(brewLog.images) : null,
        brewLog.id,
      ]
    );

    return brewLog;
  }

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM brew_logs WHERE id = ?', [id]);
  }

  private deserialize(row: any): BrewLog {
    return {
      ...row,
      parameters: JSON.parse(row.parameters) as BrewParameters,
      structuredTaste: row.structuredTaste ? JSON.parse(row.structuredTaste) : undefined,
      images: row.images ? JSON.parse(row.images) : undefined,
    };
  }
}

export const brewLogRepository = new BrewLogRepository();

