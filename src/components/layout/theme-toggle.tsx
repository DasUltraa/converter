"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const stored = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const nextDark = stored ? stored === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", nextDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    window.localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label="Darstellung wechseln" title="Darstellung wechseln">
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
