import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the API client
// We assume process.env.API_KEY is available as per instructions.
// In a real build environment, ensure this is set.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const generateChatResponse = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure process.env.API_KEY.";
  }

  try {
    // We use the lightweight flash model for quick UI interactions
    const model = 'gemini-2.5-flash';
    
    // Construct the prompt with history if needed, 
    // or use the Chat API. Here we use a stateless generateContent 
    // for simplicity, or we can map the history to the request.
    // For a robust chat, using ai.chats.create is better, but to keep 
    // the service stateless for this demo, we'll just send the message
    // with a system instruction context.
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents: [
        ...history,
        {
          role: 'user',
          parts: [{ text: message }]
        }
      ],
      config: {
        systemInstruction: "You are a helpful, concise, and professional dashboard assistant. Help the user with navigation, data analysis, or general queries.",
      }
    });

    return response.text || "I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while processing your request.";
  }
};

export const generateStreamResponse = async function* (
    message: string,
    history: { role: string; parts: { text: string }[] }[] = []
) {
    if (!apiKey) {
        yield "API Key is missing.";
        return;
    }

    try {
         const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a smart assistant embedded in a React dashboard. Be concise.",
            },
            history: history
        });

        const result = await chat.sendMessageStream({ message });
        
        for await (const chunk of result) {
            yield (chunk as GenerateContentResponse).text;
        }

    } catch (error) {
        console.error("Stream Error", error);
        yield "An error occurred during generation.";
    }
}