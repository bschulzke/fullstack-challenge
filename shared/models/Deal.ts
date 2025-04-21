export enum DealStatus {
  Prospect = "Prospect",
  Negotiation = "Negotiation",
  Won = "Won",
  Lost = "Lost",
  OnHold = "OnHold"
}

export class Deal {
  constructor(
    public deal_id: number,
    public account_id: number,
    public name: string,
    public start_date: Date,
    public end_date: Date,
    public value: number,
    public status: DealStatus
  ) {}

  static fromRow(row: any): Deal {
    return new Deal(
      row.deal_id,
      row.account_id,
      row.name,
      new Date(row.start_date),
      new Date(row.end_date),
      row.value,
      row.status as DealStatus
    );
  }

  toRow(): any {
    return {
      deal_id: this.deal_id,
      account_id: this.account_id,
      name: this.name,
      start_date: this.start_date.toISOString(),
      end_date: this.end_date.toISOString(),
      value: this.value,
      status: this.status
    };
  }
}
