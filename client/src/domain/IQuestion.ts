export interface Header {
  label: string;
  key: string;
  type: string;
  width?: string | number;
  options?: Option[];
  textBoxType?: string;
  multiline?: boolean;
  maxRows?: number;
}
export interface Option {
  label: string;
  key: string;
}
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
  headers?: Header[];
  hideMarks?: boolean;
  rows?: object &
    {
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
