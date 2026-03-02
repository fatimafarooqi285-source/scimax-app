export type QuestionType = "single" | "multi";

export interface QuestionOption {
  label: string;
  value: string;
  description?: string;
}

export interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: QuestionType;
  options: QuestionOption[];
  showIf?: {
    questionId: string;
    values: string[];
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  questions: Question[];
}

export interface QuizAnswer {
  categoryId: string;
  categoryName: string;
  questionId: string;
  question: string;
  answer: string | string[];
}

export interface ProtocolSection {
  title: string;
  content: string;
  icon?: string;
}

export interface Protocol {
  sections: ProtocolSection[];
  raw: string;
}
