import { DealsRepo } from "../repos/DealsRepo";
import { Deal, DealStatus } from "../../shared/models/Deal";

export class DealService {
  constructor(private readonly repo = new DealsRepo()) {}

  createDeal(data: {
    account_id: number;
    name: string;
    start_date: string;
    end_date: string;
    value: number;
    status: DealStatus;
  }): void {
    const deal = new Deal(
      0,
      data.account_id,
      data.name,
      new Date(data.start_date),
      new Date(data.end_date),
      data.value,
      data.status
    );
    this.repo.insert(deal);
  }

  updateDeal(data: {
    deal_id: number;
    account_id: number;
    name: string;
    start_date: string;
    end_date: string;
    value: number;
    status: DealStatus;
  }): void {
    const deal = new Deal(
      data.deal_id,
      data.account_id,
      data.name,
      new Date(data.start_date),
      new Date(data.end_date),
      data.value,
      data.status
    );
    this.repo.update(deal);
  }

  getDeal(deal_id: number): Deal | null {
    return this.repo.find(deal_id);
  }

  deleteDeal(deal_id: number): void {
    this.repo.delete(deal_id);
  }

  getDealsForAccount(account_id: number): Deal[] {
    return this.repo.findByAccount(account_id);
  }
}
