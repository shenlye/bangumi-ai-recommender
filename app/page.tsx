"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, Loader2, AlertCircleIcon } from "lucide-react";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { fetchUserData } from "@/lib/bangumi";
import { useUserStore } from "@/store/userStore";

const types = [
  {
    value: "anime",
    label: "动画",
  },
  {
    value: "game",
    label: "游戏",
  },
];

export default function Home() {
  const [username, setUsername] = useState("");
  const [type, setType] = useState<"anime" | "game">("anime");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const setUserData = useUserStore((state) => state.setUserData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("请输入Bangumi用户名");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { collections } = await fetchUserData(username, type);
      setUserData({ collections });
      console.log("用户收藏数据:", collections);
      router.push('/results');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "获取用户数据失败，请稍后重试"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Bangumi AI 推荐助手</CardTitle>
          <CardDescription>在下方输入你的用户名以开始</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                type="text"
                placeholder="你的Bangumi用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label>类型</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                    disabled={isLoading}
                  >
                    {type === "anime" ? "动画" : "游戏"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandGroup>
                      {types.map((t) => (
                        <CommandItem
                          key={t.value}
                          value={t.value}
                          onSelect={() => {
                            setType(t.value as "anime" | "game");
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              type === t.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {t.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  处理中...
                </>
              ) : (
                "开始分析"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
