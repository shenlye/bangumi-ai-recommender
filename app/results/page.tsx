"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Copy } from "lucide-react";

export default function Results() {
  const router = useRouter();
  const userData = useUserStore((state) => state.userData);
  const collections = userData?.collections?.data || [];
  const jsonData = JSON.stringify(collections);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonData);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  if (!collections.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>没有找到数据</CardTitle>
                <CardDescription>该用户还没有添加任何评分或评论</CardDescription>
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
          <h1 className="text-2xl font-bold">所有数据结果</h1>
          <p className="text-sm text-muted-foreground">
            以下是获取的数据，可复制到大语言模型进行分析（注：0分为未打分需要说明）
          </p>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> 返回主页
          </Button>
          <Button onClick={copyToClipboard}>
            <Copy className="mr-2 h-4 w-4" /> 复制数据
          </Button>
        </div>
      </div>
      
      <Card className="relative">
        <CardContent className="p-6">
          <div className="relative">
            <pre className="whitespace-pre-wrap break-words bg-muted/50 p-4 rounded-md overflow-x-auto text-sm">
              <code>{jsonData}</code>
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
