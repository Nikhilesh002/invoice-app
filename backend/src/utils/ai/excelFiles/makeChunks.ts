import fs from 'fs/promises';
import path from 'path';
import { getDataWithAi } from '../nonExcelFiles/getDataWithAi';
import { IFileInfo } from '../../types';

export const makeChunks = async (fileInfo: IFileInfo) => {
  const { filePath, fileName, mimetype } = fileInfo;

  if (mimetype !== 'text/csv') {
    return await getDataWithAi(fileInfo);
  }

  try {
    // Read the file content
    const data = await fs.readFile(filePath, 'utf8');
    const lines = data.split('\n');

    // Handle empty files
    if (lines.length < 2) {
      throw new Error('The file is empty or contains no data lines.');
    }

    // Extract header, its first ele
    const header = lines[0];
    lines.shift();  // remove ele at 0 index
    const chunks = [];
    const sanitizedFileName = path.parse(fileName).name;

    const CHUNK_SIZE = 40;

    // Split lines into chunks of CHUNK_SIZE
    for (let i = 0; i < lines.length; i += CHUNK_SIZE) {
      const chunk = lines.slice(i, i + CHUNK_SIZE).join('\n');
      const chunkFileName = `${sanitizedFileName}_chunk_${i / CHUNK_SIZE}.csv`;
      const chunkFilePath = path.join(path.dirname(filePath), chunkFileName); // Create full file path

      // Write chunk to a new file
      await fs.writeFile(chunkFilePath, `${header}\n${chunk}`);
      chunks.push(chunkFilePath);

    }

    // Process each chunk asynchronously using getDataWithAi
    const results = await Promise.all(
      chunks.map((chunkPath) =>
        getDataWithAi({
          filePath: chunkPath,
          fileName: path.basename(chunkPath),
          mimetype: 'text/csv',
        })
      )
    );

    // if results has any null, then remove it
    results.forEach((result, index) => {
      if (result === null) {
        results.splice(index, 1);
      }
    });

    const finalOp:any=[]

    // I want to merge contrents of each element of results array into a single array
    results.forEach((result) => {
      if (result) {
        result.forEach((item:any) => {
          if (item) {
            finalOp.push(item);
          }
        });
      }
    });

    return finalOp;
  } catch (error) {
    console.error('Error in makeChunks:', error);
    throw error;
  }
};
