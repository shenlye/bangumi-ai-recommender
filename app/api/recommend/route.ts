import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { collections } = await req.json();

  const prompt = `以下为用户看过的番剧以及用户的评分和评论（0分为未打分），推荐几部新的用户可能喜欢的番剧，并简要说明推荐理由：${JSON.stringify(
    collections
  )}`;

  const response = await fetch(
    "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.ZHIPU_API_KEY}`,
      },
      body: JSON.stringify({
        model: "GLM-4-Flash-250414",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    }
  );

  const data = await response.json();
  const result = data.choices?.[0]?.message?.content || "未获取到推荐结果";

  return NextResponse.json({ result });
}
