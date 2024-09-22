import fs from 'fs';
import pdfParse from 'pdf-parse';

// Function to extract emails from the PDF file
export const extractEmailsFromPDF = async (filePath: string): Promise<string[]> => {
  const dataBuffer = fs.readFileSync(filePath); // Reading the PDF file
  const data = await pdfParse(dataBuffer);      // Parsing the PDF

  // Regex to extract emails
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emails = data.text.match(emailRegex);
  console.log('Extracted Emails:', emails);     // Log the emails
  return emails || [];
};
