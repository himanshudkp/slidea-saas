"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const THEMES = [
  { name: "dark", icon: Moon, label: "dark-theme", key: "dark" },
  { name: "light", icon: Sun, label: "light-theme", key: "light" },
];

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleThemeClick = useCallback(
    (themeKey: "light" | "dark") => {
      setTheme(themeKey);
    },
    [setTheme]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative isolate flex h-10 rounded-full bg-background p-1 ring-1 ring-border">
      {THEMES.map(({ key, icon: Icon, label }) => {
        const isActive = theme === key;

        return (
          <button
            aria-label={label}
            className="relative h-8 w-8 rounded-full"
            key={key}
            onClick={() => handleThemeClick(key as "light" | "dark")}
            type="button"
          >
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-full bg-secondary"
                layoutId="activeTheme"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <Icon
              className={cn(
                "relative z-10 m-auto h-4 w-4",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default ThemeSwitcher;
