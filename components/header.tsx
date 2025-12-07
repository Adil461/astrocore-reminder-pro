"use client"

import { Moon, Sun, Sparkles } from "lucide-react"

interface HeaderProps {
  darkMode: boolean
  setDarkMode: (mode: boolean) => void
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  return (
    <header className="bg-black border-b border-border sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-3 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0">
            <img src="/astro_logo.gif" alt="Astrocore Logo" className="w-28 h-28 object-contain" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Astrocore Reminder Pro</h1>
              <p className="text-sm text-muted-foreground">Smart Task Management & Follow-up System</p>
            </div>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg hover:bg-muted transition-colors duration-200"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <Sun size={20} className="text-muted-foreground" />
            ) : (
              <Moon size={20} className="text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
