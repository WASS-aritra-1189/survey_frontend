import { BaseUrl } from "@/config/BaseUrl";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const faqService = {
  async getPublicFaqs(): Promise<FAQ[]> {
    const response = await fetch(`${BaseUrl}/faqs/public`);
    const result = await response.json();
    return result.data || result;
  },

  async getAllFaqs(token: string): Promise<FAQ[]> {
    const response = await fetch(`${BaseUrl}/faqs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const result = await response.json();
    return result.data || result;
  },

  async createFaq(token: string, faq: Omit<FAQ, 'id' | 'createdAt' | 'updatedAt'>): Promise<FAQ> {
    const response = await fetch(`${BaseUrl}/faqs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(faq)
    });
    const result = await response.json();
    return result.data || result;
  },

  async updateFaq(token: string, id: string, faq: Partial<FAQ>): Promise<FAQ> {
    const response = await fetch(`${BaseUrl}/faqs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(faq)
    });
    const result = await response.json();
    return result.data || result;
  },

  async deleteFaq(token: string, id: string): Promise<void> {
    await fetch(`${BaseUrl}/faqs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};