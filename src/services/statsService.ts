import { BaseUrl } from "@/config/BaseUrl";

export interface QuestionStat {
  questionId: string;
  questionText: string;
  totalAnswers: number;
  answerCounts: Record<string, number>;
}

export interface SurveyStats {
  surveyId: string;
  surveyTitle: string;
  totalResponses: number;
  questionStats: QuestionStat[];
}

export interface SurveyStatsResponse {
  success: boolean;
  data: SurveyStats;
}

export const statsService = {
  getSurveyStats: async (token: string, surveyId: string): Promise<SurveyStatsResponse> => {
    const response = await fetch(`${BaseUrl}/survey-responses/stats/${surveyId}?sortBy=createdAt&sortOrder=DESC`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch survey stats");
    }

    return result;
  },
};
