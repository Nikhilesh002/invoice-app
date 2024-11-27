import fs from 'fs/promises';
import path from 'path';
import { getDataWithAi } from './getDataWithAi';

export const makeChunks = async (fileInfo: { filePath: string; fileName: string; mimetype: string }) => {
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

    const header = lines[0]; // Extract header
    lines.shift(); // Remove header from lines
    const chunks = [];
    const sanitizedFileName = path.parse(fileName).name;

    // Split lines into chunks of 15
    for (let i = 0; i < lines.length; i += 15) {
      const chunk = lines.slice(i, i + 15).join('\n');
      const chunkFileName = `${sanitizedFileName}_chunk_${i / 15}.csv`;
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

    return results;
  } catch (error) {
    console.error('Error in makeChunks:', error);
    throw error;
  }
};
