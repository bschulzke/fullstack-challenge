import { Account } from "./Account";

export class Organization {
  public accounts: Account[] = [];

  constructor(
    public organization_id: number,
    public name: string,
    public created_at: Date,
    public updated_at: Date
  ) {}

  static fromRow(row: any): Organization {
    return new Organization(
      row.organization_id,
      row.name,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  toRow(): any {
    return {
      organization_id: this.organization_id,
      name: this.name,
      created_at: this.created_at.toISOString(),
      updated_at: this.updated_at.toISOString()
    };
  }

  setAccounts(accounts: Account[]) {
    this.accounts = accounts;
  }

  static fromJson(json: any): Organization {
    const org = new Organization(
      json.organization_id,
      json.name,
      new Date(json.created_at),
      new Date(json.updated_at)
    );

    if (json.accounts) {
      const accounts = json.accounts.map(Account.fromJson);
      org.setAccounts(accounts);
    }

    return org;
  }
}
