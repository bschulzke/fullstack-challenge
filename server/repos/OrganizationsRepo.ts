import initializeDatabase from "../db";
import { Organization } from "../models/Organization";

export class OrganizationsRepo {
  constructor(private db = initializeDatabase()) {}

  insert(org: Organization): void {
    const stmt = this.db.prepare(`
      INSERT INTO organizations (name, created_at, updated_at)
      VALUES (?, ?, ?)
    `);
    stmt.run(org.name, new Date(), new Date());
  }

  update(org: Organization): void {
    const stmt = this.db.prepare(`
      UPDATE organizations
      SET name = ?, updated_at = ?
      WHERE organization_id = ?
    `);
    stmt.run(
      org.name,
      new Date().toISOString(),
      org.organization_id
    );
  }

  find(organization_id: number): Organization | null {
    const row = this.db.prepare(`
      SELECT * FROM organizations WHERE organization_id = ?
    `).get(organization_id);
    return row ? Organization.fromRow(row) : null;
  }

  delete(organization_id: number): void {
    this.db.prepare(`
      DELETE FROM organizations WHERE organization_id = ?
    `).run(organization_id);
  }

  all(): Organization[] {
    const rows = this.db.prepare(`SELECT * FROM organizations`).all();
    return rows.map(Organization.fromRow);
  }
}
