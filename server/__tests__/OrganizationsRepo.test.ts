import { OrganizationsRepo } from "../repos/OrganizationsRepo";
import { Organization } from "../models/Organization";
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
    .setSystemTime(new Date("2020-01-01T00:00:00Z"));
});

afterAll(() => {
  jest.useRealTimers();
});

describe("OrganizationsRepo", () => {
  let repo: OrganizationsRepo;
  let mockDb: any;

  beforeEach(() => {
    mockDb = initializeDatabase();
    repo = new OrganizationsRepo(mockDb);
  });

  it("should insert an organization", () => {
    const org = new Organization(1, "Org 1", new Date(), new Date());

    repo.insert(org);

    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("INSERT INTO organizations"));
    expect(mockDb.run).toHaveBeenCalledWith(org.name, new Date(), new Date());
  });

  it("should update an organization", () => {
    const org = new Organization(1, "Updated Org", new Date(), new Date());

    repo.update(org);

    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("UPDATE organizations"));
    expect(mockDb.run).toHaveBeenCalledWith(
      org.name,
      new Date().toISOString(),
      org.organization_id
    );
  });

  it("should find an organization by ID", () => {
    const mockOrgRow = {
      organization_id: 1,
      name: "Org 1",
      created_at: "2020-01-01T00:00:00.000Z",
      updated_at: "2020-01-01T00:00:00.000Z",
    };
    mockDb.get.mockReturnValue(mockOrgRow);

    const org = repo.find(1);

    expect(org).toBeInstanceOf(Organization);
    expect(org?.organization_id).toBe(1);
    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM organizations"));
  });

  it("should return null if organization is not found", () => {
    mockDb.get.mockReturnValue(null);

    const org = repo.find(99);

    expect(org).toBeNull();
  });

  it("should delete an organization", () => {
    const orgId = 1;

    repo.delete(orgId);

    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("DELETE FROM organizations"));
    expect(mockDb.run).toHaveBeenCalledWith(orgId);
  });

  it("should return all organizations", () => {
    const mockOrgRows = [
      { organization_id: 1, name: "Org 1", created_at: "2020-01-01T00:00:00.000Z", updated_at: "2020-01-01T00:00:00.000Z" },
      { organization_id: 2, name: "Org 2", created_at: "2020-01-02T00:00:00.000Z", updated_at: "2020-01-02T00:00:00.000Z" }
    ];
    mockDb.all.mockReturnValue(mockOrgRows);

    const orgs = repo.all();

    expect(orgs).toHaveLength(2);
    expect(mockDb.prepare).toHaveBeenCalledWith(expect.stringContaining("SELECT * FROM organizations"));
  });
});
