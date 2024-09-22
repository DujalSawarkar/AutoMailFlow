import fs from "fs";
import csvParser from "csv-parser";

// Function to extract emails from CSV
export const extractEmailsFromCSV = async (
  filePath: string
): Promise<string[]> => {
  const emails: string[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        // Extract only the 'Email' column
        const email = row.Email;
        if (email) {
          emails.push(email.trim());
        }
      })
      .on("end", () => {
        console.log(`Extracted ${emails.length} emails from CSV`);
        console.log(emails.slice(0, 5));
        resolve(emails);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};
