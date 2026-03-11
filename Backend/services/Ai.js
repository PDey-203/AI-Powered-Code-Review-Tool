const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw new Error("Gemini API Key is not defined in environment variables.");
}

const ai = new GoogleGenAI({ apiKey });

async function main(prompt) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            config: {
                systemInstruction: `
                You are a senior developer performing a professional code review.
                
                Respond using this structure:
                
                ### Issues Found
                List the problems in the code.
                
                ### Why They Matter
                Explain the consequences.
                
                ### Suggested Fixes
                Explain how to fix them.
                
                ### Improved Code
                Provide the corrected code.
                `
                ,
            },
            contents: prompt
        });

        return response?.text ?? "";
    } catch (error) {
        console.error("Gemini API Error:", error.message);
        throw error;
    }
}

module.exports = main;