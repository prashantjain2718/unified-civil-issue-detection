const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// User requested model
const modelId = 'gemini-2.5-flash';

/**
 * Task 1: Classification & Severity
 * Classify the issue type and assess severity.
 * @param {Buffer} imageBuffer - Image file buffer
 * @param {string} mimeType - MIME type of the image
 */
async function classifyIssue(imageBuffer, mimeType = 'image/jpeg') {
  try {
    const prompt = `Analyze this image of a civic issue. 
    Classify the issue type, assess its severity, and determine the responsible department.
    - severity: High (danger/blocking), Medium (nuisance), Low (cosmetic).
    - department: PWD (roads/potholes), Nagar Nigam (garbage/sanitation), PHED (water), Electricity (streetlights).
    Respond with JSON.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBuffer.toString('base64'),
          },
        },
        { text: prompt },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            issue_type: {
              type: 'STRING',
              enum: ['Pothole', 'Garbage Overflow', 'Broken Streetlight', 'Water Leakage', 'Other'],
            },
            severity: {
              type: 'STRING',
              enum: ['High', 'Medium', 'Low'],
            },
            department: {
              type: 'STRING',
              enum: ['PWD', 'Nagar Nigam', 'PHED', 'Electricity', 'Other'],
            },
            description: { type: 'STRING' },
          },
          required: ['issue_type', 'severity', 'department'],
        },
      },
    });

    // Handle response parsing
    const resultText = response.text;
    if (!resultText) {
      throw new Error('Empty response from AI');
    }
    // Clean up potential markdown code blocks
    const cleanText = resultText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini Analysis Error:', error);
    // Fallback for demo purposes or 404s
    return {
      issue_type: 'Unknown',
      severity: 'Medium',
      department: 'Admin',
      description: 'AI Analysis failed or API key invalid. Error: ' + error.message,
    };
  }
}

/**
 * Task 2: Resolution Verification
 * Verify if the issue is resolved comparing before and after images.
 * @param {Buffer} imageBeforeBuffer
 * @param {Buffer} imageAfterBuffer
 */
async function verifyResolution(imageBeforeBuffer, imageAfterBuffer, mimeType = 'image/jpeg') {
  try {
    const prompt = `Compare these two images. The first image shows a civic issue. The second image claims to show the resolved state.
    Has the civic issue present in the first image been fully resolved in the second image?
    Respond with a JSON object containing a boolean "resolved" field.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: [
        { text: prompt },
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBeforeBuffer.toString('base64'),
          },
        },
        {
          inlineData: {
            mimeType: mimeType,
            data: imageAfterBuffer.toString('base64'),
          },
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            resolved: { type: 'BOOLEAN' },
            confidence: { type: 'NUMBER' },
            explanation: { type: 'STRING' },
          },
          required: ['resolved', 'explanation'],
        },
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error('Empty response from AI');
    }
    const cleanText = resultText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini Verification Error:', error);
    return {
      resolved: false,
      explanation: 'AI verification service failed: ' + error.message,
    };
  }
}

module.exports = { classifyIssue, verifyResolution };
