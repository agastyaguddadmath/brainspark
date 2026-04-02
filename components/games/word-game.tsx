"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle, Trophy, RotateCw, Lightbulb, Type, Play, Star, Sparkles, Send } from "lucide-react"
import type { Game } from "@/lib/game-data"

interface WordPuzzle {
  scrambled: string
  answer: string
  hint: string
}

// Word Builder - basic word unscrambling
const wordBuilderWords: WordPuzzle[] = [
  { scrambled: "tac", answer: "cat", hint: "A furry pet that purrs" },
  { scrambled: "god", answer: "dog", hint: "Man's best friend" },
  { scrambled: "nus", answer: "sun", hint: "Shines in the sky during the day" },
  { scrambled: "etre", answer: "tree", hint: "It has leaves and branches" },
  { scrambled: "rats", answer: "star", hint: "Twinkles in the night sky" },
  { scrambled: "okbo", answer: "book", hint: "You read it for stories" },
  { scrambled: "shfi", answer: "fish", hint: "Lives in water" },
  { scrambled: "irdb", answer: "bird", hint: "It can fly" },
  { scrambled: "llba", answer: "ball", hint: "Round toy you play with" },
  { scrambled: "niar", answer: "rain", hint: "Water falling from clouds" },
]

// Phonics Fun - letter sounds and patterns
const phonicsWords: WordPuzzle[] = [
  { scrambled: "tah", answer: "hat", hint: "You wear it on your head" },
  { scrambled: "gpi", answer: "pig", hint: "Farm animal that oinks" },
  { scrambled: "teb", answer: "bet", hint: "To wager something" },
  { scrambled: "nuf", answer: "fun", hint: "Enjoyment and play" },
  { scrambled: "tpo", answer: "pot", hint: "Cook food in this" },
  { scrambled: "deb", answer: "bed", hint: "Sleep on this" },
  { scrambled: "tne", answer: "net", hint: "Catches fish or butterflies" },
  { scrambled: "puc", answer: "cup", hint: "Drink from this" },
  { scrambled: "gub", answer: "bug", hint: "Small crawling insect" },
  { scrambled: "xob", answer: "box", hint: "Put things inside" },
]

// Spell Bee - spelling challenge
const spellBeeWords: WordPuzzle[] = [
  { scrambled: "laepp", answer: "apple", hint: "A red or green fruit" },
  { scrambled: "naeco", answer: "ocean", hint: "The largest body of water" },
  { scrambled: "plaen", answer: "plane", hint: "Flies through the sky" },
  { scrambled: "clkco", answer: "clock", hint: "Tells you the time" },
  { scrambled: "atreh", answer: "earth", hint: "Our home planet" },
  { scrambled: "sumci", answer: "music", hint: "Songs and melodies" },
  { scrambled: "gaicm", answer: "magic", hint: "Tricks and illusions" },
  { scrambled: "stofre", answer: "forest", hint: "Full of trees and wildlife" },
]

// Story Crafter - story-related vocabulary
const storyCrafterWords: WordPuzzle[] = [
  { scrambled: "ardgon", answer: "dragon", hint: "Mythical fire-breathing creature" },
  { scrambled: "slteca", answer: "castle", hint: "Where royalty lives" },
  { scrambled: "stproes", answer: "protest", hint: "Speak out against something" },
  { scrambled: "roeh", answer: "hero", hint: "Saves the day" },
  { scrambled: "gamic", answer: "magic", hint: "Supernatural powers" },
  { scrambled: "stqeu", answer: "quest", hint: "A long journey or search" },
  { scrambled: "knhgit", answer: "knight", hint: "Armored warrior" },
  { scrambled: "rwzida", answer: "wizard", hint: "Magical spellcaster" },
]

// Reading Rally - comprehension vocabulary
const readingRallyWords: WordPuzzle[] = [
  { scrambled: "yartivg", answer: "gravity", hint: "Force that keeps us grounded" },
  { scrambled: "baryril", answer: "library", hint: "Building full of books" },
  { scrambled: "nocvalo", answer: "volcano", hint: "Mountain that erupts lava" },
  { scrambled: "retupmoc", answer: "computer", hint: "Electronic device for work and play" },
  { scrambled: "odsiruna", answer: "dinosaur", hint: "Extinct reptile from long ago" },
  { scrambled: "talsnedi", answer: "distance", hint: "How far apart things are" },
  { scrambled: "etrapnci", answer: "patience", hint: "Ability to wait calmly" },
  { scrambled: "lhaclegne", answer: "challenge", hint: "A test of skill or ability" },
]

function getWords(gameId: string, difficulty: Game["difficulty"]): WordPuzzle[] {
  let pool: WordPuzzle[]
  
  switch (gameId) {
    case "lang-words":
      pool = wordBuilderWords
      break
    case "lang-phonics":
      pool = phonicsWords
      break
    case "lang-spelling":
      pool = spellBeeWords
      break
    case "lang-story":
      pool = storyCrafterWords
      break
    case "lang-reading":
      pool = readingRallyWords
      break
    default:
      // Fallback to difficulty-based
      if (difficulty === "easy") pool = [...wordBuilderWords, ...phonicsWords]
      else if (difficulty === "medium") pool = [...spellBeeWords, ...storyCrafterWords]
      else pool = readingRallyWords
  }
  
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 8)
}

interface WordGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

export function WordGame({ game, onComplete }: WordGameProps) {
  const [words] = useState(() => getWords(game.id, game.difficulty))
  const [currentW, setCurrentW] = useState(0)
  const [score, setScore] = useState(0)
  const [guess, setGuess] = useState("")
  const [result, setResult] = useState<boolean | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [finished, setFinished] = useState(false)
  const hasCompletedRef = useRef(false)

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (result !== null || !guess.trim()) return
      const correct = guess.trim().toLowerCase() === words[currentW].answer.toLowerCase()
      setResult(correct)
      if (correct) setScore((prev) => prev + (showHint ? 8 : 12))

      setTimeout(() => {
        if (currentW + 1 >= words.length) {
          setFinished(true)
        } else {
          setCurrentW((prev) => prev + 1)
          setGuess("")
          setResult(null)
          setShowHint(false)
        }
      }, 1500)
    },
    [guess, currentW, words, result, showHint]
  )

  useEffect(() => {
    if (finished && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onComplete(score, words.length * 12)
    }
  }, [finished, score, words.length, onComplete])

  if (finished) {
    const percentage = Math.round((score / (words.length * 12)) * 100)
    const stars = Math.ceil(percentage / 20)
    
    return (
      <Card className="max-w-xl mx-auto overflow-hidden border-0 shadow-2xl">
        <div className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-8 text-white text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Trophy className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {percentage >= 80 ? "Word Wizard!" : percentage >= 50 ? "Nice Work!" : "Keep Learning!"}
            </h2>
            <p className="text-white/80">Word puzzle completed!</p>
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
            <div className="rounded-2xl border border-border bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{percentage}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 p-4 text-center">
              <p className="text-3xl font-bold text-foreground">{score}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </div>
          </div>
          
          <Button 
            onClick={() => window.location.reload()} 
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
          >
            <Play className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const word = words[currentW]

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20">
            <Type className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Word {currentW + 1} of {words.length}</p>
            <p className="text-xs text-muted-foreground">Score: {score} pts</p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
          style={{ width: `${((currentW + 1) / words.length) * 100}%` }}
        />
      </div>

      {/* Scrambled Word Card */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10 p-8 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-4">Unscramble the letters:</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {word.scrambled.split("").map((letter, i) => (
              <div
                key={i}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-2xl font-bold uppercase text-white shadow-lg shadow-orange-500/20 transform hover:scale-105 transition-transform"
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Hint Section */}
      {showHint && (
        <div className="flex items-start gap-3 rounded-xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-4 border border-yellow-500/20">
          <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">Hint</p>
            <p className="text-sm text-foreground">{word.hint}</p>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type your answer..."
          className="flex-1 text-center text-lg font-medium h-14 rounded-xl"
          disabled={result !== null}
          autoFocus
        />
        <Button 
          type="submit" 
          disabled={result !== null || !guess.trim()}
          className="h-14 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>

      {/* Action Buttons */}
      <div className="flex justify-center gap-3">
        {!showHint && (
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg gap-2"
            onClick={() => setShowHint(true)}
          >
            <Lightbulb className="h-4 w-4" />
            Show Hint (-4 pts)
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="rounded-lg gap-2"
          onClick={() => setGuess("")}
        >
          <RotateCw className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Result Feedback */}
      {result !== null && (
        <div
          className={`flex items-center justify-center gap-2 rounded-xl p-4 font-medium ${
            result
              ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-gradient-to-r from-rose-500/10 to-red-500/10 text-rose-700 dark:text-rose-400"
          }`}
        >
          {result ? (
            <>
              <CheckCircle2 className="h-5 w-5" />
              <span>Correct! The word is <strong>&quot;{word.answer}&quot;</strong></span>
              <Sparkles className="h-4 w-4" />
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5" />
              <span>The answer was <strong>&quot;{word.answer}&quot;</strong></span>
            </>
          )}
        </div>
      )}
    </div>
  )
}
