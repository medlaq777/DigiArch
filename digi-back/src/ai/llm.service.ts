import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class LlmService {
  private genAI: GoogleGenerativeAI;
  private logger = new Logger(LlmService.name);

  constructor(private configHelper: ConfigService) {
    const apiKey = this.configHelper.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
    } else {
      this.logger.warn('GEMINI_API_KEY not found in env');
    }
  }

  async extractMetadata(text: string): Promise<any> {
    if (!this.genAI) {
      throw new Error('LLM Service not initialized (Missing API Key)');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Extract the following information from the text provided below and return it as a JSON object:
        - nom (Last Name)
        - prenom (First Name)
        - cin (Identity Card Number)
        - departement (Department/Service if explicitly mentioned, otherwise "Unknown")
        - date_document (Date of the document if found, format YYYY-MM-DD, otherwise null)
        
        Text:
        ${text}
        
        RETURN ONLY THE VALID JSON STRING. NO MARKDOWN.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const textResponse = response.text();
      
      // Clean up markdown code blocks if present
      const cleaned = textResponse.replace(/^```json/, '').replace(/```$/, '').trim();
      
      return JSON.parse(cleaned);
    } catch (error) {
      this.logger.error('LLM Extraction Failed', error);
      throw new Error('LLM Failed');
    }
  }
}
