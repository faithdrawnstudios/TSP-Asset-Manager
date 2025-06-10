'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Always render the same content during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <button
        className="p-2 rounded-md border border-border hover:bg-secondary transition-colors"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md border border-border hover:bg-secondary transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
