
interface QuestionBase {
  description: string;
  question_number: string;
  marks: number;
  keywords?: string[][] | string[];
  obtainedMarks?: number;
  code?: string;
  type?: string;
  disabled?: boolean;
  helperText?: string;
  value?: string;
  reason?: string;
  error?: string;
  documentId?: string;
  fileName?: string;
}

export interface IQuestion extends QuestionBase {
  _id: string;
  criteriaId: number;
  subQuestions?: SubQuestion[];
}

export interface SubQuestion extends QuestionBase {
  subQuestions?: SubQuestion[];
}
