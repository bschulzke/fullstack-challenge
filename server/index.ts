import express from "express";
import cors from "cors";
import initializeDatabase from "./db";
import { OrganizationService } from "./services/OrganizationService";
import { OrganizationsRepo } from "./repos/OrganizationsRepo";
import { DealStatus } from "../shared/models/Deal";
import { AccountService } from "./services/AccountService";

const app = express();
const port = process.env.PORT || 3000;

const db = initializeDatabase();

// Initialize the OrganizationService
const orgService = new OrganizationService(new OrganizationsRepo(), new AccountService());

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const setupDummyData = () => {
  db.prepare("INSERT INTO organizations (name) VALUES (?)").run("Org 1");
  db.prepare("INSERT INTO organizations (name) VALUES (?)").run("Org 2");

  db.prepare("INSERT INTO accounts (organization_id, name) VALUES (?, ?)").run(1, "Account 1-1");
  db.prepare("INSERT INTO accounts (organization_id, name) VALUES (?, ?)").run(1, "Account 1-2");
  db.prepare("INSERT INTO accounts (organization_id, name) VALUES (?, ?)").run(2, "Account 2-1");

  // Updated the deal insertions to reflect the DealStatus enum
  db.prepare("INSERT INTO deals (account_id, name, start_date, end_date, status, value) VALUES (?, ?, ?, ?, ?, ?)").run(1, "Deal 1-1", "2025-01-01", "2025-12-31", DealStatus.Prospect, 100);
  db.prepare("INSERT INTO deals (account_id, name, start_date, end_date, status, value) VALUES (?, ?, ?, ?, ?, ?)").run(2, "Deal 1-2", "2025-01-01", "2025-12-31", DealStatus.Negotiation, 500);
  db.prepare("INSERT INTO deals (account_id, name, start_date, end_date, status, value) VALUES (?, ?, ?, ?, ?, ?)").run(3, "Deal 2-1", "2025-01-01", "2025-12-31", DealStatus.Won, 750);
};

setupDummyData();

// Welcome route
app.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM sqlite_master WHERE type='table';").all();
  res.json({ message: "Welcome to the server! 🎉", rows });
});

// New /organizations endpoint to fetch all organizations
app.get("/organizations", (req, res) => {
  try {
    const organizations = orgService.getAllOrganizations();
    res.json(organizations);
  } catch (error) {
    console.error("Error fetching organizations:", error);
    res.status(500).json({ message: "Error fetching organizations" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
