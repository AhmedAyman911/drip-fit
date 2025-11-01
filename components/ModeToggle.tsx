"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-5 w-5 text-black dark:text-gray-200" />
      <Switch checked={isDark} onCheckedChange={toggleTheme} />
      <Moon className="h-5 w-5 text-black dark:text-gray-200" />
    </div>
  );
}
