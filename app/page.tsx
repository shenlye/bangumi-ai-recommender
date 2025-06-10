"use client";

import { useState } from "react";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
  const [value, setValue] = useState("anime");
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle> Bangumi AI 推荐助手</CardTitle>
          <CardDescription>
            在下方输入你的用户名以开始
          </CardDescription>  
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-2">
              <Label>用户名</Label>
              <Input type="text" placeholder="你的Bangumi用户名" />
            </div>
            <div className="flex flex-col gap-2 mt-6">
              <Label>类型</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {value === "anime" ? "动画" : "游戏"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Command>
                    <CommandGroup>
                      <CommandItem
                        value="anime"
                        onSelect={() => {
                          setValue("anime");
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === "anime" ? "opacity-100" : "opacity-0"
                          )}
                        />
                        动画
                      </CommandItem>
                      <CommandItem
                        value="game"
                        onSelect={() => {
                          setValue("game");
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            value === "game" ? "opacity-100" : "opacity-0"
                          )}
                        />
                        游戏
                      </CommandItem>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">开始分析</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
