// src/pages/editor.tsx
import { createSignal} from 'solid-js';
import { useAuth } from '../contexts/AuthContext';
import EditorComponent from '../components/EditorComponent';

export default function Editor() {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = createSignal(false);
  
  return (
    <div class="flex flex-col ">
    	<EditorComponent theme="dark" filePath={`https://raw.githubusercontent.com/evillan0315/project-board/refs/heads/main/README.md`} param="url" content={'// Enter code here'} language="typescript" /> 
    </div>
    
  );
}
