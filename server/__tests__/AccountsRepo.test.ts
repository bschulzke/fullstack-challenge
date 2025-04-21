import { AccountsRepo } from "../repos/AccountsRepo";
import { Account } from "../../shared/models/Account";
import initializeDatabase from "../db";

jest.mock("../db", () => ({
    __esModule: true,
    default: jest.fn(() => ({
      prepare: jest.fn().mockReturnThis(),
      run: jest.fn(),
      get: jest.fn(),
      all: jest.fn(),
    })),
}));

beforeAll(() => {
  jest
  .useFakeTimers()
  .setSystemTime(new Date('2020-01-01T00:00:00Z'));
});

afterAll(() => {
  jest.useRealTimers();
});

describe("AccountsRepo", () => {
  let repo: AccountsRepo;
  let mockDb: any;

  beforeEach(() => {
    mockDb = initializeDatabase();
    repo = new AccountsRepo(mockDb);
  });

  it("should insert an account", () => {
    const account = new Account(1, 1, "Account 1");

    repo.insert(account);

    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO accounts"));
    expect(mockDb.run).toHaveBeenCalledWith(
      account.account_id,
      account.name,
      new Date(),
      new Date()
    );
  });

  it("should update an account", () => {
    const account = new Account(1, 1, "Updated Account", new Date("2025-02-01"));
    account.account_id = 1;

    repo.update(account);

    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("UPDATE accounts"));
    expect(mockDb.run).toHaveBeenCalledWith(
      account.account_id,
      account.name,
      new Date().toISOString(),
      account.account_id
    );
  });

  it("should find an account by ID", () => {
    const mockAccountRow = {
      account_id: 1,
      organization_id: 1,
      name: "Account 1",
      start_date: "2025-01-01T00:00:00.000Z",
      end_date: "2025-12-31T00:00:00.000Z",
    };
    mockDb.get.mockReturnValue(mockAccountRow);

    const account = repo.find(1);

    expect(account).toBeInstanceOf(Account);
    expect(account?.account_id).toBe(1);
    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM accounts"));
  });

  it("should return null if account is not found", () => {
    mockDb.get.mockReturnValue(null);

    const account = repo.find(99);

    expect(account).toBeNull();
  });

  it("should delete an account", () => {
    const account_id = 1;

    repo.delete(account_id);

    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM accounts"));
    expect(mockDb.run).toHaveBeenCalledWith(account_id);
  });

  it("should find all accounts by organization ID", () => {
    const mockAccountRows = [
      { account_id: 1, organization_id: 1, name: "Account 1", created_at: "2025-01-01T00:00:00.000Z", updated_at: "2025-12-31T00:00:00.000Z" },
      { account_id: 2, organization_id: 1, name: "Account 2", created_at: "2025-02-01T00:00:00.000Z", updted_at: "2025-12-31T00:00:00.000Z" },
    ];
    mockDb.all.mockReturnValue(mockAccountRows);

    const accounts = repo.findByOrganization(1);

    expect(accounts).toHaveLength(2);
    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM accounts"));
  });
});
