import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { QuizAnswer } from "@/lib/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

function formatAnswers(answers: QuizAnswer[]): string {
  const byCategory = answers.reduce(
    (acc, a) => {
      const cat = a.categoryName;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(a);
      return acc;
    },
    {} as Record<string, QuizAnswer[]>
  );

  return Object.entries(byCategory)
    .map(([category, catAnswers]) => {
      const lines = catAnswers.map((a) => {
        const ans = Array.isArray(a.answer) ? a.answer.join(", ") : a.answer;
        return `  - ${a.question}\n    → ${ans}`;
      });
      return `**${category}:**\n${lines.join("\n")}`;
    })
    .join("\n\n");
}

function buildPrompt(answers: QuizAnswer[]): string {
  const formattedAnswers = formatAnswers(answers);

  // Extract key info for personalization
  const sexAnswer = answers.find((a) => a.questionId === "biological_sex");
  const ageAnswer = answers.find((a) => a.questionId === "age_range");
  const goalAnswer = answers.find((a) => a.questionId === "primary_goal");

  const sex = sexAnswer ? (sexAnswer.answer as string) : "unspecified";
  const age = ageAnswer ? (ageAnswer.answer as string) : "unspecified";
  const goal = goalAnswer ? (goalAnswer.answer as string) : "overall";

  return `You are SciMax, a cutting-edge science-backed health and appearance optimization system. Your job is to analyze diagnostic data and produce a deeply personalized, evidence-based protocol.

USER PROFILE:
- Biological sex: ${sex}
- Age range: ${age}
- Primary goal: ${goal}

FULL DIAGNOSTIC RESPONSES:
${formattedAnswers}

---

Generate a comprehensive, highly personalized optimization protocol based SPECIFICALLY on this user's answers. Do NOT give generic advice — every recommendation must be directly tied to their specific diagnostic patterns.

Structure your response with EXACTLY these sections using ## headers:

## ROOT CAUSE ANALYSIS
Identify the 2-4 core physiological dysfunctions driving this user's specific constellation of symptoms and concerns. Be specific — reference the exact answers that indicate each root cause. Use proper physiological terminology (HPA axis dysregulation, gut-skin axis disruption, circadian rhythm disruption, etc.) but explain each mechanism clearly. This should feel like a genuine clinical insight, not generic health advice.

## THE SCIENCE
Explain the biological mechanisms at play in plain English. How do their specific answers indicate these imbalances? Reference real mechanisms: cortisol cycles, testosterone/estrogen feedback loops, mTOR signaling, gut microbiome disruption, lymphatic dysfunction, ANS dysregulation, etc. Make this genuinely educational and specific to their responses. Aim for 150-250 words.

## MORNING PROTOCOL
A precise, timed morning routine (6am–12pm) optimized specifically for their identified root causes. Include:
- Wake time recommendation
- Light exposure protocol
- Specific physical interventions (facial massage techniques, posture exercises, breathing protocols)
- Breakfast/nutrition timing with specific food recommendations
- Supplement timing and specific supplements
Format as a numbered checklist with times. Make it specific and actionable.

## AFTERNOON PROTOCOL
A precise afternoon routine (12pm–6pm) targeting their specific weak points. Include movement recommendations, nutrition, hydration, focus optimization, and any stress management specific to their profile. Format as a numbered checklist with times.

## EVENING PROTOCOL
A precise evening wind-down routine (6pm–11pm) optimized for their sleep and recovery issues. Include light exposure management, nutrition cutoffs, stress protocols, sleep position recommendations if relevant, and supplement timing. Format as a numbered checklist with times.

## NUTRITION PROTOCOL
A specific nutritional intervention plan targeting their identified gut, inflammation, and hormonal issues. Include:
- Foods to prioritize (with specific mechanisms)
- Foods to eliminate or reduce (with reasons tied to their specific issues)
- Meal timing recommendations
- Hydration protocol
- Any specific nutrients they're likely deficient in based on their symptoms

## SUPPLEMENT STACK
An evidence-based supplement protocol specifically for their identified deficiencies and goals. For each supplement include:
- Supplement name
- Specific daily dosage
- Optimal timing
- Mechanism of action relevant to their specific issues
- Priority level (Essential / Beneficial / Optional)
Only include supplements with genuine evidence for their specific issues.

## WHAT TO EXPECT
A realistic, specific timeline of expected improvements:
- Week 1–2: What they should notice first
- Month 1: Primary changes
- Month 2–3: Deeper physiological shifts
- Month 4–6: Full optimization
Include specific metrics or observations they can track to verify progress.

---

CRITICAL GUIDELINES:
- Be HIGHLY specific to their actual diagnostic answers — reference their specific responses
- Use proper scientific terminology but always explain it clearly
- Every recommendation must have a clear mechanistic justification
- Do NOT give generic "eat healthy and sleep more" advice
- Aim for the level of specificity of a top functional medicine practitioner
- Format clearly with bullet points and numbered lists within each section
- Bold (**text**) key terms, supplement names, and important time-sensitive actions
- Write as if you are speaking directly to this person about THEIR specific biology`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answers } = body as { answers: QuizAnswer[] };

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "No diagnostic answers provided." },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "API key not configured. Please add ANTHROPIC_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    const prompt = buildPrompt(answers);

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude API");
    }

    return NextResponse.json({ protocol: content.text });
  } catch (err) {
    console.error("Protocol generation error:", err);

    if (err instanceof Anthropic.APIError) {
      return NextResponse.json(
        { error: `Claude API error: ${err.message}` },
        { status: err.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate protocol. Please try again." },
      { status: 500 }
    );
  }
}
