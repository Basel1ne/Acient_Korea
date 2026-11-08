export type Era = 'goryeo' | 'joseon';

export type PageRange = number;

export interface MultipleChoiceQuestion {
  id: number;
  page: PageRange;
  section: string;
  difficulty: '기초' | '표준' | '심화';
  question: string;
  passage?: string;
  options: string[];
  answer: number; // 1 to 5
  explanation: string;
  keyConcept: string;
}

export interface SubjectiveQuestion {
  id: number;
  page: PageRange;
  section: string;
  type: '단답형' | '빈칸 채우기' | '서술형';
  difficulty: '기초' | '표준' | '심화';
  question: string;
  passage?: string;
  answer: string;
  keyWords: string[];
  criteria: string[];
  explanation: string;
}

export interface ExamSummarySection {
  page: PageRange;
  title: string;
  subtitle: string;
  points: {
    title: string;
    description: string;
    badge?: string;
    details?: string[];
  }[];
  quotes?: {
    source: string;
    text: string;
    meaning: string;
  }[];
}
