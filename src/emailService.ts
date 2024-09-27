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


//sample object

const sendEmail = async (email: string) => {
  const mailOptions = {
    from: `"Dujal Sawarkar" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Job Application or Referral",
    html: `
      <p>Dear HR,</p>
      <p>
        My name is <strong>Dujal Sawarkar</strong>, and I am currently pursuing a 
        <strong>Computer Engineering degree</strong>. I have a strong foundation in 
        programming languages such as <strong>C++</strong>, <strong>JavaScript</strong>, and <strong>TypeScript</strong>. 
        My expertise includes web technologies like <strong>HTML</strong>, 
        <strong>CSS</strong>, <strong>React</strong>, <strong>Next.js</strong>, 
        <strong>Vue.js</strong>, <strong>Node.js</strong>, <strong>Express.js</strong>, 
        <strong>SQL</strong>, and <strong>MongoDB</strong>.
      </p>
      <p>
        I am eager to leverage my technical skills and passion for learning to 
        contribute to your team's success while gaining valuable industry experience.
      </p>
      <p>
        Enclosed is my resume for your review, which provides further details on my 
        qualifications and experiences. I would appreciate the opportunity to discuss 
        how my skills and aspirations align with any full-time opportunities available.
      </p>
      <p>Thank you for considering my application.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}: ${error}`);
  }
};



// for 1 mail
// const sendonemail = () => {
//   // console.log(transporter);
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return console.log(`Error: ${error}`);
//     }
//     console.log(`Email sent: ${info.response}`);
//   });
// };

const sendEmailsInBatches = () => {
  const emailsToSend = hrContacts.slice(emailIndex, emailIndex + 4); // Send 4 emails at a time
  console.log("Current batch of emails:", emailsToSend);

  // emailsToSend.forEach(async (email) => {
  //   await sendEmail(email); // Sending email to each in the batch
  // });

  emailIndex += 4; // Move the index forward by 4 emails
  console.log(`Emails sent so far: ${emailIndex}/${hrContacts.length}`);

  if (emailIndex >= hrContacts.length) {
    console.log("All emails have been sent!");
    emailIndex = 0; // Reset index if all emails are sent
  }
};

// Schedule the job to run every hour
export const scheduleEmailSending = () => {
  cron.schedule("*/5 * * * * *", () => {
    console.log("Sending next batch of emails...");
    sendEmailsInBatches();
  });
};

// Initialize email sending
export const initializeEmailSending = async () => {
  hrContacts = await extractEmailsFromCSV("./Emails.csv"); // Updated to CSV file path
  console.log(`${hrContacts.length} emails loaded from the CSV`);
  scheduleEmailSending();
  // sendonemail();
};
