"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Game } from "@/lib/game-data"
import { Globe, MapPin, Flag, Trophy, Star, ArrowRight, Check, X, Play, Landmark, Lightbulb } from "lucide-react"

interface GeographyGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

interface Question {
  type: "capital" | "flag" | "continent" | "landmark"
  question: string
  options: string[]
  correct: number
  fact: string
}

const QUESTIONS: Question[] = [
  {
    type: "capital",
    question: "What is the capital of France?",
    options: ["London", "Paris", "Berlin", "Madrid"],
    correct: 1,
    fact: "Paris is known as the 'City of Light' and is home to the Eiffel Tower!"
  },
  {
    type: "capital",
    question: "What is the capital of Japan?",
    options: ["Seoul", "Beijing", "Tokyo", "Bangkok"],
    correct: 2,
    fact: "Tokyo is one of the largest cities in the world with over 13 million people!"
  },
  {
    type: "continent",
    question: "Which continent is Brazil located in?",
    options: ["Africa", "Europe", "South America", "Asia"],
    correct: 2,
    fact: "Brazil is the largest country in South America and is famous for the Amazon rainforest!"
  },
  {
    type: "continent",
    question: "Which continent has the most countries?",
    options: ["Asia", "Africa", "Europe", "South America"],
    correct: 1,
    fact: "Africa has 54 countries, more than any other continent!"
  },
  {
    type: "landmark",
    question: "In which country would you find the Great Wall?",
    options: ["Japan", "India", "China", "Korea"],
    correct: 2,
    fact: "The Great Wall of China is over 13,000 miles long!"
  },
  {
    type: "landmark",
    question: "Where is the Statue of Liberty located?",
    options: ["France", "United States", "United Kingdom", "Italy"],
    correct: 1,
    fact: "The Statue of Liberty was a gift from France to the United States!"
  },
  {
    type: "flag",
    question: "Which country has a maple leaf on its flag?",
    options: ["Australia", "United Kingdom", "Canada", "New Zealand"],
    correct: 2,
    fact: "The Canadian flag features a red maple leaf, a symbol of Canada since the 1700s!"
  },
  {
    type: "capital",
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Perth"],
    correct: 2,
    fact: "Many people think Sydney is the capital, but it's actually Canberra!"
  },
  {
    type: "continent",
    question: "On which continent would you find Egypt?",
    options: ["Asia", "Africa", "Europe", "Middle East"],
    correct: 1,
    fact: "Egypt is in northeastern Africa and is home to the ancient pyramids!"
  },
  {
    type: "landmark",
    question: "In which city would you find the Colosseum?",
    options: ["Athens", "Rome", "Cairo", "Paris"],
    correct: 1,
    fact: "The Colosseum in Rome could hold up to 80,000 spectators!"
  },
  {
    type: "capital",
    question: "What is the capital of Germany?",
    options: ["Munich", "Frankfurt", "Berlin", "Hamburg"],
    correct: 2,
    fact: "Berlin is known for its rich history and vibrant art scene!"
  },
  {
    type: "flag",
    question: "Which country has stars on a blue background in its flag?",
    options: ["Brazil", "European Union", "China", "Japan"],
    correct: 1,
    fact: "The EU flag has 12 gold stars representing unity among European nations!"
  },
]

export function GeographyGame({ game, onComplete }: GeographyGameProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [gameState, setGameState] = useState<"playing" | "complete">("playing")
  const totalQuestions = 8
  const hasCompletedRef = useRef(false)

  useEffect(() => {
    // Shuffle and pick questions
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.slice(0, totalQuestions))
  }, [])

  const currentQuestion = questions[currentIndex]

  const handleAnswer = (answerIndex: number) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
    setShowResult(true)
    
    if (answerIndex === currentQuestion.correct) {
      setScore(prev => prev + Math.round(game.maxScore / totalQuestions))
    }
  }

  const nextQuestion = () => {
    if (currentIndex + 1 >= totalQuestions) {
      setGameState("complete")
      // Score is already updated, use it directly
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true
        const finalScore = Math.min(score, game.maxScore)
        onComplete(finalScore, game.maxScore)
      }
    } else {
      setCurrentIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "capital":
        return <MapPin className="w-4 h-4" />
      case "flag":
        return <Flag className="w-4 h-4" />
      case "landmark":
        return <Star className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  if (!currentQuestion) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading questions...</p>
        </CardContent>
      </Card>
    )
  }

  if (gameState === "complete") {
    const percentage = (score / game.maxScore) * 100
    const stars = Math.ceil(percentage / 20)
    
    return (
      <Card className="max-w-xl mx-auto overflow-hidden border-0 shadow-2xl">
        <div className="relative bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500 p-8 text-white text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjIiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-50" />
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl">
              <Trophy className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold mb-2">
              Geography Explorer!
            </h2>
            <p className="text-white/80">World tour completed!</p>
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
            <div className="rounded-2xl border border-border bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 p-4 text-center">
              <Globe className="w-6 h-6 mx-auto mb-2 text-sky-600" />
              <p className="text-3xl font-bold text-foreground">{score}</p>
              <p className="text-sm text-muted-foreground">Points</p>
            </div>
            <div className="rounded-2xl border border-border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 text-center">
              <Check className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-3xl font-bold text-foreground">{Math.round(percentage)}%</p>
              <p className="text-sm text-muted-foreground">Accuracy</p>
            </div>
          </div>
          
          <Button 
            onClick={() => window.location.reload()}
            size="lg"
            className="w-full h-14 text-lg bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600"
          >
            <Play className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 max-w-xl mx-auto">
      {/* Stats Bar */}
      <div className="flex flex-wrap gap-3 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-500 text-white shadow-lg shadow-sky-500/20">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Question {currentIndex + 1} of {totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Score: {score} pts</p>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-sky-500/10 to-blue-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-800 rounded-lg capitalize">
          {getTypeIcon(currentQuestion.type)}
          <span className="ml-1">{currentQuestion.type}</span>
        </Badge>
      </div>

      {/* Progress */}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-sky-500 to-blue-500 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="overflow-hidden border-0 shadow-xl">
        <div className="bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-indigo-500/10 p-8">
          <p className="text-center text-xl font-semibold leading-relaxed text-foreground">
            {currentQuestion.question}
          </p>
        </div>
        
        <CardContent className="p-6 space-y-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === idx
            const isCorrectAnswer = idx === currentQuestion.correct
            
            let buttonClass = "w-full justify-start text-left h-auto py-4 px-4 rounded-xl transition-all duration-200 border-2 flex items-center "
            
            if (showResult) {
              if (isCorrectAnswer) {
                buttonClass += "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500 text-foreground"
              } else if (isSelected) {
                buttonClass += "bg-gradient-to-r from-rose-500/10 to-red-500/10 border-rose-500 text-foreground"
              } else {
                buttonClass += "bg-muted/30 border-transparent text-muted-foreground opacity-50"
              }
            } else {
              buttonClass += "bg-card hover:bg-muted/50 border-border hover:border-primary/50"
            }
            
            return (
              <button
                key={idx}
                className={buttonClass}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
              >
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 text-sm font-bold ${
                  showResult && isCorrectAnswer
                    ? "bg-emerald-500 text-white"
                    : showResult && isSelected
                    ? "bg-rose-500 text-white"
                    : "bg-gradient-to-br from-sky-500/20 to-blue-500/20 text-sky-700 dark:text-sky-400"
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 font-medium">{option}</span>
                {showResult && isCorrectAnswer && (
                  <Check className="w-5 h-5 text-emerald-500 ml-2" />
                )}
                {showResult && isSelected && !isCorrectAnswer && (
                  <X className="w-5 h-5 text-rose-500 ml-2" />
                )}
              </button>
            )
          })}

          {/* Fun Fact */}
          {showResult && (
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-gradient-to-r from-sky-500/10 to-blue-500/10 p-4 border border-sky-500/20">
              <Lightbulb className="h-5 w-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-sky-600 dark:text-sky-400">Fun Fact</p>
                <p className="mt-0.5 text-sm text-foreground">{currentQuestion.fact}</p>
              </div>
            </div>
          )}

          {/* Next Button */}
          {showResult && (
            <Button 
              onClick={nextQuestion} 
              className="w-full mt-4 h-14 text-lg rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600"
            >
              {currentIndex + 1 >= totalQuestions ? "See Results" : "Next Question"}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
