import initializeDatabase from "../db";
import { Account } from "../models/Account";

export class AccountsRepo {
    constructor(private db = initializeDatabase()) {}

    insert(account: Account): void {
        const stmt = this.db.prepare(`
        INSERT INTO accounts (organization_id, name, created_at, updated_at)
        VALUES (?, ?, ?, ?)
        `);
        stmt.run(
        account.organization_id,
        account.name,
        new Date(),
        new Date()
        );
    }

    update(account: Account): void {
        const stmt = this.db.prepare(`
        UPDATE accounts
        SET organization_id = ?, name = ?, updated_at = ?
        WHERE account_id = ?
        `);
        stmt.run(
            account.organization_id,
            account.name,
            new Date().toISOString(),
            account.account_id,
        );
    }

    find(account_id: number): Account | null {
        const row = this.db.prepare(`
        SELECT * FROM accounts WHERE account_id = ?
        `).get(account_id);
        return row ? Account.fromRow(row) : null;
    }

    delete(account_id: number): void {
        this.db.prepare(`
        DELETE FROM accounts WHERE account_id = ?
        `).run(account_id);
    }

    findByOrganization(organization_id: number): Account[] {
        const rows = this.db.prepare(`
        SELECT * FROM accounts WHERE organization_id = ?
        `).all(organization_id);
        return rows.map(Account.fromRow);
    }

    all(): Account[] {
        const rows = this.db.prepare(`SELECT * FROM accounts`).all();
        return rows.map(Account.fromRow);
      }
}
