export interface Header {
  label: string;
  key: string;
  type: string;
  width?: string | number;
  options?: Option[];
  textBoxType?: string;
  multiline?: boolean;
  maxRows?: number;
  disabled?: boolean;
}
export interface Option {
  label: string;
  key: string;
}
interface QuestionBase {
  description: string;
  questionId: number;
  question_number: string;
  marks: number;
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
  hasKeywords?: boolean;
  keywordsMarksCalculation?: KeywordsMarksCalculation[];
  headers?: Header[];
  hideMarks?: boolean;
  rows?: object &
    {
      index: number;
      isManual: boolean;
      types?: object;
    }[];
  style?: object;
  showAdditionalCol?: boolean;
}

export interface IQuestion extends QuestionBase {
  _id: string;
  criteriaId: number;
  subQuestions?: SubQuestion[];
}

export interface SubQuestion extends QuestionBase {
  subQuestions?: SubQuestion[];
}

export interface KeywordsMarksCalculation {
  min: number;
  marks: number;
  max?: number;
}
