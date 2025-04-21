import { Account } from "../../shared/models/Account";
import { AccountsRepo } from "../repos/AccountsRepo";
import { DealsRepo } from "../repos/DealsRepo";
import { Deal } from "../../shared/models/Deal";

export class AccountService {

  constructor(private accountRepo = new AccountsRepo(), private dealsRepo = new DealsRepo()) {}

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

  getAllAccounts(): Account[] {
    const accounts = this.accountRepo.all();
    accounts.forEach(account => {
      const deals = this.dealsRepo.findByAccount(account.account_id);
      account.setDeals(deals);
    });
    return accounts;
  }

  getAccountsByOrganization(orgId: number): Account[] {
    const accounts = this.accountRepo.findByOrganization(orgId);
    accounts.forEach(account => {
      const deals = this.dealsRepo.findByAccount(account.account_id);
      account.setDeals(deals);
    });
    return accounts;
  }
}
