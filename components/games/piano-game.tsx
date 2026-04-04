"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Game } from "@/lib/game-data"
import { Sparkles, RotateCcw, Play, Volume2 } from "lucide-react"

interface PianoGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

const notes = [
  { note: "C", color: "white", freq: 261.63 },
  { note: "D", color: "white", freq: 293.66 },
  { note: "E", color: "white", freq: 329.63 },
  { note: "F", color: "white", freq: 349.23 },
  { note: "G", color: "white", freq: 392.00 },
  { note: "A", color: "white", freq: 440.00 },
  { note: "B", color: "white", freq: 493.88 },
  { note: "C2", color: "white", freq: 523.25 },
]

const songs = [
  { name: "Twinkle Twinkle", notes: ["C", "C", "G", "G", "A", "A", "G"], colors: ["#ef4444", "#ef4444", "#22c55e", "#22c55e", "#3b82f6", "#3b82f6", "#22c55e"] },
  { name: "Mary Had a Lamb", notes: ["E", "D", "C", "D", "E", "E", "E"], colors: ["#8b5cf6", "#f97316", "#ef4444", "#f97316", "#8b5cf6", "#8b5cf6", "#8b5cf6"] },
  { name: "Happy Birthday", notes: ["C", "C", "D", "C", "F", "E"], colors: ["#ef4444", "#ef4444", "#f97316", "#ef4444", "#22c55e", "#8b5cf6"] },
  { name: "Row Your Boat", notes: ["C", "C", "C", "D", "E"], colors: ["#ef4444", "#ef4444", "#ef4444", "#f97316", "#8b5cf6"] },
]

export function PianoGame({ game, onComplete }: PianoGameProps) {
  const [currentSong, setCurrentSong] = useState(0)
  const [currentNote, setCurrentNote] = useState(0)
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [finished, setFinished] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showDemo, setShowDemo] = useState(false)
  const [activeKey, setActiveKey] = useState<string | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const hasCompletedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const song = songs[currentSong]
  const progress = ((currentSong * song.notes.length + currentNote) / (songs.length * 6)) * 100

  const playNote = useCallback((freq: number, duration: number = 0.3) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.frequency.value = freq
    oscillator.type = "sine"
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)
    
    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + duration)
  }, [])

  const handleKeyPress = useCallback((note: string) => {
    if (finished || showDemo) return
    
    const noteData = notes.find(n => n.note === note)
    if (noteData) {
      playNote(noteData.freq)
      setActiveKey(note)
      setTimeout(() => setActiveKey(null), 200)
    }

    if (!isPlaying) {
      setIsPlaying(true)
    }

    const expectedNote = song.notes[currentNote]
    
    if (note === expectedNote) {
      setScore(s => s + 10)
      
      if (currentNote + 1 >= song.notes.length) {
        // Song complete
        if (currentSong + 1 >= songs.length) {
          // All songs complete
          setFinished(true)
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true
            const finalScore = Math.min(score + 10, game.maxScore)
            onCompleteRef.current(finalScore, game.maxScore)
          }
        } else {
          setCurrentSong(s => s + 1)
          setCurrentNote(0)
        }
      } else {
        setCurrentNote(n => n + 1)
      }
    } else {
      setMistakes(m => m + 1)
    }
  }, [currentNote, currentSong, finished, isPlaying, playNote, score, showDemo, song.notes, game.maxScore])

  const playDemo = useCallback(async () => {
    setShowDemo(true)
    
    for (let i = 0; i < song.notes.length; i++) {
      const note = song.notes[i]
      const noteData = notes.find(n => n.note === note)
      
      setActiveKey(note)
      if (noteData) playNote(noteData.freq, 0.5)
      
      await new Promise(resolve => setTimeout(resolve, 600))
      setActiveKey(null)
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    setShowDemo(false)
  }, [song.notes, playNote])

  const resetGame = () => {
    setCurrentSong(0)
    setCurrentNote(0)
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
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Piano Star!</h2>
        <p className="text-muted-foreground mb-2">
          You completed all songs with {mistakes} mistakes!
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
          Song {currentSong + 1} of {songs.length}: {song.name}
        </span>
        <span className="text-sm font-medium text-foreground">Score: {score}</span>
      </div>
      
      <Progress value={progress} className="h-2 mb-6" />

      {/* Current Note Display */}
      <div className="mb-6 text-center">
        <p className="text-sm text-muted-foreground mb-2">Play this sequence:</p>
        <div className="flex justify-center gap-2 flex-wrap">
          {song.notes.map((note, index) => (
            <motion.div
              key={index}
              animate={{ 
                scale: index === currentNote ? 1.2 : 1,
                opacity: index < currentNote ? 0.3 : 1
              }}
              className={`
                w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white
                ${index === currentNote ? "ring-2 ring-offset-2 ring-primary" : ""}
              `}
              style={{ backgroundColor: song.colors[index] }}
            >
              {note}
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

      {/* Piano Keys */}
      <div className="flex justify-center gap-1">
        {notes.map((noteData, index) => (
          <motion.button
            key={noteData.note}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              backgroundColor: activeKey === noteData.note 
                ? song.colors[song.notes.indexOf(noteData.note)] || "#3b82f6"
                : "#ffffff",
              y: activeKey === noteData.note ? 4 : 0
            }}
            onClick={() => handleKeyPress(noteData.note)}
            className={`
              w-12 h-32 rounded-b-lg border-2 border-gray-300 shadow-md
              flex items-end justify-center pb-2 font-bold text-sm
              transition-colors
              ${activeKey === noteData.note ? "text-white" : "text-gray-600"}
            `}
          >
            {noteData.note}
          </motion.button>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground mt-4">
        Tap the keys to play the melody!
      </p>
    </div>
  )
}
