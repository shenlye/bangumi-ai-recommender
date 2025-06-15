import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  const { collections } = await req.json();

  if (!collections || !Array.isArray(collections) || collections.length === 0) {
    return NextResponse.json(
      { result: "未提供有效的评分数据。" },
      { status: 400 }
    );
  }

  const prompt = `
你是一名动漫与游戏推荐专家，擅长根据用户的评分与短评来分析他们的兴趣偏好，并据此推荐可能喜欢的新作品。

以下是用户在 Bangumi 上看过/玩过的作品记录，每条数据包含：
- 作品名 name
- 用户评分 score（0 表示未评分）
- 用户短评 comment（可能为空）

请完成以下任务：
1. 分析用户的偏好，包括喜欢的题材、风格、剧情、节奏等。
2. 如果可能，也指出用户不喜欢的内容。
3. 推荐 3~5 部用户可能喜欢但尚未观看的作品（动漫或游戏皆可），每条推荐请包括作品名 + 推荐理由（简洁有逻辑）。

用户评分数据如下：
${JSON.stringify(collections, null, 2)}

请使用如下输出格式：
1. 用户偏好总结
2. 用户不喜欢的元素（如果能判断）
3. 推荐作品列表（每条以「- 作品名：推荐理由」格式输出）
`;

  const stream = await ai.models.generateContentStream({
    model: "gemini-2.5-flash-preview-05-20",
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });
  const streamBody = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk?.text;
        if (text) {
          controller.enqueue(text);
        }
      }
      controller.close();
    },
  });
  return new Response(streamBody, {
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    },
  });
}
