// services/OrganizationService.ts
import { Organization } from "../models/Organization";
import { OrganizationsRepo } from "../repos/OrganizationsRepo";
import { AccountService } from "./AccountService";

export class OrganizationService {

  constructor(private orgRepo = new OrganizationsRepo(), private accountService = new AccountService()) {}

  createOrganization(org: Organization): void {
    this.orgRepo.insert(org);
  }

  updateOrganization(org: Organization): void {
    this.orgRepo.update(org);
  }

  // Updated method to include accounts when fetching an organization
  getOrganization(id: number): Organization | null {
    const organization = this.orgRepo.find(id);
    if (organization) {
      const accounts = this.accountService.getAccountsByOrganization(id); // Get accounts for the organization
      organization.setAccounts(accounts); // Attach the accounts to the organization
    }
    return organization;
  }

  deleteOrganization(id: number): void {
    this.orgRepo.delete(id);
  }

  getAllOrganizations(): Organization[] {
    const organizations = this.orgRepo.all();
    organizations.forEach(org => {
        const accounts = this.accountService.getAccountsByOrganization(org.organization_id);
        accounts.forEach(account => {

        });
        org.setAccounts(accounts);
    });
    return organizations;
  }
}
