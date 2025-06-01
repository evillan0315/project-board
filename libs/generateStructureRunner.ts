import * as path from 'path';
const { getDirectoryStructure, saveDirectoryStructure } = require('./generateStructure');

const targetDir = path.resolve(process.argv[2] || '.');

const excludeFolders = ['node_modules', '.git'];

function main() {
  try {
    const structure = getDirectoryStructure(targetDir, excludeFolders);
    saveDirectoryStructure(structure, 'structure.json');
  } catch (error) {
    console.error('Failed to generate structure:', error);
  }
}

main();
