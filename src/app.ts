import express from "express";
// import { initializeEmailSending } from "./emailService";
import dotenv from "dotenv";
import { extractEmailsFromCSV } from "./csvReader";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/start-email-sending", async (req, res) => {
  try {
    // await initializeEmailSending();
    await extractEmailsFromCSV("./Emails.csv");
    res.send("Email sending started. Check the console for progress.");
  } catch (error) {
    res.status(500).send("Error initializing email sending");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
