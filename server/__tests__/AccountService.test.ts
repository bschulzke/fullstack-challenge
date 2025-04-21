// tests/AccountService.test.ts
import { AccountService } from "../services/AccountService";
import { AccountsRepo } from "../repos/AccountsRepo";
import { Account } from "../../shared/models/Account";
import { DealsRepo } from "../repos/DealsRepo";

jest.mock("../repos/AccountsRepo");

describe("AccountService", () => {
  let service: AccountService;
  let mockAccRepo: jest.Mocked<AccountsRepo>;
  let mockDealsRepo: jest.Mocked<DealsRepo>;

  const mockAccount = new Account(
    1,
    1,
    "Test Account",
    new Date("2020-01-01T00:00:00Z"),
    new Date("2020-01-01T00:00:00Z")
  );

  beforeEach(() => {
    mockAccRepo = new AccountsRepo() as jest.Mocked<AccountsRepo>;
    mockDealsRepo = new DealsRepo() as jest.Mocked<DealsRepo>;
    service = new AccountService(mockAccRepo, mockDealsRepo);
  });

  it("should create an account", () => {
    service.createAccount(mockAccount);
    expect(mockAccRepo.insert).toHaveBeenCalledWith(mockAccount);
  });

  it("should update an account", () => {
    service.updateAccount(mockAccount);
    expect(mockAccRepo.update).toHaveBeenCalledWith(mockAccount);
  });

  it("should get an account by ID", () => {
    mockAccRepo.find.mockReturnValue(mockAccount);
    const result = service.getAccount(1);
    expect(result).toBe(mockAccount);
    expect(mockAccRepo.find).toHaveBeenCalledWith(1);
  });

  it("should delete an account", () => {
    service.deleteAccount(1);
    expect(mockAccRepo.delete).toHaveBeenCalledWith(1);
  });

  it("should fetch all accounts with their deals", () => {
    const accounts = [
      new Account(1, 1, "Account 1", new Date(), new Date()),
      new Account(2, 2, "Account 2", new Date(), new Date())
    ];
    const deals = [
        {
          deal_id: 1,
          account_id: 1,
          name: "Deal 1",
          start_date: new Date("2023-01-01T00:00:00Z"),
          end_date: new Date("2023-12-31T00:00:00Z"),
          value: 1000,
          status: "Prospect"
        },
        {
          deal_id: 2,
          account_id: 2,
          name: "Deal 2",
          start_date: new Date("2023-02-01T00:00:00Z"),
          end_date: new Date("2023-11-30T00:00:00Z"),
          value: 5000,
          status: "Negotiation"
        }
      ];

    mockAccRepo.all = jest.fn().mockReturnValue(accounts);
    mockDealsRepo.findByAccount = jest.fn().mockReturnValue(deals);

    const result = service.getAllAccounts();

    expect(result).toHaveLength(2);
    expect(result[0].deals).toEqual(deals);
    expect(result[1].deals).toEqual(deals);
    expect(mockAccRepo.all).toHaveBeenCalled();
    expect(mockDealsRepo.findByAccount).toHaveBeenCalledWith(1);
    expect(mockDealsRepo.findByAccount).toHaveBeenCalledWith(2);
  });

});
