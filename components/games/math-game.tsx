"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle, Zap, Trophy, Calculator, Play, Star, Timer, Target } from "lucide-react"
import type { Game } from "@/lib/game-data"

interface MathQuestion {
  question: string
  answer: number
  options: number[]
  hint?: string
}

function generateQuestion(gameId: string, difficulty: Game["difficulty"]): MathQuestion {
  let a: number, b: number, op: string, answer: number, hint: string = ""

  switch (gameId) {
    case "math-addition": {
      // Addition-focused questions
      if (difficulty === "easy") {
        a = Math.floor(Math.random() * 10) + 1
        b = Math.floor(Math.random() * 10) + 1
      } else {
        a = Math.floor(Math.random() * 50) + 10
        b = Math.floor(Math.random() * 50) + 10
      }
      op = "+"
      answer = a + b
      hint = "Add the two numbers together"
      break
    }
    case "math-multiplication": {
      // Multiplication tables
      if (difficulty === "easy") {
        a = Math.floor(Math.random() * 5) + 1
        b = Math.floor(Math.random() * 5) + 1
      } else if (difficulty === "medium") {
        a = Math.floor(Math.random() * 10) + 2
        b = Math.floor(Math.random() * 10) + 2
      } else {
        a = Math.floor(Math.random() * 12) + 2
        b = Math.floor(Math.random() * 12) + 2
      }
      op = "×"
      answer = a * b
      hint = `Multiply ${a} times ${b}`
      break
    }
    case "math-counting": {
      // Simple counting for kindergarten
      a = Math.floor(Math.random() * 5) + 1
      b = Math.floor(Math.random() * 5) + 1
      op = "+"
      answer = a + b
      hint = "Count up from the first number"
      break
    }
    case "math-fractions": {
      // Fraction questions (represented as division)
      const numerators = [1, 2, 3, 4, 5, 6, 8, 10]
      const denominators = [2, 3, 4, 5, 8, 10]
      b = denominators[Math.floor(Math.random() * denominators.length)]
      answer = numerators[Math.floor(Math.random() * numerators.length)]
      a = b * answer
      op = "÷"
      hint = `What is ${a} divided by ${b}?`
      break
    }
    case "math-algebra": {
      // Simple algebra: find x
      b = Math.floor(Math.random() * 10) + 2
      answer = Math.floor(Math.random() * 15) + 1
      a = b + answer
      op = "−"
      hint = `If x + ${b} = ${a}, what is x?`
      // Represent as: a - b = x
      break
    }
    case "math-geometry": {
      // Area and perimeter calculations
      const shapes = ["square", "rectangle"]
      const shape = shapes[Math.floor(Math.random() * shapes.length)]
      if (shape === "square") {
        a = Math.floor(Math.random() * 8) + 2
        const isArea = Math.random() > 0.5
        if (isArea) {
          answer = a * a
          hint = `Area of a square with side ${a}`
          op = "²"
          b = 0
        } else {
          answer = a * 4
          hint = `Perimeter of a square with side ${a}`
          op = "×4"
          b = 4
        }
      } else {
        a = Math.floor(Math.random() * 6) + 2
        b = Math.floor(Math.random() * 6) + 2
        const isArea = Math.random() > 0.5
        if (isArea) {
          answer = a * b
          hint = `Area of ${a} × ${b} rectangle`
          op = "×"
        } else {
          answer = 2 * (a + b)
          hint = `Perimeter of ${a} × ${b} rectangle`
          op = "P"
        }
      }
      break
    }
    default: {
      // Default mixed math
      if (difficulty === "easy") {
        a = Math.floor(Math.random() * 10) + 1
        b = Math.floor(Math.random() * 10) + 1
        op = "+"
        answer = a + b
      } else if (difficulty === "medium") {
        const ops = ["+", "−", "×"]
        op = ops[Math.floor(Math.random() * ops.length)]
        a = Math.floor(Math.random() * 20) + 5
        b = Math.floor(Math.random() * 10) + 1
        if (op === "+") answer = a + b
        else if (op === "−") answer = a - b
        else answer = a * b
      } else {
        const ops = ["+", "−", "×", "÷"]
        op = ops[Math.floor(Math.random() * ops.length)]
        if (op === "÷") {
          b = Math.floor(Math.random() * 10) + 2
          answer = Math.floor(Math.random() * 12) + 1
          a = b * answer
        } else {
          a = Math.floor(Math.random() * 50) + 10
          b = Math.floor(Math.random() * 30) + 5
          if (op === "+") answer = a + b
          else if (op === "−") answer = a - b
          else answer = a * b
        }
      }
    }
  }

  const options = new Set<number>([answer!])
  while (options.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5
    const wrong = answer! + offset
    if (wrong !== answer! && wrong > 0) options.add(wrong)
    else options.add(Math.max(1, Math.floor(Math.random() * (answer! * 2)) + 1))
  }

  // Format question based on game type
  let questionText: string
  if (gameId === "math-geometry" && op === "²") {
    questionText = `${a}² = ?`
  } else if (gameId === "math-geometry" && op === "P") {
    questionText = `Perimeter: ${a} × ${b}`
  } else if (gameId === "math-algebra") {
    questionText = `x + ${b} = ${a}, x = ?`
  } else {
    questionText = `${a} ${op} ${b} = ?`
  }

  return {
    question: questionText,
    answer: answer!,
    options: Array.from(options).sort(() => Math.random() - 0.5),
    hint,
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
    Array.from({ length: totalQuestions }, () => generateQuestion(game.id, game.difficulty))
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
    const stars = Math.ceil(percentage / 20)
    
    return (
      <Card className="max-w-xl mx-auto overflow-hidden border-0 shadow-2xl">
        <div className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 p-8 text-white text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Trophy className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {percentage >= 80 ? "Outstanding!" : percentage >= 50 ? "Good Job!" : "Keep Practicing!"}
            </h2>
            <p className="text-white/80">Math challenge completed!</p>
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
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-2xl border border-border bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 p-4 text-center">
              <Target className="w-5 h-5 mx-auto mb-2 text-emerald-600" />
              <p className="text-2xl font-bold text-foreground">{percentage}%</p>
              <p className="text-xs text-muted-foreground">Accuracy</p>
            </div>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 p-4 text-center">
              <Calculator className="w-5 h-5 mx-auto mb-2 text-cyan-600" />
              <p className="text-2xl font-bold text-foreground">{displayScore}</p>
              <p className="text-xs text-muted-foreground">Points</p>
            </div>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 text-center">
              <Zap className="w-5 h-5 mx-auto mb-2 text-amber-600" />
              <p className="text-2xl font-bold text-foreground">{streak}</p>
              <p className="text-xs text-muted-foreground">Best Streak</p>
            </div>
          </div>
          
          <Button 
            onClick={() => window.location.reload()} 
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            <Play className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const question = questions[currentQ]
  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Question {currentQ + 1} of {totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Score: {score} pts</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {streak >= 3 && (
            <Badge className="gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 rounded-lg px-3 py-1">
              <Zap className="h-3 w-3" />
              x2 Streak!
            </Badge>
          )}
          <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 ${
            timeLeft <= 15 
              ? "bg-destructive/10 text-destructive" 
              : "bg-muted text-muted-foreground"
          }`}>
            <Timer className="h-4 w-4" />
            <span className="font-mono font-medium">
              {mins}:{secs.toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
          style={{ width: `${((currentQ + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 p-8 text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">Solve this equation:</p>
          <div className="inline-flex items-center justify-center rounded-2xl bg-card border border-border shadow-sm px-8 py-6">
            <p className="font-mono text-5xl font-bold text-foreground tracking-wide">
              {question.question}
            </p>
          </div>
        </div>
      </Card>

      {/* Answer Options */}
      <div className="grid grid-cols-2 gap-3">
        {question.options.map((option, index) => {
          const isSelected = selected === option
          const isCorrectAnswer = option === question.answer
          const showResult = selected !== null
          
          let buttonClass = "relative h-20 text-2xl font-bold rounded-2xl transition-all duration-200 border-2 "
          
          if (showResult) {
            if (isCorrectAnswer) {
              buttonClass += "bg-gradient-to-br from-emerald-500 to-teal-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30"
            } else if (isSelected) {
              buttonClass += "bg-gradient-to-br from-rose-500 to-red-500 text-white border-rose-500 shadow-lg shadow-rose-500/30"
            } else {
              buttonClass += "bg-muted/50 text-muted-foreground border-transparent opacity-50"
            }
          } else {
            buttonClass += "bg-card hover:bg-muted/50 text-foreground border-border hover:border-primary/50 hover:shadow-md"
          }

          return (
            <button
              key={option}
              className={buttonClass}
              onClick={() => handleAnswer(option)}
              disabled={selected !== null}
            >
              <span className="absolute top-2 left-3 text-xs font-normal opacity-60">
                {String.fromCharCode(65 + index)}
              </span>
              {option}
              {showResult && isCorrectAnswer && (
                <CheckCircle2 className="absolute top-2 right-2 h-5 w-5" />
              )}
              {showResult && isSelected && !isCorrectAnswer && (
                <XCircle className="absolute top-2 right-2 h-5 w-5" />
              )}
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {isCorrect !== null && (
        <div
          className={`rounded-xl p-4 text-center font-medium ${
            isCorrect
              ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-gradient-to-r from-rose-500/10 to-red-500/10 text-rose-700 dark:text-rose-400"
          }`}
        >
          {isCorrect
            ? streak >= 3
              ? "Fantastic! Double points bonus!"
              : "Correct! Well done!"
            : `Oops! The answer was ${question.answer}`}
        </div>
      )}
    </div>
  )
}
