"use client"

import { useEffect, useState } from "react"
import { Sparkles } from "lucide-react"

interface GameLoadingProps {
  gameName?: string
  category?: string
}

const loadingMessages = [
  "Preparing your adventure...",
  "Loading fun activities...",
  "Getting things ready...",
  "Almost there...",
  "Setting up the game...",
]

const categoryColors: Record<string, { gradient: string; glow: string }> = {
  math: { gradient: "from-emerald-500 to-teal-500", glow: "shadow-emerald-500/30" },
  science: { gradient: "from-blue-500 to-indigo-500", glow: "shadow-blue-500/30" },
  language: { gradient: "from-orange-500 to-amber-500", glow: "shadow-orange-500/30" },
  coding: { gradient: "from-pink-500 to-rose-500", glow: "shadow-pink-500/30" },
  art: { gradient: "from-fuchsia-500 to-purple-500", glow: "shadow-fuchsia-500/30" },
  music: { gradient: "from-violet-500 to-purple-500", glow: "shadow-violet-500/30" },
  geography: { gradient: "from-sky-500 to-blue-500", glow: "shadow-sky-500/30" },
  identification: { gradient: "from-cyan-500 to-teal-500", glow: "shadow-cyan-500/30" },
  iq: { gradient: "from-indigo-500 to-violet-500", glow: "shadow-indigo-500/30" },
}

export function GameLoading({ gameName, category = "math" }: GameLoadingProps) {
  const [messageIndex, setMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  
  const colors = categoryColors[category] || categoryColors.math

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length)
    }, 1500)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        return prev + Math.random() * 15
      })
    }, 200)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
      {/* Animated background circles */}
      <div className="relative mb-8">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${colors.gradient} opacity-20 blur-3xl animate-pulse`} />
        
        {/* Main loader container */}
        <div className={`relative flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br ${colors.gradient} shadow-2xl ${colors.glow}`}>
          {/* Spinning ring */}
          <div className="absolute inset-0 rounded-3xl">
            <svg className="h-full w-full animate-spin" style={{ animationDuration: '3s' }}>
              <defs>
                <linearGradient id="spinnerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
              <circle
                cx="64"
                cy="64"
                r="56"
                fill="none"
                stroke="url(#spinnerGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="100 250"
              />
            </svg>
          </div>
          
          {/* Center icon */}
          <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-8 w-8 text-white animate-pulse" />
          </div>
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
          <div className={`absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-gradient-to-r ${colors.gradient} shadow-lg ${colors.glow}`} />
        </div>
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
          <div className={`absolute top-1/2 -right-2 h-3 w-3 -translate-y-1/2 rounded-full bg-gradient-to-r ${colors.gradient} shadow-lg ${colors.glow}`} />
        </div>
      </div>

      {/* Game name */}
      {gameName && (
        <h2 className="mb-2 text-2xl font-bold text-foreground">
          {gameName}
        </h2>
      )}

      {/* Loading message */}
      <p className="mb-6 text-sm text-muted-foreground animate-pulse">
        {loadingMessages[messageIndex]}
      </p>

      {/* Progress bar */}
      <div className="w-64 h-2 rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors.gradient} transition-all duration-300 ease-out`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* Decorative floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute h-2 w-2 rounded-full bg-gradient-to-r ${colors.gradient} opacity-30`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 3) * 20}%`,
              animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scale(1.2);
            opacity: 0.6;
          }
        }
      `}</style>
    </div>
  )
}
