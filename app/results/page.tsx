"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ArrowLeft, Copy, RefreshCw } from "lucide-react";
import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Results() {
  const router = useRouter();
  const userData = useUserStore((state) => state.userData);
  const collections = userData?.collections?.data || [];
  const jsonData = JSON.stringify(collections);
  const [copied, setCopied] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedResult, setStreamedResult] = useState("");

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonData);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("复制失败:", err);
    }
  };

  const getRecommendation = async () => {
    setIsStreaming(true);
    setStreamedResult("");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collections }),
      });
      if (!res.body) throw new Error("无流数据");
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
        setStreamedResult(result);
      }
    } catch (err) {
      setStreamedResult(`推荐失败：${err}`);
    }
    setIsStreaming(false);
  };

  if (!collections.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>没有找到数据</CardTitle>
                <CardDescription>
                  该用户还没有添加任何评分或评论
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">数据结果</h1>
          <p className="text-sm text-muted-foreground">
            右侧按钮获取推荐，请耐心等待
          </p>
        </div>
        <div className="flex gap-2 md:flex-row flex-col">
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4" /> 返回主页
          </Button>
          <Button onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
            {copied ? "复制成功" : "复制数据"}
          </Button>
          <Button onClick={getRecommendation} disabled={isStreaming}>
            <RefreshCw className="h-4 w-4" />
            {isStreaming ? "思考中..." : "获取推荐"}
          </Button>
        </div>
      </div>

      {streamedResult && (
        <Card className="my-6">
          <CardHeader>
            <CardTitle>推荐结果</CardTitle>
            <CardDescription>
              以下是根据用户数据推荐的结果，模型是
              gemini-2.5-flash-preview-05-20 可能被限制
            </CardDescription>
          </CardHeader>
          <CardContent className="prose dark:prose-invert mx-auto">
            <ReactMarkdown>{streamedResult}</ReactMarkdown>
          </CardContent>
        </Card>
      )}

      <Card className="relative mt-6">
        <CardHeader>
          <CardTitle>所有数据结果</CardTitle>
          <CardDescription>
            以下是获取的数据，可复制到大语言模型进行分析（注：0分为未打分需要说明）
          </CardDescription>
        </CardHeader>
        <CardContent className="relative">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-2 right-6 z-10"
                  onClick={copyToClipboard}
                  aria-label="复制数据"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copied ? "已复制!" : "复制数据"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="relative">
            <pre className="whitespace-pre-wrap break-words bg-muted/50 p-6 rounded-md overflow-x-auto text-sm">
              <code>{jsonData}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
