"use client"

import { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Game } from "@/lib/game-data"
import { Sparkles, RotateCcw, Play, Volume2 } from "lucide-react"

interface DrumGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

interface Drum {
  name: string
  color: string
  freq: number
  type: OscillatorType
  emoji: string
}

const drums: Drum[] = [
  { name: "Kick", color: "#ef4444", freq: 80, type: "sine", emoji: "🥁" },
  { name: "Snare", color: "#f97316", freq: 200, type: "triangle", emoji: "🪘" },
  { name: "Hi-Hat", color: "#eab308", freq: 800, type: "square", emoji: "🔔" },
  { name: "Tom", color: "#22c55e", freq: 150, type: "sine", emoji: "🥁" },
]

const patterns = [
  { name: "Rock Beat", pattern: [0, 2, 1, 2, 0, 2, 1, 2] },
  { name: "Disco", pattern: [0, 0, 1, 0, 0, 0, 1, 0] },
  { name: "Simple", pattern: [0, 1, 0, 1] },
  { name: "March", pattern: [0, 0, 1, 0] },
]

export function DrumGame({ game, onComplete }: DrumGameProps) {
  const [currentPattern, setCurrentPattern] = useState(0)
  const [currentBeat, setCurrentBeat] = useState(0)
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [finished, setFinished] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [activeDrum, setActiveDrum] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)
  const hasCompletedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const pattern = patterns[currentPattern]
  const progress = ((currentPattern * 8 + currentBeat) / (patterns.length * 8)) * 100

  const playDrumSound = useCallback((drum: Drum, duration: number = 0.15) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.value = drum.freq
    oscillator.type = drum.type
    
    gainNode.gain.setValueAtTime(0.5, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  }, [])

  const handleDrumHit = useCallback((drumIndex: number) => {
    if (finished || showDemo) return
    
    playDrumSound(drums[drumIndex])
    setActiveDrum(drumIndex)
    setTimeout(() => setActiveDrum(null), 150)

    if (!isPlaying) {
      setIsPlaying(true)
    }

    const expectedDrum = pattern.pattern[currentBeat]
    
    if (drumIndex === expectedDrum) {
      setScore(s => s + 10)
      
      if (currentBeat + 1 >= pattern.pattern.length) {
        // Pattern complete
        if (currentPattern + 1 >= patterns.length) {
          // All patterns complete
          setFinished(true)
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true
            const finalScore = Math.min(score + 10, game.maxScore)
            onCompleteRef.current(finalScore, game.maxScore)
          }
        } else {
          setCurrentPattern(p => p + 1)
          setCurrentBeat(0)
        }
      } else {
        setCurrentBeat(b => b + 1)
      }
    } else {
      setMistakes(m => m + 1)
    }
  }, [currentBeat, currentPattern, finished, isPlaying, playDrumSound, pattern.pattern, score, showDemo, game.maxScore])

  const playDemo = useCallback(async () => {
    setShowDemo(true)
    
    for (let i = 0; i < pattern.pattern.length; i++) {
      const drumIndex = pattern.pattern[i]
      
      setActiveDrum(drumIndex)
      playDrumSound(drums[drumIndex], 0.2)
      
      await new Promise(resolve => setTimeout(resolve, 400))
      setActiveDrum(null)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    setShowDemo(false)
  }, [pattern.pattern, playDrumSound])

  const resetGame = () => {
    setCurrentPattern(0)
    setCurrentBeat(0)
    setScore(0)
    setMistakes(0)
    setFinished(false)
    setIsPlaying(false)
    hasCompletedRef.current = false
  }

  if (finished) {
    const percentage = Math.round((score / game.maxScore) * 100)
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-5xl">
            🥁
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Drum Champion!</h2>
        <p className="text-muted-foreground mb-2">
          You completed all patterns with {mistakes} mistakes!
        </p>
        <p className="text-muted-foreground mb-6">
          Score: {score} out of {game.maxScore} ({percentage}%)
        </p>
        <Button onClick={resetGame} size="lg" className="gap-2">
          <RotateCcw className="w-4 h-4" /> Play Again
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-muted-foreground">
          Pattern {currentPattern + 1} of {patterns.length}: {pattern.name}
        </span>
        <span className="text-sm font-medium text-foreground">Score: {score}</span>
      </div>
      
      <Progress value={progress} className="h-2 mb-6" />

      {/* Current Pattern Display */}
      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">Play this beat:</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {pattern.pattern.map((drumIndex, index) => (
            <motion.div
              key={index}
              animate={{ 
                scale: index === currentBeat ? 1.2 : 1,
                opacity: index < currentBeat ? 0.3 : 1
              }}
              className={`
                w-12 h-12 rounded-lg flex items-center justify-center text-xl
                ${index === currentBeat ? "ring-2 ring-offset-2 ring-primary" : ""}
              `}
              style={{ backgroundColor: drums[drumIndex].color }}
            >
              {drums[drumIndex].emoji}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Demo Button */}
      <div className="flex justify-center mb-6">
        <Button 
          variant="outline" 
          onClick={playDemo} 
          disabled={showDemo}
          className="gap-2"
        >
          {showDemo ? <Volume2 className="w-4 h-4 animate-pulse" /> : <Play className="w-4 h-4" />}
          {showDemo ? "Playing..." : "Listen First"}
        </Button>
      </div>

      {/* Drum Pads */}
      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        {drums.map((drum, index) => (
          <motion.button
            key={drum.name}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              scale: activeDrum === index ? 0.9 : 1,
              boxShadow: activeDrum === index ? "0 0 30px rgba(0,0,0,0.3)" : "0 4px 6px rgba(0,0,0,0.1)"
            }}
            onClick={() => handleDrumHit(index)}
            className="aspect-square rounded-2xl flex flex-col items-center justify-center text-white font-bold shadow-lg"
            style={{ backgroundColor: drum.color }}
          >
            <span className="text-4xl mb-1">{drum.emoji}</span>
            <span className="text-sm">{drum.name}</span>
          </motion.button>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Tap the drums to match the pattern!
      </p>
    </div>
  )
}
