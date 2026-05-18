import type {
  AiSurveyQuestion,
  AiSurveySavePayload,
  ParsedOption,
} from "../types/ai-survey-types";

export const parseOption = (raw: string): ParsedOption => {
  const hashIndex = raw.indexOf("#");
  if (hashIndex === -1) {
    return { value: raw, label: raw };
  }
  return {
    value: raw.slice(0, hashIndex),
    label: raw.slice(hashIndex + 1),
  };
};

export const questionFieldKey = (question: AiSurveyQuestion, index: number) =>
  `${question.questionID}__${index}`;

export type SurveyAnswersState = Record<string, string | string[]>;

export const buildSavePayload = (
  empCode: string,
  questions: AiSurveyQuestion[],
  answers: SurveyAnswersState
): AiSurveySavePayload => {
  const payloadAnswers = questions.map((question, index) => {
    const key = questionFieldKey(question, index);
    const value = answers[key];

    if (Array.isArray(value)) {
      return { q: question.questionID, a: value.join(",") };
    }

    return { q: question.questionID, a: value ?? "" };
  });

  return { empCode, answers: payloadAnswers };
};

export const validateSurveyAnswers = (
  questions: AiSurveyQuestion[],
  answers: SurveyAnswersState
): string | null => {
  for (let index = 0; index < questions.length; index += 1) {
    const question = questions[index];
    if (!question.required) continue;

    const key = questionFieldKey(question, index);
    const value = answers[key];

    if (question.type === "multipleChoice") {
      if (!Array.isArray(value) || value.length === 0) {
        return `Please answer: ${question.question}`;
      }
      continue;
    }

    if (!value || (typeof value === "string" && value.trim() === "")) {
      return `Please answer: ${question.question}`;
    }
  }

  return null;
};
