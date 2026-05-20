import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(401).json({ error: "Gemini API Key is missing on Vercel. Please set it in Settings > Environment Variables." });
    }

    const ai = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build-vercel',
        }
      }
    });

    const systemInstruction = `You are a friendly, encouraging AI teacher for kids learning the Malayalam language.
Your name is Appu (an elephant).
You MUST reply to all questions in the Malayalam language (മലയാളം), using Malayalam script.
Answer questions about Malayalam letters, words, history, or culture. 
Keep your answers very simple, short, and easy for a 5-8 year old to understand.
Use emojis to make it fun!
If a question is off-topic, gently steer it back to learning Malayalam.`;

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.status(200).json({ answer: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Try to extract a cleaner message if we got a raw JSON string or object
    let errorMessage = "An unexpected error occurred.";
    if (error.message) {
      errorMessage = error.message;
      try {
        const parsed = JSON.parse(error.message);
        if (parsed.error && parsed.error.message) {
          errorMessage = parsed.error.message;
        }
      } catch (e) {
        // Not JSON, just use as is
      }
    }
    
    res.status(500).json({ error: `Failed to connect to the AI teacher: ${errorMessage}` });
  }
}
