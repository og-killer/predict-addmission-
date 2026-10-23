import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { PAK_UNIVERSITIES, University } from './src/data/universities';
import { calculateAggregate, predictChances, checkEligibility, searchUniversities, SAMPLE_PRACTICE_QUESTIONS, generateStudyPlan } from './src/utils/admissions';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Health & Status endpoint
app.get('/api/status', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(aiClient),
    verifiedUniversitiesCount: PAK_UNIVERSITIES.length,
    timestamp: new Date().toISOString()
  });
});

// Universities query endpoint
app.get('/api/universities', (req: Request, res: Response) => {
  const query = (req.query.q as string) || '';
  const province = (req.query.province as string) || '';
  const discipline = (req.query.discipline as string) || '';

  const results = searchUniversities(query, {
    province: province || undefined,
    discipline: discipline || undefined
  });

  res.json({
    count: results.length,
    results
  });
});

// Single university endpoint
app.get('/api/universities/:id', (req: Request, res: Response) => {
  const uni = PAK_UNIVERSITIES.find((u) => u.id === req.params.id);
  if (!uni) {
    return res.status(404).json({ error: 'University not found in database' });
  }
  res.json(uni);
});

// Helper: Extract grounding database info relevant to the user query and student profile
function getGroundingContext(
  userMessage: string,
  studentProfile?: {
    matricObtained?: number;
    matricTotal?: number;
    fscObtained?: number;
    fscTotal?: number;
    testObtained?: number;
    testTotal?: number;
    fscGroup?: string;
    domicile?: string;
  }
): { groundingText: string; matchedUniversities: University[] } {
  const msgLower = userMessage.toLowerCase();

  // Find mentioned or relevant universities
  const matchedUniversities = PAK_UNIVERSITIES.filter((u) => {
    const nameMatch =
      msgLower.includes(u.shortName.toLowerCase()) ||
      msgLower.includes(u.name.toLowerCase()) ||
      msgLower.includes(u.city.toLowerCase()) ||
      msgLower.includes(u.province.toLowerCase());

    const progMatch = u.programs.some(
      (p) =>
        msgLower.includes(p.name.toLowerCase()) ||
        msgLower.includes(p.code.toLowerCase()) ||
        msgLower.includes(p.discipline.toLowerCase())
    );

    return nameMatch || progMatch;
  });

  // If none matched specifically, provide top universities (NUST, FAST, UET, NED, KEMU, COMSATS)
  const unisToInclude =
    matchedUniversities.length > 0
      ? matchedUniversities.slice(0, 5)
      : PAK_UNIVERSITIES.slice(0, 4);

  let text = '=== VERIFIED DATABASE GROUNDING (SOURCE OF TRUTH) ===\n';
  text += 'CRITICAL RULE: Never invent university names, formulas, or closing merits not in this data.\n\n';

  for (const uni of unisToInclude) {
    text += `University: ${uni.name} (${uni.shortName})\n`;
    text += `Location: ${uni.city}, ${uni.province} | Sector: ${uni.sector}\n`;
    text += `Data Verification: ${uni.isVerified ? 'VERIFIED OFFICIAL DATA' : 'DEMO/UNVERIFIED'}\n`;
    text += `Official Website: ${uni.website} | Admission Portal: ${uni.admissionPortalUrl}\n`;
    text += `Sample Papers URL: ${uni.samplePapersUrl}\n`;
    text += `Merit Formula: ${uni.meritFormula.description} (${uni.meritFormula.explanation})\n`;

    if (uni.entryTestDetails) {
      text += `Entry Test: ${uni.entryTestDetails.testName} (${uni.entryTestDetails.totalMarks} marks, Negative Marking: ${uni.entryTestDetails.negativeMarking ? 'YES (-0.25)' : 'NO'})\n`;
      text += `Subjects: ${uni.entryTestDetails.subjectsBreakdown.map((s) => `${s.subject} (${s.mcqs} MCQs)`).join(', ')}\n`;
    }

    text += 'Programs & Previous Closing Merits (2024):\n';
    for (const prog of uni.programs) {
      text += `  - ${prog.name} (${prog.code}): Min FSc ${prog.eligibility.minFscPercentage}%, 2024 Closing Merit: ${prog.previousClosingMerits.year2024}%, 2023: ${prog.previousClosingMerits.year2023}%\n`;
    }

    if (uni.scholarships && uni.scholarships.length > 0) {
      text += 'Verified University Scholarships & Financial Assistance:\n';
      for (const sch of uni.scholarships) {
        text += `  * [${sch.type}] ${sch.name}: ${sch.coverage} | Eligibility: ${sch.eligibility} | Timeline: ${sch.deadlineOrCycle} | How to apply: ${sch.applicationMethod}\n`;
      }
    }
    text += '\n';
  }

  if (
    studentProfile &&
    studentProfile.matricObtained !== undefined &&
    studentProfile.matricTotal &&
    studentProfile.fscObtained !== undefined &&
    studentProfile.fscTotal
  ) {
    const matricPct = ((studentProfile.matricObtained / studentProfile.matricTotal) * 100).toFixed(2);
    const fscPct = ((studentProfile.fscObtained / studentProfile.fscTotal) * 100).toFixed(2);
    text += '=== STUDENT ACADEMIC PROFILE (ENTERED BY USER) ===\n';
    text += `Matric: ${studentProfile.matricObtained}/${studentProfile.matricTotal} (${matricPct}%)\n`;
    text += `Intermediate/FSc: ${studentProfile.fscObtained}/${studentProfile.fscTotal} (${fscPct}%)\n`;
    if (studentProfile.testObtained !== undefined && studentProfile.testTotal) {
      const testPct = ((studentProfile.testObtained / studentProfile.testTotal) * 100).toFixed(2);
      text += `Entry Test Score: ${studentProfile.testObtained}/${studentProfile.testTotal} (${testPct}%)\n`;
    }
    if (studentProfile.fscGroup) {
      text += `Academic Group: ${studentProfile.fscGroup}\n`;
    }
    if (studentProfile.domicile) {
      text += `Domicile / Province: ${studentProfile.domicile}\n`;
    }

    // Pre-calculate sample aggregates for top matching universities
    text += '\nPre-calculated Sample Aggregates for this student:\n';
    for (const uni of unisToInclude.slice(0, 3)) {
      const agg = calculateAggregate(uni.meritFormula.id, {
        matricObtained: studentProfile.matricObtained,
        matricTotal: studentProfile.matricTotal,
        fscObtained: studentProfile.fscObtained,
        fscTotal: studentProfile.fscTotal,
        testObtained: studentProfile.testObtained ?? 75,
        testTotal: studentProfile.testTotal ?? 100
      });
      text += `  * ${uni.shortName} (${uni.meritFormula.description}): Estimated Aggregate = ${agg.toFixed(2)}%\n`;
    }
    text += '\n';
  }

  return { groundingText: text, matchedUniversities: unisToInclude };
}

// Fallback response generator if Gemini API key is missing or fails
function generateDatabaseFallbackResponse(
  userMessage: string,
  studentProfile?: any
): { response: string; matchedUniversities: any[]; isFallback: boolean } {
  const msgLower = userMessage.toLowerCase();
  const { matchedUniversities } = getGroundingContext(userMessage, studentProfile);

  let reply = '';

  if (
    msgLower.includes('aggregate') ||
    msgLower.includes('marks') ||
    msgLower.includes('calculate') ||
    msgLower.includes('chances')
  ) {
    if (studentProfile?.fscObtained) {
      const fscPct = ((studentProfile.fscObtained / studentProfile.fscTotal) * 100).toFixed(1);
      const matricPct = ((studentProfile.matricObtained / studentProfile.matricTotal) * 100).toFixed(1);

      reply += `**Personalized Academic Review**\n\n`;
      reply += `Based on your profile:\n`;
      reply += `* **FSc / HSSC**: ${studentProfile.fscObtained}/${studentProfile.fscTotal} (${fscPct}%)\n`;
      reply += `* **Matric / SSC**: ${studentProfile.matricObtained}/${studentProfile.matricTotal} (${matricPct}%)\n\n`;

      reply += `Here are your calculated aggregates and chances across top Pakistani universities:\n\n`;

      for (const uni of matchedUniversities.slice(0, 3)) {
        const testScore = studentProfile.testObtained ?? 140;
        const testTotal = studentProfile.testTotal ?? 200;
        const agg = calculateAggregate(uni.meritFormula.id, {
          matricObtained: studentProfile.matricObtained,
          matricTotal: studentProfile.matricTotal,
          fscObtained: studentProfile.fscObtained,
          fscTotal: studentProfile.fscTotal,
          testObtained: testScore,
          testTotal: testTotal
        });

        reply += `### ${uni.name} (${uni.shortName})\n`;
        reply += `* **Formula**: ${uni.meritFormula.description}\n`;
        reply += `* **Estimated Aggregate**: **${agg.toFixed(2)}%** (assuming test score ${testScore}/${testTotal})\n`;
        reply += `* **2024 Closing Merits**:\n`;
        for (const prog of uni.programs.slice(0, 3)) {
          const diff = (agg - prog.previousClosingMerits.year2024).toFixed(2);
          const verdict = Number(diff) >= 0 ? `Safe / Competitive (+${diff}%)` : `Reach (${diff}%)`;
          reply += `  - ${prog.name}: **${prog.previousClosingMerits.year2024}%** → *${verdict}*\n`;
        }
        reply += `* Official Portal: [${uni.admissionPortalUrl}](${uni.admissionPortalUrl})\n\n`;
      }
      reply += `*Note: Estimated admission chances are based on 2024 closing merit trends and do not guarantee future admission.*`;
    } else {
      reply += `To calculate your exact aggregate and admission chances, please enter your marks in the **Academic Profile** at the top, or tell me your:\n\n`;
      reply += `1. Matric marks (obtained / total)\n`;
      reply += `2. FSc Part-1 or Part-2 marks (obtained / total)\n`;
      reply += `3. Entry test score (e.g. NET, ECAT, MDCAT, or FAST NU test)\n`;
      reply += `4. Target degree discipline (e.g. Computer Science, Engineering, MBBS)\n\n`;
      reply += `Different Pakistani universities use distinct formulas. For instance:\n`;
      reply += `* **NUST**: NET 75% + FSc 15% + Matric 10%\n`;
      reply += `* **FAST**: NU Test 50% + FSc 50%\n`;
      reply += `* **UET Lahore**: ECAT 33% + FSc 50% + Matric 17%\n`;
      reply += `* **MDCAT / Medical**: MDCAT 50% + FSc Pre-Med 40% + Matric 10%`;
    }
  } else if (msgLower.includes('sindh') || msgLower.includes('karachi')) {
    const sindhUnis = PAK_UNIVERSITIES.filter((u) => u.province === 'Sindh');
    reply += `**Top Universities in Sindh**:\n\n`;
    for (const uni of sindhUnis) {
      reply += `### ${uni.name} (${uni.shortName})\n`;
      reply += `* **Location**: ${uni.city}, Sindh | Sector: ${uni.sector}\n`;
      reply += `* **Admission Formula**: ${uni.meritFormula.description}\n`;
      reply += `* **Key Programs**: ${uni.programs.map((p) => `${p.name} (Closing Merit: ${p.previousClosingMerits.year2024}%)`).join(', ')}\n`;
      reply += `* **Admission Portal**: [${uni.admissionPortalUrl}](${uni.admissionPortalUrl})\n\n`;
    }
  } else if (msgLower.includes('mcq') || msgLower.includes('practice') || msgLower.includes('question')) {
    const sample = SAMPLE_PRACTICE_QUESTIONS[0];
    reply += `**Entry Test Practice MCQ** *(Database Sample)*\n\n`;
    reply += `**Test**: ${sample.test} | **Subject**: ${sample.subject} (${sample.topic})\n\n`;
    reply += `**Question**: ${sample.question}\n\n`;
    sample.options.forEach((opt, idx) => {
      reply += `${String.fromCharCode(65 + idx)}. ${opt}\n`;
    });
    reply += `\n**Correct Answer**: ${String.fromCharCode(65 + sample.correctAnswerIndex)} (${sample.options[sample.correctAnswerIndex]})\n\n`;
    reply += `**Detailed Explanation**: ${sample.explanation}\n\n`;
    reply += `*⚠️ AI Practice Note: Practice questions are for student preparation and revision; they are not official confidential exam papers.*`;
  } else if (msgLower.includes('study plan') || msgLower.includes('prepare')) {
    const plan = generateStudyPlan('Entry Test Preparation', 30);
    reply += `**30-Day Entry Test Preparation Roadmap (${plan.testName})**\n\n`;
    for (const week of plan.weeklySchedule) {
      reply += `**Week ${week.week}: ${week.focus}** (${week.dailyHours})\n`;
      for (const m of week.milestones) {
        reply += `  • ${m}\n`;
      }
      reply += `\n`;
    }
    reply += `**High-Yield Tips**:\n`;
    for (const tip of plan.keyStrategies) {
      reply += `✓ ${tip}\n`;
    }
  } else {
    reply += `**UniPathway National Admissions Database Information**\n\n`;
    for (const uni of matchedUniversities.slice(0, 3)) {
      reply += `### ${uni.name} (${uni.shortName})\n`;
      reply += `* **Province**: ${uni.province} | **Sector**: ${uni.sector}\n`;
      reply += `* **Merit Formula**: ${uni.meritFormula.description}\n`;
      reply += `* **Closing Merits (2024)**: ${uni.programs.map((p) => `${p.code}: ${p.previousClosingMerits.year2024}%`).join(' | ')}\n`;
      reply += `* **Official Portal**: [${uni.admissionPortalUrl}](${uni.admissionPortalUrl})\n\n`;
    }
    reply += `You can ask me to calculate your aggregate, check chances for BS CS/SE/MBBS, generate practice MCQs, or explain test patterns for NUST NET, ECAT, MDCAT, and FAST!`;
  }

  return {
    response: reply,
    matchedUniversities,
    isFallback: true
  };
}

// AI Chat Assistant endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], studentProfile, mode = 'admissions' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message string is required' });
    }

    const { groundingText, matchedUniversities } = getGroundingContext(message, studentProfile);

    // If Gemini client is not available, return database fallback with clear disclaimer
    if (!aiClient) {
      const fallback = generateDatabaseFallbackResponse(message, studentProfile);
      return res.json({
        reply: fallback.response,
        matchedUniversities: fallback.matchedUniversities,
        aiUsed: false,
        notice: 'Note: GEMINI_API_KEY is not configured in the Secrets panel. Answers are generated directly from the UniPathway verified database.'
      });
    }

    // Tailor system instruction based on the active Gemini AI Mode
    let modeInstruction = '';
    switch (mode) {
      case 'tutor':
        modeInstruction = `ACTIVE MODE: "Entry Test Tutor & MCQ Solver".
Focus intensely on academic tutoring for entrance tests (NUST NET, ECAT, MDCAT, FAST NU, GIKI, IBA). Explain concepts step-by-step with formulas and derivations. Show speed shortcuts (since calculators are forbidden in most tests). If generating questions, always include 4 options, the correct answer, and an in-depth solution. Always append: "⚠️ AI-generated practice question for revision. Not an official university exam paper."`;
        break;
      case 'roadmap':
        modeInstruction = `ACTIVE MODE: "Study Roadmap Architect".
Focus on creating structured, realistic preparation timetables (e.g., 30-day or 60-day roadmaps). Group preparation into diagnostic, concept mastery, speed drills, and final past paper mocks. Address the student's weak subjects and daily available study hours.`;
        break;
      case 'comparator':
        modeInstruction = `ACTIVE MODE: "University & Degree Comparator".
Compare universities objectively using verified database figures. Compare merit formulas, 2024 closing merits, fee structures, sector (public vs private), campus environment, hostel availability, and industry recognition. Do not show bias; highlight specific pros and trade-offs.`;
        break;
      case 'interview':
        modeInstruction = `ACTIVE MODE: "Interview & Document Verification Coach".
Focus on admission interviews (e.g. for IBA, Medical colleges, LUMS), Statement of Purpose guidance, and verification of documents (IBCC equivalency for A-Levels, HEC criteria, PEC accreditation, domicile categories, and quota reservations).`;
        break;
      case 'admissions':
      default:
        modeInstruction = `ACTIVE MODE: "Admissions & Aggregate Advisor".
Provide comprehensive guidance on Pakistani university admissions, merit formulas, eligibility checks, and estimated chances based on historical 2024 closing merits.`;
        break;
    }

    const systemInstruction = `You are "UniPathway AI Assistant", an executive higher education and admissions advisor for Pakistani university applicants.
${modeInstruction}

CRITICAL RULES:
1. SOURCE OF TRUTH: Use the provided VERIFIED DATABASE GROUNDING as the source of truth for university names, eligibility criteria, exact merit formulas, and previous closing merits.
2. NO HALLUCINATION: Never invent university names, admission policies, merit formulas, or closing merit figures. If verified information is unavailable in the database, explicitly state: "This specific data could not be verified in the official database."
3. REALISTIC ESTIMATES, NEVER PROMISES: Always explain that admission chances are estimates based on previous closing merit trends and never guarantees.
4. PERSONALIZED ADVICE: If the student profile (Matric, FSc marks, test score, aggregate) is provided, use it to personalize the guidance and explain where they stand.
5. PRACTICE MCQS: When generating practice questions, ALWAYS include the disclaimer: "⚠️ AI-generated practice question for revision. Not an official university exam paper."
6. FORMATTING: Use clean, professional typography with structured bullet points, clear bold highlights, and actionable steps. Maintain an authoritative yet supportive tone.`;

    // Prepare contents
    const contents: any[] = [];

    // Add recent history if provided (up to last 6 messages)
    if (Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6);
      for (const h of recentHistory) {
        if (h.role === 'user' || h.role === 'model') {
          contents.push({
            role: h.role,
            parts: [{ text: h.content }]
          });
        }
      }
    }

    // Append current user message combined with grounding context
    const currentPromptWithGrounding = `${groundingText}

STUDENT'S QUESTION:
${message}`;

    contents.push({
      role: 'user',
      parts: [{ text: currentPromptWithGrounding }]
    });

    const response = await Promise.race([
      aiClient.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      }),
      new Promise<any>((_, reject) =>
        setTimeout(() => reject(new Error('AI response timeout (8s)')), 8000)
      )
    ]);

    const replyText = response.text || 'I apologize, but I could not generate a response. Please try again.';

    return res.json({
      reply: replyText,
      matchedUniversities,
      aiUsed: true,
      mode,
      notice: null
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error?.message || error);
    // Graceful fallback to verified database response on API failure or timeout
    const fallback = generateDatabaseFallbackResponse(req.body.message || '', req.body.studentProfile);
    return res.json({
      reply: fallback.response,
      matchedUniversities: fallback.matchedUniversities,
      aiUsed: false,
      mode: req.body.mode || 'admissions',
      notice: 'AI latency exceeded. Provided verified answers directly from UniPathway Database.'
    });
  }
});

// Practice MCQ Generation endpoint
app.post('/api/generate-mcq', async (req: Request, res: Response) => {
  try {
    const { testName = 'NUST NET', subject = 'Mathematics', difficulty = 'Medium' } = req.body;

    if (!aiClient) {
      // Return curated sample question
      const filtered = SAMPLE_PRACTICE_QUESTIONS.filter(
        (q) => q.test.toLowerCase().includes(testName.toLowerCase()) || q.subject.toLowerCase() === subject.toLowerCase()
      );
      const chosen = filtered.length > 0 ? filtered[Math.floor(Math.random() * filtered.length)] : SAMPLE_PRACTICE_QUESTIONS[0];
      return res.json({
        mcq: chosen,
        source: 'database-curated',
        disclaimer: '⚠️ AI-generated practice question for revision. Not an official university exam paper.'
      });
    }

    const prompt = `Generate 1 high-quality practice multiple choice question for Pakistani entrance test: "${testName}".
Subject: "${subject}".
Difficulty level: "${difficulty}".
Format the response strictly as valid JSON matching this schema:
{
  "test": "${testName}",
  "subject": "${subject}",
  "topic": "Specific Topic name",
  "difficulty": "${difficulty}",
  "question": "The question text with any necessary equations or data",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswerIndex": 0,
  "explanation": "Clear step-by-step mathematical or conceptual explanation"
}`;

    const response = await Promise.race([
      aiClient.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.6
        }
      }),
      new Promise<any>((_, reject) =>
        setTimeout(() => reject(new Error('AI response timeout (8s)')), 8000)
      )
    ]);

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      mcq: {
        id: `mcq-gen-${Date.now()}`,
        test: parsed.test || testName,
        subject: parsed.subject || subject,
        topic: parsed.topic || 'General Concepts',
        difficulty: parsed.difficulty || difficulty,
        question: parsed.question,
        options: parsed.options || ['A', 'B', 'C', 'D'],
        correctAnswerIndex: typeof parsed.correctAnswerIndex === 'number' ? parsed.correctAnswerIndex : 0,
        explanation: parsed.explanation
      },
      source: 'gemini-ai',
      disclaimer: '⚠️ AI-generated practice question for revision. Not an official university exam paper.'
    });
  } catch (error) {
    console.error('Error in /api/generate-mcq:', error);
    const chosen = SAMPLE_PRACTICE_QUESTIONS[Math.floor(Math.random() * SAMPLE_PRACTICE_QUESTIONS.length)];
    return res.json({
      mcq: chosen,
      source: 'database-fallback',
      disclaimer: '⚠️ AI-generated practice question for revision. Not an official university exam paper.'
    });
  }
});

// Setup Vite middleware in development or serve static in production
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve('dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UniPathway server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
});
