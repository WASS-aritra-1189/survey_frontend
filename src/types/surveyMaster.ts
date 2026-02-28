export interface SurveyMaster {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
  deletedAt: string | null;
  loginId: string;
  password: string;
  surveyLimit: number;
  status: string;
  accountId: string;
  settingId: string;
  totalSurveysAssigned: number;
  totalResponsesGiven: number;
  accessToken?: string;
}

export interface SurveyMastersResponse {
  success: boolean;
  messageId: string;
  messageType: string;
  data: {
    data: SurveyMaster[];
    total: number;
  };
}
