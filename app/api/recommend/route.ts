import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  const { collections } = await req.json();

  const prompt = `以下为用户看过/玩过的作品以及用户的评分和评论（0分为未打分），推荐几部新的用户可能喜欢的作品，并简要说明推荐理由：${JSON.stringify(
    collections
  )}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-05-20",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const result =
      response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "未获取到推荐结果";

    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json(
      { result: `推荐失败${e}` },
      { status: 500 }
    );
  }
}
