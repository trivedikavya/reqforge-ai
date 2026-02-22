const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Helper class to rotate between multiple Gemini API keys 
 * to mitigate 429 Too Many Requests quota errors.
 */
class GeminiClient {
    constructor() {
        this.keys = [];
        this.currentIndex = 0;

        // Support either single key or comma-separated multiple keys
        if (process.env.GEMINI_API_KEYS) {
            this.keys = process.env.GEMINI_API_KEYS.split(',').map(k => k.trim()).filter(k => k);
        } else if (process.env.GEMINI_API_KEY) {
            this.keys = [process.env.GEMINI_API_KEY.trim()];
        }

        if (this.keys.length === 0) {
            console.warn("No Gemini API keys found in environment variables.");
        } else {
            console.log(`[Gemini Setup] Loaded ${this.keys.length} API keys for rotation.`);
        }
    }

    // Gets the next model initialized with a rotating key
    getModel(modelName = "gemini-1.5-flash") {
        if (this.keys.length === 0) {
            throw new Error("Missing Gemini API Key configuration.");
        }

        const key = this.keys[this.currentIndex];

        // Rotate to next key for next time
        this.currentIndex = (this.currentIndex + 1) % this.keys.length;

        const genAI = new GoogleGenerativeAI(key);
        return genAI.getGenerativeModel({ model: modelName });
    }

    // Helper to execute with custom retry logic and key rotation
    async executeWithRetry(prompt, modelName = "gemini-1.5-flash", maxRetries = 3) {
        let lastError = null;

        for (let i = 0; i < maxRetries; i++) {
            try {
                const model = this.getModel(modelName);
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text();
            } catch (error) {
                lastError = error;
                // If it's a 429 quota error, try again immediately with next key
                if ((error.status === 429 || error.message.includes('429')) && this.keys.length > 1) {
                    console.warn(`[Gemini] Key rotation triggered due to 429 Quota Error. Retrying (${i + 1}/${maxRetries})...`);
                    continue;
                }

                // Wait before retry on general errors
                console.warn(`[Gemini] Error encountered: ${error.message}. Retrying...`);
                await new Promise(res => setTimeout(res, 1500 * (i + 1)));
            }
        }

        throw lastError;
    }
}

const geminiClient = new GeminiClient();
module.exports = geminiClient;
