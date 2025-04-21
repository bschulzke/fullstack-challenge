import { DealsRepo } from "../repos/DealsRepo";
import { Deal, DealStatus } from "../models/Deal";
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

describe("DealsRepo", () => {
  let repo: DealsRepo;
  let mockDb: any;

  beforeEach(() => {
    mockDb = initializeDatabase();
    repo = new DealsRepo(mockDb);
  });

  it("should insert a deal", () => {
    const deal = new Deal(1, 1, "Deal 1", new Date("2025-01-01"), new Date("2025-12-31"), 1000, DealStatus.Prospect);

    repo.insert(deal);

    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO deals"));
    expect(mockDb.run).toHaveBeenCalledWith(
      deal.account_id,
      deal.name,
      deal.start_date.toISOString(),
      deal.end_date.toISOString(),
      deal.value,
      deal.status
    );
  });

  it("should update a deal", () => {
    const deal = new Deal(1, 1, "Updated Deal", new Date("2025-02-01"), new Date("2025-12-31"), 2000, DealStatus.Negotiation);
    deal.deal_id = 1;

    repo.update(deal);

    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("UPDATE deals"));
    expect(mockDb.run).toHaveBeenCalledWith(
      deal.account_id,
      deal.name,
      deal.start_date.toISOString(),
      deal.end_date.toISOString(),
      deal.value,
      deal.status,
      deal.deal_id
    );
  });

  it("should find a deal by ID", () => {
    const mockDealRow = {
      deal_id: 1,
      account_id: 1,
      name: "Deal 1",
      start_date: "2025-01-01T00:00:00.000Z",
      end_date: "2025-12-31T00:00:00.000Z",
      value: 1000,
      status: "Prospect"
    };
    mockDb.get.mockReturnValue(mockDealRow);

    const deal = repo.find(1);

    expect(deal).toBeInstanceOf(Deal);
    expect(deal?.deal_id).toBe(1);
    expect(deal?.value).toBe(1000);
    expect(deal?.status).toBe(DealStatus.Prospect);
    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM deals"));
  });

  it("should return null if deal is not found", () => {
    mockDb.get.mockReturnValue(null);

    const deal = repo.find(99);

    expect(deal).toBeNull();
  });

  it("should delete a deal", () => {
    const deal_id = 1;

    repo.delete(deal_id);

    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM deals"));
    expect(mockDb.run).toHaveBeenCalledWith(deal_id);
  });

  it("should find all deals by account ID", () => {
    const mockDealRows = [
      {
        deal_id: 1,
        account_id: 1,
        name: "Deal 1",
        start_date: "2025-01-01T00:00:00.000Z",
        end_date: "2025-12-31T00:00:00.000Z",
        value: 1000,
        status: "Prospect"
      },
      {
        deal_id: 2,
        account_id: 1,
        name: "Deal 2",
        start_date: "2025-02-01T00:00:00.000Z",
        end_date: "2025-12-31T00:00:00.000Z",
        value: 2000,
        status: "Negotiation"
      }
    ];
    mockDb.all.mockReturnValue(mockDealRows);

    const deals = repo.findByAccount(1);

    expect(deals).toHaveLength(2);
    expect(deals[0].value).toBe(1000);
    expect(deals[0].status).toBe(DealStatus.Prospect);
    expect(deals[1].status).toBe(DealStatus.Negotiation);
    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM deals"));
  });
});
