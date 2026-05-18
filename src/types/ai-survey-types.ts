export type AiSurveyQuestionType = "checkbox" | "multipleChoice";

export type AiSurveyQuestion = {
  question: string;
  options: string[];
  type: AiSurveyQuestionType;
  required: boolean;
  questionID: string;
};

export type AiSurveySection = {
  title: string;
  description: string;
  questions: AiSurveyQuestion[];
};

export type AiSurveyQuestionsResponse = {
  status: string;
  success: boolean;
  data: AiSurveySection[];
};

export type AiSurveyAnswerPayload = {
  q: string;
  a: string;
};

export type AiSurveySavePayload = {
  empCode: string;
  answers: AiSurveyAnswerPayload[];
};

export type ParsedOption = {
  value: string;
  label: string;
};
