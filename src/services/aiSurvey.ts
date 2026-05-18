import type {
  AiSurveyQuestionsResponse,
  AiSurveySavePayload,
} from "../types/ai-survey-types";
import { baseApiInstance } from "./baseApiInstance";

const aiSurveyApi = baseApiInstance.injectEndpoints({
  endpoints: (builder) => ({
    getAiSurveyQuestions: builder.query<AiSurveyQuestionsResponse, void>({
      query: () => ({
        url: "/aisurvey/questions",
        method: "GET",
      }),
    }),
    saveAiSurveyResponse: builder.mutation<unknown, AiSurveySavePayload>({
      query: (body) => ({
        url: "/aisurvey/response/save",
        method: "POST",
        body,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAiSurveyQuestionsQuery,
  useSaveAiSurveyResponseMutation,
} = aiSurveyApi;
