// services/OrganizationService.ts
import { Organization } from "../models/Organization";
import { OrganizationsRepo } from "../repos/OrganizationsRepo";
import { AccountsRepo } from "../repos/AccountsRepo"; // Import the AccountsRepo

export class OrganizationService {

  constructor(private orgRepo = new OrganizationsRepo(), private accountsRepo = new AccountsRepo()) {}

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
      const accounts = this.accountsRepo.findByOrganization(id); // Get accounts for the organization
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
        const accounts = this.accountsRepo.findByOrganization(org.organization_id);
        console.log("ACCOUNTS FOR ORG", accounts);
        org.setAccounts(accounts);
    });
    return organizations;
  }
}
