import { NextRequest, NextResponse } from "next/server";
import { getOpenAIClient, DEFAULT_OPENAI_MODEL } from "@/lib/openai";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt || prompt.length < 10) {
    return NextResponse.json({ error: "Provide a detailed prompt" }, { status: 400 });
  }

  const openai = getOpenAIClient();
  try {
    const result = await openai.chat.completions.create({
      model: DEFAULT_OPENAI_MODEL,
      messages: [
        { role: "system", content: "You are a legal contract generating AI. Respond only with contract text. Do not include explanations or disclaimers." },
        { role: "user", content: prompt },
      ],
      max_tokens: 1500,
      temperature: 0.25,
    });

    const content = result.choices[0].message.content ?? "";
    // MVP: Just return the whole output
    return NextResponse.json({ title: "AI Generated Contract", content });
  } catch (err) {
    console.error("OpenAI error:", err);
    return NextResponse.json({ error: "Could not generate contract" }, { status: 500 });
  }
}