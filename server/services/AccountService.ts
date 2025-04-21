import { Account } from "../models/Account";
import { AccountsRepo } from "../repos/AccountsRepo";
import { DealsRepo } from "../repos/DealsRepo";
import { Deal } from "../models/Deal";

export class AccountService {
  private dealsRepo = new DealsRepo();

  constructor(private accountRepo = new AccountsRepo()) {}

  createAccount(account: Account): void {
    this.accountRepo.insert(account);
  }

  updateAccount(account: Account): void {
    this.accountRepo.update(account);
  }

  getAccount(id: number): Account | null {
    const account = this.accountRepo.find(id);
    if (account) {
      const deals: Deal[] = this.dealsRepo.findByAccount(id);
      account.setDeals(deals);
    }
    return account;
  }

  deleteAccount(id: number): void {
    this.accountRepo.delete(id);
  }

}
