import * as XLSX from 'xlsx';
import * as fs from 'fs';

// Function to convert Excel file to CSV
export const XLSXtoCSV=async(inputFilePath:string)=>{
  const outputFilePath=inputFilePath.replace(".xlsx",".csv");

  // Read the workbook
  const workbook = XLSX.readFile(inputFilePath);
  
  // Get the first sheet name
  const sheetName = workbook.SheetNames[0];
  
  // Get the worksheet
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert worksheet to CSV
  const csvData = XLSX.utils.sheet_to_csv(worksheet);
  
  // Write CSV to file
  fs.writeFileSync(outputFilePath, csvData, 'utf8');
  console.log(`CSV file has been created at: ${outputFilePath}`);

  fs.unlinkSync(inputFilePath);
  
  return outputFilePath;
}
