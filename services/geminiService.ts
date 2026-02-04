
import { GoogleGenAI, Type } from "@google/genai";
import { DeviceInfo, SecurityAnalysis } from "../types";

export const analyzeDeviceInfo = async (info: DeviceInfo): Promise<SecurityAnalysis> => {
  // Initialize Gemini API with the environment variable API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analyze this device system information from a security auditor's perspective. 
  Pretend this is a CTF (Capture The Flag) challenge feedback. 
  Identify potential fingerprinting risks, privacy leaks, and hardware capabilities.
  
  Device Data: ${JSON.stringify(info, null, 2)}`;

  // Use gemini-3-pro-preview for advanced reasoning as per guidelines
  // Added thinkingConfig to allow the model to reason more deeply about the security data
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 4096 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { 
            type: Type.NUMBER, 
            description: "Risk score from 0 to 100 based on information leakage." 
          },
          summary: { 
            type: Type.STRING, 
            description: "A professional security summary." 
          },
          vulnerabilities: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of potential data points that could be used for fingerprinting."
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Steps to improve device anonymity."
          }
        },
        required: ["riskScore", "summary", "vulnerabilities", "recommendations"],
        propertyOrdering: ["riskScore", "summary", "vulnerabilities", "recommendations"]
      }
    }
  });

  try {
    // Access response.text property directly as per latest SDK guidelines
    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty model response");
    }
    return JSON.parse(responseText.trim());
  } catch (error) {
    console.error("Failed to parse AI analysis:", error);
    return {
      riskScore: 0,
      summary: "System analysis failed. Analysis module offline.",
      vulnerabilities: [],
      recommendations: []
    };
  }
};
