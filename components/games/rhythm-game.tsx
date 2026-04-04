"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Game } from "@/lib/game-data"
import { Sparkles, RotateCcw, Play, Pause } from "lucide-react"

interface RhythmGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

interface Note {
  id: number
  lane: number
  time: number
  hit: boolean
}

const laneColors = ["#ef4444", "#22c55e", "#3b82f6", "#eab308"]
const laneKeys = ["A", "S", "D", "F"]

export function RhythmGame({ game, onComplete }: RhythmGameProps) {
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready")
  const [notes, setNotes] = useState<Note[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [hits, setHits] = useState(0)
  const [misses, setMisses] = useState(0)
  const gameLoopRef = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)
  const audioContextRef = useRef<AudioContext | null>(null)
  const hasCompletedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete
  
  const gameDuration = 15000 // 15 seconds
  const totalNotes = 20

  const generateNotes = useCallback(() => {
    const newNotes: Note[] = []
    for (let i = 0; i < totalNotes; i++) {
      newNotes.push({
        id: i,
        lane: Math.floor(Math.random() * 4),
        time: (i + 1) * (gameDuration / (totalNotes + 2)),
        hit: false
      })
    }
    return newNotes
  }, [])

  const playHitSound = useCallback((success: boolean) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.value = success ? 800 : 200
    oscillator.type = success ? "sine" : "sawtooth"
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.1)
  }, [])

  const startGame = useCallback(() => {
    setNotes(generateNotes())
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setHits(0)
    setMisses(0)
    setCurrentTime(0)
    setGameState("playing")
    startTimeRef.current = Date.now()
    hasCompletedRef.current = false
  }, [generateNotes])

  const handleLanePress = useCallback((laneIndex: number) => {
    if (gameState !== "playing") return
    
    // Find the closest note in this lane that hasn't been hit
    const hitWindow = 300 // ms window to hit the note
    const targetTime = currentTime + 500 // Notes should be hit when they reach the bottom
    
    const hitNote = notes.find(note => 
      note.lane === laneIndex && 
      !note.hit && 
      Math.abs(note.time - targetTime) < hitWindow
    )
    
    if (hitNote) {
      playHitSound(true)
      setNotes(prev => prev.map(n => 
        n.id === hitNote.id ? { ...n, hit: true } : n
      ))
      
      const timingAccuracy = Math.abs(hitNote.time - targetTime)
      const points = timingAccuracy < 100 ? 100 : timingAccuracy < 200 ? 50 : 25
      
      setScore(s => s + points + (combo * 5))
      setCombo(c => {
        const newCombo = c + 1
        setMaxCombo(m => Math.max(m, newCombo))
        return newCombo
      })
      setHits(h => h + 1)
    } else {
      playHitSound(false)
      setCombo(0)
      setMisses(m => m + 1)
    }
  }, [gameState, currentTime, notes, playHitSound])

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return
    
    const update = () => {
      const elapsed = Date.now() - startTimeRef.current
      setCurrentTime(elapsed)
      
      if (elapsed >= gameDuration) {
        setGameState("finished")
        if (!hasCompletedRef.current) {
          hasCompletedRef.current = true
          const finalScore = Math.min(score, game.maxScore)
          onCompleteRef.current(finalScore, game.maxScore)
        }
        return
      }
      
      gameLoopRef.current = requestAnimationFrame(update)
    }
    
    gameLoopRef.current = requestAnimationFrame(update)
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current)
      }
    }
  }, [gameState, score, game.maxScore])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyIndex = laneKeys.indexOf(e.key.toUpperCase())
      if (keyIndex !== -1) {
        handleLanePress(keyIndex)
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleLanePress])

  const progress = (currentTime / gameDuration) * 100

  if (gameState === "finished") {
    const percentage = Math.round((score / game.maxScore) * 100)
    const accuracy = totalNotes > 0 ? Math.round((hits / totalNotes) * 100) : 0
    
    return (
      <div className="p-8 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-6"
        >
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Rhythm Master!</h2>
        <div className="space-y-1 mb-6">
          <p className="text-muted-foreground">Score: {score}</p>
          <p className="text-muted-foreground">Accuracy: {accuracy}%</p>
          <p className="text-muted-foreground">Max Combo: {maxCombo}x</p>
        </div>
        <Button onClick={startGame} size="lg" className="gap-2">
          <RotateCcw className="w-4 h-4" /> Play Again
        </Button>
      </div>
    )
  }

  if (gameState === "ready") {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Rhythm Runner</h2>
        <p className="text-muted-foreground mb-6">
          Tap the lanes when notes reach the bottom!<br />
          Use A, S, D, F keys or tap the lanes.
        </p>
        <div className="flex justify-center gap-4 mb-6">
          {laneColors.map((color, index) => (
            <div
              key={index}
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: color }}
            >
              {laneKeys[index]}
            </div>
          ))}
        </div>
        <Button onClick={startGame} size="lg" className="gap-2">
          <Play className="w-4 h-4" /> Start Game
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Combo: {combo}x</span>
        <span className="text-sm font-medium">Score: {score}</span>
      </div>
      
      <Progress value={progress} className="h-2 mb-4" />

      {/* Game Area */}
      <div className="relative h-64 bg-muted/50 rounded-xl overflow-hidden">
        {/* Lanes */}
        <div className="absolute inset-0 flex">
          {laneColors.map((color, index) => (
            <div
              key={index}
              className="flex-1 border-r border-border/30 last:border-r-0"
              style={{ backgroundColor: `${color}10` }}
            />
          ))}
        </div>

        {/* Hit Zone */}
        <div className="absolute bottom-12 left-0 right-0 h-1 bg-white/50" />

        {/* Notes */}
        <AnimatePresence>
          {notes.filter(note => !note.hit && note.time > currentTime - 500 && note.time < currentTime + 2000).map(note => {
            const position = ((note.time - currentTime) / 2000) * 100
            const opacity = note.time < currentTime ? 0 : 1
            
            return (
              <motion.div
                key={note.id}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity,
                  top: `${100 - position}%`
                }}
                exit={{ opacity: 0, scale: 1.5 }}
                className="absolute w-1/4 h-8 px-1"
                style={{ 
                  left: `${note.lane * 25}%`,
                }}
              >
                <div 
                  className="w-full h-full rounded-lg"
                  style={{ backgroundColor: laneColors[note.lane] }}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>

        {/* Hit Buttons */}
        <div className="absolute bottom-0 left-0 right-0 flex h-12">
          {laneColors.map((color, index) => (
            <motion.button
              key={index}
              whileTap={{ scale: 0.9, opacity: 0.8 }}
              onClick={() => handleLanePress(index)}
              className="flex-1 flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: color }}
            >
              {laneKeys[index]}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
