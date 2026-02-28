export interface Question {
  id?: string;
  question: string;
  questionType: string;
  options?: string[];
  isRequired: boolean;
  orderIndex: number;
}

export interface LocationConstraint {
  latitude: number;
  longitude: number;
  radiusInMeters: number;
}

export interface SurveyAssignmentLocation {
  id: string;
  surveyId: string;
  surveyMasterId: string;
  latitude: number;
  longitude: number;
  radiusInMeters: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Survey {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string | null;
  deletedAt?: string | null;
  title: string;
  description: string;
  target: number;
  deviceType: string[];
  questions: Question[];
  surveyMasterIds?: string[];
  status?: string;
  totalResponses?: number;
  accessToken?: string;
  requiresLocationValidation?: boolean;
}

export interface SurveyResponse {
  success: boolean;
  messageId: string;
  messageType: string;
  data: Survey;
}

export interface SurveyListResponse {
  success: boolean;
  messageId: string;
  messageType: string;
  data: {
    data: Survey[];
    total: number;
  };
}
