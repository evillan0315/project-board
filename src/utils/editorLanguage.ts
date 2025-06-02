import { javascript } from '@codemirror/lang-javascript';
import { markdown } from '@codemirror/lang-markdown';
import { sql } from '@codemirror/lang-sql';
import { python } from '@codemirror/lang-python';
import { yaml } from '@codemirror/lang-yaml';
import { xml } from '@codemirror/lang-xml';
import { json } from '@codemirror/lang-json';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { type Extension } from '@codemirror/state';
//import { handlebarsLanguage } from "@xiechao/codemirror-lang-handlebars";

export function detectLanguage(filePath: string): Extension {
  const ext = filePath.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'ts':
    case 'tsx':
    case 'jsx':
    case 'cjs':
    case 'mjs':
    case 'ejs':
    case 'prisma':
      return javascript();
    case 'json':
      return json();
    case 'html':
    case 'hbs':
      return html();
    case 'css':
      return css();
    case 'md':
      return markdown();
    case 'xml':
      return xml();
    case 'py':
      return python();
    case 'yml':
    case 'yaml':
      return yaml();
    case 'sql':
      return sql();
    //case "hbs":
    //return handlebarsLanguage();
    default:
      return [];
  }
}
