import { Deal } from "./Deal";

export class Account {
  public deals: Deal[] = [];

  constructor(
    public account_id: number,
    public organization_id: number,
    public name: string,
    public created_at: Date | null = null,
    public updated_at: Date | null = null
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

  setDeals(deals: Deal[]) {
    this.deals = deals;
  }
}
