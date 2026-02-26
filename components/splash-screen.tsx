"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Brain, Rocket, Star } from "lucide-react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentPhase, setCurrentPhase] = useState(0)

  const phases = [
    { icon: Brain, text: "Loading brain games...", color: "text-primary" },
    { icon: Sparkles, text: "Sparking creativity...", color: "text-[oklch(0.7_0.2_50)]" },
    { icon: Rocket, text: "Preparing for launch...", color: "text-[oklch(0.7_0.18_150)]" },
  ]

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 40)

    return () => clearInterval(progressInterval)
  }, [])

  useEffect(() => {
    if (progress < 35) setCurrentPhase(0)
    else if (progress < 70) setCurrentPhase(1)
    else setCurrentPhase(2)
  }, [progress])

  useEffect(() => {
    if (progress === 100) {
      const timeout = setTimeout(onComplete, 500)
      return () => clearTimeout(timeout)
    }
  }, [progress, onComplete])

  const CurrentIcon = phases[currentPhase].icon

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5"
    >
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== "undefined" ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== "undefined" ? window.innerHeight : 800),
              scale: 0,
              opacity: 0,
            }}
            animate={{
              y: [null, Math.random() * -200 - 100],
              scale: [0, Math.random() * 0.5 + 0.5],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Star
              className={`h-${Math.floor(Math.random() * 3 + 2) * 2} w-${Math.floor(Math.random() * 3 + 2) * 2} ${
                ["text-primary/30", "text-accent/30", "text-[oklch(0.7_0.2_50)]/30"][i % 3]
              }`}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-8">
        {/* Animated logo */}
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        >
          <div className="relative flex h-32 w-32 items-center justify-center">
            {/* Outer ring */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-primary/20"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
            {/* Middle ring */}
            <motion.div
              className="absolute inset-2 rounded-full border-4 border-accent/20"
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />
            {/* Inner glow */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-lg" />
            {/* Icon container */}
            <motion.div
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg"
              animate={{
                boxShadow: [
                  "0 0 20px oklch(0.55 0.2 250 / 0.3)",
                  "0 0 40px oklch(0.55 0.2 250 / 0.5)",
                  "0 0 20px oklch(0.55 0.2 250 / 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPhase}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 90 }}
                  transition={{ duration: 0.3 }}
                >
                  <CurrentIcon className="h-10 w-10 text-primary-foreground" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>

        {/* Brand name */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              BrainSpark
            </span>
          </h1>
          <motion.p
            className="mt-2 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Fun Learning for Kids
          </motion.p>
        </motion.div>

        {/* Loading status */}
        <motion.div
          className="flex flex-col items-center gap-4 w-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Progress bar */}
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-foreground/20"
              style={{ width: `${progress}%` }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>

          {/* Phase text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-2 text-sm font-medium ${phases[currentPhase].color}`}
            >
              <CurrentIcon className="h-4 w-4" />
              <span>{phases[currentPhase].text}</span>
            </motion.div>
          </AnimatePresence>

          {/* Percentage */}
          <span className="text-xs text-muted-foreground font-mono">{progress}%</span>
        </motion.div>
      </div>

      {/* Bottom decorative elements */}
      <motion.div
        className="absolute bottom-8 flex items-center gap-2 text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Sparkles className="h-3 w-3" />
        <span>Powered by curiosity and imagination</span>
        <Sparkles className="h-3 w-3" />
      </motion.div>
    </motion.div>
  )
}
