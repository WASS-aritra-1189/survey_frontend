import { BaseUrl } from "@/config/BaseUrl";

export interface SurveyResponse {
  id: string;
  surveyId: string;
  surveyMasterId: string;
  respondentName: string;
  respondentContact: string;
  responses: { questionId: string; answer: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface ResponseListResponse {
  success: boolean;
  data: {
    data: SurveyResponse[];
    total: number;
    page: number;
    limit: number;
  };
}

export const responseService = {
  async getAll(
    token: string,
    surveyId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    startDate?: string,
    endDate?: string
  ): Promise<ResponseListResponse> {
    const params = new URLSearchParams({
      surveyId,
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    const url = `${BaseUrl}/survey-responses?${params}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch responses");
    }

    return result;
  },

  async create(surveyId: string, responses: { questionId: string; answer: any }[]) {
    const response = await fetch(`${BaseUrl}/survey-responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ surveyId, responses })
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to submit response');
    }

    return result;
  },

  async uploadAudio(
    token: string,
    responseId: string,
    audioBlob: Blob
  ) {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await fetch(`${BaseUrl}/survey-responses/${responseId}/audio`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to upload audio');
    }

    return result;
  }
};
