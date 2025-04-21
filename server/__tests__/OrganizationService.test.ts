import { OrganizationService } from "../services/OrganizationService";
import { OrganizationsRepo } from "../repos/OrganizationsRepo";
import { AccountService } from "../services/AccountService";
import { Organization } from "../../shared/models/Organization";
import { Account } from "../../shared/models/Account";

// Mock the dependencies
jest.mock("../repos/OrganizationsRepo");
jest.mock("../services/AccountService");

describe("OrganizationService", () => {
  let service: OrganizationService;
  let mockOrgRepo: jest.Mocked<OrganizationsRepo>;
  let mockAccService: jest.Mocked<AccountService>;

  beforeEach(() => {
    mockOrgRepo = new OrganizationsRepo() as jest.Mocked<OrganizationsRepo>;
    mockAccService = new AccountService() as jest.Mocked<AccountService>;
    service = new OrganizationService(mockOrgRepo, mockAccService);
  });

  it("should create an organization", () => {
    const org = new Organization(1, "Org 1", new Date(), new Date());
    mockOrgRepo.insert = jest.fn();

    service.createOrganization(org);

    expect(mockOrgRepo.insert).toHaveBeenCalledWith(org);
  });

  it("should update an organization", () => {
    const org = new Organization(1, "Updated Org", new Date(), new Date());
    mockOrgRepo.update = jest.fn();

    service.updateOrganization(org);

    expect(mockOrgRepo.update).toHaveBeenCalledWith(org);
  });

  it("should fetch an organization with its accounts", () => {
    const org = new Organization(1, "Org 1", new Date(), new Date());
    const accounts = [new Account(1, 1, "Account 1"), new Account(2, 1, "Account 2")];

    mockOrgRepo.find = jest.fn().mockReturnValue(org);
    mockAccService.getAccountsByOrganization = jest.fn().mockReturnValue(accounts);

    const result = service.getOrganization(1);

    expect(result).toBeInstanceOf(Organization);
    expect(result?.accounts).toEqual(accounts);
    expect(mockOrgRepo.find).toHaveBeenCalledWith(1);
    expect(mockAccService.getAccountsByOrganization).toHaveBeenCalledWith(1);
  });

  it("should return null if organization is not found", () => {
    mockOrgRepo.find = jest.fn().mockReturnValue(null);

    const result = service.getOrganization(99);

    expect(result).toBeNull();
  });

  it("should delete an organization", () => {
    const orgId = 1;
    mockOrgRepo.delete = jest.fn();

    service.deleteOrganization(orgId);

    expect(mockOrgRepo.delete).toHaveBeenCalledWith(orgId);
  });

  it("should fetch all organizations with their accounts", () => {
    const orgs = [
      new Organization(1, "Org 1", new Date(), new Date()),
      new Organization(2, "Org 2", new Date(), new Date())
    ];
    const accounts1 = [new Account(1, 1, "Account 1")];
    const accounts2 = [new Account(2, 2, "Account 2")];

    mockOrgRepo.all = jest.fn().mockReturnValue(orgs);
    mockAccService.getAccountsByOrganization = jest
      .fn()
      .mockImplementation((orgId: number) => {
        return orgId === 1 ? accounts1 : accounts2;
      });

    const result = service.getAllOrganizations();

    expect(result).toHaveLength(2);
    expect(result[0].accounts).toEqual(accounts1);
    expect(result[1].accounts).toEqual(accounts2);
    expect(mockOrgRepo.all).toHaveBeenCalled();
    expect(mockAccService.getAccountsByOrganization).toHaveBeenCalledWith(1);
    expect(mockAccService.getAccountsByOrganization).toHaveBeenCalledWith(2);
  });
});
