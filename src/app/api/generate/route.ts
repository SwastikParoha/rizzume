import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `You are an elite resume writer and ATS optimization specialist. Transform the candidate's resume into a perfectly tailored, ATS-friendly resume for the specific job description provided.

RULES:
1. Extract ALL contact details (name, email, phone, location, LinkedIn, GitHub) from the resume
2. Analyze the job description for required skills, keywords, and responsibilities
3. Rewrite every experience bullet to: start with a strong action verb, incorporate job keywords naturally, quantify achievements where numbers exist, focus on impact
4. Prioritize skills matching the job requirements first
5. Write a compelling 2-3 sentence professional summary tailored to THIS specific role
6. Generate a professional cover letter (3 paragraphs, under 300 words total):
   - Para 1: Hook + why this specific role excites the candidate
   - Para 2: Most relevant experience/achievement
   - Para 3: Call to action + sign-off

YOUR RESPONSE MUST BE A SINGLE RAW JSON OBJECT.
DO NOT use markdown. DO NOT use backticks. DO NOT add any text before or after the JSON.
START your response with { and END with }

JSON schema:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "linkedin": "string",
  "github": "string",
  "summary": "2-3 sentence tailored professional summary",
  "experience": [
    {
      "company": "string",
      "title": "string",
      "duration": "string e.g. Jan 2022 – Mar 2024",
      "bullets": ["Action verb + achievement + metric"]
    }
  ],
  "skills": ["Skill 1", "Skill 2"],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "year": "string"
    }
  ],
  "coverLetter": "Full cover letter. Separate paragraphs with \\n\\n"
}`;

function extractJSON(raw: string): unknown {
  const attempts = [
    // 1. Direct parse
    () => JSON.parse(raw.trim()),
    // 2. Strip markdown fences then parse
    () => JSON.parse(raw.replace(/^[\s\S]*?```(?:json)?\s*/i, '').replace(/\s*```[\s\S]*$/i, '').trim()),
    // 3. Grab everything between first { and last }
    () => {
      const start = raw.indexOf('{');
      const end = raw.lastIndexOf('}');
      if (start === -1 || end === -1 || end <= start) throw new Error('No JSON object found');
      return JSON.parse(raw.slice(start, end + 1));
    },
  ];

  for (const attempt of attempts) {
    try { return attempt(); } catch { /* try next */ }
  }

  console.error('[/api/generate] unparseable response (first 600 chars):\n', raw.slice(0, 600));
  throw new SyntaxError('Could not extract JSON from AI response.');
}

async function callGemini(ai: GoogleGenAI, prompt: string): Promise<string> {
  const MODELS = ['gemini-2.0-flash', 'gemini-2.0-flash-lite', 'gemini-2.5-flash'];

  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          temperature: 0.4,   // lower = more deterministic / less hallucination
          maxOutputTokens: 8192,
        },
      });
      const text = response.text;
      if (text?.trim()) {
        console.log(`[/api/generate] got response from ${model}`);
        return text;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isSkippable =
        msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('quota') || msg.includes('404') || msg.includes('NOT_FOUND');
      console.warn(`[/api/generate] ${model}: ${msg.slice(0, 100)}`);
      if (isSkippable && model !== MODELS[MODELS.length - 1]) continue;
      throw err;
    }
  }
  throw new Error('All models failed or returned empty responses.');
}

export async function POST(req: NextRequest) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText?.trim() || !jobDescription?.trim()) {
      return NextResponse.json({ error: 'Both fields are required.' }, { status: 400 });
    }
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'GEMINI_API_KEY not set in .env.local.' }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `${SYSTEM_PROMPT}\n\nRESUME:\n${resumeText}\n\n---\n\nJOB DESCRIPTION:\n${jobDescription}`;

    // Up to 2 attempts before giving up
    const MAX_ATTEMPTS = 2;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        const raw = await callGemini(ai, prompt);
        const data = extractJSON(raw);
        return NextResponse.json(data);
      } catch (err) {
        lastError = err instanceof Error ? err : new Error(String(err));
        if (err instanceof SyntaxError && attempt < MAX_ATTEMPTS) {
          console.warn(`[/api/generate] attempt ${attempt} failed JSON parse, retrying...`);
          continue;
        }
        break;
      }
    }

    // All attempts exhausted
    const msg = lastError?.message ?? '';
    if (msg.includes('429') || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
      return NextResponse.json(
        { error: 'API quota exhausted. Wait a minute and try again, or create a fresh key at aistudio.google.com/apikey' },
        { status: 429 }
      );
    }
    if (lastError instanceof SyntaxError) {
      return NextResponse.json({ error: 'AI returned malformed data. Please try again.' }, { status: 500 });
    }
    return NextResponse.json({ error: msg || 'Generation failed.' }, { status: 500 });

  } catch (err) {
    console.error('[/api/generate] unhandled:', err);
    return NextResponse.json({ error: 'Unexpected server error.' }, { status: 500 });
  }
}
