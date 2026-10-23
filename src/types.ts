import { University, DegreeProgram, EntryTestInfo } from './data/universities';
import { StudentMarks } from './utils/admissions';

export type { University, DegreeProgram, EntryTestInfo, StudentMarks };

export type GeminiAiMode =
  | 'admissions'
  | 'tutor'
  | 'roadmap'
  | 'comparator'
  | 'interview';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isAiGenerated?: boolean;
  matchedUniversities?: University[];
  notice?: string | null;
  mode?: GeminiAiMode;
}

export type ActiveTab = 'predictor' | 'universities' | 'calculator' | 'entry-tests';

export interface AcademicQuote {
  id: string;
  quote: string;
  author: string;
  designation: string;
}

export const ACADEMIC_QUOTES: AcademicQuote[] = [
  {
    id: 'jinnah-1',
    quote: 'Education is a matter of life and death for Pakistan. The world is progressing so rapidly that without high-standard education, we will be left far behind.',
    author: 'Quaid-e-Azam Muhammad Ali Jinnah',
    designation: 'Founder of Pakistan (First All-Pakistan Education Conference, 1947)'
  },
  {
    id: 'salam-1',
    quote: 'Scientific thought and its creation is the common and shared heritage of all mankind. Strive tirelessly for knowledge, discovery, and truth.',
    author: 'Prof. Abdus Salam',
    designation: 'Nobel Laureate in Physics'
  },
  {
    id: 'iqbal-1',
    quote: 'Elevate yourself through knowledge and relentless effort so high that before each destiny, the Divine asks: tell me, what is your desire?',
    author: 'Allama Muhammad Iqbal',
    designation: 'Philosopher, Scholar & National Poet'
  },
  {
    id: 'sir-syed-1',
    quote: 'Acquire knowledge from wherever you find it. True education does not merely bestow literacy; it expands human reason and moral character.',
    author: 'Sir Syed Ahmad Khan',
    designation: 'Educational Pioneer & Founder of Aligarh Movement'
  }
];
