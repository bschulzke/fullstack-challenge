// tests/AccountService.test.ts
import { AccountService } from "../services/AccountService";
import { AccountsRepo } from "../repos/AccountsRepo";
import { Account } from "../models/Account";

jest.mock("../repos/AccountsRepo");

describe("AccountService", () => {
  let service: AccountService;
  let mockRepo: jest.Mocked<AccountsRepo>;

  const mockAccount = new Account(
    1,
    1,
    "Test Account",
    new Date("2020-01-01T00:00:00Z"),
    new Date("2020-01-01T00:00:00Z")
  );

  beforeEach(() => {
    mockRepo = new AccountsRepo() as jest.Mocked<AccountsRepo>;
    service = new AccountService(mockRepo);
  });

  it("should create an account", () => {
    service.createAccount(mockAccount);
    expect(mockRepo.insert).toHaveBeenCalledWith(mockAccount);
  });

  it("should update an account", () => {
    service.updateAccount(mockAccount);
    expect(mockRepo.update).toHaveBeenCalledWith(mockAccount);
  });

  it("should get an account by ID", () => {
    mockRepo.find.mockReturnValue(mockAccount);
    const result = service.getAccount(1);
    expect(result).toBe(mockAccount);
    expect(mockRepo.find).toHaveBeenCalledWith(1);
  });

  it("should delete an account", () => {
    service.deleteAccount(1);
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

});
