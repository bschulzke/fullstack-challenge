import { Deal } from "./Deal";

export class Account {
  public deals: Deal[] = [];

  constructor(
    public account_id: number,
    public organization_id: number,
    public name: string,
    public created_at: Date,
    public updated_at: Date
  ) {}

  static fromRow(row: any): Account {
    return new Account(
      row.account_id,
      row.organization_id,
      row.name,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }

  toRow(): any {
    return {
      account_id: this.account_id,
      organization_id: this.organization_id,
      name: this.name,
      created_at: this.created_at.toISOString(),
      updated_at: this.updated_at.toISOString()
    };
  }

  setDeals(deals: Deal[]) {
    this.deals = deals;
  }
}
