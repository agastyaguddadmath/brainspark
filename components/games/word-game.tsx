"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Trophy, RotateCw } from "lucide-react"
import type { Game } from "@/lib/game-data"

interface WordPuzzle {
  scrambled: string
  answer: string
  hint: string
}

const easyWords: WordPuzzle[] = [
  { scrambled: "tac", answer: "cat", hint: "A furry pet that purrs" },
  { scrambled: "god", answer: "dog", hint: "Man's best friend" },
  { scrambled: "nus", answer: "sun", hint: "Shines in the sky during the day" },
  { scrambled: "erte", answer: "tree", hint: "It has leaves and branches" },
  { scrambled: "rats", answer: "star", hint: "Twinkles in the night sky" },
  { scrambled: "okbo", answer: "book", hint: "You read it for stories" },
  { scrambled: "shfi", answer: "fish", hint: "Lives in water" },
  { scrambled: "irdb", answer: "bird", hint: "It can fly" },
  { scrambled: "llba", answer: "ball", hint: "Round toy you play with" },
  { scrambled: "niar", answer: "rain", hint: "Water falling from clouds" },
]

const mediumWords: WordPuzzle[] = [
  { scrambled: "laepp", answer: "apple", hint: "A red or green fruit" },
  { scrambled: "naeco", answer: "ocean", hint: "The largest body of water" },
  { scrambled: "plaen", answer: "plane", hint: "Flies through the sky" },
  { scrambled: "clkco", answer: "clock", hint: "Tells you the time" },
  { scrambled: "atreh", answer: "earth", hint: "Our home planet" },
  { scrambled: "sumci", answer: "music", hint: "Songs and melodies" },
  { scrambled: "gaicm", answer: "magic", hint: "Tricks and illusions" },
  { scrambled: "ardgon", answer: "dragon", hint: "Mythical fire-breathing creature" },
  { scrambled: "stofre", answer: "forest", hint: "Full of trees and wildlife" },
  { scrambled: "kecort", answer: "rocket", hint: "Goes to outer space" },
]

const hardWords: WordPuzzle[] = [
  { scrambled: "yartivg", answer: "gravity", hint: "Force that keeps us grounded" },
  { scrambled: "moleclue", answer: "molecule", hint: "Smallest unit of a substance" },
  { scrambled: "baryril", answer: "library", hint: "Building full of books" },
  { scrambled: "tropecjl", answer: "projectl", hint: "Something you work on" },
  { scrambled: "nocvalo", answer: "volcano", hint: "Mountain that erupts lava" },
  { scrambled: "retupmoc", answer: "computer", hint: "Electronic device for work and play" },
  { scrambled: "odsiruna", answer: "dinosaur", hint: "Extinct reptile from long ago" },
  { scrambled: "talasncdi", answer: "distance", hint: "How far apart things are" },
  { scrambled: "etrapnci", answer: "patience", hint: "Ability to wait calmly" },
  { scrambled: "lhaclegne", answer: "challenge", hint: "A test of skill or ability" },
]

function getWords(difficulty: Game["difficulty"]): WordPuzzle[] {
  const pool = difficulty === "easy" ? easyWords : difficulty === "medium" ? mediumWords : hardWords
  return [...pool].sort(() => Math.random() - 0.5).slice(0, 8)
}

interface WordGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

export function WordGame({ game, onComplete }: WordGameProps) {
  const [words] = useState(() => getWords(game.difficulty))
  const [currentW, setCurrentW] = useState(0)
  const [score, setScore] = useState(0)
  const [guess, setGuess] = useState("")
  const [result, setResult] = useState<boolean | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [finished, setFinished] = useState(false)

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
    if (finished) onComplete(score, words.length * 12)
  }, [finished, score, words.length, onComplete])

  if (finished) {
    const percentage = Math.round((score / (words.length * 12)) * 100)
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[oklch(0.7_0.2_50/0.1)]">
          <Trophy className="h-10 w-10 text-[oklch(0.7_0.2_50)]" />
        </div>
        <h2 className="mt-6 text-3xl font-bold text-foreground">
          {percentage >= 80 ? "Word Wizard!" : percentage >= 50 ? "Nice Work!" : "Keep Learning!"}
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          You scored {score} out of {words.length * 12} points
        </p>
        <div className="mt-6 flex items-center gap-4">
          <div className="rounded-xl bg-secondary p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{percentage}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div className="rounded-xl bg-secondary p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{score}</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </div>
        </div>
      </div>
    )
  }

  const word = words[currentW]

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <Badge variant="outline">{currentW + 1}/{words.length}</Badge>
        <span className="text-sm font-medium text-foreground">Score: {score}</span>
      </div>

      <Progress value={((currentW + 1) / words.length) * 100} className="h-2" />

      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm font-medium text-muted-foreground">Unscramble this word:</p>
        <div className="mt-4 flex justify-center gap-2">
          {word.scrambled.split("").map((letter, i) => (
            <div
              key={i}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold uppercase text-primary"
            >
              {letter}
            </div>
          ))}
        </div>
      </div>

      {showHint && (
        <div className="rounded-lg bg-[oklch(0.78_0.18_70/0.15)] p-3 text-center text-sm text-foreground">
          Hint: {word.hint}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Type your answer..."
          className="flex-1 text-center text-lg font-medium"
          disabled={result !== null}
          autoFocus
        />
        <Button type="submit" disabled={result !== null || !guess.trim()}>
          Check
        </Button>
      </form>

      <div className="flex justify-center gap-3">
        {!showHint && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={() => setShowHint(true)}
          >
            Show hint (-4 pts)
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="gap-1 text-xs text-muted-foreground"
          onClick={() => {
            setGuess("")
          }}
        >
          <RotateCw className="h-3 w-3" />
          Clear
        </Button>
      </div>

      {result !== null && (
        <div
          className={`flex items-center justify-center gap-2 rounded-lg p-3 text-sm font-medium ${
            result
              ? "bg-[oklch(0.7_0.18_150/0.1)] text-[oklch(0.5_0.18_150)]"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {result ? (
            <>
              <CheckCircle2 className="h-5 w-5" />
              Correct! The word is &quot;{word.answer}&quot;
            </>
          ) : (
            <>
              <XCircle className="h-5 w-5" />
              The answer was &quot;{word.answer}&quot;
            </>
          )}
        </div>
      )}
    </div>
  )
}
