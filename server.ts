import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize express app
const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy-loaded Gemini AI client helper to avoid crashing on start if API key isn't provided
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in the Secrets panel.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", time: new Date().toISOString() });
});

// 2. Suggest Smart Replies
app.post("/api/suggest-replies", async (req, res) => {
  try {
    const { messages, contactName, role } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages parameter" });
    }

    const ai = getAIClient();
    
    // Format conversation history for the prompt
    const formattedHistory = messages
      .map((m: any) => `${m.senderName}: ${m.text}`)
      .join("\n");

    const prompt = `You are "Cognitive Ease AI Assistant", a smart enterprise communication analyzer.
Analyze this recent message thread between the user and ${contactName} (${role}):

---
${formattedHistory}
---

Generate exactly 3 professional, concise, and highly contextual quick replies or action phrases that the user (as the manager) can choose to reply with or suggest.
Keep each reply short (ideally under 12 words) and calibrated for "Cognitive Ease" (stress-free, clear, and actionable).

Return the suggestions as a JSON array of strings. Format must strictly match:
[
  "Short response option 1",
  "Short response option 2",
  "Short response option 3"
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Exactly 3 concise suggested replies"
        }
      }
    });

    const suggestionsText = response.text || "[]";
    const suggestions = JSON.parse(suggestionsText);
    res.json({ suggestions });
  } catch (error: any) {
    console.error("Error in /api/suggest-replies:", error);
    res.status(500).json({ 
      error: "Failed to generate smart replies. " + (error.message || ""),
      suggestions: [
        "Let me check and get back to you.",
        "That looks good, approved.",
        "Can we schedule a short call to discuss?"
      ] 
    });
  }
});

// 3. Process Chat Message & Generate Response (AI Assistant or Roleplay Contact)
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, contactName, role, userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).json({ error: "userMessage is required" });
    }

    const ai = getAIClient();

    const formattedHistory = (messages || [])
      .map((m: any) => `${m.senderName}: ${m.text}`)
      .join("\n");

    const systemInstruction = `You are a key component of 'Cognitive Ease', an intelligent messaging dashboard.
You play two roles based on the user's input:

1. CONTACT ROLEPLAY:
If the user's message is a direct response to the conversation (e.g., agreeing, disagreeing, asking questions to the contact, approving a proposal), you must roleplay as ${contactName} (${role}). Write a highly authentic, professional response to continue the conversation in character. Stay true to their business tone (e.g. Sarah is a PM - structured; Marcus is a Creative Director - minimal, design-focused).

2. ASSISTANT ANALYSIS:
If the user's message is asking you to analyze, summarize, write a draft, extract tasks, or search for info (e.g., "Summarize this thread", "What is the budget?", "What are the action items?", "Can you write a draft response accepting this?"), act as "Cognitive Ease AI Assistant". Give a friendly, analytical response in the third person or as a helper.

ADDITIONALLY, identify if any actionable task, todo, or milestone was agreed upon or requested in this message exchange. Extract them as a list of brief tasks (max 2) to be added to the user's Task List.

You MUST respond strictly in JSON with this schema:
{
  "replyText": "The text of your response (roleplayed or analytical)",
  "senderName": "The name of the sender. This must be either '${contactName}' if you did roleplay, or 'AI Assistant' if you did analysis",
  "isAI": true/false (set to true if 'AI Assistant', false if roleplaying as '${contactName}'),
  "extractedTasks": ["Task description 1", "Task description 2"] (Optional list of tasks to add, keep them short and actionable, else empty array)
}`;

    const prompt = `Current conversation history:
${formattedHistory}

User's incoming message:
"${userMessage}"

Generate your response in accordance with the system instruction. Keep responses crisp, elegant, and legible.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyText: { type: Type.STRING, description: "The response message text." },
            senderName: { type: Type.STRING, description: "Must be either the contact name or 'AI Assistant'" },
            isAI: { type: Type.BOOLEAN, description: "True if responding as AI Assistant, False if roleplaying as the contact" },
            extractedTasks: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }, 
              description: "Extracted action items or tasks from this exchange (if any)"
            }
          },
          required: ["replyText", "senderName", "isAI"]
        }
      }
    });

    const resultText = response.text || "{}";
    const result = JSON.parse(resultText);
    res.json(result);
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({
      error: "Failed to generate AI response. " + (error.message || ""),
      replyText: "I apologize, but I am currently experiencing an issue connecting to my intelligence engine. Let's try again in a moment.",
      senderName: "AI Assistant",
      isAI: true,
      extractedTasks: []
    });
  }
});

// 4. Summarize full conversation / Generate Brand-New AI Brief
app.post("/api/summarize-thread", async (req, res) => {
  try {
    const { messages, contactName, role } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages array is required" });
    }

    const ai = getAIClient();
    const formattedHistory = messages
      .map((m: any) => `${m.senderName}: ${m.text}`)
      .join("\n");

    const prompt = `You are "Cognitive Ease Intelligence Engine". Analyze the following chat thread with ${contactName} (${role}):
---
${formattedHistory}
---

Provide a full structured summary of the conversation.
Extract:
1. Status (e.g. "Awaiting Approval", "Action Required", "Resolved", "Under Discussion") - max 3 words
2. Sentiment (e.g. "Urgent / Collaborative", "Reflective", "Stable / Informational") - max 3 words
3. Resolution Time (e.g. "Est. 2 hours remaining", "Est. 1 day", "Completed") - max 4 words
4. Key Insights: Exactly 3 high-level bullet points summarizing critical facts or decisions (e.g. "$12k reallocation request", "Deadline: 5:00 PM Today")
5. Vertical Stripe Color Recommendation (high, medium, or low priority based on urgency)

Return your evaluation as a strict JSON object with this schema:
{
  "status": "...",
  "sentiment": "...",
  "resolutionTime": "...",
  "keyInsights": ["Insight 1", "Insight 2", "Insight 3"],
  "priority": "high" | "medium" | "low"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            status: { type: Type.STRING },
            sentiment: { type: Type.STRING },
            resolutionTime: { type: Type.STRING },
            keyInsights: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            priority: { type: Type.STRING, enum: ["high", "medium", "low"] }
          },
          required: ["status", "sentiment", "resolutionTime", "keyInsights", "priority"]
        }
      }
    });

    const summary = JSON.parse(response.text || "{}");
    res.json(summary);
  } catch (error: any) {
    console.error("Error in /api/summarize-thread:", error);
    res.status(500).json({ error: "Failed to summarize. " + (error.message || "") });
  }
});

// Setup Vite Dev server or Production static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in Development mode.");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files from dist in Production mode.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
