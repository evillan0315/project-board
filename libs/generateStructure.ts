import * as fs from 'fs';
import * as path from 'path';

/**
 * Represents an item in the file system (either a file or a directory).
 */
interface FileSystemItem {
  type: 'directory' | 'file';
  name: string;
  contents?: FileSystemItem[];
}

/**
 * Recursively generates a tree-like structure representing the contents of a directory.
 *
 * @param dirPath The path to the directory to process.
 * @param excludeFolders An array of folder names to exclude from the structure.
 * @returns A FileSystemItem object representing the directory structure.
 * @throws {Error} If an error occurs during directory traversal (e.g., directory not found, permission issues).  Consider removing the try/catch if you want calling function to handle it.
 */
export function getDirectoryStructure(dirPath: string, excludeFolders: string[] = []): FileSystemItem {
  try {
    const stats = fs.statSync(dirPath);
    const item: FileSystemItem = {
      type: stats.isDirectory() ? 'directory' : 'file',
      name: path.basename(dirPath),
    };

    if (stats.isDirectory()) {
      const contents = fs.readdirSync(dirPath);

      const filteredContents = contents.filter((child) => !excludeFolders.includes(child));

      item.contents = filteredContents.map((child) => getDirectoryStructure(path.join(dirPath, child), excludeFolders));
    }

    return item;
  } catch (error) {
    console.error(`Error getting directory structure for ${dirPath}: ${error}`);
    // Return a default item or re-throw the error if you prefer
    return {
      type: 'directory', // Or 'file' if you want a different default
      name: path.basename(dirPath),
      contents: [], // Or undefined if you don't want contents
    }; // Or throw error: throw error;
  }
}

/**
 * Saves the directory structure to a JSON file.
 *
 * @param structure The FileSystemItem object representing the directory structure.
 * @param outputPath The path to the output JSON file (relative to the project root).  Defaults to 'structure.json' in the project root.
 * @returns void
 * @throws {Error} If an error occurs during file writing.
 */
export function saveDirectoryStructure(structure: FileSystemItem, outputPath: string = 'structure.json'): void {
  const rootDir = process.cwd();
  const fullPath = path.join(rootDir, outputPath);

  try {
    fs.writeFileSync(fullPath, JSON.stringify(structure, null, 2), 'utf-8');
    console.log(`Directory structure saved to ${fullPath}`);
  } catch (error) {
    console.error(`Error saving directory structure: ${error}`);
    throw error; // Re-throw to let calling function handle it
  }
}
