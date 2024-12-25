import { IFileInfo } from "../../../types";
import fs from 'fs/promises';
import { makeCsvPrompt } from "../makeSheetPrompt/makeCsvPrompt";
import { geminiText } from "../../askGemini";
import { formatData } from "./formatData";



export const handleCsv = async (fileInfo:IFileInfo)=>{
  const { filePath, fileName, mimetype } = fileInfo;

  try {
    // Read the file content
    const data = await fs.readFile(filePath, 'utf8');
    const lines = data.split('\n');

    // Handle empty files
    if (lines.length < 2) {
      throw new Error('The file is empty or contains no data lines.');
    }

    // make prompt
    const csvPrompt = makeCsvPrompt(lines[0]);

    // ask gemini for schema mapping
    const aiRes = await geminiText(csvPrompt);
    const SchemaMapping = JSON.parse(aiRes.split('json')[1].split('```')[0]);

    // then each row, make req file ds
    const formattedData = formatData(SchemaMapping,lines);
    console.log(formattedData);

    return [];
  } catch (error) {
    console.error('Error in makeChunks:', error);
    throw error;
  }
}
