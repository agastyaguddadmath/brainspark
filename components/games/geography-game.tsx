"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Game } from "@/lib/game-data"
import { Globe, MapPin, Flag, Trophy, Star, ArrowRight, Check, X } from "lucide-react"

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
      const finalScore = Math.min(score, game.maxScore)
      onComplete(finalScore, game.maxScore)
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
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Geography Explorer!
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
          <p className="text-3xl font-bold text-primary mb-2">
            {score} / {game.maxScore}
          </p>
          <p className="text-muted-foreground mb-6">
            You answered {Math.round(percentage)}% correctly!
          </p>
          <Button onClick={() => window.location.reload()}>
            Play Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center gap-4">
        <Progress value={((currentIndex + 1) / totalQuestions) * 100} className="flex-1" />
        <Badge variant="secondary">
          {currentIndex + 1} / {totalQuestions}
        </Badge>
        <Badge variant="outline" className="bg-success/10 text-success">
          Score: {score}
        </Badge>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="capitalize">
              {getTypeIcon(currentQuestion.type)}
              <span className="ml-1">{currentQuestion.type}</span>
            </Badge>
          </div>
          <CardTitle className="text-xl mt-2">
            {currentQuestion.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let buttonClass = "w-full justify-start text-left h-auto py-4 px-4"
            
            if (showResult) {
              if (idx === currentQuestion.correct) {
                buttonClass += " bg-success text-success-foreground hover:bg-success"
              } else if (idx === selectedAnswer && idx !== currentQuestion.correct) {
                buttonClass += " bg-destructive text-destructive-foreground hover:bg-destructive"
              }
            }
            
            return (
              <Button
                key={idx}
                variant={showResult ? "default" : "outline"}
                className={buttonClass}
                onClick={() => handleAnswer(idx)}
                disabled={showResult}
              >
                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3 text-sm font-medium">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1">{option}</span>
                {showResult && idx === currentQuestion.correct && (
                  <Check className="w-5 h-5 ml-2" />
                )}
                {showResult && idx === selectedAnswer && idx !== currentQuestion.correct && (
                  <X className="w-5 h-5 ml-2" />
                )}
              </Button>
            )
          })}

          {/* Fun Fact */}
          {showResult && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm">
                <span className="font-semibold text-primary">Fun Fact: </span>
                {currentQuestion.fact}
              </p>
            </div>
          )}

          {/* Next Button */}
          {showResult && (
            <Button onClick={nextQuestion} className="w-full mt-4" size="lg">
              {currentIndex + 1 >= totalQuestions ? "See Results" : "Next Question"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
