const Project = require('../models/Project.model');
const BRD = require('../models/BRD.model');
const geminiClient = require('./geminiClient');

exports.getTemplateInstructions = (templateType) => {
  let templateInstructions = "";
  if (templateType === 'agile') {
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
  } else if (templateType === 'standard') {
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
  } else if (templateType === 'comprehensive') {
    templateInstructions = `
    You must format the BRD using the Comprehensive Business Requirements Document template exactly.
    REQUIRED SECTIONS (Use these exact numbered headings):
    1. Executive summary (Paragraph format)
    2. Project objectives (Bullet points improving client retention, views, conversion, etc.)
    3. Project scope (Paragraph detailing the team, deliverables, etc.)
    4. Business requirements (MUST be a Markdown Table with columns: Priority level, Critical level, Requirement description)
    5. Key stakeholders (MUST be a Markdown Table with columns: Name, Job role, Duties)
    6. Project constraints (MUST be a Markdown Table with columns: Constraint, Description - including Timeline, Budget, Team availability, Project risks)
    7. Cost-benefit analysis (MUST be a Markdown Table with columns: Cost, Benefit. Below the table include "Total cost = [Value]" and "Expected ROI = [Value]")
    
    CRITICAL: For sections 4, 5, 6, and 7, you MUST generate valid Markdown tables. Do not use plain text lists for those sections.
    `;
  }
  return templateInstructions;
};

/**
 * Handles AI chat and BRD generation logic using Gemini 1.5 Flash
 */
exports.chatWithAI = async (projectId, message) => {
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new Error(`Project ${projectId} not found.`);
    }

    // Fetch the existing BRD to provide context for refinement
    const existingBrd = await BRD.findOne({ projectId: projectId });
    const currentBrdContext = existingBrd && existingBrd.content
      ? `\n--- CURRENT BRD STATE ---\n${existingBrd.content}\n--- END OF CURRENT BRD STATE ---\n`
      : '\n--- CURRENT BRD STATE ---\n(No BRD has been generated yet)\n--- END OF CURRENT BRD STATE ---\n';

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

    const templateInstructions = exports.getTemplateInstructions(project.templateType);

    const prompt = `
      Context: You are an expert Business Analyst working on Project: "${project.name}".
      Project Description: "${project.description || 'N/A'}"
      Template Type: ${project.templateType}
      ${templateInstructions}
      ${documentContext}
      ${currentBrdContext}

      User Input: "${message}"
      
      Task: Provide a professional response to the user. Use the uploaded document context provided above if requested or relevant to the user's prompt.
      If the user is asking to create, modify, or refine requirements, provide the full updated Markdown content for the BRD. Follow the template instructions strictly.
      CRITICAL: ONLY provide a "brdUpdate" string if you made actual changes or refinements to the BRD. If you are just answering a question, "brdUpdate" MUST be null.
      
      CRITICAL: You MUST return your response as a VALID JSON object exactly in this format:
      {
        "message": "A helpful text response to the user.",
        "suggestions": ["Provide a metric", "Identify risks"],
        "brdUpdate": "The full updated BRD markdown text here, or null if no update is needed."
      }
      Do not include any text outside of the JSON object.
    `;

    const textResponse = await geminiClient.executeWithRetry(prompt, "gemini-1.5-flash");

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