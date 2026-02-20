const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

class PythonService {
  async generateBRD(data) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/ai/generate`, data);
      return response.data;
    } catch (error) {
      console.error('Python service error:', error.message);
      throw error;
    }
  }

  async chatWithAI(data) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/ai/chat`, data);
      return response.data;
    } catch (error) {
      console.error('Python chat error:', error.message);
      throw error;
    }
  }

  async scrapeWebsite(data) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/ai/scrape`, data);
      return response.data;
    } catch (error) {
      console.error('Python scrape error:', error.message);
      throw error;
    }
  }

  async detectConflicts(data) {
    try {
      const response = await axios.post(`${AI_SERVICE_URL}/api/ai/conflicts`, data);
      return response.data;
    } catch (error) {
      console.error('Python conflicts error:', error.message);
      throw error;
    }
  }
}

module.exports = new PythonService();