import initializeDatabase from "../db";
import { Deal } from "../models/Deal";

export class DealsRepo {
  constructor(private db = initializeDatabase()) {}

  insert(deal: Deal): void {
    const stmt = this.db.prepare(`
      INSERT INTO deals (account_id, name, start_date, end_date, value, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      deal.account_id,
      deal.name,
      deal.start_date.toISOString(),
      deal.end_date.toISOString(),
      deal.value,
      deal.status
    );
  }

  update(deal: Deal): void {
    const stmt = this.db.prepare(`
      UPDATE deals
      SET account_id = ?, name = ?, start_date = ?, end_date = ?, value = ?, status = ?
      WHERE deal_id = ?
    `);
    stmt.run(
      deal.account_id,
      deal.name,
      deal.start_date.toISOString(),
      deal.end_date.toISOString(),
      deal.value,
      deal.status,
      deal.deal_id
    );
  }

  find(deal_id: number): Deal | null {
    const row = this.db.prepare(`
      SELECT * FROM deals WHERE deal_id = ?
    `).get(deal_id);
    return row ? Deal.fromRow(row) : null;
  }

  delete(deal_id: number): void {
    this.db.prepare(`
      DELETE FROM deals WHERE deal_id = ?
    `).run(deal_id);
  }

  findByAccount(account_id: number): Deal[] {
    const rows = this.db.prepare(`
      SELECT * FROM deals WHERE account_id = ?
    `).all(account_id);
    return rows.map(Deal.fromRow);
  }
}
