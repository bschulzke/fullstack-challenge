import { DealService } from "../services/DealService";
import { DealsRepo } from "../repos/DealsRepo";
import { Deal, DealStatus } from "../../shared/models/Deal";

// Mock DealsRepo
jest.mock("../repos/DealsRepo");

describe("DealService", () => {
  let service: DealService;
  let mockRepo: jest.Mocked<DealsRepo>;

  beforeEach(() => {
    mockRepo = new DealsRepo() as jest.Mocked<DealsRepo>;
    service = new DealService(mockRepo);
  });

  it("should create a deal", () => {
    const data = {
      account_id: 1,
      name: "New Deal",
      start_date: "2025-01-01",
      end_date: "2025-12-31",
      value: 10000,
      status: DealStatus.Prospect
    };

    service.createDeal(data);

    expect(mockRepo.insert).toHaveBeenCalledWith(expect.objectContaining({
      account_id: 1,
      name: "New Deal",
      start_date: new Date("2025-01-01"),
      end_date: new Date("2025-12-31"),
      value: 10000,
      status: DealStatus.Prospect
    }));
  });

  it("should update a deal", () => {
    const data = {
      deal_id: 1,
      account_id: 2,
      name: "Updated Deal",
      start_date: "2025-02-01",
      end_date: "2025-12-01",
      value: 20000,
      status: DealStatus.Negotiation
    };

    service.updateDeal(data);

    expect(mockRepo.update).toHaveBeenCalledWith(expect.objectContaining({
      deal_id: 1,
      account_id: 2,
      name: "Updated Deal",
      start_date: new Date("2025-02-01"),
      end_date: new Date("2025-12-01"),
      value: 20000,
      status: DealStatus.Negotiation
    }));
  });

  it("should get a deal by ID", () => {
    const mockDeal = new Deal(1, 1, "Deal 1", new Date(), new Date(), 5000, DealStatus.Prospect);
    mockRepo.find.mockReturnValue(mockDeal);

    const result = service.getDeal(1);

    expect(mockRepo.find).toHaveBeenCalledWith(1);
    expect(result).toBe(mockDeal);
  });

  it("should delete a deal by ID", () => {
    service.deleteDeal(1);

    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it("should get deals for an account", () => {
    const mockDeals = [
      new Deal(1, 1, "Deal 1", new Date(), new Date(), 1000, DealStatus.Prospect),
      new Deal(2, 1, "Deal 2", new Date(), new Date(), 2000, DealStatus.Negotiation)
    ];
    mockRepo.findByAccount.mockReturnValue(mockDeals);

    const result = service.getDealsForAccount(1);

    expect(mockRepo.findByAccount).toHaveBeenCalledWith(1);
    expect(result).toEqual(mockDeals);
  });
});
