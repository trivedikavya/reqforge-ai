const { GoogleGenerativeAI } = require("@google/generative-ai");
const Project = require('../models/Project.model');

// Initialize Gemini AI with the API Key from your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Handles AI chat and BRD generation logic using Gemini 1.5 Flash
 */
exports.chatWithAI = async (projectId, message) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found.`);
    }

    // Extract text context from any uploaded documents
    let documentContext = '';
    if (project.dataSources && project.dataSources.uploads && project.dataSources.uploads.length > 0) {
      documentContext = '\n--- Uploaded Document Context ---\n';
      project.dataSources.uploads.forEach((file, index) => {
        if (file.extractedText) {
          documentContext += `\nDocument ${index + 1} (${file.originalname}):\n${file.extractedText.substring(0, 15000)}\n`;
        }
      });
      documentContext += '\n--- End of Document Context ---\n';
    }

    // Using gemini-2.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let templateInstructions = "";
    if (project.templateType === 'agile') {
      templateInstructions = `
      You must format the BRD for an Agile context. 
      REQUIRED SECTIONS:
      1. Project Overview
      2. User Personas
      3. User Stories (in strict Gherkin format: As a [persona], I want to [action] so that [outcome])
      4. Acceptance Criteria
      5. Sprint Roadmap
      Do not add extra sections unless explicitly requested. Use bullet points heavily for readability.
      `;
    } else if (project.templateType === 'standard') {
      templateInstructions = `
      You must format the BRD using the Standard Enterprise template.
      REQUIRED SECTIONS (Use these exact headings):
      1. Executive Summary
      2. Project Objectives (S.M.A.R.T format)
      3. Needs Statement
      4. Project Scope (Include In-Scope and Out-of-Scope)
      5. Current and Proposed Process (As-Is vs To-Be)
      6. Project Requirements (Functional and Non-Functional)
      7. Stakeholders
      8. Project Schedule
      9. Cost-Benefit Analysis
      You must include ALL 9 sections without fail.
      `;
    } else if (project.templateType === 'comprehensive') {
      templateInstructions = `
      You must format the BRD using the Comprehensive Enterprise template.
      REQUIRED SECTIONS:
      1. Executive Overview & Business Case
      2. Detailed Scope & Exclusions
      3. Technical Requirements & Architecture
      4. Governance & Oversight
      5. Regulatory Compliance & Security Protocols
      6. Risk Mitigation & Contingency Planning
      7. Data Migration Plan
      8. Vendor Requirements & SLAs
      Provide extreme detail, suitable for C-level executives and compliance auditors.
      `;
    }

    const prompt = `
      Context: You are an expert Business Analyst working on Project: "${project.name}".
      Project Description: "${project.description || 'N/A'}"
      Template Type: ${project.templateType}
      ${templateInstructions}
      ${documentContext}

      User Input: "${message}"
      
      Task: Provide a professional response to the user. Use the uploaded document context provided above if requested or relevant to the user's prompt.
      If the user is asking to create or modify requirements, provide the full updated Markdown content for the BRD. Follow the template instructions strictly.
      
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

    const cleanedJson = textResponse.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
      return JSON.parse(cleanedJson);
    } catch (parseError) {
      console.warn("AI response was not valid JSON. Falling back to text-only mode.");
      return {
        message: textResponse.substring(0, 2000), // Safety truncation
        suggestions: [],
        brdUpdate: null
      };
    }
  } catch (error) {
    console.error("Gemini AI Service Error:", error);
    throw error;
  }
};