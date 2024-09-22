import nodemailer from "nodemailer";
import cron from "node-cron";
import dotenv from "dotenv";
import { extractEmailsFromCSV } from "./csvReader"; // Updated import for CSV

dotenv.config();

let emailIndex = 0;
let hrContacts: string[] = [];

// Configure nodemailer with SMTP credentials
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send email to individual recipient
const sendEmail = async (email: string) => {
  const mailOptions = {
    from: `"Your Name" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Job Application or Referral",
    html: `<p>Dear HR,</p>
           <p>I would like to apply for...</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}: ${error}`);
  }
};

// Send emails in batches of 10 per hour
const sendEmailsInBatches = () => {
  const emailsToSend = hrContacts.slice(emailIndex, emailIndex + 10);
  console.log("Current batch of emails:", emailsToSend);

  emailsToSend.forEach(async (email) => {
    await sendEmail(email);
  });

  emailIndex += 10;
  console.log(`Emails sent so far: ${emailIndex}/${hrContacts.length}`);

  if (emailIndex >= hrContacts.length) {
    console.log("All emails have been sent!");
    emailIndex = 0;
  }
};

// Schedule the job to run every hour
export const scheduleEmailSending = () => {
  cron.schedule("0 * * * *", () => {
    // Every hour
    console.log("Sending next batch of emails...");
    sendEmailsInBatches();
  });
};

// Initialize email sending
export const initializeEmailSending = async () => {
  hrContacts = await extractEmailsFromCSV("./Emails.csv"); // Updated to CSV file path
  console.log(`${hrContacts.length} emails loaded from the CSV`);
  scheduleEmailSending();
};
