"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Game } from "@/lib/game-data"
import { Music, Play, Volume2, Trophy, Star, Sparkles, Check, HelpCircle } from "lucide-react"

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
  label: string
}

const PIANO_KEYS: Note[] = [
  { id: 0, key: "C", color: "white", frequency: 261.63, name: "Do", label: "C" },
  { id: 1, key: "C#", color: "black", frequency: 277.18, name: "Do#", label: "C#" },
  { id: 2, key: "D", color: "white", frequency: 293.66, name: "Re", label: "D" },
  { id: 3, key: "D#", color: "black", frequency: 311.13, name: "Re#", label: "D#" },
  { id: 4, key: "E", color: "white", frequency: 329.63, name: "Mi", label: "E" },
  { id: 5, key: "F", color: "white", frequency: 349.23, name: "Fa", label: "F" },
  { id: 6, key: "F#", color: "black", frequency: 369.99, name: "Fa#", label: "F#" },
  { id: 7, key: "G", color: "white", frequency: 392.0, name: "Sol", label: "G" },
  { id: 8, key: "G#", color: "black", frequency: 415.3, name: "Sol#", label: "G#" },
  { id: 9, key: "A", color: "white", frequency: 440.0, name: "La", label: "A" },
  { id: 10, key: "A#", color: "black", frequency: 466.16, name: "La#", label: "A#" },
  { id: 11, key: "B", color: "white", frequency: 493.88, name: "Si", label: "B" },
  { id: 12, key: "C2", color: "white", frequency: 523.25, name: "Do2", label: "C" },
]

const MELODIES = [
  { name: "Happy Birthday", notes: [0, 0, 2, 0, 5, 4], description: "Play the start of Happy Birthday", emoji: "🎂" },
  { name: "Twinkle Twinkle", notes: [0, 0, 7, 7, 9, 9, 7], description: "Play Twinkle Twinkle Little Star", emoji: "⭐" },
  { name: "Mary Had a Lamb", notes: [4, 2, 0, 2, 4, 4, 4], description: "Play Mary Had a Little Lamb", emoji: "🐑" },
  { name: "Jingle Bells", notes: [4, 4, 4, 4, 4, 4, 4, 7, 0, 2, 4], description: "Play Jingle Bells chorus", emoji: "🔔" },
]

// Color palette for visual feedback
const NOTE_COLORS = [
  "from-rose-400 to-rose-600",      // C
  "from-rose-500 to-rose-700",      // C#
  "from-orange-400 to-orange-600",  // D
  "from-orange-500 to-orange-700",  // D#
  "from-amber-400 to-amber-600",    // E
  "from-yellow-400 to-yellow-600",  // F
  "from-lime-500 to-lime-700",      // F#
  "from-emerald-400 to-emerald-600",// G
  "from-teal-500 to-teal-700",      // G#
  "from-cyan-400 to-cyan-600",      // A
  "from-blue-500 to-blue-700",      // A#
  "from-indigo-400 to-indigo-600",  // B
  "from-violet-400 to-violet-600",  // C2
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
  const hasCompletedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

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
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true
            const finalScore = Math.min(Math.max(0, score + 10 - (mistakes * 5)), game.maxScore)
            setGameState("complete")
            onCompleteRef.current(finalScore, game.maxScore)
          }
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
      <Card className="max-w-2xl mx-auto overflow-hidden border-0 shadow-2xl">
        <div className="relative bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-8 text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <Music className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{game.name}</h1>
                <p className="text-white/80 text-sm">Become a musical maestro!</p>
              </div>
            </div>
            
            {/* Animated music notes */}
            <div className="flex justify-center gap-4 py-6">
              {["C", "E", "G", "B"].map((note, i) => (
                <div
                  key={note}
                  className="w-12 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center shadow-lg"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="text-2xl font-bold">{note}</span>
                  <span className="text-xs text-white/70">note</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <CardContent className="space-y-6 p-6 bg-card">
          <p className="text-muted-foreground text-center">
            Listen to the melody and play it back on the piano! Complete 3 melodies to finish the game.
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: "🎵", text: "Listen to melody" },
              { icon: "🎹", text: "Play it back" },
              { icon: "💡", text: "Follow the hints" },
              { icon: "🏆", text: "Earn your stars!" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm font-medium text-foreground">{item.text}</span>
              </div>
            ))}
          </div>
          
          <Button onClick={startGame} size="lg" className="w-full h-14 text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 shadow-lg">
            <Play className="w-5 h-5 mr-2" />
            Start Playing
            <Sparkles className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (gameState === "complete") {
    const finalScore = Math.max(0, score - (mistakes * 5))
    const stars = Math.ceil((finalScore / game.maxScore) * 5)
    
    return (
      <Card className="max-w-2xl mx-auto overflow-hidden border-0 shadow-2xl">
        <div className="relative bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-8 text-white text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Trophy className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              Musical Maestro!
            </h2>
            <p className="text-white/80">You&apos;ve completed the challenge!</p>
          </div>
        </div>
        
        <CardContent className="p-8 bg-card">
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  i < stars
                    ? "bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30"
                    : "bg-muted"
                }`}
              >
                <Star
                  className={`w-6 h-6 ${
                    i < stars ? "text-white fill-white" : "text-muted-foreground"
                  }`}
                />
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{finalScore}</p>
              <p className="text-sm text-muted-foreground">Final Score</p>
            </div>
            <div className="rounded-2xl border border-border bg-muted/30 p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{roundsCompleted}</p>
              <p className="text-sm text-muted-foreground">Melodies Played</p>
            </div>
          </div>
          
          <Button 
            onClick={() => window.location.reload()} 
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
          >
            <Play className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/20">
            <Music className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Round {round} of 3</p>
            <p className="text-xs text-muted-foreground">Score: {score} pts</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {mistakes > 0 && (
            <Badge variant="destructive" className="rounded-lg px-3 py-1">
              {mistakes} {mistakes === 1 ? "miss" : "misses"}
            </Badge>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={playMelodyDemo}
            className="rounded-xl"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            Replay
          </Button>
        </div>
      </div>

      {/* Current Melody */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{currentMelody.emoji}</span>
            <div>
              <h3 className="font-bold text-foreground">{currentMelody.name}</h3>
              <p className="text-sm text-muted-foreground">{currentMelody.description}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {currentMelody.notes.map((noteId, idx) => (
              <div
                key={idx}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  idx < currentNoteIndex
                    ? `bg-gradient-to-br ${NOTE_COLORS[noteId]} text-white shadow-lg`
                    : idx === currentNoteIndex
                    ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/40 scale-110 ring-2 ring-violet-400 ring-offset-2 ring-offset-background"
                    : "bg-muted/50 text-muted-foreground border border-border"
                }`}
              >
                {idx < currentNoteIndex ? (
                  <Check className="w-5 h-5" />
                ) : showHint ? (
                  PIANO_KEYS[noteId].label
                ) : (
                  <HelpCircle className="w-4 h-4" />
                )}
              </div>
            ))}
          </div>
          
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
              style={{ width: `${(currentNoteIndex / currentMelody.notes.length) * 100}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Modern Piano */}
      <Card className="overflow-hidden border-0 shadow-2xl">
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-6 pb-4">
          <div className="relative flex justify-center">
            {/* Piano frame */}
            <div className="relative rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 p-3 shadow-inner">
              {/* White keys */}
              <div className="flex gap-0.5 relative">
                {PIANO_KEYS.filter(k => k.color === "white").map((note, index) => {
                  const isActive = activeKey === note.id
                  const isHint = showHint && currentMelody.notes[currentNoteIndex] === note.id
                  
                  return (
                    <button
                      key={note.id}
                      onClick={() => handleKeyPress(note.id)}
                      className={`relative w-11 sm:w-14 h-40 sm:h-48 rounded-b-lg transition-all duration-100 flex flex-col justify-end items-center pb-2 ${
                        isActive
                          ? `bg-gradient-to-b ${NOTE_COLORS[note.id]} shadow-lg scale-[0.98] translate-y-1`
                          : isHint
                          ? "bg-gradient-to-b from-violet-200 to-violet-300 shadow-md"
                          : "bg-gradient-to-b from-white to-slate-100 hover:from-slate-50 hover:to-slate-200 shadow-md"
                      }`}
                      style={{
                        boxShadow: isActive 
                          ? "inset 0 -2px 4px rgba(0,0,0,0.2)"
                          : "0 4px 8px rgba(0,0,0,0.3), inset 0 -4px 0 rgba(0,0,0,0.1)"
                      }}
                    >
                      <span className={`text-xs font-semibold ${
                        isActive ? "text-white" : "text-slate-500"
                      }`}>
                        {note.label}
                      </span>
                    </button>
                  )
                })}
              </div>
              
              {/* Black keys */}
              <div className="absolute top-3 left-3 right-3 flex pointer-events-none">
                <div className="flex gap-0.5">
                  {PIANO_KEYS.filter(k => k.color === "white").map((whiteKey, idx) => {
                    // Black keys appear after C, D, F, G, A (not after E, B)
                    const blackKeyAfter = [0, 2, 5, 7, 9] // Note IDs that have black keys after
                    const hasBlackKey = blackKeyAfter.includes(whiteKey.id) && whiteKey.id !== 12
                    
                    if (!hasBlackKey) {
                      return <div key={idx} className="w-11 sm:w-14" />
                    }
                    
                    const blackNote = PIANO_KEYS.find(k => k.id === whiteKey.id + 1)
                    if (!blackNote || blackNote.color !== "black") {
                      return <div key={idx} className="w-11 sm:w-14" />
                    }
                    
                    const isActive = activeKey === blackNote.id
                    const isHint = showHint && currentMelody.notes[currentNoteIndex] === blackNote.id
                    
                    return (
                      <div key={idx} className="w-11 sm:w-14 flex justify-end">
                        <button
                          onClick={() => handleKeyPress(blackNote.id)}
                          className={`w-7 sm:w-9 h-24 sm:h-28 rounded-b-md -mr-3.5 sm:-mr-4.5 z-10 pointer-events-auto transition-all duration-100 ${
                            isActive
                              ? `bg-gradient-to-b ${NOTE_COLORS[blackNote.id]} translate-y-0.5`
                              : isHint
                              ? "bg-gradient-to-b from-violet-600 to-violet-800"
                              : "bg-gradient-to-b from-slate-800 to-slate-950 hover:from-slate-700 hover:to-slate-900"
                          }`}
                          style={{
                            boxShadow: isActive
                              ? "0 2px 4px rgba(0,0,0,0.4)"
                              : "0 4px 8px rgba(0,0,0,0.5), inset 0 -2px 0 rgba(0,0,0,0.3)"
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
          
          {/* Hint text */}
          {showHint && (
            <p className="text-center text-sm text-slate-400 mt-4">
              Look for the highlighted key to play next!
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
