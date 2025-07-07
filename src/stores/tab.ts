import { atom } from 'nanostores';
import type { FileItem } from '../../types/types';
import { persistentAtom } from '../utils/persistentAtom';

export const openTabs = persistentAtom<string[]>('openTabs', []);
