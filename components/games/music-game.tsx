"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Game } from "@/lib/game-data"
import { Music, Play, Volume2, Trophy, Star } from "lucide-react"

interface MusicGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

interface Note {
  id: number
  key: string
  color: string
  frequency: number
  name: string
}

const PIANO_KEYS: Note[] = [
  { id: 0, key: "C", color: "white", frequency: 261.63, name: "Do" },
  { id: 1, key: "C#", color: "black", frequency: 277.18, name: "Do#" },
  { id: 2, key: "D", color: "white", frequency: 293.66, name: "Re" },
  { id: 3, key: "D#", color: "black", frequency: 311.13, name: "Re#" },
  { id: 4, key: "E", color: "white", frequency: 329.63, name: "Mi" },
  { id: 5, key: "F", color: "white", frequency: 349.23, name: "Fa" },
  { id: 6, key: "F#", color: "black", frequency: 369.99, name: "Fa#" },
  { id: 7, key: "G", color: "white", frequency: 392.0, name: "Sol" },
  { id: 8, key: "G#", color: "black", frequency: 415.3, name: "Sol#" },
  { id: 9, key: "A", color: "white", frequency: 440.0, name: "La" },
  { id: 10, key: "A#", color: "black", frequency: 466.16, name: "La#" },
  { id: 11, key: "B", color: "white", frequency: 493.88, name: "Si" },
  { id: 12, key: "C2", color: "white", frequency: 523.25, name: "Do2" },
]

const MELODIES = [
  { name: "Happy Birthday", notes: [0, 0, 2, 0, 5, 4], description: "Play the start of Happy Birthday" },
  { name: "Twinkle Twinkle", notes: [0, 0, 7, 7, 9, 9, 7], description: "Play Twinkle Twinkle Little Star" },
  { name: "Mary Had a Lamb", notes: [4, 2, 0, 2, 4, 4, 4], description: "Play Mary Had a Little Lamb" },
  { name: "Jingle Bells", notes: [4, 4, 4, 4, 4, 4, 4, 7, 0, 2, 4], description: "Play Jingle Bells chorus" },
]

export function MusicGame({ game, onComplete }: MusicGameProps) {
  const [gameState, setGameState] = useState<"intro" | "playing" | "complete">("intro")
  const [currentMelody, setCurrentMelody] = useState(() => 
    MELODIES[Math.floor(Math.random() * MELODIES.length)]
  )
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [mistakes, setMistakes] = useState(0)
  const [activeKey, setActiveKey] = useState<number | null>(null)
  const [showHint, setShowHint] = useState(true)
  const [round, setRound] = useState(1)
  const [roundsCompleted, setRoundsCompleted] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)

  const playNote = useCallback((frequency: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }
    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)
    
    oscillator.type = "sine"
    oscillator.frequency.value = frequency
    gainNode.gain.value = 0.3
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    
    oscillator.start()
    oscillator.stop(ctx.currentTime + 0.5)
  }, [])

  const handleKeyPress = (noteId: number) => {
    setActiveKey(noteId)
    playNote(PIANO_KEYS[noteId].frequency)
    
    setTimeout(() => setActiveKey(null), 200)
    
    if (gameState !== "playing") return
    
    const expectedNote = currentMelody.notes[currentNoteIndex]
    
    if (noteId === expectedNote) {
      setScore(prev => prev + 10)
      if (currentNoteIndex + 1 >= currentMelody.notes.length) {
        // Melody complete
        setRoundsCompleted(prev => prev + 1)
        if (round >= 3) {
          // Game complete
          const finalScore = Math.min(Math.max(0, score + 10 - (mistakes * 5)), game.maxScore)
          setGameState("complete")
          onComplete(finalScore, game.maxScore)
        } else {
          // Next round
          setRound(prev => prev + 1)
          setCurrentMelody(MELODIES[Math.floor(Math.random() * MELODIES.length)])
          setCurrentNoteIndex(0)
          setShowHint(round >= 2 ? false : true)
        }
      } else {
        setCurrentNoteIndex(prev => prev + 1)
      }
    } else {
      setMistakes(prev => prev + 1)
    }
  }

  const playMelodyDemo = () => {
    currentMelody.notes.forEach((noteId, index) => {
      setTimeout(() => {
        setActiveKey(noteId)
        playNote(PIANO_KEYS[noteId].frequency)
        setTimeout(() => setActiveKey(null), 300)
      }, index * 500)
    })
  }

  const startGame = () => {
    setGameState("playing")
    playMelodyDemo()
  }

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  if (gameState === "intro") {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-6 h-6 text-primary" />
            {game.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Listen to the melody and play it back on the piano! Complete 3 melodies to finish the game.
          </p>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">How to Play:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Click &quot;Start&quot; to hear the melody</li>
              <li>Play the notes back in the correct order</li>
              <li>Watch for the highlighted key hints</li>
              <li>Hints disappear in later rounds!</li>
            </ul>
          </div>
          <Button onClick={startGame} size="lg" className="w-full">
            <Play className="w-4 h-4 mr-2" />
            Start Game
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (gameState === "complete") {
    const finalScore = Math.max(0, score - (mistakes * 5))
    const stars = Math.ceil((finalScore / game.maxScore) * 5)
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Musical Maestro!
          </h2>
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-8 h-8 ${
                  i < stars
                    ? "text-warning fill-warning"
                    : "text-muted"
                }`}
              />
            ))}
          </div>
          <p className="text-muted-foreground mb-2">
            Score: {finalScore} / {game.maxScore}
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            {roundsCompleted} melodies completed with {mistakes} mistakes
          </p>
          <Button onClick={() => window.location.reload()}>
            Play Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Badge variant="secondary">Round {round}/3</Badge>
          <Badge variant="secondary">Score: {score}</Badge>
          <Badge variant="destructive">Mistakes: {mistakes}</Badge>
        </div>
        <Button variant="outline" size="sm" onClick={playMelodyDemo}>
          <Volume2 className="w-4 h-4 mr-2" />
          Replay Melody
        </Button>
      </div>

      {/* Current Melody */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{currentMelody.description}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {currentMelody.notes.map((noteId, idx) => (
              <div
                key={idx}
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                  idx < currentNoteIndex
                    ? "bg-success text-success-foreground"
                    : idx === currentNoteIndex
                    ? "bg-primary text-primary-foreground animate-pulse"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {idx < currentNoteIndex ? "✓" : showHint ? PIANO_KEYS[noteId].name : "?"}
              </div>
            ))}
          </div>
          <Progress value={(currentNoteIndex / currentMelody.notes.length) * 100} />
        </CardContent>
      </Card>

      {/* Piano */}
      <Card>
        <CardContent className="p-4">
          <div className="relative flex justify-center">
            {/* White keys */}
            <div className="flex">
              {PIANO_KEYS.filter(k => k.color === "white").map((note) => (
                <button
                  key={note.id}
                  onClick={() => handleKeyPress(note.id)}
                  className={`w-12 h-36 border border-border rounded-b-lg transition-all ${
                    activeKey === note.id
                      ? "bg-primary"
                      : showHint && currentMelody.notes[currentNoteIndex] === note.id
                      ? "bg-primary/30"
                      : "bg-white hover:bg-muted"
                  }`}
                >
                  <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                    {note.name}
                  </span>
                </button>
              ))}
            </div>
            {/* Black keys */}
            <div className="absolute top-0 left-0 right-0 flex justify-center pointer-events-none">
              <div className="flex">
                {PIANO_KEYS.filter(k => k.color === "white").map((_, idx) => {
                  const blackKeyPositions = [1, 2, 4, 5, 6]
                  const hasBlackKey = blackKeyPositions.includes(idx + 1)
                  if (!hasBlackKey || idx >= PIANO_KEYS.filter(k => k.color === "white").length - 1) {
                    return <div key={idx} className="w-12" />
                  }
                  const blackNote = PIANO_KEYS.find(
                    k => k.color === "black" && k.id === idx * 2 + 1 - Math.floor((idx + 1) / 3)
                  )
                  if (!blackNote) return <div key={idx} className="w-12" />
                  
                  return (
                    <div key={idx} className="w-12 flex justify-end">
                      <button
                        onClick={() => handleKeyPress(blackNote.id)}
                        className={`w-8 h-20 rounded-b-md -mr-4 z-10 pointer-events-auto transition-all ${
                          activeKey === blackNote.id
                            ? "bg-primary"
                            : showHint && currentMelody.notes[currentNoteIndex] === blackNote.id
                            ? "bg-primary/50"
                            : "bg-foreground hover:bg-foreground/80"
                        }`}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
