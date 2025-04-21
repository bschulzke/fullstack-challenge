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

  static fromJson(json: any): Account {
    const account = new Account(
      json.account_id,
      json.organization_id,
      json.name,
      new Date(json.created_at),
      new Date(json.updated_at)
    );

    if (json.deals) {
      const deals = json.deals.map(Deal.fromJson);
      account.setDeals(deals);
    }

    return account;
  }
}
