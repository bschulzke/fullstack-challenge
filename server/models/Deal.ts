export class Deal {
    constructor(
      public deal_id: number,
      public account_id: number,
      public name: string,
      public start_date: Date,
      public end_date: Date
    ) {}

    static fromRow(row: any): Deal {
      return new Deal(
        row.deal_id,
        row.account_id,
        row.name,
        new Date(row.start_date),
        new Date(row.end_date)
      );
    }

    toRow(): any {
      return {
        deal_id: this.deal_id,
        account_id: this.account_id,
        name: this.name,
        start_date: this.start_date.toISOString(),
        end_date: this.end_date.toISOString()
      };
    }
  }
