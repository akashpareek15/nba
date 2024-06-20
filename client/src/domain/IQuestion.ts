
export interface IQuestion {
  _id: string;
  description: string;
  criteriaId: number;
  question_number: string;
  marks: number;
  subQuestions?: SubQuestion[];
  value?: string;
  reason?: string;
  keywords?: string[];
  obtainedMarks?: number;
}

export interface SubQuestion {
  description: string;
  question_number: string;
  marks: number;
  value?: string;
  keywords?: string[];
  reason?: string;
  obtainedMarks?: number;
  subQuestions?: SubQuestion[];
}
