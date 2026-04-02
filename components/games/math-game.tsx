"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, Zap, Trophy } from "lucide-react"
import type { Game } from "@/lib/game-data"

interface MathQuestion {
  question: string
  answer: number
  options: number[]
}

function generateQuestion(difficulty: Game["difficulty"]): MathQuestion {
  let a: number, b: number, op: string, answer: number

  if (difficulty === "easy") {
    a = Math.floor(Math.random() * 10) + 1
    b = Math.floor(Math.random() * 10) + 1
    op = "+"
    answer = a + b
  } else if (difficulty === "medium") {
    const ops = ["+", "-", "*"]
    op = ops[Math.floor(Math.random() * ops.length)]
    a = Math.floor(Math.random() * 20) + 5
    b = Math.floor(Math.random() * 10) + 1
    if (op === "+") answer = a + b
    else if (op === "-") answer = a - b
    else answer = a * b
  } else {
    const ops = ["+", "-", "*", "/"]
    op = ops[Math.floor(Math.random() * ops.length)]
    if (op === "/") {
      b = Math.floor(Math.random() * 10) + 2
      answer = Math.floor(Math.random() * 12) + 1
      a = b * answer
    } else {
      a = Math.floor(Math.random() * 50) + 10
      b = Math.floor(Math.random() * 30) + 5
      if (op === "+") answer = a + b
      else if (op === "-") answer = a - b
      else answer = a * b
    }
  }

  const options = new Set<number>([answer!])
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5
    const wrong = answer! + offset
    if (wrong !== answer! && wrong > 0) options.add(wrong)
    else options.add(Math.floor(Math.random() * (answer! * 2)) + 1)
  }

  return {
    question: `${a} ${op} ${b} = ?`,
    answer: answer!,
    options: Array.from(options).sort(() => Math.random() - 0.5),
  }
}

interface MathGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

export function MathGame({ game, onComplete }: MathGameProps) {
  const totalQuestions = 10
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [questions] = useState(() =>
    Array.from({ length: totalQuestions }, () => generateQuestion(game.difficulty))
  )
  const [finished, setFinished] = useState(false)
  const [timeLeft, setTimeLeft] = useState(game.difficulty === "easy" ? 120 : game.difficulty === "medium" ? 90 : 60)
  const hasCompletedRef = useRef(false)

  useEffect(() => {
    if (finished || timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setFinished(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [finished, timeLeft])

  const handleAnswer = useCallback(
    (option: number) => {
      if (selected !== null) return
      setSelected(option)
      const correct = option === questions[currentQ].answer
      setIsCorrect(correct)

      if (correct) {
        const bonus = streak >= 3 ? 2 : 1
        setScore((prev) => prev + 10 * bonus)
        setStreak((prev) => prev + 1)
      } else {
        setStreak(0)
      }

      setTimeout(() => {
        if (currentQ + 1 >= totalQuestions) {
          setFinished(true)
        } else {
          setCurrentQ((prev) => prev + 1)
          setSelected(null)
          setIsCorrect(null)
        }
      }, 1200)
    },
    [selected, currentQ, questions, streak]
  )

  useEffect(() => {
    if (finished && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      const maxScore = totalQuestions * 10
      const finalScore = Math.min(score, maxScore) // Cap score at max
      onComplete(finalScore, maxScore)
    }
  }, [finished, score, onComplete])

  if (finished) {
    const maxScore = totalQuestions * 10
    const displayScore = Math.min(score, maxScore)
    const percentage = Math.min(Math.round((score / maxScore) * 100), 100)
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <Trophy className="h-10 w-10 text-primary" />
        </div>
        <h2 className="mt-6 text-3xl font-bold text-foreground">
          {percentage >= 80 ? "Outstanding!" : percentage >= 50 ? "Good Job!" : "Keep Practicing!"}
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          You scored {displayScore} out of {maxScore} points
        </p>
        <div className="mt-6 flex items-center gap-4">
          <div className="rounded-xl bg-secondary p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{percentage}%</div>
            <div className="text-xs text-muted-foreground">Accuracy</div>
          </div>
          <div className="rounded-xl bg-secondary p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{displayScore}</div>
            <div className="text-xs text-muted-foreground">Points</div>
          </div>
          <div className="rounded-xl bg-secondary p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{streak}</div>
            <div className="text-xs text-muted-foreground">Best Streak</div>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQ]
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            {currentQ + 1}/{totalQuestions}
          </Badge>
          {streak >= 3 && (
            <Badge className="gap-1 bg-warning text-warning-foreground">
              <Zap className="h-3 w-3" />
              x2 Streak!
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Score: {score}</span>
          <span className={`text-sm font-mono ${timeLeft <= 15 ? "text-destructive" : "text-muted-foreground"}`}>
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
        </div>
      </div>

      <Progress value={((currentQ + 1) / totalQuestions) * 100} className="h-2" />

      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm font-medium text-muted-foreground">Solve this:</p>
        <p className="mt-4 font-mono text-4xl font-bold text-foreground">
          {question.question}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option) => {
          let variant: "outline" | "default" | "destructive" = "outline"
          let extraClass = ""

          if (selected !== null) {
            if (option === question.answer) {
              variant = "default"
              extraClass = "bg-[oklch(0.7_0.18_150)] text-[oklch(0.99_0_0)] border-[oklch(0.7_0.18_150)]"
            } else if (option === selected) {
              variant = "destructive"
            }
          }

          return (
            <Button
              key={option}
              variant={variant}
              className={`h-16 text-xl font-bold ${extraClass}`}
              onClick={() => handleAnswer(option)}
              disabled={selected !== null}
            >
              {option}
              {selected !== null && option === question.answer && (
                <CheckCircle2 className="ml-2 h-5 w-5" />
              )}
              {selected === option && option !== question.answer && (
                <XCircle className="ml-2 h-5 w-5" />
              )}
            </Button>
          )
        })}
      </div>

      {isCorrect !== null && (
        <div
          className={`rounded-lg p-3 text-center text-sm font-medium ${
            isCorrect
              ? "bg-[oklch(0.7_0.18_150/0.1)] text-[oklch(0.5_0.18_150)]"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {isCorrect
            ? streak >= 3
              ? "Fantastic! Double points!"
              : "Correct! Well done!"
            : `The answer was ${question.answer}`}
        </div>
      )}
    </div>
  )
}
