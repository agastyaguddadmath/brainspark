"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { Game } from "@/lib/game-data"
import { Sparkles, RotateCcw } from "lucide-react"

interface ColorMatchGameProps {
  game: Game
  onComplete: (score: number, maxScore: number) => void
}

const colors = [
  { name: "Red", hex: "#ef4444", light: "#fecaca" },
  { name: "Blue", hex: "#3b82f6", light: "#bfdbfe" },
  { name: "Green", hex: "#22c55e", light: "#bbf7d0" },
  { name: "Yellow", hex: "#eab308", light: "#fef08a" },
  { name: "Purple", hex: "#a855f7", light: "#e9d5ff" },
  { name: "Orange", hex: "#f97316", light: "#fed7aa" },
  { name: "Pink", hex: "#ec4899", light: "#fbcfe8" },
  { name: "Brown", hex: "#a16207", light: "#d6b88f" },
]

type QuestionType = "name" | "match" | "mix"

interface Question {
  type: QuestionType
  question: string
  displayColor: string
  options: string[]
  correct: number
}

function generateQuestions(): Question[] {
  const questions: Question[] = []
  const shuffled = [...colors].sort(() => Math.random() - 0.5)
  
  // Name the color questions
  for (let i = 0; i < 4; i++) {
    const color = shuffled[i]
    const wrongOptions = colors
      .filter(c => c.name !== color.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.name)
    const options = [...wrongOptions, color.name].sort(() => Math.random() - 0.5)
    questions.push({
      type: "name",
      question: "What color is this?",
      displayColor: color.hex,
      options,
      correct: options.indexOf(color.name)
    })
  }
  
  // Color mixing questions
  const mixingQuestions = [
    { q: "Red + Blue = ?", answer: "Purple", options: ["Purple", "Green", "Orange", "Brown"] },
    { q: "Red + Yellow = ?", answer: "Orange", options: ["Orange", "Green", "Purple", "Pink"] },
    { q: "Blue + Yellow = ?", answer: "Green", options: ["Green", "Purple", "Orange", "Brown"] },
    { q: "Red + White = ?", answer: "Pink", options: ["Pink", "Orange", "Purple", "Yellow"] },
  ]
  
  const shuffledMix = [...mixingQuestions].sort(() => Math.random() - 0.5).slice(0, 4)
  shuffledMix.forEach(mq => {
    const opts = [...mq.options].sort(() => Math.random() - 0.5)
    questions.push({
      type: "mix",
      question: mq.q,
      displayColor: "gradient",
      options: opts,
      correct: opts.indexOf(mq.answer)
    })
  })
  
  return questions.sort(() => Math.random() - 0.5).slice(0, 8)
}

export function ColorMatchGame({ game, onComplete }: ColorMatchGameProps) {
  const [questions] = useState(() => generateQuestions())
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [finished, setFinished] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const hasCompletedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const current = questions[currentQ]
  const progress = ((currentQ + 1) / questions.length) * 100

  useEffect(() => {
    if (finished && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onCompleteRef.current(score, game.maxScore)
    }
  }, [finished, score, game.maxScore])

  const handleAnswer = (index: number) => {
    if (selected !== null) return
    setSelected(index)
    
    if (index === current.correct) {
      setScore(s => s + 12)
    }
    setShowNext(true)
  }

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setFinished(true)
    } else {
      setCurrentQ(q => q + 1)
      setSelected(null)
      setShowNext(false)
    }
  }

  const resetGame = () => {
    setCurrentQ(0)
    setScore(0)
    setSelected(null)
    setFinished(false)
    setShowNext(false)
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
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
        </motion.div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Color Champion!</h2>
        <p className="text-muted-foreground mb-6">
          You scored {score} out of {game.maxScore} points ({percentage}%)
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
          Question {currentQ + 1} of {questions.length}
        </span>
        <span className="text-sm font-medium text-foreground">Score: {score}</span>
      </div>
      
      <Progress value={progress} className="h-2 mb-6" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="space-y-6"
        >
          {/* Color Display */}
          <div className="flex justify-center mb-6">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 rounded-2xl shadow-lg"
              style={{ 
                backgroundColor: current.displayColor === "gradient" 
                  ? undefined 
                  : current.displayColor,
                background: current.displayColor === "gradient"
                  ? "linear-gradient(135deg, #ef4444, #3b82f6)"
                  : undefined
              }}
            />
          </div>

          <h3 className="text-xl font-semibold text-center text-foreground mb-6">
            {current.question}
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {current.options.map((option, index) => {
              const isCorrect = index === current.correct
              const isSelected = selected === index
              const optionColor = colors.find(c => c.name === option)
              
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: selected === null ? 1.03 : 1 }}
                  whileTap={{ scale: selected === null ? 0.97 : 1 }}
                  onClick={() => handleAnswer(index)}
                  disabled={selected !== null}
                  className={`
                    p-4 rounded-xl border-2 font-medium transition-all flex items-center gap-3
                    ${selected === null 
                      ? "border-border hover:border-primary/50 bg-card" 
                      : isSelected && isCorrect
                        ? "border-green-500 bg-green-500/10"
                        : isSelected && !isCorrect
                          ? "border-red-500 bg-red-500/10"
                          : isCorrect
                            ? "border-green-500 bg-green-500/10"
                            : "border-border bg-card opacity-50"
                    }
                  `}
                >
                  {optionColor && (
                    <div 
                      className="w-8 h-8 rounded-full shrink-0 border-2 border-white shadow"
                      style={{ backgroundColor: optionColor.hex }}
                    />
                  )}
                  <span className="text-lg">{option}</span>
                </motion.button>
              )
            })}
          </div>

          {showNext && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Button onClick={nextQuestion} className="w-full" size="lg">
                {currentQ + 1 >= questions.length ? "See Results" : "Next Question"}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
