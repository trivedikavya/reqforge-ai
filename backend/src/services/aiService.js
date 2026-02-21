const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI with the API Key from your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Handles AI chat and BRD generation logic using Gemini 1.5 Flash
 */
exports.chatWithAI = async (projectId, message) => {
  try {
    // Using gemini-2.5-flash to avoid 404 errors with newer model names
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Context: You are an expert Business Analyst working on Project ID: ${projectId}.
      User Input: "${message}"
      
      Task: Provide a professional response to the user. 
      If the user is asking to create or modify requirements, provide the full updated Markdown content for the BRD.
      
      CRITICAL: You MUST return your response as a VALID JSON object exactly in this format:
      {
        "message": "A helpful text response to the user.",
        "suggestions": ["suggestion 1", "suggestion 2"],
        "brdUpdate": "The full updated BRD markdown text here, or null if no update is needed."
      }
      Do not include any text outside of the JSON object.
    `;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();

    // AI often wraps JSON in code blocks like \`\`\`json ... \`\`\`. We must strip those.
    const cleanedJson = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      return JSON.parse(cleanedJson);
    } catch (parseError) {
      console.warn("AI response was not valid JSON. Falling back to text-only mode.");
      return {
        message: textResponse,
        suggestions: [],
        brdUpdate: null
      };
    }
  } catch (error) {
    console.error("Gemini AI Service Error:", error);
    throw error;
  }
};