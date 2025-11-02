"use client";

import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";
import { useSyncExternalStore } from "react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  if (!mounted) {
    return <div className="w-[88px] h-6" />;
  }

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-5 w-5 text-black dark:text-gray-200" />
      <Switch checked={isDark} onCheckedChange={toggleTheme} />
      <Moon className="h-5 w-5 text-black dark:text-gray-200" />
    </div>
  );
}