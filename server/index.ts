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
  const existing = db.prepare("SELECT COUNT(*) as count FROM organizations").get() as {count: number};
  if (existing.count > 0) return;
  db.prepare("INSERT INTO organizations (name) VALUES (?)").run("The Resistance Network");

  db.prepare("INSERT INTO accounts (organization_id, name) VALUES (?, ?)").run(1, "Neo");
  db.prepare("INSERT INTO accounts (organization_id, name) VALUES (?, ?)").run(1, "Trinity");
  db.prepare("INSERT INTO accounts (organization_id, name) VALUES (?, ?)").run(1, "Agent Smith");

  db.prepare("INSERT INTO deals (account_id, name, start_date, end_date, status, value) VALUES (?, ?, ?, ?, ?, ?)").run(1, "The One's Awakening", "2025-01-01", "2025-03-31", DealStatus.Prospect, 50000);
  db.prepare("INSERT INTO deals (account_id, name, start_date, end_date, status, value) VALUES (?, ?, ?, ?, ?, ?)").run(1, "Destroy the Matrix", "2025-04-01", "2025-12-31", DealStatus.Negotiation, 100000);
  db.prepare("INSERT INTO deals (account_id, name, start_date, end_date, status, value) VALUES (?, ?, ?, ?, ?, ?)").run(1, "Free the Minds", "2025-01-01", "2025-12-31", DealStatus.Won, 500000);

  db.prepare("INSERT INTO deals (account_id, name, start_date, end_date, status, value) VALUES (?, ?, ?, ?, ?, ?)").run(2, "Matrix Infiltration", "2025-02-01", "2025-06-30", DealStatus.Prospect, 30000);
  db.prepare("INSERT INTO deals (account_id, name, start_date, end_date, status, value) VALUES (?, ?, ?, ?, ?, ?)").run(2, "Extract the Keymaker", "2025-03-01", "2025-09-30", DealStatus.Negotiation, 40000);
  db.prepare("INSERT INTO deals (account_id, name, start_date, end_date, status, value) VALUES (?, ?, ?, ?, ?, ?)").run(2, "Escape the Agents", "2025-05-01", "2025-12-31", DealStatus.Won, 20000);

  db.prepare("INSERT INTO deals (account_id, name, start_date, end_date, status, value) VALUES (?, ?, ?, ?, ?, ?)").run(3, "The Hunt for Rebels", "2025-01-01", "2025-06-30", DealStatus.Prospect, 150000);
  db.prepare("INSERT INTO deals (account_id, name, start_date, end_date, status, value) VALUES (?, ?, ?, ?, ?, ?)").run(3, "Track the Oracle", "2025-02-01", "2025-07-31", DealStatus.Negotiation, 200000);
  db.prepare("INSERT INTO deals (account_id, name, start_date, end_date, status, value) VALUES (?, ?, ?, ?, ?, ?)").run(3, "Eradicate the Zionists", "2025-03-01", "2025-12-31", DealStatus.Won, 500000);

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
