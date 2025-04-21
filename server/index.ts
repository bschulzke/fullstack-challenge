import express from "express";
import cors from "cors";
import initializeDatabase from "./db";
const app = express();
const port = process.env.PORT || 3000;

/**
 * Welcome to the Fullstack Challenge for the Server!
 *
 * This is a basic express server.
 * You can customize and organize it to your needs.
 * Good luck!
 */
const db = initializeDatabase();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM sqlite_master WHERE type='table';").all();
  res.json({ message: "Welcome to the server! 🎉", rows });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
