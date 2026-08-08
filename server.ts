/**
 * Personal AI OS - Express Server with Vite Middleware & Server-Side Gemini API
 */
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper to initialize GoogleGenAI lazily with telemetry User-Agent header
function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not configured');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction for the Personal AI OS Assistant
const ASSISTANT_SYSTEM_INSTRUCTION = `You are Personal AI OS — a calm, highly intelligent, private workspace assistant built for clarity and focus.
Your goal is to help the user organize their day, prioritize important tasks, answer questions about their workspace, and generate thoughtful plans.

Core Principles:
1. Always be calm, clear, concise, and helpful.
2. Maintain a professional, serene tone. Avoid promotional buzzwords or artificial hype.
3. Keep responses structured with clear markdown bullet points when listing actions or advice.
4. When suggesting actions (e.g. creating tasks, rescheduling overdue items, planning the day), format them cleanly so the user can review and approve them.
5. Respect user privacy and local workspace context.`;

// 1. AI Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history, context } = req.body;
    const ai = getAIClient();

    // Formulate workspace context text
    const contextPrompt = `
CURRENT WORKSPACE CONTEXT:
User Name: ${context?.user?.name || 'Alex'}
Daily Goal Focus: ${context?.user?.dailyGoalFocus || 'Not set'}

TASKS (${context?.tasks?.length || 0} total):
${(context?.tasks || [])
  .slice(0, 15)
  .map(
    (t: any) =>
      `- [${t.completed ? 'x' : ' '}] (${t.priority}) "${t.title}" (Due: ${t.dueDate || 'Today'}, Project: ${t.project})`
  )
  .join('\n')}

TODAY'S SCHEDULE / CALENDAR (${context?.calendar?.length || 0} events):
${(context?.calendar || [])
  .map((c: any) => `- ${c.startTime} - ${c.endTime}: ${c.title} (${c.category})`)
  .join('\n')}

NOTES (${context?.notes?.length || 0} notes):
${(context?.notes || [])
  .slice(0, 10)
  .map((n: any) => `- "${n.title}" [Folder: ${n.folder}]`)
  .join('\n')}

ACTIVE GOALS (${context?.goals?.length || 0}):
${(context?.goals || [])
  .map((g: any) => `- Goal: "${g.title}" (${g.progress}% completed)`)
  .join('\n')}

AI MEMORY FACTS:
${(context?.memory || []).map((m: any) => `- ${m.key}: ${m.value}`).join('\n')}
`;

    const contents = [
      { role: 'user', parts: [{ text: contextPrompt }] },
      ...(history || []).map((h: any) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction: ASSISTANT_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    res.json({
      reply: response.text || 'I am ready to help you plan and manage your day.',
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: error.message || 'Failed to communicate with AI model' });
  }
});

// 2. AI Daily Planner Endpoint ("Plan my day")
app.post('/api/ai/plan-day', async (req, res) => {
  try {
    const { tasks, calendar, goals, preferences } = req.body;
    const ai = getAIClient();

    const prompt = `Analyze the user's tasks, calendar schedule, and goals to generate a realistic, time-blocked daily plan.

Tasks to fit:
${(tasks || []).map((t: any) => `- (${t.priority}) "${t.title}" (Est time: 45m)`).join('\n')}

Calendar commitments:
${(calendar || []).map((c: any) => `- ${c.startTime} - ${c.endTime}: ${c.title}`).join('\n')}

User Goal Focus: ${preferences?.dailyGoalFocus || 'High focus work'}

Generate a structured array of time blocks covering the day from 08:30 to 17:30.
Categories allowed: "deep_work", "meeting", "break", "planning", "admin".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert executive calendar planner.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              time: { type: Type.STRING, description: 'e.g. 09:00 - 10:30' },
              activity: { type: Type.STRING, description: 'Name of activity or task' },
              category: {
                type: Type.STRING,
                description: 'deep_work, meeting, break, planning, or admin',
              },
            },
            required: ['time', 'activity', 'category'],
          },
        },
      },
    });

    let planItems = [];
    try {
      planItems = JSON.parse(response.text || '[]');
    } catch {
      planItems = [];
    }

    res.json({ plan: planItems });
  } catch (error: any) {
    console.error('Plan Day Error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate daily plan' });
  }
});

// 3. AI Document Analysis Endpoint
app.post('/api/ai/analyze-document', async (req, res) => {
  try {
    const { fileName, fileContent, question } = req.body;
    const ai = getAIClient();

    const prompt = `Document Name: ${fileName}
Document Content snippet:
${(fileContent || '').slice(0, 8000)}

User Query: ${question || 'Summarize the key takeaways and extract actionable tasks from this document.'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'You are a precise document analyzer. Provide a clear summary and extract key action items.',
      },
    });

    res.json({ result: response.text });
  } catch (error: any) {
    console.error('Document Analysis Error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze document' });
  }
});

// 4. AI Note Summarizer / Action Extractor Endpoint
app.post('/api/ai/summarize-note', async (req, res) => {
  try {
    const { title, content } = req.body;
    const ai = getAIClient();

    const prompt = `Note Title: ${title}
Note Content:
${content}

Task: Provide a 2-bullet summary and list any actionable tasks extracted from this note.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an executive assistant summarizing notes concisely.',
      },
    });

    res.json({ summary: response.text });
  } catch (error: any) {
    console.error('Summarize Note Error:', error);
    res.status(500).json({ error: error.message || 'Failed to summarize note' });
  }
});

// 5. AI Goal Breakdown Endpoint
app.post('/api/ai/goal-breakdown', async (req, res) => {
  try {
    const { goalTitle, goalDescription, timeframe } = req.body;
    const ai = getAIClient();

    const prompt = `Goal: "${goalTitle}" (${timeframe})
Description: ${goalDescription || 'No description'}

Break this goal down into 3 to 5 realistic, sequential milestones to track progress.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              completed: { type: Type.BOOLEAN },
            },
            required: ['title'],
          },
        },
      },
    });

    let milestones = [];
    try {
      milestones = JSON.parse(response.text || '[]');
    } catch {
      milestones = [];
    }

    res.json({ milestones });
  } catch (error: any) {
    console.error('Goal Breakdown Error:', error);
    res.status(500).json({ error: error.message || 'Failed to break down goal' });
  }
});

// Server Initialization
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Personal AI OS running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
