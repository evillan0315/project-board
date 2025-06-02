import * as path from 'path';
//const path = require('path');

import { getDirectoryStructure, saveDirectoryStructure } from './generateStructure';

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
