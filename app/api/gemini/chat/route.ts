import { GoogleGenAI, Type } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { messages, model, systemInstruction, tools } = await req.json();

    // Map tools based on grounding type
    const activeTools: any[] = [];
    if (tools?.includes('googleSearch')) {
      activeTools.push({ googleSearch: {} });
    }
    if (tools?.includes('googleMaps')) {
      activeTools.push({ googleMaps: {} });
    }

    const response = await ai.models.generateContent({
      model: model || "gemini-3.8-flash",
      contents: messages,
      config: {
        systemInstruction: systemInstruction || "You are a helpful assistant for EduGraphix Lab.",
        tools: activeTools.length > 0 ? activeTools : undefined,
      },
    });

    return NextResponse.json({ 
      text: response.text,
      groundingMetadata: response.candidates?.[0]?.groundingMetadata 
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
