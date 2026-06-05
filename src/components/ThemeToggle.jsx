import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/themeContextValue";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`brand-button-secondary inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium shadow-sm transition ${className}`}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
      <span>{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
