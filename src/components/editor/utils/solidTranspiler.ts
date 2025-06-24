// utils/solidTranspiler.ts
import { transform } from 'sucrase';
import * as ts from 'typescript';

export function transpileSolidToJs(code: string): string {
  const result = transform(code, {
    transforms: ['typescript', 'jsx'],
    production: true,
  });

  // Strip export default or import statements if any remain
  return result.code;
  //.replace(/export default /g, '')
  //.replace(/import .*?;/g, '')
  //.trim();
}

/**
 * Transpile SolidJS TSX/JSX code into plain JavaScript (ESNext).
 *
 * @param code - The SolidJS source code as a string
 * @param fileName - (Optional) The virtual file name (default: "file.tsx")
 * @returns The transpiled JavaScript code as a string
 */
export function transpileTypescriptToJs(code: string, fileName = 'file.tsx'): string {
  const result = ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ESNext,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.None, // Solid uses JSX syntax, this outputs JSX-compatible JS
      jsxFactory: 'h', // can be customized; Solid uses its own pragma
      jsxFragmentFactory: 'Fragment',
      esModuleInterop: true,
      allowJs: true,
    },
    fileName,
  });

  return result.outputText.trim();
}
