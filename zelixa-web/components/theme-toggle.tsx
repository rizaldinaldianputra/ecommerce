"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="rounded-full bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 h-10 w-10">
        <div className="h-5 w-5" />
      </Button>
    )
  }

  const isDark = theme === 'dark'

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-full bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800 h-10 w-10 relative overflow-hidden transition-colors shadow-sm"
    >
      <AnimatePresence mode="wait">
        <motion.div
           key={theme}
           initial={{ y: 20, opacity: 0, rotate: -90 }}
           animate={{ y: 0, opacity: 1, rotate: 0 }}
           exit={{ y: -20, opacity: 0, rotate: 90 }}
           transition={{ duration: 0.2, ease: "easeInOut" }}
           className="flex items-center justify-center"
        >
          {isDark ? (
            <Moon className="h-5 w-5 text-blue-400 fill-blue-400/20" />
          ) : (
            <Sun className="h-5 w-5 text-amber-500 fill-amber-500/20" />
          )}
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
